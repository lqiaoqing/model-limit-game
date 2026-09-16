import { expect, test } from '@playwright/test';

/**
 * Scripted bot: circle-strafe + hold fire + periodic dash, then stress-death
 * and restart. Driven only through real input + diagnostics — no private APIs.
 */

type Snap = {
  frame: number;
  score: number;
  kills: number;
  complete: boolean;
  mode: string;
  wave: number;
  enemies: number;
  hp: number;
  shield: number;
  x: number;
  z: number;
  overheated: boolean;
};

async function sample(page: import('@playwright/test').Page): Promise<Snap> {
  return page.evaluate(() => {
    const d = window.__THREE_GAME_DIAGNOSTICS__;
    if (!d) throw new Error('diagnostics missing');
    return {
      frame: d.frame,
      score: d.score,
      kills: d.kills ?? 0,
      complete: d.complete,
      mode: d.mode ?? 'play',
      wave: d.wave ?? 1,
      enemies: d.enemies ?? 0,
      hp: d.player.hp ?? 0,
      shield: d.player.shield ?? 0,
      x: d.player.position.x,
      z: d.player.position.z,
      overheated: d.player.overheated ?? false,
    };
  });
}

const MOVE_KEYS = [
  ['KeyW', 'KeyD'],
  ['KeyD', 'KeyS'],
  ['KeyS', 'KeyA'],
  ['KeyA', 'KeyW'],
] as const;

test('bot playtest: combat progression, stress death, restart', async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== 'desktop-chrome',
    'Bot uses keyboard/mouse; mobile is covered by visual.spec.ts.',
  );
  test.setTimeout(120_000);

  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

  await page.goto('/');
  await page.waitForFunction(() => (window.__THREE_GAME_DIAGNOSTICS__?.frame ?? 0) > 10);

  const boot = await page.evaluate(async () => {
    const hooks = window.__THREE_GAME_TEST_HOOKS__;
    if (!hooks?.seed || !hooks?.setState) throw new Error('test hooks missing');
    await hooks.seed(42);
    await hooks.setState('active-play');
    return true;
  });
  expect(boot).toBe(true);

  const canvas = page.locator('#game-canvas');
  const box = await canvas.boundingBox();
  expect(box).not.toBeNull();
  const cx = (box as { x: number; width: number }).x + (box as { width: number }).width * 0.5;
  const cy = (box as { y: number; height: number }).y + (box as { height: number }).height * 0.42;

  // Hold LMB (fire) and orbit while sweeping aim so shots meet the pack.
  await page.mouse.move(cx, cy);
  await page.mouse.down();

  const before = await sample(page);
  let maxKills = before.kills;
  let maxScore = before.score;
  let distance = 0;
  let prevX = before.x;
  let prevZ = before.z;
  let dashCount = 0;
  const aimOffsets = [
    [80, -40],
    [120, 20],
    [-60, 50],
    [-100, -30],
  ] as const;

  for (let step = 0; step < 12; step += 1) {
    const keys = MOVE_KEYS[step % MOVE_KEYS.length];
    for (const key of keys) await page.keyboard.down(key);

    const aim = aimOffsets[step % aimOffsets.length];
    await page.mouse.move(cx + aim[0], cy + aim[1]);

    if (step % 3 === 1) {
      await page.keyboard.press('Space');
      dashCount += 1;
    }

    await page.waitForTimeout(900);
    for (const key of keys) await page.keyboard.up(key);

    const snap = await sample(page);
    distance += Math.hypot(snap.x - prevX, snap.z - prevZ);
    prevX = snap.x;
    prevZ = snap.z;
    maxKills = Math.max(maxKills, snap.kills);
    maxScore = Math.max(maxScore, snap.score);
    if (snap.mode === 'dead') break;
  }

  await page.mouse.up();

  const combat = await sample(page);
  const combatReport = {
    dashes: dashCount,
    kills: maxKills,
    scoreGained: maxScore - before.score,
    wave: combat.wave,
    enemies: combat.enemies,
    distance: Number(distance.toFixed(2)),
    mode: combat.mode,
    overheated: combat.overheated,
    hp: combat.hp,
  };
  await testInfo.attach('bot-combat-report', {
    body: JSON.stringify(combatReport, null, 2),
    contentType: 'application/json',
  });
  console.log(`bot combat: ${JSON.stringify(combatReport)}`);

  expect(pageErrors, 'no page errors during combat bot').toEqual([]);
  expect(consoleErrors, 'no console errors during combat bot').toEqual([]);
  expect(distance, 'bot must move').toBeGreaterThan(3);
  expect(
    maxKills,
    'scripted fire + orbit should score at least one kill on wave 1',
  ).toBeGreaterThanOrEqual(1);
  expect(maxScore, 'score must advance from kills').toBeGreaterThan(before.score);

  // Stress flood → expect death, then R restart restores a playable run.
  await page.evaluate(async () => {
    window.__THREE_GAME_TEST_HOOKS__?.setState('stress');
  });

  let died = false;
  const deathDeadline = Date.now() + 45_000;
  while (Date.now() < deathDeadline) {
    const snap = await sample(page);
    if (snap.mode === 'dead' || snap.complete || !snap.hp) {
      died = true;
      break;
    }
    // Nudge into the pack so contact/projectiles finish the job faster.
    await page.keyboard.down('KeyW');
    await page.waitForTimeout(400);
    await page.keyboard.up('KeyW');
    await page.keyboard.down('KeyS');
    await page.waitForTimeout(400);
    await page.keyboard.up('KeyS');
  }
  expect(died, 'stress flood should eventually kill an idle-ish bot').toBe(true);

  const deadSnap = await sample(page);
  await testInfo.attach('bot-death-snap', {
    body: JSON.stringify(deadSnap, null, 2),
    contentType: 'application/json',
  });

  await page.keyboard.press('KeyR');
  await page.waitForTimeout(400);
  const revived = await sample(page);
  expect(revived.mode, 'R must restart into play').toBe('play');
  expect(revived.hp, 'restart restores HP').toBeGreaterThan(90);
  expect(revived.shield, 'restart restores shield').toBeGreaterThan(40);
  expect(revived.complete, 'restart clears dead flag').toBe(false);

  // Pause toggle still works after restart.
  await page.keyboard.press('KeyP');
  await page.waitForTimeout(120);
  const paused = await sample(page);
  expect(paused.mode).toBe('paused');
  await page.keyboard.press('KeyP');
  await page.waitForTimeout(120);
  expect((await sample(page)).mode).toBe('play');

  const finalReport = {
    combat: combatReport,
    deadAt: { mode: deadSnap.mode, wave: deadSnap.wave, hp: deadSnap.hp },
    revived: { mode: revived.mode, hp: revived.hp, shield: revived.shield },
    pageErrors,
    consoleErrors,
  };
  await testInfo.attach('bot-playtest-report', {
    body: JSON.stringify(finalReport, null, 2),
    contentType: 'application/json',
  });
});
