/**
 * Model Arena evaluator — scores one implementation against a challenge pack.
 * Does not modify the target repo; writes results under arena/runs/<model>/<challenge>/.
 *
 * Usage:
 *   node scripts/arena-eval.mjs --model miMo --challenge model-limit-v2
 *   node scripts/arena-eval.mjs --model x --root /path/to/impl --skip-bot --skip-balance
 */
import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const arenaRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'arena');
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function parseArgs(argv) {
  const args = {
    model: 'anonymous',
    challenge: 'model-limit-v2',
    root: repoRoot,
    skipBot: false,
    skipBalance: false,
    skipBuild: false,
    balanceSeeds: '42,137',
    balanceDuration: 8,
  };
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    const next = () => argv[++i];
    if (a === '--model') args.model = String(next());
    else if (a === '--challenge') args.challenge = String(next());
    else if (a === '--root') args.root = path.resolve(String(next()));
    else if (a === '--skip-bot') args.skipBot = true;
    else if (a === '--skip-balance') args.skipBalance = true;
    else if (a === '--skip-build') args.skipBuild = true;
    else if (a === '--balance-seeds') args.balanceSeeds = String(next());
    else if (a === '--balance-duration') args.balanceDuration = Number(next());
  }
  return args;
}

function run(cmd, args, opts = {}) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, {
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
      ...opts,
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => {
      stdout += d.toString();
    });
    child.stderr.on('data', (d) => {
      stderr += d.toString();
    });
    child.on('close', (code) => {
      resolve({ code: code ?? 1, stdout, stderr });
    });
  });
}

async function walkFiles(dir, acc = [], depth = 0) {
  if (depth > 8) return acc;
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const e of entries) {
    if (
      e.name === 'node_modules' ||
      e.name === 'dist' ||
      e.name === '.git' ||
      e.name === 'arena' ||
      e.name === 'artifacts' ||
      e.name === 'test-results' ||
      e.name === 'playwright-report'
    ) {
      continue;
    }
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walkFiles(full, acc, depth + 1);
    else if (e.isFile()) acc.push(full);
  }
  return acc;
}

async function freePort(port) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const ns = await run('netstat', ['-ano']);
    const pids = new Set();
    for (const line of ns.stdout.split(/\r?\n/)) {
      if (!line.includes(`:${port}`)) continue;
      if (!/LISTENING/i.test(line)) continue;
      const parts = line.trim().split(/\s+/);
      const pid = Number(parts[parts.length - 1]);
      if (Number.isFinite(pid) && pid > 0) pids.add(pid);
    }
    for (const pid of pids) {
      await run('taskkill', ['/PID', String(pid), '/F', '/T']);
    }
    await new Promise((r) => setTimeout(r, 400));
    const ns2 = await run('netstat', ['-ano']);
    const still = ns2.stdout
      .split(/\r?\n/)
      .some((l) => l.includes(`:${port}`) && /LISTENING/i.test(l));
    if (!still) return true;
  }
  return false;
}

async function loadChallenge(id) {
  const dir = path.join(arenaRoot, 'challenges', id);
  const scoringPath = path.join(dir, 'scoring.json');
  const challengePath = path.join(dir, 'CHALLENGE.md');
  const scoring = JSON.parse(await readFile(scoringPath, 'utf8'));
  let challengeMd = '';
  try {
    challengeMd = await readFile(challengePath, 'utf8');
  } catch {
    // optional
  }
  return { scoring, challengeMd, dir };
}

