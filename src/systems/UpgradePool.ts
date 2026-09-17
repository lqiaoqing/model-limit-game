import type { PlayerStats } from '../entities/Player';
import type { CombatModifiers } from '../combat/CombatModifiers';
import type { WeaponId } from '../combat/Weapons';

export type UpgradeId =
  | 'overclock'
  | 'thrusters'
  | 'armor'
  | 'shield_bank'
  | 'coolant_loop'
  | 'capacitor'
  | 'dash_servos'
  | 'mag_accel'
  | 'arc_capacitor'
  | 'overheat_cascade'
  | 'critical_conductor'
  | 'rail_bore'
  | 'rail_reactor'
  | 'scatter_choke'
  | 'dash_detonation'
  | 'shield_nova';

export type UpgradeDef = {
  id: UpgradeId;
  name: string;
  desc: string;
  color: string;
  maxStacks: number;
  /** Soft bias when this weapon is active (1 = neutral). */
  weaponAffinity?: WeaponId;
  apply: (stats: PlayerStats, mods: CombatModifiers) => void;
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
    id: 'arc_capacitor',
    name: 'Arc Capacitor',
    desc: 'Kills chain lightning to +1 nearby',
    color: '#38bdf8',
    maxStacks: 2,
    weaponAffinity: 'plasma',
    apply: (_s, mods) => {
      mods.arcChain += 1;
    },
  },
  {
    id: 'overheat_cascade',
    name: 'Overheat Cascade',
    desc: 'Overheat becomes EMP blast',
    color: '#f97316',
    maxStacks: 1,
    weaponAffinity: 'plasma',
    apply: (_s, mods) => {
      mods.overheatEmp = true;
    },
  },
  {
    id: 'critical_conductor',
    name: 'Critical Conductor',
    desc: 'Chain hits may crit ×1.5',
    color: '#e879f9',
    maxStacks: 1,
    weaponAffinity: 'plasma',
    apply: (_s, mods) => {
      mods.critConductor = true;
    },
  },
  {
    id: 'rail_bore',
    name: 'Rail Bore',
    desc: 'Rail pierce +1 · pierce damage +',
    color: '#fbbf24',
    maxStacks: 2,
    weaponAffinity: 'rail',
    apply: (s, mods) => {
      mods.railPierce += 1;
      s.projectileDamage += 2;
    },
  },
  {
    id: 'rail_reactor',
    name: 'Rail Reactor',
    desc: 'Rail kills refund 20% heat',
    color: '#f59e0b',
    maxStacks: 1,
    weaponAffinity: 'rail',
    apply: (_s, mods) => {
      mods.railHeatRefund = true;
    },
  },
  {
    id: 'scatter_choke',
    name: 'Scatter Choke',
    desc: 'Close-range bonus damage',
    color: '#f472b6',
    maxStacks: 2,
    weaponAffinity: 'scatter',
    apply: (s, mods) => {
      mods.scatterCloseBonus = true;
      s.projectileDamage += 1;
    },
  },
  {
    id: 'dash_detonation',
    name: 'Dash Detonation',
    desc: 'Dash leaves a delayed blast',
    color: '#22d3ee',
    maxStacks: 1,
    weaponAffinity: 'scatter',
    apply: (_s, mods) => {
      mods.dashDetonation = true;
    },
  },
  {
    id: 'shield_nova',
    name: 'Shield Nova',
    desc: 'Shield break emits a nova',
    color: '#3ec6ff',
    maxStacks: 1,
    apply: (_s, mods) => {
      mods.shieldNova = true;
    },
  },
];

export type UpgradeOffer = {
  id: UpgradeId;
  name: string;
  desc: string;
  color: string;
};

/** Pick 3 distinct offers weighted toward under-stacked upgrades + weapon affinity. */
export function rollUpgradeOffers(
  stacks: Partial<Record<UpgradeId, number>>,
  rng: () => number,
  activeWeapon?: WeaponId,
  count = 3,
): UpgradeOffer[] {
  const eligible = UPGRADE_POOL.filter((u) => (stacks[u.id] ?? 0) < u.maxStacks);
  const bag = eligible.slice();
  const offers: UpgradeOffer[] = [];
  while (offers.length < count && bag.length > 0) {
    let total = 0;
    const weights = bag.map((u) => {
      const stack = stacks[u.id] ?? 0;
      let w = 1 / (1 + stack * 0.85);
      if (activeWeapon && u.weaponAffinity === activeWeapon) w *= 1.6;
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
