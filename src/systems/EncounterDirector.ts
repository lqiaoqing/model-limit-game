import type { EnemyKind } from '../entities/Enemy';
import { ENEMY_ARCHETYPES, isUnlocked } from './EnemyArchetypes';
import { bossIdForWave } from './BossDefinitions';

export type SquadRecipeId =
  | 'hunter_pack'
  | 'artillery_nest'
  | 'shield_wall'
  | 'assassin_strike'
  | 'suppression'
  | 'bomb_rush'
  | 'disruptor_escort';

export type SpawnAnchor = 'north' | 'south' | 'east' | 'west' | 'center';

export type SpawnTicket = {
  kind: EnemyKind;
  squadId: SquadRecipeId | 'filler' | 'boss' | 'stress';
  /** Formation center on the arena edge (or center). */
  anchor: SpawnAnchor;
  /** Offset from formation center in arena units. */
  offsetX: number;
  offsetZ: number;
  /** Seconds to wait after wave start before this unit may enter. */
  delay: number;
  /** Boss identity when kind === 'boss'. */
  bossId?: string | null;
};

export type SquadRecipe = {
  id: SquadRecipeId;
  name: string;
  threat: number;
  mix: Partial<Record<EnemyKind, number>>;
  /** Preferred formation anchors for this squad. */
  anchors: SpawnAnchor[];
  /** Minimum wave for this squad recipe. */
  unlockWave: number;
};

export const SQUAD_RECIPES: SquadRecipe[] = [
  {
    id: 'hunter_pack',
    name: 'HUNTER PACK',
    threat: 8,
    mix: { chaser: 4, swarm: 3 },
    // Same-side pressure: pack from one flank.
    anchors: ['east', 'west'],
    unlockWave: 1,
  },
  {
    id: 'artillery_nest',
    name: 'ARTILLERY NEST',
    threat: 12,
    mix: { ranged: 3, sniper: 1 },
    // Rear nest: hold far side and shell.
    anchors: ['north', 'south'],
    unlockWave: 2,
  },
  {
    id: 'shield_wall',
    name: 'SHIELD WALL',
    threat: 14,
    mix: { bulwark: 2, ranged: 2 },
    anchors: ['north', 'south'],
    unlockWave: 6,
  },
  {
    id: 'assassin_strike',
    name: 'ASSASSIN STRIKE',
    threat: 11,
    mix: { elite: 2 },
    // Dual flank pincer.
    anchors: ['east', 'west'],
    unlockWave: 4,
  },
  {
    id: 'suppression',
    name: 'SUPPRESSION',
    threat: 12,
    mix: { chaser: 4, sniper: 1, ranged: 2 },
    anchors: ['north', 'south', 'east'],
    unlockWave: 3,
  },
  {
    id: 'bomb_rush',
    name: 'BOMB RUSH',
    threat: 10,
    mix: { bomber: 3, swarm: 4 },
    anchors: ['east', 'west', 'south'],
    unlockWave: 4,
  },
  {
    id: 'disruptor_escort',
    name: 'DISRUPTOR ESCORT',
    threat: 13,
    mix: { disruptor: 1, bulwark: 1, chaser: 3 },
    anchors: ['north', 'south', 'center'],
    unlockWave: 8,
  },
];

export function threatBudgetForWave(wave: number, stressMode: boolean): number {
  if (stressMode) return 0;
  return 8 + wave * 3;
}

function anchorWorld(
  anchor: SpawnAnchor,
  halfWidth: number,
  halfDepth: number,
): { x: number; z: number } {
  const margin = 1.2;
  switch (anchor) {
    case 'north':
      return { x: 0, z: -halfDepth + margin };
    case 'south':
      return { x: 0, z: halfDepth - margin };
    case 'east':
      return { x: halfWidth - margin, z: 0 };
    case 'west':
      return { x: -halfWidth + margin, z: 0 };
    default:
      return { x: 0, z: 0 };
  }
}

