/** Run-scoped combat telemetry for diagnostics + balance harness. */
export type CombatTelemetrySnapshot = {
  damageByWeapon: Record<string, number>;
  killsByWeapon: Record<string, number>;
  damageByUpgrade: Record<string, number>;
  damageByHazard: Record<string, number>;
  damageTakenBySource: Record<string, number>;
  enemyKillsByType: Record<string, number>;
  bossPhaseDeaths: number;
  hazardKills: number;
};

function bump(map: Record<string, number>, key: string | null | undefined, amount: number): void {
  if (!key || !Number.isFinite(amount)) return;
  map[key] = (map[key] ?? 0) + amount;
}

export class CombatTelemetry {
  private readonly damageByWeapon: Record<string, number> = {};
  private readonly killsByWeapon: Record<string, number> = {};
  private readonly damageByUpgrade: Record<string, number> = {};
  private readonly damageByHazard: Record<string, number> = {};
  private readonly damageTakenBySource: Record<string, number> = {};
  private readonly enemyKillsByType: Record<string, number> = {};
  private bossPhaseDeaths = 0;
  private hazardKills = 0;

  reset(): void {
    for (const k of Object.keys(this.damageByWeapon)) delete this.damageByWeapon[k];
    for (const k of Object.keys(this.killsByWeapon)) delete this.killsByWeapon[k];
    for (const k of Object.keys(this.damageByUpgrade)) delete this.damageByUpgrade[k];
    for (const k of Object.keys(this.damageByHazard)) delete this.damageByHazard[k];
    for (const k of Object.keys(this.damageTakenBySource)) delete this.damageTakenBySource[k];
    for (const k of Object.keys(this.enemyKillsByType)) delete this.enemyKillsByType[k];
    this.bossPhaseDeaths = 0;
    this.hazardKills = 0;
  }

  /**
   * `source` is a weapon id, upgrade id, or hazard kind.
   * `bucket` selects which map absorbs the event.
   */
  recordDamage(
    amount: number,
    source: string | null,
    bucket: 'weapon' | 'upgrade' | 'hazard' = 'weapon',
  ): void {
    if (bucket === 'upgrade') bump(this.damageByUpgrade, source, amount);
    else if (bucket === 'hazard') bump(this.damageByHazard, source, amount);
    else bump(this.damageByWeapon, source, amount);
  }

  recordKill(
    opts: {
      weapon?: string | null;
      enemyKind?: string | null;
      boss?: boolean;
      hazard?: boolean;
    },
  ): void {
    if (opts.weapon) bump(this.killsByWeapon, opts.weapon, 1);
    if (opts.enemyKind) bump(this.enemyKillsByType, opts.enemyKind, 1);
    if (opts.hazard) this.hazardKills += 1;
  }

  recordPlayerDamageTaken(amount: number, source: string): void {
    bump(this.damageTakenBySource, source, amount);
  }

  recordBossPhaseDeath(): void {
    this.bossPhaseDeaths += 1;
  }

  getHazardKills(): number {
    return this.hazardKills;
  }

  snapshot(): CombatTelemetrySnapshot {
    return {
      damageByWeapon: { ...this.damageByWeapon },
      killsByWeapon: { ...this.killsByWeapon },
      damageByUpgrade: { ...this.damageByUpgrade },
      damageByHazard: { ...this.damageByHazard },
      damageTakenBySource: { ...this.damageTakenBySource },
      enemyKillsByType: { ...this.enemyKillsByType },
      bossPhaseDeaths: this.bossPhaseDeaths,
      hazardKills: this.hazardKills,
    };
  }
}

export function classifyDamageSource(source: string | null): 'weapon' | 'upgrade' | 'hazard' {
  if (!source) return 'weapon';
  if (source.startsWith('hazard') || source === 'laser_gate' || source === 'shock_zone' || source === 'overload_core') {
    return 'hazard';
  }
  if (
    source === 'arc_capacitor' ||
    source === 'overheat_cascade' ||
    source === 'dash_detonation' ||
    source === 'ion_aftershock' ||
    source === 'shield_nova' ||
    source === 'plasma_feedback' ||
    source === 'rail_ricochet' ||
    source === 'scatter_shrapnel'
  ) {
    return 'upgrade';
  }
  return 'weapon';
}
