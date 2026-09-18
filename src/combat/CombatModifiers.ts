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
  /** Plasma: arc-chain kills may refund heat. */
  plasmaFeedback: boolean;
  /** Plasma: arc range up, chain damage decays per hop. */
  plasmaSuperconduct: boolean;
  /** Rail: bonus damage vs low-HP targets. */
  railExecute: boolean;
  /** Rail: after pierce budget ends, deflect once toward nearest foe. */
  railRicochet: boolean;
  /** Rail: idle charge stacks (next shot +dmg/+pierce/+heat). */
  railCharge: boolean;
  /** Scatter: close kills emit shrapnel pellets. */
  scatterShrapnel: boolean;
  /** Scatter: close hits deal bonus vs elite/boss. */
  scatterBreach: boolean;
  /** Scatter: dash grants a short fire-interval window. */
  scatterDashReload: boolean;
  /** Global: first lethal-pressure trigger grants shield + dash reset. */
  emergencyProtocol: boolean;
  /** Global: sustained movement stacks (0 = off). */
  momentumCore: number;
  /** Global: hazard kills grant a short combat buff (T5). */
  hazardConductor: boolean;
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
  plasmaFeedback: false,
  plasmaSuperconduct: false,
  railExecute: false,
  railRicochet: false,
  railCharge: false,
  scatterShrapnel: false,
  scatterBreach: false,
  scatterDashReload: false,
  emergencyProtocol: false,
  momentumCore: 0,
  hazardConductor: false,
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
  if (mods.ionBlastRadiusMul > 1.001) ids.push(`ion_expansion×${mods.ionBlastRadiusMul.toFixed(2)}`);
  if (mods.ionAftershock) ids.push('ion_aftershock');
  if (mods.ionHeatRefundPerHit > 0) ids.push(`ion_heat_sink×${mods.ionHeatRefundPerHit}`);
  if (mods.plasmaFeedback) ids.push('plasma_feedback');
  if (mods.plasmaSuperconduct) ids.push('plasma_superconduct');
  if (mods.railExecute) ids.push('rail_execute');
  if (mods.railRicochet) ids.push('rail_ricochet');
  if (mods.railCharge) ids.push('rail_charge');
  if (mods.scatterShrapnel) ids.push('scatter_shrapnel');
  if (mods.scatterBreach) ids.push('scatter_breach');
  if (mods.scatterDashReload) ids.push('scatter_dash_reload');
  if (mods.emergencyProtocol) ids.push('emergency_protocol');
  if (mods.momentumCore > 0) ids.push(`momentum_core×${mods.momentumCore}`);
  if (mods.hazardConductor) ids.push('hazard_conductor');
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
export const PLASMA_SUPERCONDUCT_RANGE_MUL = 1.35;
export const PLASMA_SUPERCONDUCT_DECAY = 0.78;
export const PLASMA_FEEDBACK_HEAT_REFUND = 6;
export const RAIL_EXECUTE_HP_RATIO = 0.35;
export const RAIL_EXECUTE_DMG_MUL = 1.55;
export const RAIL_CHARGE_IDLE_SEC = 1.15;
export const RAIL_CHARGE_DMG_MUL = 1.45;
export const RAIL_CHARGE_PIERCE_BONUS = 1;
export const RAIL_CHARGE_HEAT_MUL = 1.25;
export const SCATTER_BREACH_DMG_MUL = 1.4;
export const SCATTER_SHRAPNEL_DAMAGE = 5;
export const SCATTER_SHRAPNEL_COUNT = 4;
export const DASH_RELOAD_WINDOW = 0.85;
export const DASH_RELOAD_FIRE_MUL = 0.72;
export const EMERGENCY_HP_RATIO = 0.32;
export const EMERGENCY_SHIELD = 28;
export const MOMENTUM_MAX = 1;
export const HAZARD_BUFF_WINDOW = 2.5;
