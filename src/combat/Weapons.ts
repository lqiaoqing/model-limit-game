export type WeaponId = 'plasma' | 'rail' | 'scatter' | 'launcher';

export type WeaponDef = {
  id: WeaponId;
  name: string;
  short: string;
  color: string;
  fireInterval: number;
  heatPerShot: number;
  damage: number;
  projectileSpeed: number;
  pellets: number;
  /** Half-angle in radians for multi-pellet spread. */
  spread: number;
  pierce: number;
  desc: string;
  /** Radial impact blast radius; 0 = single-target projectile. */
  aoeRadius?: number;
};

export const WEAPON_ORDER: WeaponId[] = ['plasma', 'rail', 'scatter', 'launcher'];

export const WEAPON_DEFS: Record<WeaponId, WeaponDef> = {
  plasma: {
    id: 'plasma',
    name: 'Plasma Repeater',
    short: 'PLS',
    color: '#22d3ee',
    fireInterval: 0.11,
    heatPerShot: 4.2,
    damage: 12,
    projectileSpeed: 28,
    pellets: 1,
    spread: 0,
    pierce: 0,
    desc: 'Sustained fire · heat pressure',
  },
  rail: {
    id: 'rail',
    name: 'Railgun',
    short: 'RAIL',
    color: '#fbbf24',
    fireInterval: 0.42,
    heatPerShot: 11,
    damage: 34,
    projectileSpeed: 42,
    pellets: 1,
    spread: 0,
    pierce: 2,
    desc: 'Heavy slug · pierces lines',
  },
  scatter: {
    id: 'scatter',
    name: 'Scattergun',
    short: 'SCT',
    color: '#f472b6',
    fireInterval: 0.38,
    heatPerShot: 9,
    damage: 7,
    projectileSpeed: 24,
    pellets: 5,
    spread: 0.22,
    pierce: 0,
    desc: 'Close burst · multi-pellet',
  },
  launcher: {
    id: 'launcher',
    name: 'Ion Launcher',
    short: 'ION',
    color: '#4ade80',
    fireInterval: 0.72,
    heatPerShot: 16,
    damage: 26,
    projectileSpeed: 14,
    pellets: 1,
    spread: 0,
    pierce: 0,
    desc: 'Slow ion bolt · impact blast',
    aoeRadius: 2.55,
  },
};

export function getWeaponDef(id: WeaponId): WeaponDef {
  return WEAPON_DEFS[id];
}

export function weaponIndex(id: WeaponId): number {
  return WEAPON_ORDER.indexOf(id);
}

export function weaponAt(index: number): WeaponId {
  const i = ((index % WEAPON_ORDER.length) + WEAPON_ORDER.length) % WEAPON_ORDER.length;
  return WEAPON_ORDER[i];
}
