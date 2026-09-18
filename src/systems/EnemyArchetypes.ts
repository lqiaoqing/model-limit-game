import type { EnemyKind } from '../entities/Enemy';

export type EnemyRole =
  | 'melee'
  | 'shooter'
  | 'tank'
  | 'sniper'
  | 'bomber'
  | 'swarm'
  | 'disruptor'
  | 'elite'
  | 'boss';

export type EnemyArchetypeDef = {
  kind: EnemyKind;
  role: EnemyRole;
  /** First wave this kind may appear in filler/squads. */
  unlockWave: number;
  /** Threat weight used by EncounterDirector budgeting. */
  threat: number;
  blurb: string;
};

export const ENEMY_ARCHETYPES: Record<EnemyKind, EnemyArchetypeDef> = {
  chaser: {
    kind: 'chaser',
    role: 'melee',
    unlockWave: 1,
    threat: 2,
    blurb: 'Basic rusher with short lunge telegraph',
  },
  ranged: {
    kind: 'ranged',
    role: 'shooter',
    unlockWave: 2,
    threat: 3,
    blurb: 'Keeps mid distance and shells',
  },
  swarm: {
    kind: 'swarm',
    role: 'swarm',
    unlockWave: 3,
    threat: 1,
    blurb: 'Fragile flood body for AoE/chain tests',
  },
  elite: {
    kind: 'elite',
    role: 'elite',
    unlockWave: 4,
    threat: 6,
    blurb: 'Heavy duelist with high contact pressure',
  },
  bomber: {
    kind: 'bomber',
    role: 'bomber',
    unlockWave: 4,
    threat: 4,
    blurb: 'Approach → blink fuse → AoE; death also explodes',
  },
  bulwark: {
    kind: 'bulwark',
    role: 'tank',
    unlockWave: 6,
    threat: 5,
    blurb: 'Frontal plate: reduced damage from facing arc',
  },
  sniper: {
    kind: 'sniper',
    role: 'sniper',
    unlockWave: 7,
    threat: 5,
    blurb: 'Long-range lock with readable laser telegraph',
  },
  disruptor: {
    kind: 'disruptor',
    role: 'disruptor',
    unlockWave: 8,
    threat: 5,
    blurb: 'Soft control: move slow + heat cooling interference',
  },
  boss: {
    kind: 'boss',
    role: 'boss',
    unlockWave: 5,
    threat: 20,
    blurb: 'Milestone multi-phase boss',
  },
};

/** The 8 normal combat archetypes (boss excluded). */
export const NORMAL_ENEMY_KINDS: EnemyKind[] = [
  'chaser',
  'ranged',
  'swarm',
  'elite',
  'bomber',
  'bulwark',
  'sniper',
  'disruptor',
];

export function isUnlocked(kind: EnemyKind, wave: number): boolean {
  return wave >= ENEMY_ARCHETYPES[kind].unlockWave;
}

export function unlockedNormalKinds(wave: number): EnemyKind[] {
  return NORMAL_ENEMY_KINDS.filter((k) => isUnlocked(k, wave));
}
