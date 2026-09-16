import type { PlayerStats } from '../entities/Player';

export type UpgradeId =
  | 'overclock'
  | 'he_rounds'
  | 'thrusters'
  | 'armor'
  | 'shield_bank'
  | 'coolant_loop'
  | 'capacitor'
  | 'dash_servos'
  | 'mag_accel'
  | 'ult_bearing'
  | 'reactive_plating'
  | 'ult_core';

export type UpgradeDef = {
  id: UpgradeId;
  name: string;
  desc: string;
  color: string;
  maxStacks: number;
  apply: (stats: PlayerStats) => void;
};

export const UPGRADE_POOL: UpgradeDef[] = [
  {
    id: 'overclock',
    name: 'Overclock',
    desc: 'Fire rate +10%',
    color: '#22d3ee',
    maxStacks: 4,
    apply: (s) => {
      s.fireInterval = Math.max(0.062, s.fireInterval * 0.9);
    },
  },
  {
    id: 'he_rounds',
    name: 'HE Rounds',
    desc: 'Projectile damage +2',
    color: '#fbbf24',
    maxStacks: 5,
    apply: (s) => {
      s.projectileDamage += 2;
    },
  },
  {
    id: 'thrusters',
    name: 'Thrusters',
    desc: 'Move speed +0.45',
    color: '#7ae7ff',
    maxStacks: 4,
    apply: (s) => {
      s.moveSpeed += 0.45;
    },
  },
  {
    id: 'armor',
    name: 'Armor Plate',
    desc: 'Max hull +20 · repair 20',
    color: '#ff4d6d',
    maxStacks: 5,
    apply: (s) => {
      s.maxHp += 20;
    },
  },
  {
    id: 'shield_bank',
    name: 'Shield Bank',
    desc: 'Max shield +15 · charge 15',
    color: '#3ec6ff',
    maxStacks: 4,
    apply: (s) => {
      s.maxShield += 15;
    },
  },
  {
    id: 'coolant_loop',
    name: 'Coolant Loop',
    desc: 'Heat cooling +7/s',
    color: '#4ade80',
    maxStacks: 4,
    apply: (s) => {
      s.heatCoolPerSec += 7;
      s.overheatLockPerSec += 3;
    },
  },
  {
    id: 'capacitor',
    name: 'Capacitor',
    desc: 'Max heat +12',
    color: '#a78bfa',
    maxStacks: 3,
    apply: (s) => {
      s.maxHeat += 12;
    },
  },
  {
    id: 'dash_servos',
    name: 'Dash Servos',
    desc: 'Dash cooldown −12%',
    color: '#22d3ee',
    maxStacks: 4,
    apply: (s) => {
      s.dashCooldown = Math.max(0.45, s.dashCooldown * 0.88);
    },
  },
  {
    id: 'mag_accel',
    name: 'Mag Accelerator',
    desc: 'Projectile speed +4',
    color: '#94a3b8',
    maxStacks: 4,
    apply: (s) => {
      s.projectileSpeed += 4;
    },
  },
  {
    id: 'ult_bearing',
    name: 'Ult Bearing',
    desc: 'Ult charge/kill +1.5',
    color: '#a78bfa',
    maxStacks: 3,
    apply: (s) => {
      s.ultChargePerKill += 1.5;
    },
  },
  {
    id: 'reactive_plating',
    name: 'Reactive Plating',
    desc: 'Hit i-frames +0.05s',
    color: '#f59e0b',
    maxStacks: 3,
    apply: (s) => {
      s.invulnAfterHit = Math.min(0.85, s.invulnAfterHit + 0.05);
    },
  },
  {
    id: 'ult_core',
    name: 'Ult Core',
    desc: 'Ult damage +8 · radius +0.4',
    color: '#c4b5fd',
    maxStacks: 3,
    apply: (s) => {
      s.ultDamage += 8;
      s.ultRadius += 0.4;
    },
  },
];

export type UpgradeOffer = {
  id: UpgradeId;
  name: string;
  desc: string;
  color: string;
};

/** Pick 3 distinct offers weighted toward under-stacked upgrades. */
export function rollUpgradeOffers(
  stacks: Partial<Record<UpgradeId, number>>,
  rng: () => number,
  count = 3,
): UpgradeOffer[] {
  const eligible = UPGRADE_POOL.filter((u) => (stacks[u.id] ?? 0) < u.maxStacks);
  const bag = eligible.slice();
  const offers: UpgradeOffer[] = [];
  while (offers.length < count && bag.length > 0) {
    // Prefer lower stack counts so choices stay diverse.
    let total = 0;
    const weights = bag.map((u) => {
      const stack = stacks[u.id] ?? 0;
      const w = 1 / (1 + stack * 0.85);
      total += w;
      return w;
    });
    let roll = rng() * total;
    let idx = 0;
    for (let i = 0; i < bag.length; i += 1) {
      roll -= weights[i];
      if (roll <= 0) {
        idx = i;
        break;
      }
    }
    const [picked] = bag.splice(idx, 1);
    offers.push({ id: picked.id, name: picked.name, desc: picked.desc, color: picked.color });
  }
  return offers;
}

export function getUpgrade(id: UpgradeId): UpgradeDef | undefined {
  return UPGRADE_POOL.find((u) => u.id === id);
}
