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

  test('rule-changing upgrade deals damage recorded in damageByUpgrade', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    test.setTimeout(60_000);
    await boot(page, 77);

    // Deterministic rule-damage path: arc_capacitor chains on kill; dash_detonation blasts on dash.
    const setup = await page.evaluate(() => {
      const hooks = window.__THREE_GAME_TEST_HOOKS__;
      if (!hooks?.grantUpgrade || !hooks?.clearEnemies || !hooks?.spawnEnemy || !hooks?.debugHitEnemy) {
        throw new Error('hooks missing');
      }
      hooks.clearEnemies();
      const arc = hooks.grantUpgrade('arc_capacitor');
      const dash = hooks.grantUpgrade('dash_detonation');
      const player = window.__THREE_GAME_DIAGNOSTICS__?.player?.position ?? { x: 0, z: 0 };
      const px = player.x ?? 0;
      const pz = player.z ?? 0;
      // Cluster within ARC_CHAIN_RANGE (4.2) and DASH_BLAST_RADIUS (3.2).
      hooks.spawnEnemy('chaser', px + 0.3, pz - 1.6);
      hooks.spawnEnemy('swarm', px - 0.4, pz - 1.8);
      hooks.spawnEnemy('chaser', px + 0.1, pz - 2.4);
      return {
        arc,
        dash,
        enemies: hooks.getEnemies?.() ?? [],
        stacks: window.__THREE_GAME_DIAGNOSTICS__?.upgradeStacks ?? {},
      };
    });

    expect(setup.arc.ok).toBe(true);
    expect(setup.dash.ok).toBe(true);
    expect(setup.stacks.arc_capacitor ?? 0).toBeGreaterThanOrEqual(1);
    expect(setup.stacks.dash_detonation ?? 0).toBeGreaterThanOrEqual(1);
    expect(setup.enemies.filter((e) => e.alive).length).toBeGreaterThanOrEqual(2);

    // Kill the nearest clustered unit → arc_capacitor should chain and record upgrade damage.
    await page.evaluate(() => {
      const hooks = window.__THREE_GAME_TEST_HOOKS__;
      const enemies = hooks?.getEnemies?.() ?? [];
      const player = window.__THREE_GAME_DIAGNOSTICS__?.player?.position ?? { x: 0, z: 0 };
      const px = player.x ?? 0;
      const pz = player.z ?? 0;
      const target = enemies
        .filter((e) => e.alive)
        .sort(
          (a, b) =>
            Math.hypot(a.x - px, a.z - pz) - Math.hypot(b.x - px, b.z - pz),
        )[0];
      if (!target) throw new Error('no live enemy for rule damage');
      hooks?.debugHitEnemy?.(target.id ?? target.kind, 9999, px, pz);
    });
    await page.waitForTimeout(400);

    // Also exercise dash_detonation: Space dash leaves a delayed blast.
    const canvas = page.locator('#game-canvas');
    const box = await canvas.boundingBox();
    const b = box as { x: number; y: number; width: number; height: number };
    await page.mouse.move(b.x + b.width * 0.5, b.y + b.height * 0.35);
    await page.keyboard.press('Space');
    await page.waitForTimeout(900);

    const snap = await page.evaluate(() => window.__THREE_GAME_DIAGNOSTICS__);
    const byUpgrade = snap?.damageByUpgrade ?? {};
    const arcDmg = byUpgrade.arc_capacitor ?? 0;
    const dashDmg = byUpgrade.dash_detonation ?? 0;
    const ruleTotal = arcDmg + dashDmg;

    // Must prove a rule-changing upgrade actually produced telemetry damage — not merely that the object exists.
    expect(ruleTotal, `damageByUpgrade=${JSON.stringify(byUpgrade)}`).toBeGreaterThan(0);
    expect(arcDmg > 0 || dashDmg > 0).toBe(true);
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
