import type { EnemyKind } from '../entities/Enemy';
import type { SquadRecipeId } from './EncounterDirector';
import { ENEMY_ARCHETYPES, unlockedNormalKinds } from './EnemyArchetypes';
import { bossIdForWave } from './BossDefinitions';
import { hazardBudgetForWave } from './ArenaHazardSystem';

export type WaveBand = 'learn' | 'titan' | 'expand' | 'warden' | 'push' | 'void' | 'endless';

export type WavePlan = {
  wave: number;
  band: WaveBand;
  bossId: string | null;
  unlockedKinds: EnemyKind[];
  hazardBudget: number;
  /** Soft target: how many distinct squad recipes may appear. */
  squadFloor: number;
  blurb: string;
};

export function waveBand(wave: number): WaveBand {
  if (wave <= 4) return 'learn';
  if (wave === 5) return 'titan';
  if (wave <= 9) return 'expand';
  if (wave === 10) return 'warden';
  if (wave <= 14) return 'push';
  if (wave === 15) return 'void';
  return 'endless';
}

/** Intended first-cycle design (Wave 1–15). */
export function wavePlan(wave: number): WavePlan {
  const isBoss = wave % 5 === 0;
  const band = waveBand(wave);
  const unlocked = unlockedNormalKinds(wave);
  const squadFloor =
    wave <= 2 ? 1 : wave <= 5 ? 2 : wave <= 9 ? 3 : wave <= 14 ? 4 : 5;
  const blurb =
    band === 'learn'
      ? 'Teach move/fire/dash with light chaser+ranged pressure'
      : band === 'titan'
        ? 'TITAN-07 milestone — form tier T1 after clear'
        : band === 'expand'
          ? 'New archetypes + harder squads + first hazards'
          : band === 'warden'
            ? 'ORBITAL WARDEN — spatial control check'
            : band === 'push'
              ? 'Advanced squads + dual hazards'
              : band === 'void'
                ? 'VOID ENGINE — arena manipulation check'
                : 'Endless loop / boss cycle';
  return {
    wave,
    band,
    bossId: isBoss ? bossIdForWave(wave) : null,
    unlockedKinds: unlocked,
    hazardBudget: hazardBudgetForWave(wave),
    squadFloor,
    blurb,
  };
}

export function fullCyclePlan(): WavePlan[] {
  return Array.from({ length: 15 }, (_, i) => wavePlan(i + 1));
}

/** Expected unlock gates used by regression tests. */
export const ENEMY_UNLOCK_GATES: Array<{ wave: number; kinds: EnemyKind[] }> = [
  { wave: 1, kinds: ['chaser'] },
  { wave: 2, kinds: ['ranged'] },
  { wave: 3, kinds: ['swarm'] },
  { wave: 4, kinds: ['elite', 'bomber'] },
  { wave: 6, kinds: ['bulwark'] },
  { wave: 7, kinds: ['sniper'] },
  { wave: 8, kinds: ['disruptor'] },
];

export const BOSS_CYCLE: Array<{ wave: number; bossId: string }> = [
  { wave: 5, bossId: 'titan07' },
  { wave: 10, bossId: 'orbital_warden' },
  { wave: 15, bossId: 'void_engine' },
];

/** Filler preference weights — recently unlocked kinds appear more often. */
export function fillerWeights(wave: number): Partial<Record<EnemyKind, number>> {
  const w: Partial<Record<EnemyKind, number>> = {
    chaser: 3.2,
  };
  if (wave >= 2) w.ranged = 2.0;
  if (wave >= 3) w.swarm = wave <= 6 ? 2.4 : 1.6;
  if (wave >= 4) w.elite = 1.2;
  if (wave >= 4) w.bomber = wave <= 7 ? 1.8 : 1.2;
  if (wave >= 6) w.bulwark = 1.3;
  if (wave >= 7) w.sniper = 1.2;
  if (wave >= 8) w.disruptor = 1.1;
  return w;
}

export function pickFillerKind(wave: number, r: number): EnemyKind {
  const weights = fillerWeights(wave);
  const entries = Object.entries(weights).filter(([kind]) => {
    const def = ENEMY_ARCHETYPES[kind as EnemyKind];
    return def && wave >= def.unlockWave;
  }) as Array<[EnemyKind, number]>;
  if (entries.length === 0) return 'chaser';
  let total = 0;
  for (const [, weight] of entries) total += weight;
  let roll = r * total;
  for (const [kind, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return kind;
  }
  return entries[entries.length - 1][0];
}

export type ProgressionCheck = {
  wave: number;
  plan: WavePlan;
  ticketKinds: EnemyKind[];
  squadIds: SquadRecipeId[] | string[];
  bossId: string | null;
  violations: string[];
};

/** Pure progression audit against composed tickets for one wave. */
export function auditWaveTickets(
  wave: number,
  tickets: Array<{ kind: string; squadId: string; bossId?: string | null }>,
  squads: string[],
): ProgressionCheck {
  const plan = wavePlan(wave);
  const violations: string[] = [];
  const normalKinds = tickets
    .map((t) => t.kind as EnemyKind)
    .filter((k) => k !== 'boss');

  for (const k of normalKinds) {
    const def = ENEMY_ARCHETYPES[k];
    if (!def) {
      violations.push(`unknown kind ${k}`);
      continue;
    }
    if (wave < def.unlockWave) {
      const inSquad = tickets.some((t) => t.kind === k && t.squadId !== 'stress');
      if (inSquad) violations.push(`locked kind ${k} on wave ${wave} (unlock ${def.unlockWave})`);
    }
  }

  const bossTickets = tickets.filter((t) => t.kind === 'boss');
  if (plan.bossId) {
    if (bossTickets.length === 0) violations.push(`missing boss ticket on wave ${wave}`);
    else if (bossTickets[0].bossId && bossTickets[0].bossId !== plan.bossId) {
      violations.push(`bossId ${bossTickets[0].bossId} != plan ${plan.bossId}`);
    }
  } else if (bossTickets.length > 0) {
    violations.push(`unexpected boss on non-boss wave ${wave}`);
  }

  if (wave <= 2 && squads.some((s) => s === 'disruptor_escort' || s === 'shield_wall')) {
    violations.push(`late squad on early wave ${wave}`);
  }

  return {
    wave,
    plan,
    ticketKinds: normalKinds,
    squadIds: squads,
    bossId: plan.bossId,
    violations,
  };
}
