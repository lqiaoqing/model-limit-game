export type BossPhaseId = 1 | 2 | 3;

export type BossPhaseDef = {
  id: BossPhaseId;
  name: string;
  /** Enter when hp/maxHp <= this threshold (exclusive upper bound of band). */
  maxHpRatio: number;
  moveSpeedMul: number;
  fireIntervalMul: number;
  projectileDamageMul: number;
  /** Number of projectiles in the primary fan. */
  fanCount: number;
  fanSpread: number;
  summonEvery: number;
  summonCount: number;
  color: string;
};

export const BOSS_PHASES: BossPhaseDef[] = [
  {
    id: 1,
    name: 'SWEEP',
    maxHpRatio: 0.7,
    moveSpeedMul: 1,
    fireIntervalMul: 1,
    projectileDamageMul: 1,
    fanCount: 3,
    fanSpread: 0.28,
    summonEvery: 6,
    summonCount: 2,
    color: '#f43f5e',
  },
  {
    id: 2,
    name: 'LOCKDOWN',
    maxHpRatio: 0.4,
    moveSpeedMul: 1.12,
    fireIntervalMul: 0.78,
    projectileDamageMul: 1.15,
    fanCount: 5,
    fanSpread: 0.2,
    summonEvery: 5,
    summonCount: 3,
    color: '#fb7185',
  },
  {
    id: 3,
    name: 'OVERDRIVE',
    maxHpRatio: 0,
    moveSpeedMul: 1.28,
    fireIntervalMul: 0.58,
    projectileDamageMul: 1.3,
    fanCount: 7,
    fanSpread: 0.16,
    summonEvery: 4,
    summonCount: 3,
    color: '#fda4af',
  },
];

export type BossRuntime = {
  phase: BossPhaseId;
  summonTimer: number;
  ringTimer: number;
  spiralAngle: number;
};

export function createBossRuntime(): BossRuntime {
  return {
    phase: 1,
    summonTimer: BOSS_PHASES[0].summonEvery * 0.55,
    ringTimer: 2.4,
    spiralAngle: 0,
  };
}

export function bossPhaseForRatio(ratio: number): BossPhaseId {
  if (ratio <= 0.4) return 3;
  if (ratio <= 0.7) return 2;
  return 1;
}

export function getBossPhase(id: BossPhaseId): BossPhaseDef {
  return BOSS_PHASES.find((p) => p.id === id) ?? BOSS_PHASES[0];
}

export function advanceBossPhase(
  runtime: BossRuntime,
  ratio: number,
): { changed: boolean; phase: BossPhaseDef } {
  const next = bossPhaseForRatio(ratio);
  if (next === runtime.phase) {
    return { changed: false, phase: getBossPhase(runtime.phase) };
  }
  runtime.phase = next;
  const phase = getBossPhase(next);
  runtime.summonTimer = phase.summonEvery * 0.4;
  runtime.ringTimer = 1.4;
  return { changed: true, phase };
}
