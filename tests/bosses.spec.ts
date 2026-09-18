import { expect, test } from '@playwright/test';

type BossSnap = {
  activeBossId: string;
  bossId: string | null;
  alive: boolean;
  hpRatio: number;
  director: {
    bossId: string | null;
    phase: number;
    shieldActive: boolean;
    shieldDrones: number;
    arenaShrink: number;
    beamAngle: number;
  };
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

async function forceBoss(page: import('@playwright/test').Page, id: string) {
  return page.evaluate((bossId) => {
    const hooks = window.__THREE_GAME_TEST_HOOKS__;
    if (!hooks?.forceBoss || !hooks?.getBossSnapshot) throw new Error('boss hooks missing');
    const spawned = hooks.forceBoss(bossId);
    return { spawned, snap: hooks.getBossSnapshot() as BossSnap };
  }, id);
}

async function setRatio(page: import('@playwright/test').Page, ratio: number): Promise<BossSnap> {
  return page.evaluate((r) => {
    const hooks = window.__THREE_GAME_TEST_HOOKS__;
    hooks?.setBossHpRatio?.(r);
    return (hooks?.getBossSnapshot?.() ?? null) as BossSnap | null;
  }, ratio) as Promise<BossSnap>;
}

test.describe('v2 bosses', () => {
  test('titan phases at 70% and 40% hp', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    test.setTimeout(60_000);
    await boot(page, 42);
    const r0 = await forceBoss(page, 'titan07');
    expect(r0.spawned.ok).toBe(true);
    expect(r0.snap.bossId).toBe('titan07');
    expect(r0.snap.director.phase).toBe(1);

    const p2 = await setRatio(page, 0.65);
    expect(p2.director.phase).toBe(2);

    const p3 = await setRatio(page, 0.35);
    expect(p3.director.phase).toBe(3);
    expect(p3.hpRatio).toBeLessThanOrEqual(0.36);
  });

  test('orbital warden shield and dual-beam phase', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    test.setTimeout(60_000);
    await boot(page, 42);
    const r0 = await forceBoss(page, 'orbital_warden');
    expect(r0.spawned.ok).toBe(true);
    expect(r0.snap.bossId).toBe('orbital_warden');

    await setRatio(page, 0.55);
    await page.waitForTimeout(200);
    const p2b = await setRatio(page, 0.55);
    expect(p2b.director.phase).toBe(2);

    const p3 = await setRatio(page, 0.3);
    await page.waitForTimeout(200);
    const beam1 = p3.director.beamAngle;
    await page.waitForTimeout(400);
    const later = await page.evaluate(
      () => window.__THREE_GAME_TEST_HOOKS__?.getBossSnapshot?.() as BossSnap,
    );
    expect(later.director.phase).toBe(3);
    expect(later.director.beamAngle).toBeGreaterThanOrEqual(beam1);
  });

  test('void engine collapse shrinks arena and later phases unlock', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    test.setTimeout(60_000);
    await boot(page, 42);
    const r0 = await forceBoss(page, 'void_engine');
    expect(r0.spawned.ok).toBe(true);
    expect(r0.snap.bossId).toBe('void_engine');

    await setRatio(page, 0.5);
    await page.waitForTimeout(250);
    const p2b = await setRatio(page, 0.5);
    expect(p2b.director.phase).toBe(2);
    expect(p2b.director.arenaShrink).toBeLessThan(1);

    const p3 = await setRatio(page, 0.25);
    expect(p3.director.phase).toBe(3);
  });

  test('composeEncounter boss ticket uses wave-mapped boss ids', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    await boot(page, 42);
    const ids = await page.evaluate(() => {
      const hooks = window.__THREE_GAME_TEST_HOOKS__;
      if (!hooks?.composeEncounter) throw new Error('composeEncounter missing');
      const bossOf = (wave: number) => {
        const enc = hooks.composeEncounter!(wave, 42);
        return enc.tickets.find((t) => t.kind === 'boss')?.bossId ?? null;
      };
      return { w5: bossOf(5), w10: bossOf(10), w15: bossOf(15), w20: bossOf(20) };
    });
    expect(ids.w5).toBe('titan07');
    expect(ids.w10).toBe('orbital_warden');
    expect(ids.w15).toBe('void_engine');
    expect(ids.w20).toBe('titan07');
  });
});
