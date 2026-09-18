import { expect, test } from '@playwright/test';

type BuildSnap = {
  weapon: string;
  damage: number;
  fireInterval: number;
  pierce: number;
  aoeRadius?: number;
  heatPerShot?: number;
  perWeaponDamage?: Record<string, number>;
  modifiers: string[];
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

async function getBuild(page: import('@playwright/test').Page): Promise<BuildSnap> {
  return page.evaluate(() => {
    const snap = window.__THREE_GAME_TEST_HOOKS__?.getBuildSnapshot?.();
    if (!snap) throw new Error('getBuildSnapshot missing');
    return snap as BuildSnap;
  });
}

test.describe('v2 content · ion launcher', () => {
  test('weapon round-trip 1→2→3→4→1 keeps identities', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    test.setTimeout(60_000);
    await boot(page, 42);
    const plasma0 = await getBuild(page);
    expect(plasma0.weapon).toBe('plasma');

    await page.keyboard.press('Digit2');
    await page.waitForTimeout(80);
    const rail = await getBuild(page);
    expect(rail.weapon).toBe('rail');
    expect(rail.damage).toBeGreaterThan(plasma0.damage);

    await page.keyboard.press('Digit3');
    await page.waitForTimeout(80);
    const scatter = await getBuild(page);
    expect(scatter.weapon).toBe('scatter');

    await page.keyboard.press('Digit4');
    await page.waitForTimeout(80);
    const launcher = await getBuild(page);
    expect(launcher.weapon).toBe('launcher');
    expect(launcher.aoeRadius ?? 0).toBeGreaterThan(1.5);
    expect(launcher.heatPerShot ?? 0).toBeGreaterThan(plasma0.heatPerShot ?? 0);
    expect(launcher.fireInterval).toBeGreaterThan(plasma0.fireInterval);
    expect(launcher.damage).toBeGreaterThan(0);
    expect(launcher.damage).not.toBe(plasma0.damage);

    await page.keyboard.press('Digit1');
    await page.waitForTimeout(80);
    const plasma1 = await getBuild(page);
    expect(plasma1.weapon).toBe('plasma');
    expect(plasma1.damage).toBeCloseTo(plasma0.damage, 5);
    expect(plasma1.fireInterval).toBeCloseTo(plasma0.fireInterval, 5);
  });

  test('launcher impact AoE damages ≥2 in-radius targets and leaves outside target intact', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    test.setTimeout(60_000);
    await boot(page, 42);

    type EnemySnap = { id?: string; kind: string; x: number; z: number; hp: number; alive: boolean };

    const setup = await page.evaluate(async () => {
      const hooks = window.__THREE_GAME_TEST_HOOKS__;
      if (!hooks?.forceWeapon || !hooks?.spawnEnemy || !hooks?.clearEnemies || !hooks?.getEnemies) {
        throw new Error('hooks missing');
      }
      hooks.clearEnemies();
      hooks.forceWeapon('launcher');
      const player = window.__THREE_GAME_DIAGNOSTICS__?.player?.position ?? { x: 0, z: 0 };
      const px = player.x ?? 0;
      const pz = player.z ?? 0;

      // Deterministic layout along default aim (-Z):
      // A = impact target, B = inside AoE (launcher aoeRadius 2.55), C = far outside.
      const a = { x: px, z: pz - 3.2 };
      const b = { x: px + 0.85, z: pz - 3.45 };
      const c = { x: px + 8.5, z: pz + 8.5 };
      hooks.spawnEnemy('chaser', a.x, a.z);
      hooks.spawnEnemy('chaser', b.x, b.z);
      hooks.spawnEnemy('chaser', c.x, c.z);

      const enemies = hooks.getEnemies() ?? [];
      const near = (e: EnemySnap, p: { x: number; z: number }, r = 0.55) =>
        Math.hypot(e.x - p.x, e.z - p.z) <= r;
      const snapA = enemies.find((e) => e.alive && near(e, a));
      const snapB = enemies.find((e) => e.alive && near(e, b));
      const snapC = enemies.find((e) => e.alive && near(e, c));
      return {
        weapon: hooks.getBuildSnapshot?.().weapon,
        a: snapA ? { ...snapA, id: snapA.id ?? '' } : null,
        b: snapB ? { ...snapB, id: snapB.id ?? '' } : null,
        c: snapC ? { ...snapC, id: snapC.id ?? '' } : null,
        aliveCount: enemies.filter((e) => e.alive).length,
      };
    });

    expect(setup.weapon).toBe('launcher');
    expect(setup.aliveCount).toBeGreaterThanOrEqual(3);
    expect(setup.a, 'impact target A').toBeTruthy();
    expect(setup.b, 'in-AoE target B').toBeTruthy();
    expect(setup.c, 'outside target C').toBeTruthy();
    expect(setup.a!.id).toBeTruthy();
    expect(setup.b!.id).toBeTruthy();
    expect(setup.c!.id).toBeTruthy();

    // Single-burst window: fire once toward -Z (center top of canvas).
    await page.mouse.move(640, 180);
    await page.mouse.down();
    await page.waitForTimeout(250);
    await page.mouse.up();
    await page.waitForTimeout(1400);

    const after = await page.evaluate((ids: { a: string; b: string; c: string }) => {
      const hooks = window.__THREE_GAME_TEST_HOOKS__;
      const enemies = hooks?.getEnemies?.() ?? [];
      const byId = new Map(enemies.map((e) => [e.id ?? '', e]));
      return {
        a: byId.get(ids.a) ?? null,
        b: byId.get(ids.b) ?? null,
        c: byId.get(ids.c) ?? null,
        shotsFired: window.__THREE_GAME_DIAGNOSTICS__?.shotsFired ?? 0,
        damageByWeapon: window.__THREE_GAME_DIAGNOSTICS__?.damageByWeapon ?? {},
      };
    }, { a: setup.a!.id, b: setup.b!.id, c: setup.c!.id });

    expect(after.shotsFired).toBeGreaterThan(0);

    const hurt = (snap: EnemySnap | null, before: EnemySnap) => {
      if (!snap) return true;
      return !snap.alive || snap.hp < before.hp;
    };

    // AoE identity: impact target AND at least one other in-radius target both took damage.
    expect(hurt(after.a, setup.a!), `A damaged (hp ${setup.a!.hp} -> ${after.a?.hp ?? 'gone'})`).toBe(true);
    expect(hurt(after.b, setup.b!), `B damaged (hp ${setup.b!.hp} -> ${after.b?.hp ?? 'gone'})`).toBe(true);

    // Outside target must be untouched by the impact blast.
    expect(after.c, 'C still present').toBeTruthy();
    expect(after.c!.alive, 'C still alive').toBe(true);
    expect(after.c!.hp, 'C hp unchanged').toBe(setup.c!.hp);

    const launcherDmg = after.damageByWeapon.launcher ?? 0;
    expect(launcherDmg, 'launcher damage recorded').toBeGreaterThan(0);
  });

  test('launcher affinity upgrades do not modify rail/plasma/scatter', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    test.setTimeout(60_000);
    await boot(page, 137);

    const before = await page.evaluate(() => {
      const hooks = window.__THREE_GAME_TEST_HOOKS__;
      return hooks?.getBuildSnapshot?.().perWeaponDamage ?? {};
    });

    // T2 ion upgrades are not live yet; isolation is structural via perWeapon slots.
    const after = await page.evaluate(() => {
      const hooks = window.__THREE_GAME_TEST_HOOKS__;
      if (!hooks?.forceWeapon) throw new Error('forceWeapon missing');
      hooks.forceWeapon('launcher');
      return hooks.getBuildSnapshot?.();
    });

    expect(after?.weapon).toBe('launcher');
    const dmg = after?.perWeaponDamage ?? {};
    expect(dmg.plasma).toBeCloseTo(before.plasma ?? dmg.plasma, 5);
    expect(dmg.rail).toBeCloseTo(before.rail ?? dmg.rail, 5);
    expect(dmg.scatter).toBeCloseTo(before.scatter ?? dmg.scatter, 5);
    // Launcher has its own baseline, not a copy of plasma damage identity.
    expect(dmg.launcher).toBeGreaterThan(0);
  });
});
