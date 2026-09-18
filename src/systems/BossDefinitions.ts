import type { BossPhaseId } from './BossPhases';

export type BossId = 'titan07' | 'orbital_warden' | 'void_engine';

export type BossPhaseDef = {
  id: BossPhaseId;
  name: string;
  maxHpRatio: number;
  moveSpeedMul: number;
  fireIntervalMul: number;
  projectileDamageMul: number;
  fanCount: number;
  fanSpread: number;
  summonEvery: number;
  summonCount: number;
  ringEvery: number;
  color: string;
  /** Extra identity knobs used by BossDirector. */
  beamCount?: number;
  beamSpin?: number;
  teleportEvery?: number;
  arenaShrink?: boolean;
  summonKinds?: string[];
};

export type BossMechanics = {
  rotatingBeam: boolean;
  shieldDrones: boolean;
  teleport: boolean;
  arenaShrink: boolean;
};

export type BossDef = {
  id: BossId;
  nameKey: string;
  displayName: string;
  waveAnchor: number;
  color: string;
  mechanics: BossMechanics;
  phases: BossPhaseDef[];
};

export const BOSS_DEFS: Record<BossId, BossDef> = {
  titan07: {
    id: 'titan07',
    nameKey: 'titan07',
    displayName: 'TITAN-07',
    waveAnchor: 5,
    color: '#f43f5e',
    mechanics: {
      rotatingBeam: false,
      shieldDrones: false,
      teleport: false,
      arenaShrink: false,
    },
    phases: [
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
        ringEvery: 0,
        color: '#f43f5e',
        summonKinds: ['chaser'],
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
        ringEvery: 3.1,
        color: '#fb7185',
        summonKinds: ['chaser', 'ranged'],
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
        ringEvery: 2.2,
        color: '#fda4af',
        summonKinds: ['chaser', 'ranged', 'elite'],
      },
    ],
  },
  orbital_warden: {
    id: 'orbital_warden',
    nameKey: 'orbitalWarden',
    displayName: 'ORBITAL WARDEN',
    waveAnchor: 10,
    color: '#38bdf8',
    mechanics: {
      rotatingBeam: true,
      shieldDrones: true,
      teleport: false,
      arenaShrink: false,
    },
    phases: [
      {
        id: 1,
        name: 'ORBIT',
        maxHpRatio: 0.7,
        moveSpeedMul: 0.9,
        fireIntervalMul: 1.1,
        projectileDamageMul: 0.95,
        fanCount: 2,
        fanSpread: 0.35,
        summonEvery: 7,
        summonCount: 2,
        ringEvery: 0,
        color: '#38bdf8',
        beamCount: 1,
        beamSpin: 0.85,
        summonKinds: ['chaser'],
      },
      {
        id: 2,
        name: 'SHIELD RING',
        maxHpRatio: 0.4,
        moveSpeedMul: 0.85,
        fireIntervalMul: 0.95,
        projectileDamageMul: 1.05,
        fanCount: 3,
        fanSpread: 0.28,
        summonEvery: 5,
        summonCount: 3,
        ringEvery: 3.4,
        color: '#7dd3fc',
        beamCount: 1,
        beamSpin: 0.7,
        summonKinds: ['swarm', 'chaser'],
      },
      {
        id: 3,
        name: 'LOCKDOWN ORBIT',
        maxHpRatio: 0,
        moveSpeedMul: 1.05,
        fireIntervalMul: 0.7,
        projectileDamageMul: 1.2,
        fanCount: 4,
        fanSpread: 0.22,
        summonEvery: 4.5,
        summonCount: 2,
        ringEvery: 2.6,
        color: '#bae6fd',
        beamCount: 2,
        beamSpin: 1.45,
        summonKinds: ['sniper', 'chaser'],
      },
    ],
  },
  void_engine: {
    id: 'void_engine',
    nameKey: 'voidEngine',
    displayName: 'VOID ENGINE',
    waveAnchor: 15,
    color: '#a78bfa',
    mechanics: {
      rotatingBeam: false,
      shieldDrones: false,
      teleport: true,
      arenaShrink: true,
    },
    phases: [
      {
        id: 1,
        name: 'BLINK',
        maxHpRatio: 0.7,
        moveSpeedMul: 1.0,
        fireIntervalMul: 0.95,
        projectileDamageMul: 1.0,
        fanCount: 5,
        fanSpread: 0.2,
        summonEvery: 7,
        summonCount: 1,
        ringEvery: 3.0,
        color: '#a78bfa',
        teleportEvery: 4.2,
        summonKinds: ['swarm'],
      },
      {
        id: 2,
        name: 'COLLAPSE',
        maxHpRatio: 0.4,
        moveSpeedMul: 0.95,
        fireIntervalMul: 0.85,
        projectileDamageMul: 1.15,
        fanCount: 6,
        fanSpread: 0.18,
        summonEvery: 5.5,
        summonCount: 2,
        ringEvery: 2.8,
        color: '#c4b5fd',
        teleportEvery: 3.4,
        arenaShrink: true,
        summonKinds: ['chaser', 'bomber'],
      },
      {
        id: 3,
        name: 'SINGULARITY',
        maxHpRatio: 0,
        moveSpeedMul: 1.1,
        fireIntervalMul: 0.62,
        projectileDamageMul: 1.25,
        fanCount: 7,
        fanSpread: 0.15,
        summonEvery: 4,
        summonCount: 2,
        ringEvery: 2.0,
        color: '#e879f9',
        teleportEvery: 2.4,
        arenaShrink: true,
        summonKinds: ['chaser', 'bomber', 'sniper'],
      },
    ],
  },
};

export const BOSS_IDS: BossId[] = ['titan07', 'orbital_warden', 'void_engine'];

/** 5→TITAN, 10→WARDEN, 15→VOID, 20+ cycles. */
export function bossIdForWave(wave: number): BossId {
  if (wave < 5) return 'titan07';
  const cycle = Math.floor((wave - 5) / 5) % 3;
  return BOSS_IDS[((cycle % 3) + 3) % 3];
}

export function getBossDef(id: BossId): BossDef {
  return BOSS_DEFS[id];
}

export function getBossPhases(id: BossId): BossPhaseDef[] {
  return BOSS_DEFS[id].phases;
}

export function getBossPhaseById(id: BossId, phase: BossPhaseId): BossPhaseDef {
  const list = getBossPhases(id);
  return list.find((p) => p.id === phase) ?? list[0];
}

export function bossPhaseForRatio(id: BossId, ratio: number): BossPhaseId {
  const list = getBossPhases(id);
  if (ratio <= 0.4) return list[list.length - 1].id;
  if (ratio <= 0.7) return list[Math.min(1, list.length - 1)].id;
  return list[0].id;
}

export type BossDirectorState = {
  bossId: BossId | null;
  phase: BossPhaseId;
  summonTimer: number;
  ringTimer: number;
  spiralAngle: number;
  beamAngle: number;
  beamTimer: number;
  shieldActive: boolean;
  shieldDrones: number;
  teleportTimer: number;
  arenaShrink: number;
};

export function createBossDirectorState(): BossDirectorState {
  return {
    bossId: null,
    phase: 1,
    summonTimer: 3,
    ringTimer: 2.4,
    spiralAngle: 0,
    beamAngle: 0,
    beamTimer: 0,
    shieldActive: false,
    shieldDrones: 0,
    teleportTimer: 0,
    arenaShrink: 1,
  };
}
