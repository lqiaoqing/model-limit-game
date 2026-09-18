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

test.describe('v2 upgrades', () => {
  test('pool size ~28 and rule-changing ≥16', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    await boot(page, 42);
    const snap = await page.evaluate(() => window.__THREE_GAME_TEST_HOOKS__?.getBuildSnapshot?.());
    expect(snap?.poolSize ?? 0).toBeGreaterThanOrEqual(28);
    expect(snap?.poolSize ?? 0).toBeLessThanOrEqual(32);
    expect(snap?.ruleCount ?? 0).toBeGreaterThanOrEqual(16);
  });

  test('ion_expansion isolation: launcher only', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    await boot(page, 42);
    const before = await page.evaluate(() => {
      const snap = window.__THREE_GAME_TEST_HOOKS__?.getBuildSnapshot?.();
      return {
        plasma: snap?.perWeaponDamage?.plasma,
        rail: snap?.perWeaponDamage?.rail,
        scatter: snap?.perWeaponDamage?.scatter,
        launcher: snap?.perWeaponDamage?.launcher,
        aoe: snap?.aoeRadius,
      };
    });
    await page.evaluate(() => {
      window.__THREE_GAME_TEST_HOOKS__?.grantUpgrade?.('ion_expansion');
      window.__THREE_GAME_TEST_HOOKS__?.forceWeapon?.('launcher');
    });
    const after = await page.evaluate(() => window.__THREE_GAME_TEST_HOOKS__?.getBuildSnapshot?.());
    expect(after?.weapon).toBe('launcher');
    expect(after?.modifiers.some((m) => m.startsWith('ion_expansion'))).toBe(true);
    expect(after?.perWeaponDamage?.plasma).toBeCloseTo(before.plasma ?? 0, 5);
    expect(after?.perWeaponDamage?.rail).toBeCloseTo(before.rail ?? 0, 5);
    expect(after?.perWeaponDamage?.scatter).toBeCloseTo(before.scatter ?? 0, 5);
    expect(after?.perWeaponDamage?.launcher).toBeLessThan(before.launcher ?? 0);
  });

  test('synergy modifiers observable in telemetry snapshot', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    await boot(page, 77);
    const mods = await page.evaluate(() => {
      const hooks = window.__THREE_GAME_TEST_HOOKS__;
      if (!hooks?.grantUpgrade) throw new Error('grantUpgrade missing');
      // Plasma chain build
      hooks.grantUpgrade('arc_capacitor');
      hooks.grantUpgrade('critical_conductor');
      hooks.grantUpgrade('plasma_feedback');
      hooks.grantUpgrade('plasma_superconduct');
      // Rail
      hooks.grantUpgrade('rail_bore');
      hooks.grantUpgrade('rail_execute');
      hooks.grantUpgrade('rail_charge');
      // Scatter + dash
      hooks.grantUpgrade('scatter_choke');
      hooks.grantUpgrade('dash_detonation');
      hooks.grantUpgrade('scatter_dash_reload');
      // Ion
      hooks.grantUpgrade('ion_aftershock');
      hooks.grantUpgrade('ion_heat_sink');
      // Global
      hooks.grantUpgrade('overheat_cascade');
      hooks.grantUpgrade('emergency_protocol');
      hooks.grantUpgrade('momentum_core');
      return hooks.getBuildSnapshot?.().modifiers ?? [];
    });
    for (const id of [
      'arc_capacitor',
      'critical_conductor',
      'plasma_feedback',
      'plasma_superconduct',
      'rail_bore',
      'rail_execute',
      'rail_charge',
      'scatter_choke',
      'dash_detonation',
      'scatter_dash_reload',
      'ion_aftershock',
      'ion_heat_sink',
      'overheat_cascade',
      'emergency_protocol',
      'momentum_core',
    ]) {
      expect(mods.some((m) => m.startsWith(id)), `missing modifier ${id}`).toBe(true);
    }
  });

  test('rail_bore still does not pollute plasma after expanded pool', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    await boot(page, 137);
    const before = await page.evaluate(() => window.__THREE_GAME_TEST_HOOKS__?.getBuildSnapshot?.());
    await page.evaluate(() => {
      const hooks = window.__THREE_GAME_TEST_HOOKS__;
      hooks?.grantUpgrade?.('rail_bore');
      hooks?.grantUpgrade?.('rail_execute');
      hooks?.grantUpgrade?.('ion_expansion');
    });
    const after = await page.evaluate(() => window.__THREE_GAME_TEST_HOOKS__?.getBuildSnapshot?.());
    expect(after?.weapon).toBe('plasma');
    expect(after?.damage).toBeCloseTo(before?.damage ?? 0, 5);
    expect(after?.perWeaponDamage?.plasma).toBeCloseTo(before?.perWeaponDamage?.plasma ?? 0, 5);
  });
});
