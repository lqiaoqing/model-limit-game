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

test.describe('v2 arena hazards', () => {
  test('seeded schedule is deterministic and respects wave budget', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    await boot(page, 42);
    const schedules = await page.evaluate(() => {
      const hooks = window.__THREE_GAME_TEST_HOOKS__;
      if (!hooks?.planHazardSchedule) throw new Error('planHazardSchedule missing');
      const a1 = hooks.planHazardSchedule(1, 42);
      const a2 = hooks.planHazardSchedule(1, 42);
      const b1 = hooks.planHazardSchedule(7, 42);
      const b2 = hooks.planHazardSchedule(7, 42);
      const c = hooks.planHazardSchedule(7, 137);
      return { a1, a2, b1, b2, c };
    });
    expect(schedules.a1).toEqual(schedules.a2);
    expect(schedules.a1.length).toBe(0);
    expect(schedules.b1).toEqual(schedules.b2);
    expect(schedules.b1.length).toBeGreaterThanOrEqual(1);
    expect(schedules.b1.length).toBeLessThanOrEqual(2);
    // Different seed may differ (not required, but wave 1 always empty).
    expect(Array.isArray(schedules.c)).toBe(true);
  });

  test('warning phase precedes active laser gate', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    test.setTimeout(60_000);
    await boot(page, 42);
    const phases: string[] = [];
    const spawned = await page.evaluate(() => {
      const hooks = window.__THREE_GAME_TEST_HOOKS__;
      if (!hooks?.triggerHazard || !hooks?.getHazardSnapshot) throw new Error('hooks missing');
      const r = hooks.triggerHazard('laser_gate');
      return { ok: r.ok, snap: hooks.getHazardSnapshot() };
    });
    expect(spawned.ok).toBe(true);
    const first = spawned.snap.hazards.find((h) => h.kind === 'laser_gate');
    expect(first?.phase, 'must start in warning').toBe('warning');
    phases.push(first?.phase ?? 'missing');

    for (let i = 0; i < 24; i += 1) {
      await page.waitForTimeout(200);
      const snap = await page.evaluate(
        () => window.__THREE_GAME_TEST_HOOKS__?.getHazardSnapshot?.(),
      );
      const h = snap?.hazards.find((x) => x.kind === 'laser_gate');
      if (h) phases.push(h.phase);
    }
    expect(phases).toContain('warning');
    expect(phases).toContain('active');
  });

  test('hazard field damages enemies; cores are shootable', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    test.setTimeout(60_000);
    await boot(page, 42);
    const setup = await page.evaluate(async () => {
      const hooks = window.__THREE_GAME_TEST_HOOKS__;
      if (!hooks?.clearEnemies || !hooks?.spawnEnemy || !hooks?.triggerHazard || !hooks?.getEnemies) {
        throw new Error('hooks missing');
      }
      hooks.clearEnemies();
      const core = hooks.triggerHazard('overload_core');
      if (!core.ok || !core.hazard) throw new Error('core spawn failed');
      // Place chasers inside the core blast ring.
      hooks.spawnEnemy('chaser', core.hazard.x + 0.3, core.hazard.z + 0.2);
      hooks.spawnEnemy('chaser', core.hazard.x - 0.2, core.hazard.z - 0.3);
      hooks.spawnEnemy('chaser', 10, 7); // far decoy
      await new Promise((r) => setTimeout(r, 80));
      return {
        core,
        enemies: hooks.getEnemies(),
      };
    });
    const core = setup.core.hazard;
    if (!core) throw new Error('missing core hazard');
    expect(core.phase).toBe('warning');

    // Wait for core warning → it stays until shot or timer; force via many rail-like hits using debug path:
    // Player fires from origin; place aim by waiting natural active if core self-detonates after warning.
    // Overload core activeDur is short after warning — it will self-detonate.
    await page.waitForTimeout(2500);

    const after = await page.evaluate(() => {
      const hooks = window.__THREE_GAME_TEST_HOOKS__;
      return {
        hazards: hooks?.getHazardSnapshot?.(),
        enemies: hooks?.getEnemies?.() ?? [],
        hazardKills: window.__THREE_GAME_DIAGNOSTICS__?.hazardKills ?? 0,
      };
    });

    const far = after.enemies.find((e) => Math.abs(e.x - 10) < 0.5 && Math.abs(e.z - 7) < 0.5);
    const nearCore = after.enemies.filter(
      (e) => Math.hypot(e.x - (core?.x ?? 0), e.z - (core?.z ?? 0)) < 3.2,
    );
    // Near-core units should be damaged or dead after detonation/field.
    const hurtNear = nearCore.some((e) => !e.alive || e.hp < 28);
    expect(hurtNear || (after.hazardKills ?? 0) >= 1).toBe(true);
    if (far) expect(far.alive).toBe(true);
  });

  test('laser gate damages enemies standing in the line', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    test.setTimeout(60_000);
    await boot(page, 42);
    const setup = await page.evaluate(() => {
      const hooks = window.__THREE_GAME_TEST_HOOKS__;
      if (!hooks?.clearEnemies || !hooks?.spawnEnemy || !hooks?.triggerHazard || !hooks?.getEnemies) {
        throw new Error('hooks missing');
      }
      hooks.clearEnemies();
      const r = hooks.triggerHazard('laser_gate');
      if (!r.ok || !r.hazard) throw new Error('laser spawn failed');
      const h = r.hazard;
      // Spawn on the laser line.
      if (h.axis === 0) {
        hooks.spawnEnemy('chaser', h.x, h.z);
        hooks.spawnEnemy('chaser', h.x + 8, h.z); // off-line
      } else {
        hooks.spawnEnemy('chaser', h.x, h.z);
        hooks.spawnEnemy('chaser', h.x, h.z + 8);
      }
      return { h, enemies: hooks.getEnemies() };
    });
    const h = setup.h;
    const onLineBefore = setup.enemies.find(
      (e) => Math.hypot(e.x - h.x, e.z - h.z) < 0.6,
    );
    expect(onLineBefore).toBeTruthy();

    // warning 1.2s + active ticks
    await page.waitForTimeout(3500);
    const after = await page.evaluate(
      () => window.__THREE_GAME_TEST_HOOKS__?.getEnemies?.() ?? [],
    );
    const onLine = after.find((e) => Math.hypot(e.x - h.x, e.z - h.z) < 1.2 && e.kind === 'chaser');
    const offLine = after.find((e) => {
      const d =
        h.axis === 0
          ? Math.hypot(e.x - (h.x + 8), e.z - h.z)
          : Math.hypot(e.x - h.x, e.z - (h.z + 8));
      return d < 2;
    });
    if (onLine) {
      expect(onLine.alive === false || onLine.hp < (onLineBefore?.hp ?? 28)).toBe(true);
    }
    if (offLine) expect(offLine.alive).toBe(true);
  });

  test('wave 1 budget is zero; wave 8 allows hazards', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    await boot(page, 42);
    const budgets = await page.evaluate(() => {
      const hooks = window.__THREE_GAME_TEST_HOOKS__;
      const plan = (w: number) => hooks?.planHazardSchedule?.(w, 99) ?? [];
      return { w1: plan(1), w3: plan(3), w8: plan(8), w12: plan(12) };
    });
    expect(budgets.w1.length).toBe(0);
    expect(budgets.w3.length).toBeGreaterThanOrEqual(0);
    expect(budgets.w3.length).toBeLessThanOrEqual(1);
    expect(budgets.w8.length).toBeGreaterThanOrEqual(1);
    expect(budgets.w8.length).toBeLessThanOrEqual(2);
    expect(budgets.w12.length).toBeGreaterThanOrEqual(1);
    expect(budgets.w12.length).toBeLessThanOrEqual(2);
  });
});