function matchGlob(rel, glob) {
  // Minimal glob: **/*.ext and exact-ish suffix
  const g = glob.replace(/^\*\*\//, '');
  if (glob.startsWith('**/')) {
    return rel.endsWith(g.replace(/^\*\*\//, '')) || rel.includes(g.replace(/^\*\*\//, ''));
  }
  return rel === glob || rel.endsWith('/' + glob);
}

async function scoreProbes(root, probeGroups, files) {
  const results = {};
  const fileMap = new Map(files.map((f) => [path.relative(root, f).replace(/\\/g, '/'), f]));

  async function readIf(relOrName) {
    // exact relative or basename search
    if (fileMap.has(relOrName)) return readFile(fileMap.get(relOrName), 'utf8');
    for (const [rel, full] of fileMap) {
      if (rel.endsWith('/' + relOrName) || rel === relOrName) return readFile(full, 'utf8');
    }
    return null;
  }

  for (const [group, probes] of Object.entries(probeGroups)) {
    let earned = 0;
    let possible = 0;
    const details = [];
    for (const probe of probes) {
      possible += probe.points;
      let hit = false;
      let note = '';
      if (probe.glob) {
        const matches = [...fileMap.keys()].filter((rel) => matchGlob(rel, probe.glob));
        hit = matches.length > 0;
        note = matches.slice(0, 3).join(', ') || 'missing';
        if (hit && probe.maxLines) {
          const content = await readFile(fileMap.get(matches[0]), 'utf8');
          const lines = content.split(/\r?\n/).length;
          hit = lines <= probe.maxLines;
          note = `${matches[0]} lines=${lines}`;
        }
      } else if (probe.file) {
        const content = await readIf(probe.file);
        hit = Boolean(content && (!probe.pattern || new RegExp(probe.pattern, 'i').test(content)));
        note = probe.file;
      } else if (probe.pattern) {
        const include = probe.include || '**/*.{ts,tsx,js,mjs,html,css}';
        for (const [rel, full] of fileMap) {
          // include patterns: **/*.{ext,...}, **/tests/**, exact suffix
          let includeHit = false;
          if (include.includes('tests/')) {
            includeHit = rel.includes('tests/') && /\.(ts|js|mjs)$/.test(rel);
          } else if (include.includes('*.{')) {
            const m = include.match(/\*\{([^}]+)\}/);
            const exts = m ? m[1].split(',') : ['ts', 'js'];
            includeHit = exts.some((ext) => rel.endsWith(`.${ext}`));
          } else if (include.startsWith('**/')) {
            includeHit = rel.includes(include.slice(3).replace(/^\*\//, ''));
          } else {
            includeHit = rel.endsWith(include);
          }
          if (!includeHit) continue;
          const text = await readFile(full, 'utf8');
          if (new RegExp(probe.pattern, 'i').test(text)) {
            hit = true;
            note = rel;
            break;
          }
        }
        if (!hit) note = 'no match';
      }
      if (hit) earned += probe.points;
      details.push({ id: probe.id, hit, points: probe.points, note });
    }
    results[group] = {
      earned: Number(earned.toFixed(2)),
      possible: Number(possible.toFixed(2)),
      ratio: possible > 0 ? Number((earned / possible).toFixed(3)) : 0,
      details,
    };
  }
  return results;
}

function clamp01(n) {
  return Math.max(0, Math.min(1, n));
}

async function main() {
  const args = parseArgs(process.argv);
  const root = args.root;
  const { scoring } = await loadChallenge(args.challenge);
  const files = await walkFiles(root);
  console.log(`Evaluating model=${args.model} challenge=${args.challenge} root=${root}`);

  const checks = {
    build: { ran: false, pass: false, status: 'SKIPPED', code: null, note: 'skipped' },
    bot: { ran: false, pass: false, status: 'SKIPPED', note: 'skipped' },
    balance: {
      ran: false,
      pass: false,
      status: 'SKIPPED',
      note: 'skipped',
      profile: null,
      summary: null,
    },
  };

  if (!args.skipBuild) {
    console.log('→ npm run build');
    const build = await run('npm', ['run', 'build'], { cwd: root });
    checks.build = {
      ran: true,
      pass: build.code === 0,
      status: build.code === 0 ? 'PASS' : 'FAIL',
      code: build.code,
      note: build.code === 0 ? 'ok' : (build.stderr || build.stdout).slice(-400),
    };
  }

  if (!args.skipBot) {
    console.log('→ free port 5188 + playwright desktop bot');
    await freePort(5188);
    await new Promise((r) => setTimeout(r, 400));
    const bot = await run('npx', ['playwright', 'test', '--project=desktop-chrome'], {
      cwd: root,
    });
    checks.bot = {
      ran: true,
      pass: bot.code === 0,
      status: bot.code === 0 ? 'PASS' : 'FAIL',
      note: bot.code === 0 ? 'ok' : (bot.stdout + bot.stderr).slice(-500),
    };
  }

  if (!args.skipBalance) {
    // Short harness profile writes only to artifacts/balance/smoke/ — never overwrites full evidence.
    console.log('→ free port + balance harness (smoke profile)');
    await freePort(5188);
    await new Promise((r) => setTimeout(r, 400));
    const bal = await run(
      'node',
      [
        'scripts/balance-harness.mjs',
        '--profile',
        'smoke',
        '--seeds',
        args.balanceSeeds,
        '--duration',
        String(args.balanceDuration),
      ],
      { cwd: root },
    );
    let summary = null;
    try {
      const latest = JSON.parse(
        await readFile(path.join(root, 'artifacts', 'balance', 'smoke', 'latest.json'), 'utf8'),
      );
      summary = latest.aggregate ?? null;
    } catch {
      // ignore
    }
    checks.balance = {
      ran: true,
      pass: bal.code === 0,
      status: bal.code === 0 ? 'PASS' : 'FAIL',
      note: bal.code === 0 ? 'ok (smoke profile)' : (bal.stdout + bal.stderr).slice(-500),
      profile: 'smoke',
      summary,
    };
  }

  const probeScores = await scoreProbes(root, scoring.probes, files);

  // Dimension scores 0..1
  const gameplay = checks.bot.ran
    ? checks.bot.pass
      ? 1
      : 0.25
    : probeScores.depth
      ? probeScores.depth.ratio
      : 0.5;

  const depth = probeScores.depth?.ratio ?? 0;
  const visual = probeScores.visual?.ratio ?? 0;
  const architecture = probeScores.architecture?.ratio ?? 0;
  const testsBase = probeScores.tests?.ratio ?? 0;
  const tests = checks.bot.ran ? (checks.bot.pass ? Math.max(testsBase, 0.85) : testsBase * 0.4) : testsBase;
  const mobile = probeScores.mobile?.ratio ?? 0;

  // Performance: probes + optional FPS from balance. When checks were skipped, cap.
  let perf = probeScores.performance?.ratio ?? 0;
  if (checks.balance.summary?.weaponRows?.length) {
    const fps = checks.balance.summary.weaponRows.reduce((s, r) => s + (r.fpsP95Avg || 0), 0) /
      checks.balance.summary.weaponRows.length;
    const fpsScore = clamp01(fps / 60);
    perf = clamp01(perf * 0.45 + fpsScore * 0.55);
  } else if (checks.balance.ran === false) {
    perf = Math.min(perf, 0.7);
  }

  // Bug rate: skipped checks cannot earn full credit.
  let bugRate = 1;
  if (checks.build.ran && !checks.build.pass) bugRate -= 0.6;
  if (checks.bot.ran && !checks.bot.pass) bugRate -= 0.3;
  if (checks.balance.ran && !checks.balance.pass) bugRate -= 0.1;
  if (!checks.build.ran) bugRate -= 0.25;
  if (!checks.bot.ran) bugRate -= 0.15;
  bugRate = clamp01(bugRate);

  // Completion requires functional evidence, not just file presence.
  const depthHits = (probeScores.depth?.details ?? []).filter((d) => d.hit).length;
  const depthTotal = (probeScores.depth?.details ?? []).length || 1;
  let completion = clamp01(depthHits / depthTotal);
  if (!checks.bot.ran || !checks.bot.pass) completion = Math.min(completion, 0.55);
  if (!checks.build.ran || !checks.build.pass) completion = Math.min(completion, 0.4);

  const weights = scoring.weights;
  const dimensions = {
    gameplay: { score: gameplay, weight: weights.gameplay },
    depth: { score: depth, weight: weights.depth },
    visual: { score: visual, weight: weights.visual },
    performance: { score: perf, weight: weights.performance },
    architecture: { score: architecture, weight: weights.architecture },
    tests: { score: tests, weight: weights.tests },
    mobile: { score: mobile, weight: weights.mobile },
    bugRate: { score: bugRate, weight: weights.bugRate },
    completion: { score: completion, weight: weights.completion },
  };

  let total = 0;
  for (const d of Object.values(dimensions)) total += d.score * d.weight;
  total = Number(total.toFixed(4));

  const runId = args.model.replace(/[^\w.-]+/g, '_');
  const outDir = path.join(arenaRoot, 'runs', runId, args.challenge);
  await mkdir(outDir, { recursive: true });

  const payload = {
    model: args.model,
    challenge: args.challenge,
    root,
    generatedAt: new Date().toISOString(),
    total,
    total100: Math.round(total * 100),
    dimensions,
    checks,
    probes: probeScores,
    weights,
  };

  await writeFile(path.join(outDir, 'score.json'), JSON.stringify(payload, null, 2));

  const lines = [];
  lines.push(`# Arena Scorecard — ${args.model}`);
  lines.push('');
  lines.push(`- Challenge: \`${args.challenge}\``);
  lines.push(`- Root: \`${root}\``);
  lines.push(`- Generated: ${payload.generatedAt}`);
  lines.push(`- **Total: ${(total * 100).toFixed(1)} / 100**`);
  lines.push('');
  lines.push('## Dimensions');
  lines.push('');
  lines.push('| Dimension | Score | Weight | Contribution |');
  lines.push('|---|---:|---:|---:|');
  for (const [name, d] of Object.entries(dimensions)) {
    lines.push(
      `| ${name} | ${(d.score * 100).toFixed(0)}% | ${(d.weight * 100).toFixed(0)}% | ${(d.score * d.weight * 100).toFixed(1)} |`,
    );
  }
  lines.push('');
  lines.push('## Checks');
  lines.push('');
  lines.push(`- Build: ${checks.build.status}`);
  lines.push(`- Bot test: ${checks.bot.status}`);
  lines.push(
    `- Balance: ${checks.balance.status}${checks.balance.profile ? ` (${checks.balance.profile})` : ''}`,
  );
  if (checks.balance.status === 'SKIPPED') {
    lines.push('- Balance note: intentionally skipped — use `npm run balance:full` for canonical evidence under `artifacts/balance/full/`.');
  }
  if (checks.balance.summary?.weaponRows) {
    lines.push('');
    lines.push('| Weapon | DPS avg | FPS p95 |');
    lines.push('|---|---:|---:|');
    for (const row of checks.balance.summary.weaponRows) {
      lines.push(`| ${row.weapon} | ${row.dpsAvg} | ${row.fpsP95Avg} |`);
    }
  }
  lines.push('');
  lines.push('## Probe detail');
  lines.push('');
  for (const [group, g] of Object.entries(probeScores)) {
    lines.push(`### ${group} (${g.earned}/${g.possible})`);
    for (const d of g.details) {
      lines.push(`- ${d.hit ? 'x' : ' '} \`${d.id}\` — ${d.note || ''}`);
    }
    lines.push('');
  }
  lines.push('_Generated by `scripts/arena-eval.mjs`._');
  lines.push('');

  await writeFile(path.join(outDir, 'SCORECARD.md'), lines.join('\n'));
  console.log(`\nTotal ${(total * 100).toFixed(1)}/100`);
  console.log(`Wrote ${path.join(outDir, 'score.json')}`);
  console.log(`Wrote ${path.join(outDir, 'SCORECARD.md')}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
