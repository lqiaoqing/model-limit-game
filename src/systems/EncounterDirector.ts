import type { EnemyKind } from '../entities/Enemy';

export type SquadRecipeId =
  | 'hunter_pack'
  | 'artillery_nest'
  | 'shield_wall'
  | 'assassin_strike'
  | 'suppression';

export type SquadRecipe = {
  id: SquadRecipeId;
  name: string;
  threat: number;
  mix: Partial<Record<EnemyKind, number>>;
};

export const SQUAD_RECIPES: SquadRecipe[] = [
  {
    id: 'hunter_pack',
    name: 'HUNTER PACK',
    threat: 8,
    mix: { chaser: 6 },
  },
  {
    id: 'artillery_nest',
    name: 'ARTILLERY NEST',
    threat: 10,
    mix: { ranged: 4 },
  },
  {
    id: 'shield_wall',
    name: 'SHIELD WALL',
    threat: 12,
    mix: { elite: 2, chaser: 4 },
  },
  {
    id: 'assassin_strike',
    name: 'ASSASSIN STRIKE',
    threat: 11,
    mix: { elite: 2 },
  },
  {
    id: 'suppression',
    name: 'SUPPRESSION',
    threat: 12,
    mix: { ranged: 3, chaser: 5 },
  },
];

export function threatBudgetForWave(wave: number, stressMode: boolean): number {
  if (stressMode) return 0;
  return 8 + wave * 3;
}

/**
 * Compose a wave queue from threat-budgeted squads, then top up with cheap units
 * so density still ramps. Boss waves prepend the boss and use a tighter budget.
 */
export function composeWaveQueue(options: {
  wave: number;
  stressMode: boolean;
  rng: () => number;
  bossWave: boolean;
}): { queue: EnemyKind[]; squads: SquadRecipeId[] } {
  const { wave, stressMode, rng, bossWave } = options;
  if (stressMode) {
    const countBase = 55 + Math.min(180, wave * 10);
    const queue: EnemyKind[] = [];
    if (bossWave) queue.push('boss');
    for (let i = 0; i < countBase; i += 1) queue.push('chaser');
    for (let i = 0; i < 120; i += 1) queue.push('chaser');
    return { queue, squads: [] };
  }

  let budget = threatBudgetForWave(wave, false);
  if (bossWave) budget = Math.max(10, Math.floor(budget * 0.55));

  const unlocked = SQUAD_RECIPES.filter((recipe) => {
    if (recipe.id === 'hunter_pack') return wave >= 1;
    if (recipe.id === 'artillery_nest') return wave >= 2;
    if (recipe.id === 'shield_wall') return wave >= 4;
    if (recipe.id === 'assassin_strike') return wave >= 4;
    if (recipe.id === 'suppression') return wave >= 3;
    return true;
  });

  const queue: EnemyKind[] = [];
  const squads: SquadRecipeId[] = [];
  if (bossWave) queue.push('boss');

  let guard = 0;
  while (budget > 0 && unlocked.length > 0 && guard < 12) {
    guard += 1;
    const affordable = unlocked.filter((r) => r.threat <= budget);
    if (affordable.length === 0) break;
    const pick = affordable[Math.floor(rng() * affordable.length)];
    budget -= pick.threat;
    squads.push(pick.id);
    for (const [kind, count] of Object.entries(pick.mix)) {
      const n = count ?? 0;
      for (let i = 0; i < n; i += 1) queue.push(kind as EnemyKind);
    }
  }

  // Top-up filler keeps density on the old curve without another squad.
  const fillerBase = bossWave
    ? 2 + Math.min(8, Math.floor(wave * 0.6))
    : 2 + Math.min(14, Math.floor(wave * 1.1));
  for (let i = 0; i < fillerBase; i += 1) {
    const r = rng();
    let kind: EnemyKind = 'chaser';
    if (wave >= 2 && r < 0.32) kind = 'ranged';
    else if (wave >= 4 && r < 0.48) kind = 'elite';
    queue.push(kind);
  }

  return { queue, squads };
}