function formationOffsets(
  squadId: SquadRecipeId | 'filler' | 'boss' | 'stress',
  kind: EnemyKind,
  index: number,
  total: number,
  rng: () => number,
): { offsetX: number; offsetZ: number; delay: number } {
  // Compact line/arc along the edge, with staggered delay so squads read as groups.
  const spacing = kind === 'ranged' || kind === 'sniper' ? 1.1 : 0.85;
  const mid = (total - 1) / 2;
  const along = (index - mid) * spacing;
  const jitter = () => (rng() - 0.5) * 0.35;

  if (squadId === 'assassin_strike') {
    return {
      offsetX: along * 0.4 + jitter(),
      offsetZ: (index === 0 ? 1.8 : -1.8) + jitter(),
      delay: 0.15 + index * 0.12,
    };
  }
  if (squadId === 'artillery_nest') {
    return {
      offsetX: along,
      offsetZ: 0.6 + Math.abs(along) * 0.15 + jitter(),
      delay: 0.1 + index * 0.08,
    };
  }
  if (squadId === 'shield_wall') {
    const lead = kind === 'bulwark' ? 0.9 : 0.2;
    return { offsetX: along, offsetZ: lead + jitter(), delay: 0.05 + index * 0.06 };
  }
  if (squadId === 'hunter_pack') {
    return { offsetX: along * 0.7 + jitter(), offsetZ: 0.4 + (index % 2) * 0.5, delay: index * 0.05 };
  }
  if (squadId === 'suppression') {
    const depth = kind === 'ranged' || kind === 'sniper' ? 1.4 : 0.3;
    return { offsetX: along, offsetZ: depth + jitter(), delay: 0.08 + index * 0.07 };
  }
  if (squadId === 'bomb_rush') {
    return {
      offsetX: along * 0.6 + jitter(),
      offsetZ: 0.2 + (kind === 'bomber' ? 0.4 : 0),
      delay: index * 0.06,
    };
  }
  if (squadId === 'disruptor_escort') {
    const depth = kind === 'disruptor' ? 0 : kind === 'bulwark' ? 0.7 : 0.25;
    return { offsetX: along, offsetZ: depth + jitter(), delay: 0.1 + index * 0.08 };
  }
  return { offsetX: along * 0.5 + jitter(), offsetZ: jitter(), delay: index * 0.04 };
}

/**
 * Compose wave spawn tickets with real squad formations.
 * Stress keeps a dense flood ticket list (anchor center / ring handled by WaveDirector).
 */
