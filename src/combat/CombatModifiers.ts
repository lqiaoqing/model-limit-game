export type CombatModifiers = {
  arcChain: number;
  overheatEmp: boolean;
  critConductor: boolean;
  railPierce: number;
  railHeatRefund: boolean;
  scatterCloseBonus: boolean;
  dashDetonation: boolean;
  shieldNova: boolean;
  /** Ion Launcher: blast radius multiplier stacks (1 = base). */
  ionBlastRadiusMul: number;
  /** Ion Launcher: delayed secondary blast after impact. */
  ionAftershock: boolean;
  /** Ion Launcher: refund heat per enemy hit by blast (capped upstream). */
  ionHeatRefundPerHit: number;
};

export const DEFAULT_COMBAT_MODIFIERS: CombatModifiers = {
  arcChain: 0,
  overheatEmp: false,
  critConductor: false,
  railPierce: 0,
  railHeatRefund: false,
  scatterCloseBonus: false,
  dashDetonation: false,
  shieldNova: false,
  ionBlastRadiusMul: 1,
  ionAftershock: false,
  ionHeatRefundPerHit: 0,
};

export function createCombatModifiers(): CombatModifiers {
  return { ...DEFAULT_COMBAT_MODIFIERS };
}

export function resetCombatModifiers(mods: CombatModifiers): void {
  Object.assign(mods, DEFAULT_COMBAT_MODIFIERS);
}

export function modifierIds(mods: CombatModifiers): string[] {
  const ids: string[] = [];
  if (mods.arcChain > 0) ids.push(`arc_capacitor×${mods.arcChain}`);
  if (mods.overheatEmp) ids.push('overheat_cascade');
  if (mods.critConductor) ids.push('critical_conductor');
  if (mods.railPierce > 0) ids.push(`rail_bore×${mods.railPierce}`);
  if (mods.railHeatRefund) ids.push('rail_reactor');
  if (mods.scatterCloseBonus) ids.push('scatter_choke');
  if (mods.dashDetonation) ids.push('dash_detonation');
  if (mods.shieldNova) ids.push('shield_nova');
  return ids;
}

export const SCATTER_CLOSE_RANGE = 3.5;
export const ARC_CHAIN_RANGE = 4.2;
export const ARC_CHAIN_DAMAGE = 10;
export const CRIT_MULTIPLIER = 1.5;
export const OVERHEAT_EMP_RADIUS = 5.5;
export const OVERHEAT_EMP_DAMAGE = 28;
export const DASH_BLAST_RADIUS = 3.2;
export const DASH_BLAST_DAMAGE = 22;
export const SHIELD_NOVA_RADIUS = 4.5;
export const SHIELD_NOVA_DAMAGE = 16;
export const ION_AOE_FALLOFF = 0.45;
export const ION_HEAT_REFUND_CAP = 8;
export const ION_AFTERSHOCK_DELAY = 0.5;
export const ION_AFTERSHOCK_DAMAGE_MUL = 0.45;
export const ION_AFTERSHOCK_RADIUS_MUL = 0.85;
