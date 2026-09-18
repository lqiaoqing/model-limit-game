/**
 * Multi-seed balance harness.
 * For each seed × weapon, run a short scripted bot session and aggregate
 * combat/perf telemetry into artifacts/balance/.
 *
 * Usage:
 *   npm run balance
 *   node scripts/balance-harness.mjs --seeds 42,137 --duration 10
 */
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'artifacts', 'balance');

function parseArgs(argv) {
  const args = {
    seeds: [42, 137, 999, 2026, 65535],
    durationSec: 12,
    port: 5188,
  };
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--seeds') {
      args.seeds = String(argv[++i] ?? '')
        .split(',')
        .map((s) => Number(s.trim()))
        .filter((n) => Number.isFinite(n));
    } else if (a === '--duration') {
      args.durationSec = Number(argv[++i]);
    } else if (a === '--port') {
      args.port = Number(argv[++i]);
    }
  }
  return args;
}

async function waitForServer(url, timeoutMs = 20000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  return false;
}

function percentile(sorted, p) {
  if (sorted.length === 0) return 0;
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
  return sorted[idx];
}

const WEAPONS = [
  { id: 'plasma', key: 'Digit1' },
  { id: 'rail', key: 'Digit2' },
  { id: 'scatter', key: 'Digit3' },
  { id: 'launcher', key: 'Digit4' },
  { id: 'launcher', key: 'Digit4' },
];

const MOVE_KEYS = [
  ['KeyW', 'KeyD'],
  ['KeyD', 'KeyS'],
  ['KeyS', 'KeyA'],
  ['KeyA', 'KeyW'],
];

async function sample(page) {
  return page.evaluate(() => {
    const d = window.__THREE_GAME_DIAGNOSTICS__;
    if (!d) return null;
    return {
      frame: d.frame,
      elapsed: d.elapsed,
      score: d.score,
      kills: d.kills ?? 0,
      mode: d.mode ?? 'play',
      wave: d.wave ?? 1,
      enemies: d.enemies ?? 0,
      fps: d.fps ?? 0,
      weapon: d.weapon ?? 'plasma',
      modifiers: d.modifiers ?? [],
      upgradeStacks: d.upgradeStacks ?? {},
      bossPhase: d.bossPhase ?? null,
      projectiles: d.projectiles ?? 0,
      particles: d.particles ?? 0,
      backend: d.backend ?? 'webgl2',
      hp: d.player?.hp ?? 0,
      shield: d.player?.shield ?? 0,
      heat: d.player?.heat ?? 0,
      overheated: Boolean(d.player?.overheated),
      alive: d.player?.alive !== false,
      fireInterval: d.player?.fireInterval ?? 0,
      projectileDamage: d.player?.projectileDamage ?? 0,
      combatTime: d.combatTime ?? 0,
      damageDealt: d.damageDealt ?? 0,
      shotsFired: d.shotsFired ?? 0,
      hitsLanded: d.hitsLanded ?? 0,
      dps: d.dps ?? 0,
      killsPerSec: d.killsPerSec ?? 0,
      frameMs: d.frameMs ?? null,
    };
  });
}