export function composeWaveTickets(options: {
  wave: number;
  stressMode: boolean;
  rng: () => number;
  bossWave: boolean;
  halfWidth: number;
  halfDepth: number;
}): { tickets: SpawnTicket[]; squads: SquadRecipeId[]; budgetLeft: number } {
  const { wave, stressMode, rng, bossWave, halfWidth, halfDepth } = options;

  if (stressMode) {
    const countBase = 80 + Math.min(280, wave * 18);
    const tickets: SpawnTicket[] = [];
    if (bossWave) {
      tickets.push({
        kind: 'boss',
        squadId: 'boss',
        anchor: 'center',
        offsetX: 0,
        offsetZ: 0,
        delay: 0,
        bossId: bossIdForWave(wave),
      });
    }
    // Stress stays chaser-heavy so the flood remains a lethal ceiling test.
    const floodKinds: EnemyKind[] = ['chaser', 'chaser', 'chaser', 'chaser', 'chaser', 'swarm'];
    for (let i = 0; i < countBase + 200; i += 1) {
      const kind = floodKinds[i % floodKinds.length];
      tickets.push({
        kind,
        squadId: 'stress',
        anchor: 'center',
        offsetX: 0,
        offsetZ: 0,
        delay: 0,
      });
    }
    return { tickets, squads: [], budgetLeft: 0 };
  }

  let budget = threatBudgetForWave(wave, false);
  if (bossWave) budget = Math.max(10, Math.floor(budget * 0.55));

  const unlocked = SQUAD_RECIPES.filter((recipe) => wave >= recipe.unlockWave);

  const tickets: SpawnTicket[] = [];
  const squads: SquadRecipeId[] = [];
  if (bossWave) {
    tickets.push({
      kind: 'boss',
      squadId: 'boss',
      anchor: 'center',
      offsetX: 0,
      offsetZ: 0,
      delay: 0,
      bossId: bossIdForWave(wave),
    });
  }

  let guard = 0;
  let squadDelay = 0;
  while (budget > 0 && unlocked.length > 0 && guard < 12) {
    guard += 1;
    const affordable = unlocked.filter((r) => r.threat <= budget);
    if (affordable.length === 0) break;
    const pick = affordable[Math.floor(rng() * affordable.length)];
    budget -= pick.threat;
    squads.push(pick.id);

    // Assassin / disruptor escort: force dual anchors. Others: one shared anchor.
    const useDual = pick.id === 'assassin_strike' || pick.id === 'disruptor_escort';
    const anchorA = pick.anchors[Math.floor(rng() * pick.anchors.length)];
    const anchorB = pick.anchors.find((a) => a !== anchorA) ?? anchorA;

    const members: EnemyKind[] = [];
    for (const [kind, count] of Object.entries(pick.mix)) {
      for (let i = 0; i < (count ?? 0); i += 1) members.push(kind as EnemyKind);
    }

    members.forEach((kind, index) => {
      const anchor = useDual && kind !== 'disruptor' ? (index % 2 === 0 ? anchorA : anchorB) : anchorA;
      const form = formationOffsets(pick.id, kind, index, members.length, rng);
      const base = anchorWorld(anchor, halfWidth, halfDepth);
      tickets.push({
        kind,
        squadId: pick.id,
        anchor,
        offsetX: THREE_clamp(base.x + form.offsetX, -halfWidth + 1, halfWidth - 1),
        offsetZ: THREE_clamp(base.z + form.offsetZ, -halfDepth + 1, halfDepth - 1),
        delay: squadDelay + form.delay,
      });
    });
    squadDelay += 0.35;
  }

  const fillerBase = bossWave
    ? 2 + Math.min(8, Math.floor(wave * 0.6))
    : 2 + Math.min(14, Math.floor(wave * 1.1));
  for (let i = 0; i < fillerBase; i += 1) {
    const r = rng();
    let kind: EnemyKind = 'chaser';
    // Weighted filler among unlocked normal archetypes.
    const unlockedKinds = (
      ['chaser', 'ranged', 'swarm', 'elite', 'bomber', 'bulwark', 'sniper', 'disruptor'] as const
    ).filter((k) => isUnlocked(k, wave));
    if (unlockedKinds.length > 0) {
      const idx = Math.floor(r * unlockedKinds.length) % unlockedKinds.length;
      kind = unlockedKinds[idx];
    }
    const anchor: SpawnAnchor = (['north', 'south', 'east', 'west'] as const)[
      Math.floor(r * 4) % 4
    ];
    const base = anchorWorld(anchor, halfWidth, halfDepth);
    const form = formationOffsets('filler', kind, i, fillerBase, rng);
    tickets.push({
      kind,
      squadId: 'filler',
      anchor,
      offsetX: THREE_clamp(base.x + form.offsetX, -halfWidth + 1, halfWidth - 1),
      offsetZ: THREE_clamp(base.z + form.offsetZ, -halfDepth + 1, halfDepth - 1),
      delay: squadDelay + form.delay,
    });
  }

  return { tickets, squads, budgetLeft: budget };
}

function THREE_clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/** Back-compat helper used by diagnostics/tests. */
export function composeWaveQueue(options: {
  wave: number;
  stressMode: boolean;
  rng: () => number;
  bossWave: boolean;
}): { queue: EnemyKind[]; squads: SquadRecipeId[] } {
  const { tickets, squads } = composeWaveTickets({
    ...options,
    halfWidth: 14,
    halfDepth: 9,
  });
  return { queue: tickets.map((t) => t.kind), squads };
}

export function squadThreat(recipeId: SquadRecipeId): number {
  return SQUAD_RECIPES.find((r) => r.id === recipeId)?.threat ?? 0;
}

export function archetypeThreat(kind: EnemyKind): number {
  return ENEMY_ARCHETYPES[kind].threat;
}
