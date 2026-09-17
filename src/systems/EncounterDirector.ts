import type { EnemyKind } from '../entities/Enemy';

export type SquadRecipeId =
  | 'hunter_pack'
  | 'artillery_nest'
  | 'shield_wall'
  | 'assassin_strike'
  | 'suppression';

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
};

export type SquadRecipe = {
  id: SquadRecipeId;
  name: string;
  threat: number;
  mix: Partial<Record<EnemyKind, number>>;
  /** Preferred formation anchors for this squad. */
  anchors: SpawnAnchor[];
};

export const SQUAD_RECIPES: SquadRecipe[] = [
  {
    id: 'hunter_pack',
    name: 'HUNTER PACK',
    threat: 8,
    mix: { chaser: 6 },
    // Same-side pressure: pack from one flank.
    anchors: ['east', 'west'],
  },
  {
    id: 'artillery_nest',
    name: 'ARTILLERY NEST',
    threat: 10,
    mix: { ranged: 4 },
    // Rear nest: hold far side and shell.
    anchors: ['north', 'south'],
  },
  {
    id: 'shield_wall',
    name: 'SHIELD WALL',
    threat: 12,
    mix: { elite: 2, chaser: 4 },
    anchors: ['north', 'south'],
  },
  {
    id: 'assassin_strike',
    name: 'ASSASSIN STRIKE',
    threat: 11,
    mix: { elite: 2 },
    // Dual flank pincer.
    anchors: ['east', 'west'],
  },
  {
    id: 'suppression',
    name: 'SUPPRESSION',
    threat: 12,
    mix: { ranged: 3, chaser: 5 },
    anchors: ['north', 'south', 'east'],
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
  const spacing = kind === 'ranged' ? 1.1 : 0.85;
  const mid = (total - 1) / 2;
  const along = (index - mid) * spacing;
  const jitter = () => (rng() - 0.5) * 0.35;

  if (squadId === 'assassin_strike') {
    // Deep offset toward center for a strike pair.
    return {
      offsetX: along * 0.4 + jitter(),
      offsetZ: (index === 0 ? 1.8 : -1.8) + jitter(),
      delay: 0.15 + index * 0.12,
    };
  }
  if (squadId === 'artillery_nest') {
    // Clustered rear arc.
    return {
      offsetX: along,
      offsetZ: 0.6 + Math.abs(along) * 0.15 + jitter(),
      delay: 0.1 + index * 0.08,
    };
  }
  if (squadId === 'shield_wall') {
    // Elites lead slightly forward.
    const lead = kind === 'elite' ? 0.9 : 0.2;
    return { offsetX: along, offsetZ: lead + jitter(), delay: 0.05 + index * 0.06 };
  }
  if (squadId === 'hunter_pack') {
    return { offsetX: along * 0.7 + jitter(), offsetZ: 0.4 + (index % 2) * 0.5, delay: index * 0.05 };
  }
  if (squadId === 'suppression') {
    const depth = kind === 'ranged' ? 1.4 : 0.3;
    return { offsetX: along, offsetZ: depth + jitter(), delay: 0.08 + index * 0.07 };
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
      });
    }
    for (let i = 0; i < countBase + 200; i += 1) {
      tickets.push({
        kind: 'chaser',
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

  const unlocked = SQUAD_RECIPES.filter((recipe) => {
    if (recipe.id === 'hunter_pack') return wave >= 1;
    if (recipe.id === 'artillery_nest') return wave >= 2;
    if (recipe.id === 'shield_wall') return wave >= 4;
    if (recipe.id === 'assassin_strike') return wave >= 4;
    if (recipe.id === 'suppression') return wave >= 3;
    return true;
  });

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

    // Assassin: force dual anchors (pincer). Others: one shared anchor.
    const useDual = pick.id === 'assassin_strike';
    const anchorA = pick.anchors[Math.floor(rng() * pick.anchors.length)];
    const anchorB = pick.anchors.find((a) => a !== anchorA) ?? anchorA;

    const members: EnemyKind[] = [];
    for (const [kind, count] of Object.entries(pick.mix)) {
      for (let i = 0; i < (count ?? 0); i += 1) members.push(kind as EnemyKind);
    }

    members.forEach((kind, index) => {
      const anchor = useDual ? (index % 2 === 0 ? anchorA : anchorB) : anchorA;
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
    if (wave >= 2 && r < 0.32) kind = 'ranged';
    else if (wave >= 4 && r < 0.48) kind = 'elite';
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
