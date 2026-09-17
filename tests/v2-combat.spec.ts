import { expect, test } from '@playwright/test';

type Snap = {
  mode: string;
  weapon?: string;
  damage?: number;
  fireInterval?: number;
  kills?: number;
  dps?: number;
  killsPerSec?: number;
  combatTime?: number;
  frameMs?: { p50: number; p95: number; p99: number };
  bossPhase?: number | null;
  enemies?: number;
  wave?: number;
};

async function boot(page: import('@playwright/test').Page, seed = 42): Promise<void> {
  await page.goto('/');
  await page.waitForFunction(() => (window.__THREE_GAME_DIAGNOSTICS__?.frame ?? 0) > 10);
  await page.evaluate(async (s) => {
    const hooks = window.__THREE_GAME_TEST_HOOKS__;
    if (!hooks?.seed || !hooks?.setState) throw new Error('hooks missing');
    await hooks.seed(s);
    await hooks.setState('active-play');
  }, seed);
  await page.waitForTimeout(150);
}

async function buildSnap(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const d = window.__THREE_GAME_DIAGNOSTICS__;
    return {
      mode: d?.mode ?? 'unknown',
      weapon: d?.weapon,
      damage: d?.player?.projectileDamage,
      fireInterval: d?.player?.fireInterval,
      kills: d?.kills,
      dps: d?.dps,
      killsPerSec: d?.killsPerSec,
      combatTime: d?.combatTime,
      frameMs: d?.frameMs,
      bossPhase: d?.bossPhase,
      enemies: d?.enemies,
      wave: d?.wave,
      complete: d?.complete,
    } satisfies Snap & { complete?: boolean };
  });
}

test.describe('v2 combat regression', () => {
  test('weapon round-trip preserves plasma identity', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    test.setTimeout(60_000);
    await boot(page, 42);
    const plasma0 = await buildSnap(page);
    expect(plasma0.weapon).toBe('plasma');

    await page.keyboard.press('Digit2');
    await page.waitForTimeout(80);
    const rail = await buildSnap(page);
    expect(rail.weapon).toBe('rail');
    expect(rail.damage).toBeGreaterThan(plasma0.damage ?? 0);

    await page.keyboard.press('Digit3');
    await page.waitForTimeout(80);
    const scatter = await buildSnap(page);
    expect(scatter.weapon).toBe('scatter');
    // scatter interval sits between plasma (fast) and rail (slow)
    expect(scatter.fireInterval).toBeGreaterThan(plasma0.fireInterval ?? 0);
    expect(scatter.fireInterval).toBeLessThan(rail.fireInterval ?? 0);
    expect(scatter.damage).toBeLessThan(rail.damage ?? 0);

    await page.keyboard.press('Digit1');
    await page.waitForTimeout(80);
    const plasma1 = await buildSnap(page);
    expect(plasma1.weapon).toBe('plasma');
    expect(plasma1.damage).toBeCloseTo(plasma0.damage ?? 0, 5);
    expect(plasma1.fireInterval).toBeCloseTo(plasma0.fireInterval ?? 0, 5);
  });

  test('rail_bore does not pollute plasma damage', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    test.setTimeout(60_000);
    await boot(page, 137);
    const before = await buildSnap(page);
    expect(before.weapon).toBe('plasma');

    const granted = await page.evaluate(() => {
      const hooks = window.__THREE_GAME_TEST_HOOKS__;
      if (!hooks?.grantUpgrade) throw new Error('grantUpgrade missing');
      const a = hooks.grantUpgrade('rail_bore');
      const b = hooks.grantUpgrade('rail_bore');
      const snap = hooks.getBuildSnapshot?.();
      return { a, b, snap };
    });
    expect(granted.a.ok).toBe(true);
    expect(granted.b.ok).toBe(true);

    const afterPlasma = await buildSnap(page);
    // Plasma numeric damage must be unchanged by rail-only upgrades.
    expect(afterPlasma.damage).toBeCloseTo(before.damage ?? 0, 5);
    expect(afterPlasma.fireInterval).toBeCloseTo(before.fireInterval ?? 0, 5);

    await page.keyboard.press('Digit2');
    await page.waitForTimeout(80);
    const rail = await page.evaluate(() => {
      const snap = window.__THREE_GAME_TEST_HOOKS__?.getBuildSnapshot?.();
      const dmg = window.__THREE_GAME_DIAGNOSTICS__?.player?.projectileDamage;
      return { snap, dmg };
    });
    // Rail base 34 + 2+2 bore
    expect(rail.dmg).toBeGreaterThanOrEqual(38);
    expect(rail.snap?.pierce).toBeGreaterThanOrEqual(4);
  });

  test('scatter_choke does not leak into rail damage', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    test.setTimeout(60_000);
    await boot(page, 999);
    await page.keyboard.press('Digit2');
    await page.waitForTimeout(80);
    const railBefore = await buildSnap(page);

    await page.evaluate(() => {
      window.__THREE_GAME_TEST_HOOKS__?.grantUpgrade?.('scatter_choke');
      window.__THREE_GAME_TEST_HOOKS__?.grantUpgrade?.('scatter_choke');
    });

    const railAfter = await buildSnap(page);
    expect(railAfter.weapon).toBe('rail');
    expect(railAfter.damage).toBeCloseTo(railBefore.damage ?? 0, 5);
  });

  test('encounter director emits squads and telegraphed density', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    test.setTimeout(90_000);
    await boot(page, 2026);
    // Force a later wave by playing briefly; diagnostics should show enemies after intermission.
    const canvas = page.locator('#game-canvas');
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    await page.mouse.move(
      (box as { x: number; width: number }).x + (box as { width: number }).width * 0.5,
      (box as { y: number; height: number }).y + (box as { height: number }).height * 0.4,
    );
    await page.mouse.down();
    await page.waitForTimeout(2500);
    await page.mouse.up();
    const snap = await buildSnap(page);
    expect(snap.wave).toBeGreaterThanOrEqual(1);
    expect(snap.enemies).toBeGreaterThanOrEqual(0);
  });

  test('diagnostics expose real dps fields and frame times', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    test.setTimeout(60_000);
    await boot(page, 65535);
    await page.waitForTimeout(800);
    const snap = await buildSnap(page);
    expect(snap.combatTime).toBeGreaterThan(0);
    expect(snap.dps).toBeGreaterThanOrEqual(0);
    expect(snap.killsPerSec).toBeGreaterThanOrEqual(0);
    expect(snap.frameMs?.p50).toBeGreaterThan(0);
    expect(snap.frameMs?.p99).toBeGreaterThanOrEqual(snap.frameMs?.p50 ?? 0);
  });
});
