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
  | 'shield_nova'
  | 'plasma_feedback'
  | 'plasma_superconduct'
  | 'rail_execute'
  | 'rail_ricochet'
  | 'rail_charge'
  | 'scatter_shrapnel'
  | 'scatter_breach'
  | 'scatter_dash_reload'
  | 'ion_expansion'
  | 'ion_aftershock'
  | 'ion_heat_sink'
  | 'emergency_protocol'
  | 'momentum_core'
  | 'hazard_conductor';

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
  /** Rule-changing modules alter combat identity, not just numbers. */
  rule?: boolean;
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
    rule: true,
    apply: ({ mods }) => {
      mods.arcChain += 1;
    },
  },
  {
    id: 'overheat_cascade',
    color: '#f97316',
    maxStacks: 1,
    weaponAffinity: 'plasma',
    rule: true,
    apply: ({ mods }) => {
      mods.overheatEmp = true;
    },
  },
  {
    id: 'critical_conductor',
    color: '#e879f9',
    maxStacks: 1,
    weaponAffinity: 'plasma',
    rule: true,
    apply: ({ mods }) => {
      mods.critConductor = true;
    },
  },
  {
    id: 'rail_bore',
    color: '#fbbf24',
    maxStacks: 2,
    weaponAffinity: 'rail',
    rule: true,
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
    rule: true,
    apply: ({ mods }) => {
      mods.railHeatRefund = true;
    },
  },
  {
    id: 'scatter_choke',
    color: '#f472b6',
    maxStacks: 2,
    weaponAffinity: 'scatter',
    rule: true,
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
    rule: true,
    apply: ({ mods }) => {
      mods.dashDetonation = true;
    },
  },
  {
    id: 'shield_nova',
    color: '#3ec6ff',
    maxStacks: 1,
    rule: true,
    apply: ({ mods }) => {
      mods.shieldNova = true;
    },
  },
  {
    id: 'plasma_feedback',
    color: '#67e8f9',
    maxStacks: 1,
    weaponAffinity: 'plasma',
    rule: true,
    apply: ({ mods }) => {
      mods.plasmaFeedback = true;
    },
  },
  {
    id: 'plasma_superconduct',
    color: '#7dd3fc',
    maxStacks: 1,
    weaponAffinity: 'plasma',
    rule: true,
    apply: ({ mods }) => {
      mods.plasmaSuperconduct = true;
    },
  },
  {
    id: 'rail_execute',
    color: '#fde68a',
    maxStacks: 2,
    weaponAffinity: 'rail',
    rule: true,
    apply: ({ build }) => {
      build.modifiers.railExecute = true;
      build.perWeapon.rail.dmgBonus += 1;
    },
  },
  {
    id: 'rail_ricochet',
    color: '#fcd34d',
    maxStacks: 1,
    weaponAffinity: 'rail',
    rule: true,
    apply: ({ mods }) => {
      mods.railRicochet = true;
    },
  },
  {
    id: 'rail_charge',
    color: '#fb923c',
    maxStacks: 1,
    weaponAffinity: 'rail',
    rule: true,
    apply: ({ mods }) => {
      mods.railCharge = true;
    },
  },
  {
    id: 'scatter_shrapnel',
    color: '#f9a8d4',
    maxStacks: 2,
    weaponAffinity: 'scatter',
    rule: true,
    apply: ({ build }) => {
      build.modifiers.scatterShrapnel = true;
      build.perWeapon.scatter.dmgBonus += 0;
    },
  },
  {
    id: 'scatter_breach',
    color: '#f472b6',
    maxStacks: 2,
    weaponAffinity: 'scatter',
    rule: true,
    apply: ({ build }) => {
      build.modifiers.scatterBreach = true;
      build.perWeapon.scatter.dmgBonus += 1;
    },
  },
  {
    id: 'scatter_dash_reload',
    color: '#fbcfe8',
    maxStacks: 1,
    weaponAffinity: 'scatter',
    rule: true,
    apply: ({ mods }) => {
      mods.scatterDashReload = true;
    },
  },
  {
    id: 'ion_expansion',
    color: '#86efac',
    maxStacks: 2,
    weaponAffinity: 'launcher',
    rule: true,
    apply: ({ build }) => {
      build.modifiers.ionBlastRadiusMul *= 1.22;
      build.perWeapon.launcher.dmgBonus = Math.round(build.perWeapon.launcher.dmgBonus - 3);
    },
  },
  {
    id: 'ion_aftershock',
    color: '#4ade80',
    maxStacks: 1,
    weaponAffinity: 'launcher',
    rule: true,
    apply: ({ mods }) => {
      mods.ionAftershock = true;
    },
  },
  {
    id: 'ion_heat_sink',
    color: '#bbf7d0',
    maxStacks: 2,
    weaponAffinity: 'launcher',
    rule: true,
    apply: ({ mods }) => {
      mods.ionHeatRefundPerHit += 1.2;
    },
  },
  {
    id: 'emergency_protocol',
    color: '#f87171',
    maxStacks: 1,
    rule: true,
    apply: ({ mods }) => {
      mods.emergencyProtocol = true;
    },
  },
  {
    id: 'momentum_core',
    color: '#a5b4fc',
    maxStacks: 3,
    rule: true,
    apply: ({ mods }) => {
      mods.momentumCore += 1;
    },
  },
  {
    id: 'hazard_conductor',
    color: '#fbbf24',
    maxStacks: 1,
    rule: true,
    apply: ({ mods }) => {
      mods.hazardConductor = true;
    },
  },
];

export const RULE_UPGRADE_IDS: UpgradeId[] = UPGRADE_POOL.filter((u) => u.rule).map((u) => u.id);

export function countUpgrades(): number {
  return UPGRADE_POOL.length;
}

export function countRuleUpgrades(): number {
  return RULE_UPGRADE_IDS.length;
}

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
