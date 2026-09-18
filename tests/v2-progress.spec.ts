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

test.describe('v2 wave 1-15 progression', () => {
  test('full cycle plan matches design bands and boss milestones', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    await boot(page, 42);
    const plan = await page.evaluate(() => {
      const hooks = window.__THREE_GAME_TEST_HOOKS__;
      if (!hooks?.getFullCyclePlan) throw new Error('getFullCyclePlan missing');
      return hooks.getFullCyclePlan();
    });
    expect(plan).toHaveLength(15);
    expect(plan[0].band).toBe('learn');
    expect(plan[4].bossId).toBe('titan07');
    expect(plan[9].bossId).toBe('orbital_warden');
    expect(plan[14].bossId).toBe('void_engine');
    expect(plan[0].unlockedKinds).toEqual(['chaser']);
    expect(plan[1].unlockedKinds).toContain('ranged');
    expect(plan[2].unlockedKinds).toContain('swarm');
    expect(plan[3].unlockedKinds).toContain('elite');
    expect(plan[3].unlockedKinds).toContain('bomber');
    expect(plan[5].unlockedKinds).toContain('bulwark');
    expect(plan[6].unlockedKinds).toContain('sniper');
    expect(plan[7].unlockedKinds).toContain('disruptor');
    // Hazards gated
    expect(plan[0].hazardBudget).toBe(0);
    expect(plan[2].hazardBudget).toBeLessThanOrEqual(1);
    expect(plan[10].hazardBudget).toBe(2);
  });

  test('audited waves 1-15 have no locked kinds or wrong bosses', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    test.setTimeout(60_000);
    await boot(page, 42);
    const audits = await page.evaluate(() => {
      const hooks = window.__THREE_GAME_TEST_HOOKS__;
      if (!hooks?.auditWave) throw new Error('auditWave missing');
      const out = [];
      for (let wave = 1; wave <= 15; wave += 1) {
        // Try a few seeds; all must be clean.
        for (const seed of [42, 7, 99, 137]) {
          out.push(hooks.auditWave(wave, seed));
        }
      }
      return out;
    });
    const violations = audits.flatMap((a) =>
      a.violations.map((v: string) => `w${a.wave}: ${v}`),
    );
    expect(violations, violations.join(' | ')).toEqual([]);
  });

  test('wave 1 stays learning-light; wave 8+ can field late kinds', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    await boot(page, 42);
    const stats = await page.evaluate(() => {
      const hooks = window.__THREE_GAME_TEST_HOOKS__;
      if (!hooks?.composeEncounter) throw new Error('compose missing');
      const kindsOf = (wave: number, seed: number) => {
        const enc = hooks.composeEncounter!(wave, seed);
        const kinds = [...new Set(enc.tickets.map((t) => t.kind))];
        return { kinds, count: enc.tickets.length, squads: enc.squads };
      };
      return {
        w1: kindsOf(1, 42),
        w3: kindsOf(3, 42),
        w8: kindsOf(8, 42),
        w12: kindsOf(12, 42),
      };
    });
    expect(stats.w1.kinds.includes('disruptor')).toBe(false);
    expect(stats.w1.kinds.includes('bulwark')).toBe(false);
    expect(stats.w1.kinds.includes('sniper')).toBe(false);
    expect(stats.w1.count).toBeGreaterThan(0);
    let sawLate = false;
    for (const seed of [1, 2, 3, 4, 5, 42, 99, 137, 2026]) {
      const enc = await page.evaluate((s) => {
        return window.__THREE_GAME_TEST_HOOKS__?.composeEncounter?.(8, s);
      }, seed);
      const kinds = new Set((enc?.tickets ?? []).map((t) => t.kind));
      if (kinds.has('disruptor') || kinds.has('sniper') || kinds.has('bulwark')) sawLate = true;
    }
    expect(sawLate).toBe(true);
  });

  test('threat budget ramps without boss-wave overload', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    await boot(page, 42);
    const budgets = await page.evaluate(() => {
      const hooks = window.__THREE_GAME_TEST_HOOKS__;
      const out: Array<{ wave: number; tickets: number; boss: boolean }> = [];
      for (const wave of [1, 2, 3, 4, 5, 6, 8, 10, 12, 15]) {
        const enc = hooks?.composeEncounter?.(wave, 42);
        out.push({
          wave,
          tickets: enc?.tickets.length ?? 0,
          boss: (enc?.tickets ?? []).some((t) => t.kind === 'boss'),
        });
      }
      return out;
    });
    const w1 = budgets.find((b) => b.wave === 1);
    const w5 = budgets.find((b) => b.wave === 5);
    const w12 = budgets.find((b) => b.wave === 12);
    expect(w1?.boss).toBe(false);
    expect(w5?.boss).toBe(true);
    expect(w12?.boss).toBe(false);
    expect(w12?.tickets ?? 0).toBeGreaterThan(w1?.tickets ?? 0);
  });

  test('live forceWave respects unlock gating for spawned pool', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    test.setTimeout(90_000);
    await boot(page, 42);
    const snap = await page.evaluate(async () => {
      const hooks = window.__THREE_GAME_TEST_HOOKS__;
      if (!hooks?.forceWave || !hooks?.getEncounterSnapshot) throw new Error('hooks missing');
      hooks.forceWave(3);
      await new Promise((r) => setTimeout(r, 2000));
      return hooks.getEncounterSnapshot();
    });
    expect(snap.wave).toBe(3);
    const kinds = new Set(snap.tickets.map((t) => t.kind));
    expect(kinds.has('disruptor')).toBe(false);
    expect(kinds.has('bulwark')).toBe(false);
  });
});