async function runSession(page, { seed, weaponKey, weaponId, durationSec, canvasBox }) {
  await page.evaluate(async (s) => {
    await window.__THREE_GAME_TEST_HOOKS__?.seed(s);
    await window.__THREE_GAME_TEST_HOOKS__?.setState('active-play');
  }, seed);
  await page.waitForTimeout(200);
  await page.keyboard.press(weaponKey);
  await page.waitForTimeout(80);

  const before = await sample(page);
  if (!before) throw new Error('diagnostics missing');

  const cx = canvasBox.x + canvasBox.width * 0.5;
  const cy = canvasBox.y + canvasBox.height * 0.42;
  await page.mouse.move(cx, cy);
  await page.mouse.down();

  const fpsSamples = [];
  const started = Date.now();
  const deadline = started + durationSec * 1000;
  let step = 0;
  let maxKills = before.kills;
  let maxScore = before.score;
  let deaths = 0;
  let upgradePicks = 0;
  let dashes = 0;
  let overheatedFrames = 0;
  let samples = 0;

  while (Date.now() < deadline) {
    const keys = MOVE_KEYS[step % MOVE_KEYS.length];
    for (const key of keys) await page.keyboard.down(key);
    const aimX = cx + [80, -60, 110, -90][step % 4];
    const aimY = cy + [-40, 50, 20, -30][step % 4];
    await page.mouse.move(aimX, aimY);
    if (step % 4 === 1) {
      await page.keyboard.press('Space');
      dashes += 1;
    }
    await page.waitForTimeout(280);
    for (const key of keys) await page.keyboard.up(key);

    let snap = await sample(page);
    if (!snap) break;
    samples += 1;
    if (snap.fps > 0) fpsSamples.push(snap.fps);
    if (snap.overheated) overheatedFrames += 1;
    maxKills = Math.max(maxKills, snap.kills);
    maxScore = Math.max(maxScore, snap.score);

    if (snap.mode === 'upgrade') {
      const pick = step % 3;
      await page.evaluate((i) => window.__THREE_GAME_TEST_HOOKS__?.pickUpgrade(i), pick);
      await page.waitForTimeout(80);
      upgradePicks += 1;
      snap = await sample(page);
    }
    if (snap?.mode === 'dead' || (snap && !snap.alive)) {
      deaths += 1;
      // Respawn and continue so later weapons still get coverage.
      await page.keyboard.press('KeyR');
      await page.waitForTimeout(200);
      await page.keyboard.press(weaponKey);
    }
    step += 1;
  }

  await page.mouse.up();
  const after = await sample(page);
  const wallSec = (Date.now() - started) / 1000;
  const sortedFps = fpsSamples.slice().sort((a, b) => a - b);
  const killsDelta = Math.max(0, maxKills - before.kills);
  const scoreDelta = Math.max(0, maxScore - before.score);
  const combatTime = Math.max(after?.combatTime ?? 0, 0.001);
  const damageDealt = after?.damageDealt ?? 0;
  const trueDps = Number((damageDealt / combatTime).toFixed(2));
  const killsPerSec = Number((killsDelta / Math.max(wallSec, 0.001)).toFixed(2));

  return {
    seed,
    weapon: weaponId,
    wallSec: Number(wallSec.toFixed(2)),
    kills: killsDelta,
    score: scoreDelta,
    dps: trueDps,
    killsPerSec,
    damageDealt,
    combatTime: Number(combatTime.toFixed(2)),
    shotsFired: after?.shotsFired ?? 0,
    hitsLanded: after?.hitsLanded ?? 0,
    deaths,
    dashes,
    upgradePicks,
    overheatedRatio: samples ? Number((overheatedFrames / samples).toFixed(3)) : 0,
    endWave: after?.wave ?? before.wave,
    endMode: after?.mode ?? 'unknown',
    endHp: after?.hp ?? 0,
    endModifiers: after?.modifiers ?? [],
    endUpgrades: after?.upgradeStacks ?? {},
    weaponStats: {
      fireInterval: after?.fireInterval ?? before.fireInterval,
      projectileDamage: after?.projectileDamage ?? before.projectileDamage,
    },
    frameMs: after?.frameMs ?? null,
    perf: {
      fpsAvg: fpsSamples.length
        ? Number((fpsSamples.reduce((a, b) => a + b, 0) / fpsSamples.length).toFixed(1))
        : 0,
      fpsP50: Number(percentile(sortedFps, 50).toFixed(1)),
      fpsP95: Number(percentile(sortedFps, 95).toFixed(1)),
      fpsMin: sortedFps[0] ?? 0,
      frameMsP50: after?.frameMs?.p50 ?? 0,
      frameMsP95: after?.frameMs?.p95 ?? 0,
      frameMsP99: after?.frameMs?.p99 ?? 0,
      projectilesEnd: after?.projectiles ?? 0,
      particlesEnd: after?.particles ?? 0,
      backend: after?.backend ?? 'webgl2',
    },
  };
}

