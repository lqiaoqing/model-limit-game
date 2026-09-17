import { WEAPON_DEFS, type WeaponId, type WeaponDef } from './Weapons';
import type { CombatModifiers } from './CombatModifiers';

export type WeaponBonus = {
  fireMul: number;
  speedMul: number;
  /** Flat damage added only to this weapon. */
  dmgBonus: number;
  extraPierce: number;
  /** Multiplier on pellet spread (1 = unchanged). */
  spreadMul: number;
};

export type GlobalWeaponBonus = {
  fireMul: number;
  speedMul: number;
};

export function defaultWeaponBonus(): WeaponBonus {
  return { fireMul: 1, speedMul: 1, dmgBonus: 0, extraPierce: 0, spreadMul: 1 };
}

export function defaultGlobalBonus(): GlobalWeaponBonus {
  return { fireMul: 1, speedMul: 1 };
}

/**
 * Explicit build state. Weapon identity is never inferred from PlayerStats.
 * Global upgrades (Overclock, Mag Accel) touch `global`; weapon-affinity
 * upgrades touch only `perWeapon[id]`.
 */
export type CombatBuild = {
  weapon: WeaponId;
  global: GlobalWeaponBonus;
  perWeapon: Record<WeaponId, WeaponBonus>;
  modifiers: CombatModifiers;
};

export function createCombatBuild(modifiers: CombatModifiers): CombatBuild {
  return {
    weapon: 'plasma',
    global: defaultGlobalBonus(),
    perWeapon: {
      plasma: defaultWeaponBonus(),
      rail: defaultWeaponBonus(),
      scatter: defaultWeaponBonus(),
    },
    modifiers,
  };
}

export function resetCombatBuild(build: CombatBuild, modifiers: CombatModifiers): void {
  build.weapon = 'plasma';
  build.global = defaultGlobalBonus();
  build.perWeapon = {
    plasma: defaultWeaponBonus(),
    rail: defaultWeaponBonus(),
    scatter: defaultWeaponBonus(),
  };
  build.modifiers = modifiers;
}

export type ResolvedWeaponStats = {
  def: WeaponDef;
  fireInterval: number;
  heatPerShot: number;
  damage: number;
  projectileSpeed: number;
  pierce: number;
  spread: number;
  pellets: number;
  color: string;
};

/** Pure resolver: weapon def × global × per-weapon × rule modifiers. */
export function resolveWeaponStats(build: CombatBuild, weaponId: WeaponId): ResolvedWeaponStats {
  const def = WEAPON_DEFS[weaponId];
  const g = build.global;
  const pw = build.perWeapon[weaponId];
  const mods = build.modifiers;
  const extraRailPierce = weaponId === 'rail' ? mods.railPierce + pw.extraPierce : pw.extraPierce;
  return {
    def,
    fireInterval: Math.max(0.05, def.fireInterval * g.fireMul * pw.fireMul),
    heatPerShot: def.heatPerShot,
    damage: Math.max(1, def.damage + pw.dmgBonus),
    projectileSpeed: def.projectileSpeed * g.speedMul * pw.speedMul,
    pierce: def.pierce + extraRailPierce,
    spread: def.spread * pw.spreadMul,
    pellets: def.pellets,
    color: def.color,
  };
}

export function activeWeaponBonus(build: CombatBuild, weaponId: WeaponId = build.weapon): WeaponBonus {
  return build.perWeapon[weaponId];
}
