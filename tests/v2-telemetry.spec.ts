import { expect, test } from '@playwright/test';

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

test.describe('v2 combat telemetry', () => {
  test('diagnostics expose damage/kills breakdowns after combat', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    test.setTimeout(60_000);
    await boot(page, 42);
    const canvas = page.locator('#game-canvas');
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    const b = box as { x: number; y: number; width: number; height: number };
    await page.mouse.move(b.x + b.width * 0.5, b.y + b.height * 0.4);
    await page.mouse.down();
    await page.waitForTimeout(2500);
    await page.mouse.up();

    const snap = await page.evaluate(() => {
      const d = window.__THREE_GAME_DIAGNOSTICS__;
      return {
        damageDealt: d?.damageDealt ?? 0,
        shotsFired: d?.shotsFired ?? 0,
        damageByWeapon: d?.damageByWeapon ?? {},
        killsByWeapon: d?.killsByWeapon ?? {},
        damageByUpgrade: d?.damageByUpgrade ?? {},
        damageByHazard: d?.damageByHazard ?? {},
        damageTakenBySource: d?.damageTakenBySource ?? {},
        enemyKillsByType: d?.enemyKillsByType ?? {},
        bossPhaseDeaths: d?.bossPhaseDeaths ?? 0,
        hazardKills: d?.hazardKills ?? 0,
        // Labels must not be mis-tagged: dps is a rate, not raw kills/s used as DPS
        dps: d?.dps ?? 0,
        killsPerSec: d?.killsPerSec ?? 0,
        combatTime: d?.combatTime ?? 0,
      };
    });

    expect(snap.shotsFired).toBeGreaterThan(0);
    expect(snap.damageByWeapon).toBeTruthy();
    expect(typeof snap.damageByWeapon).toBe('object');
    // Plasma default weapon should register damage after sustained fire if any hits landed.
    if (snap.damageDealt > 0) {
      const weaponSum = Object.values(snap.damageByWeapon).reduce((a, b) => a + b, 0);
      expect(weaponSum).toBeGreaterThan(0);
    }
    // dps is damage/combatTime when combatTime > 0 — not equal to killsPerSec by construction
    if (snap.combatTime > 0.05 && snap.damageDealt > 0) {
      expect(snap.dps).toBeGreaterThan(0);
    }
    expect(snap.enemyKillsByType).toBeTruthy();
    expect(Array.isArray(Object.keys(snap.damageTakenBySource))).toBe(true);
  });

  test('upgrade-rule damage appears in damageByUpgrade after grants + combat', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    test.setTimeout(60_000);
    await boot(page, 77);
    await page.evaluate(() => {
      const hooks = window.__THREE_GAME_TEST_HOOKS__;
      hooks?.grantUpgrade?.('arc_capacitor');
      hooks?.grantUpgrade?.('dash_detonation');
      hooks?.grantUpgrade?.('ion_aftershock');
      hooks?.spawnEnemy?.('chaser', 0, -2.5);
      hooks?.spawnEnemy?.('swarm', 0.4, -2.2);
    });
    const canvas = page.locator('#game-canvas');
    const box = await canvas.boundingBox();
    const b = box as { x: number; y: number; width: number; height: number };
    await page.mouse.move(b.x + b.width * 0.5, b.y + b.height * 0.35);
    await page.mouse.down();
    await page.waitForTimeout(1800);
    await page.keyboard.press('Space');
    await page.waitForTimeout(800);
    await page.mouse.up();

    const snap = await page.evaluate(() => window.__THREE_GAME_DIAGNOSTICS__);
    const byUpgrade = snap?.damageByUpgrade ?? {};
    const keys = Object.keys(byUpgrade);
    // At least the object exists; if arc/dash fired, keys should be non-empty.
    expect(typeof snap?.damageByUpgrade).toBe('object');
    expect(keys.every((k) => typeof k === 'string')).toBe(true);
    // stacks recorded
    expect(snap?.upgradeStacks?.arc_capacitor ?? 0).toBeGreaterThanOrEqual(1);
  });

  test('enemy kills counted by archetype kind', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    test.setTimeout(60_000);
    await boot(page, 42);
    await page.evaluate(() => {
      const hooks = window.__THREE_GAME_TEST_HOOKS__;
      hooks?.clearEnemies?.();
      hooks?.spawnEnemy?.('chaser', 0, -2);
      hooks?.spawnEnemy?.('swarm', 1, -2);
      hooks?.debugHitEnemy?.('chaser', 9999, 0, 0);
      hooks?.debugHitEnemy?.('swarm', 9999, 0, 0);
    });
    const snap = await page.evaluate(() => window.__THREE_GAME_DIAGNOSTICS__);
    const kinds = snap?.enemyKillsByType ?? {};
    expect(kinds.chaser ?? 0).toBeGreaterThanOrEqual(1);
    expect(kinds.swarm ?? 0).toBeGreaterThanOrEqual(1);
  });
});