function aggregate(runs) {
  const byWeapon = new Map();
  for (const run of runs) {
    if (!byWeapon.has(run.weapon)) byWeapon.set(run.weapon, []);
    byWeapon.get(run.weapon).push(run);
  }
  const weaponRows = [...byWeapon.entries()].map(([weapon, list]) => {
    const avg = (key) =>
      Number((list.reduce((s, r) => s + r[key], 0) / list.length).toFixed(2));
    const avgPerf = (key) =>
      Number((list.reduce((s, r) => s + r.perf[key], 0) / list.length).toFixed(1));
    return {
      weapon,
      runs: list.length,
      killsAvg: avg('kills'),
      scoreAvg: avg('score'),
      dpsAvg: avg('dps'),
      killsPerSecAvg: avg('killsPerSec'),
      deathsAvg: avg('deaths'),
      overheatedRatioAvg: avg('overheatedRatio'),
      fpsAvg: avgPerf('fpsAvg'),
      fpsP50Avg: avgPerf('fpsP50'),
      fpsP95Avg: avgPerf('fpsP95'),
      frameMsP50Avg: avgPerf('frameMsP50'),
      frameMsP95Avg: avgPerf('frameMsP95'),
      frameMsP99Avg: avgPerf('frameMsP99'),
    };
  });

  // Flag likely-OP / weak weapons relative to mean DPS.
  const meanDps =
    weaponRows.reduce((s, r) => s + r.dpsAvg, 0) / Math.max(weaponRows.length, 1);
  for (const row of weaponRows) {
    if (meanDps <= 0) {
      row.balanceNote = 'n/a';
    } else if (row.dpsAvg >= meanDps * 1.2) {
      row.balanceNote = 'OP?';
    } else if (row.dpsAvg <= meanDps * 0.8) {
      row.balanceNote = 'weak?';
    } else {
      row.balanceNote = 'ok';
    }
  }

  const upgradePickCounts = {};
  for (const run of runs) {
    for (const [id, n] of Object.entries(run.endUpgrades)) {
      upgradePickCounts[id] = (upgradePickCounts[id] ?? 0) + n;
    }
  }

  return {
    meanDps: Number(meanDps.toFixed(2)),
    weaponRows,
    upgradePickCounts,
    totalRuns: runs.length,
  };
}

function renderScorecard({ meta, aggregate: agg, runs }) {
  const lines = [];
  lines.push('# Balance Scorecard');
  lines.push('');
  lines.push(`- Generated: ${meta.generatedAt}`);
  lines.push(`- Seeds: ${meta.seeds.join(', ')}`);
  lines.push(`- Session duration: ${meta.durationSec}s per seed × weapon`);
  lines.push(`- Runs: ${agg.totalRuns}`);
  lines.push(`- Mean DPS across weapons: ${agg.meanDps}`);
  lines.push('');
  lines.push('## Weapon balance');
  lines.push('');
  lines.push(
    '| Weapon | Kills avg | DPS avg | Kills/s | Deaths avg | Overheat | Frame p50/p99 | FPS p50 | Note |',
  );
  lines.push('|---|---:|---:|---:|---:|---:|---:|---:|---|');
  for (const row of agg.weaponRows) {
    lines.push(
      `| ${row.weapon} | ${row.killsAvg} | ${row.dpsAvg} | ${row.killsPerSecAvg} | ${row.deathsAvg} | ${row.overheatedRatioAvg} | ${row.frameMsP50Avg} / ${row.frameMsP99Avg} | ${row.fpsP50Avg} | ${row.balanceNote} |`,
    );
  }
  lines.push('');
  lines.push('## Upgrade stack totals (end of sessions)');
  lines.push('');
  const upgrades = Object.entries(agg.upgradePickCounts).sort((a, b) => b[1] - a[1]);
  if (upgrades.length === 0) {
    lines.push('_No upgrades recorded._');
  } else {
    lines.push('| Upgrade | Stacks |');
    lines.push('|---|---:|');
    for (const [id, n] of upgrades) {
      lines.push(`| ${id} | ${n} |`);
    }
  }
  lines.push('');
  lines.push('## Per-run detail');
  lines.push('');
  lines.push('| Seed | Weapon | Kills | DPS | Deaths | Wave | FPS p95 | Mode end |');
  lines.push('|---:|---|---:|---:|---:|---:|---:|---|');
  for (const r of runs) {
    lines.push(
      `| ${r.seed} | ${r.weapon} | ${r.kills} | ${r.dps} | ${r.deaths} | ${r.endWave} | ${r.perf.fpsP95} | ${r.endMode} |`,
    );
  }
  lines.push('');
  lines.push('## Notes');
  lines.push('');
  lines.push('- Bot is deterministic input, not a skilled player; use for regression + relative weapon comparison.');
  lines.push('- `OP?` / `weak?` flags are heuristic (±20% of mean DPS).');
  lines.push('- Rerun: `npm run balance`');
  lines.push('');
  return lines.join('\n');
}

