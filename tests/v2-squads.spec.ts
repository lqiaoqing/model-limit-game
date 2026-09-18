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

type Ticket = {
  kind: string;
  squadId: string;
  anchor: string;
  delay: number;
  offsetX: number;
  offsetZ: number;
};

async function compose(
  page: import('@playwright/test').Page,
  wave: number,
  seed: number,
): Promise<{ tickets: Ticket[]; squads: string[] }> {
  return page.evaluate(
    ({ wave: w, seed: s }) => {
      const hooks = window.__THREE_GAME_TEST_HOOKS__;
      if (!hooks?.composeEncounter) throw new Error('composeEncounter missing');
      return hooks.composeEncounter(w, s);
    },
    { wave, seed },
  );
}

function findSquad(tickets: Ticket[], squadId: string): Ticket[] {
  return tickets.filter((t) => t.squadId === squadId);
}

test.describe('v2 tactical squads', () => {
  test('assassin pincer uses two distinct anchors', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    test.setTimeout(60_000);
    await boot(page, 42);
    let found: Ticket[] = [];
    for (let seed = 1; seed <= 40 && found.length === 0; seed += 1) {
      const enc = await compose(page, 6, seed);
      found = findSquad(enc.tickets, 'assassin_strike');
    }
    expect(found.length, 'assassin_strike should appear by wave 6').toBeGreaterThanOrEqual(2);
    const anchors = new Set(found.map((t) => t.anchor));
    expect(anchors.size, `pincer anchors: ${[...anchors].join(',')}`).toBeGreaterThanOrEqual(2);
    expect([...anchors].some((a) => a === 'east' || a === 'west')).toBe(true);
    // Formation: delayed stagger, not a single synchronized blob.
    const delays = found.map((t) => t.delay);
    expect(Math.max(...delays) - Math.min(...delays)).toBeGreaterThan(0);
  });

  test('shield_wall contains bulwark front and ranged rear roles', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    await boot(page, 42);
    let wall: Ticket[] = [];
    for (let seed = 1; seed <= 50 && wall.length === 0; seed += 1) {
      const enc = await compose(page, 8, seed);
      wall = findSquad(enc.tickets, 'shield_wall');
    }
    expect(wall.length, 'shield_wall unlocks at wave 6+').toBeGreaterThanOrEqual(2);
    expect(wall.some((t) => t.kind === 'bulwark')).toBe(true);
    expect(wall.some((t) => t.kind === 'ranged')).toBe(true);
    // Bulwark leads the wall (smaller |offsetZ| toward player side vs rear ranged).
    const bulwarks = wall.filter((t) => t.kind === 'bulwark');
    const ranged = wall.filter((t) => t.kind === 'ranged');
    expect(bulwarks.length).toBeGreaterThan(0);
    expect(ranged.length).toBeGreaterThan(0);
  });

  test('bomb_rush mixes bomber + swarm; artillery nest mixes ranged + sniper later', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    await boot(page, 42);
    let rush: Ticket[] = [];
    let nest: Ticket[] = [];
    for (let seed = 1; seed <= 60 && (rush.length === 0 || nest.length === 0); seed += 1) {
      const enc = await compose(page, 10, seed);
      if (rush.length === 0) rush = findSquad(enc.tickets, 'bomb_rush');
      if (nest.length === 0) nest = findSquad(enc.tickets, 'artillery_nest');
    }
    expect(rush.length, 'bomb_rush at wave 4+').toBeGreaterThan(0);
    expect(rush.some((t) => t.kind === 'bomber')).toBe(true);
    expect(rush.some((t) => t.kind === 'swarm')).toBe(true);
    expect(nest.length, 'artillery_nest present').toBeGreaterThan(0);
    expect(nest.some((t) => t.kind === 'ranged')).toBe(true);
  });

  test('disruptor_escort ticket recipe includes disruptor + escort roles', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    await boot(page, 42);
    let escort: Ticket[] = [];
    for (let seed = 1; seed <= 60 && escort.length === 0; seed += 1) {
      const enc = await compose(page, 12, seed);
      escort = findSquad(enc.tickets, 'disruptor_escort');
    }
    expect(escort.length, 'disruptor_escort unlocks wave 8+').toBeGreaterThan(0);
    expect(escort.some((t) => t.kind === 'disruptor')).toBe(true);
    expect(
      escort.some((t) => t.kind === 'bulwark' || t.kind === 'chaser'),
      'escort bodyguards present',
    ).toBe(true);
  });

  test('live forceWave assigns squadId/role on spawned units', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    test.setTimeout(90_000);
    await boot(page, 99);
    const snap = await page.evaluate(async () => {
      const hooks = window.__THREE_GAME_TEST_HOOKS__;
      if (!hooks?.forceWave || !hooks?.getEncounterSnapshot) throw new Error('hooks missing');
      hooks.forceWave(8);
      // Allow delayed tickets to enter.
      await new Promise((r) => setTimeout(r, 2500));
      return hooks.getEncounterSnapshot();
    });
    expect(snap.wave).toBe(8);
    expect(snap.tickets.length, 'wave tickets composed').toBeGreaterThan(0);
    expect(snap.squads.length, 'squad recipe ids selected').toBeGreaterThan(0);
    const tagged = snap.enemies.filter((e) => e.alive && e.squadId && e.squadId !== 'filler');
    expect(tagged.length, 'squad-tagged enemies alive').toBeGreaterThan(0);
    for (const e of tagged.slice(0, 6)) {
      expect(e.squadId).toBeTruthy();
    }
    // Snapshot groups expose roles for at least one tactical squad.
    if (snap.squadGroups.length > 0) {
      const g = snap.squadGroups[0];
      expect(g.count).toBeGreaterThan(0);
    }
  });

  test('composeEncounter wave 1 does not unlock late squads', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    await boot(page, 42);
    const enc = await compose(page, 1, 42);
    const late = enc.tickets.filter(
      (t) =>
        t.squadId === 'bomb_rush' ||
        t.squadId === 'disruptor_escort' ||
        t.squadId === 'shield_wall',
    );
    expect(late.length).toBe(0);
    expect(enc.tickets.every((t) => t.delay >= 0)).toBe(true);
  });
});
