import type { PlayerStats } from '../entities/Player';
import type { CombatBuild } from '../combat/CombatBuild';
import type { CombatModifiers } from '../combat/CombatModifiers';
import type { WeaponId } from '../combat/Weapons';
import { upgradeText } from '../i18n';

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

export type UpgradeApplyCtx = {
  stats: PlayerStats;
  build: CombatBuild;
  mods: CombatModifiers;
};

export type UpgradeDef = {
  id: UpgradeId;
  color: string;
  maxStacks: number;
  weaponAffinity?: WeaponId;
  apply: (ctx: UpgradeApplyCtx) => void;
};

export const UPGRADE_POOL: UpgradeDef[] = [
  {
    id: 'overclock',
    color: '#22d3ee',
    maxStacks: 4,
    apply: ({ build }) => {
      build.global.fireMul *= 0.9;
    },
  },
  {
    id: 'thrusters',
    color: '#7ae7ff',
    maxStacks: 4,
    apply: ({ stats }) => {
      stats.moveSpeed += 0.45;
    },
  },
  {
    id: 'armor',
    color: '#ff4d6d',
    maxStacks: 5,
    apply: ({ stats }) => {
      stats.maxHp += 20;
    },
  },
  {
    id: 'shield_bank',
    color: '#3ec6ff',
    maxStacks: 4,
    apply: ({ stats }) => {
      stats.maxShield += 15;
    },
  },
  {
    id: 'coolant_loop',
    color: '#4ade80',
    maxStacks: 4,
    apply: ({ stats }) => {
      stats.heatCoolPerSec += 7;
      stats.overheatLockPerSec += 3;
    },
  },
  {
    id: 'capacitor',
    color: '#a78bfa',
    maxStacks: 3,
    apply: ({ stats }) => {
      stats.maxHeat += 12;
    },
  },
  {
    id: 'dash_servos',
    color: '#22d3ee',
    maxStacks: 4,
    apply: ({ stats }) => {
      stats.dashCooldown = Math.max(0.45, stats.dashCooldown * 0.88);
    },
  },
  {
    id: 'mag_accel',
    color: '#94a3b8',
    maxStacks: 4,
    apply: ({ build }) => {
      build.global.speedMul *= 1.08;
    },
  },
  {
    id: 'arc_capacitor',
    color: '#38bdf8',
    maxStacks: 2,
    weaponAffinity: 'plasma',
    apply: ({ mods }) => {
      mods.arcChain += 1;
    },
  },
  {
    id: 'overheat_cascade',
    color: '#f97316',
    maxStacks: 1,
    weaponAffinity: 'plasma',
    apply: ({ mods }) => {
      mods.overheatEmp = true;
    },
  },
  {
    id: 'critical_conductor',
    color: '#e879f9',
    maxStacks: 1,
    weaponAffinity: 'plasma',
    apply: ({ mods }) => {
      mods.critConductor = true;
    },
  },
  {
    id: 'rail_bore',
    color: '#fbbf24',
    maxStacks: 2,
    weaponAffinity: 'rail',
    apply: ({ build }) => {
      build.modifiers.railPierce += 1;
      build.perWeapon.rail.dmgBonus += 2;
    },
  },
  {
    id: 'rail_reactor',
    color: '#f59e0b',
    maxStacks: 1,
    weaponAffinity: 'rail',
    apply: ({ mods }) => {
      mods.railHeatRefund = true;
    },
  },
  {
    id: 'scatter_choke',
    color: '#f472b6',
    maxStacks: 2,
    weaponAffinity: 'scatter',
    apply: ({ build }) => {
      build.modifiers.scatterCloseBonus = true;
      build.perWeapon.scatter.dmgBonus += 1;
      build.perWeapon.scatter.spreadMul *= 0.72;
    },
  },
  {
    id: 'dash_detonation',
    color: '#22d3ee',
    maxStacks: 1,
    weaponAffinity: 'scatter',
    apply: ({ mods }) => {
      mods.dashDetonation = true;
    },
  },
  {
    id: 'shield_nova',
    color: '#3ec6ff',
    maxStacks: 1,
    apply: ({ mods }) => {
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
    const text = upgradeText(picked.id);
    offers.push({ id: picked.id, name: text.name, desc: text.desc, color: picked.color });
  }
  return offers;
}

export function getUpgrade(id: UpgradeId): UpgradeDef | undefined {
  return UPGRADE_POOL.find((u) => u.id === id);
}