async function main() {
  const args = parseArgs(process.argv);
  const url = `http://127.0.0.1:${args.port}/`;
  await mkdir(outDir, { recursive: true });

  let server = null;
  const up = await waitForServer(url, 800);
  if (!up) {
    server = spawn('npm', ['run', 'dev'], {
      cwd: root,
      stdio: 'ignore',
      shell: true,
    });
    const ok = await waitForServer(url, 20000);
    if (!ok) {
      server.kill();
      throw new Error(`Dev server did not start on ${url}`);
    }
  }

  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(String(e.message)));

  await page.goto(url);
  await page.waitForFunction(() => (window.__THREE_GAME_DIAGNOSTICS__?.frame ?? 0) > 10);
  await page.evaluate(() => window.__THREE_GAME_TEST_HOOKS__?.hideDebugUi?.(true));

  const canvas = page.locator('#game-canvas');
  const box = await canvas.boundingBox();
  if (!box) throw new Error('canvas box missing');

  const runs = [];
  for (const seed of args.seeds) {
    for (const weapon of WEAPONS) {
      process.stdout.write(`seed=${seed} weapon=${weapon.id}… `);
      const run = await runSession(page, {
        seed,
        weaponKey: weapon.key,
        weaponId: weapon.id,
        durationSec: args.durationSec,
        canvasBox: box,
      });
      runs.push(run);
      process.stdout.write(
        `kills=${run.kills} dps=${run.dps} kps=${run.killsPerSec} deaths=${run.deaths} frameP99=${run.perf.frameMsP99}\n`,
      );
    }
  }

  await browser.close();
  if (server) server.kill();

  const agg = aggregate(runs);
  const meta = {
    generatedAt: new Date().toISOString(),
    seeds: args.seeds,
    durationSec: args.durationSec,
    pageErrors,
  };
  const payload = { meta, aggregate: agg, runs };
  const stamp = meta.generatedAt.replace(/[:.]/g, '-');
  await writeFile(path.join(outDir, 'latest.json'), JSON.stringify(payload, null, 2));
  await writeFile(path.join(outDir, `balance-${stamp}.json`), JSON.stringify(payload, null, 2));
  const md = renderScorecard(payload);
  await writeFile(path.join(outDir, 'balance-report.md'), md);
  await writeFile(path.join(outDir, 'scorecard.md'), md);

  console.log(`\nWrote ${path.join(outDir, 'balance-report.md')}`);
  console.log(`Wrote ${path.join(outDir, 'latest.json')}`);
  if (pageErrors.length) {
    console.error('Page errors:', pageErrors);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
