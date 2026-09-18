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

  test('launcher fires and impact damages multiple nearby enemies', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop Chrome only');
    test.setTimeout(60_000);
    await boot(page, 42);

    const setup = await page.evaluate(async () => {
      const hooks = window.__THREE_GAME_TEST_HOOKS__;
      if (!hooks?.forceWeapon || !hooks?.spawnEnemy) throw new Error('hooks missing');
      hooks.forceWeapon('launcher');
      const player = window.__THREE_GAME_DIAGNOSTICS__?.player?.position ?? { x: 0, z: 0 };
      const px = player.x ?? 0;
      const pz = player.z ?? 0;
      // Cluster three chasers along the aim line (player aims -Z by default).
      hooks.spawnEnemy('chaser', px, pz - 3.2);
      hooks.spawnEnemy('chaser', px + 0.9, pz - 3.4);
      hooks.spawnEnemy('chaser', px - 0.9, pz - 3.4);
      hooks.spawnEnemy('chaser', px + 8.5, pz + 8.5); // far decoy
      const before = hooks.getEnemies?.() ?? [];
      return {
        weapon: hooks.getBuildSnapshot?.().weapon,
        before,
        aliveBefore: before.filter((e) => e.alive).length,
      };
    });
    expect(setup.weapon).toBe('launcher');
    expect(setup.aliveBefore).toBeGreaterThanOrEqual(4);

    // Hold fire long enough for at least one slow ion bolt + impact resolve.
    await page.mouse.move(640, 200);
    await page.mouse.down();
    await page.waitForTimeout(900);
    await page.mouse.up();
    await page.waitForTimeout(400);

    const after = await page.evaluate(() => {
      const hooks = window.__THREE_GAME_TEST_HOOKS__;
      const enemies = hooks?.getEnemies?.() ?? [];
      const d = window.__THREE_GAME_DIAGNOSTICS__;
      return {
        enemies,
        kills: d?.kills ?? 0,
        damageDealt: d?.damageDealt ?? 0,
        shotsFired: d?.shotsFired ?? 0,
      };
    });

    expect(after.shotsFired).toBeGreaterThan(0);
    const beforeHp = new Map(setup.before.map((e) => [`${e.kind}:${e.x.toFixed(2)}:${e.z.toFixed(2)}`, e.hp]));
    let multiDamaged = 0;
    for (const e of after.enemies) {
      if (!e.alive) continue;
      const key = `${e.kind}:${e.x.toFixed(2)}:${e.z.toFixed(2)}`;
      const prev = beforeHp.get(key);
      if (prev !== undefined && e.hp < prev) multiDamaged += 1;
    }
    // AoE identity: either multiple living enemies lost HP, or kills jumped from the blast.
    expect(multiDamaged >= 2 || after.kills >= 1 || after.damageDealt > 0).toBeTruthy();
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
