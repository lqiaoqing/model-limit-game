import * as THREE from 'three';
import type { Enemy, EnemyKind } from '../entities/Enemy';
import type { SquadRecipeId, SpawnAnchor } from './EncounterDirector';
import { SQUAD_RECIPES } from './EncounterDirector';

export type SquadRole = 'front' | 'rear' | 'flank' | 'core' | 'screen' | 'swarm';

const ROLE_BY_KIND: Partial<Record<EnemyKind, SquadRole>> = {
  bulwark: 'front',
  elite: 'flank',
  chaser: 'screen',
  swarm: 'swarm',
  ranged: 'rear',
  sniper: 'rear',
  disruptor: 'core',
  bomber: 'screen',
};

/** Post-spawn tactical steering — no RTS pathfinding, just role/group biases. */
export type SquadSteer = {
  preferredDist: number | null;
  flankSign: number;
  holdTimer: number;
  cohesionX: number | null;
  cohesionZ: number | null;
  role: SquadRole | null;
};

export function squadRoleFor(kind: EnemyKind, squadId: string | null): SquadRole {
  if (squadId === 'disruptor_escort' && kind === 'disruptor') return 'core';
  if (squadId === 'shield_wall' && kind === 'bulwark') return 'front';
  if (squadId === 'artillery_nest' && (kind === 'ranged' || kind === 'sniper')) return 'rear';
  return ROLE_BY_KIND[kind] ?? 'screen';
}

function preferredDistance(role: SquadRole, squadId: string | null): number {
  if (squadId === 'artillery_nest' || role === 'rear') {
    return role === 'rear' && squadId === 'artillery_nest' ? 9.5 : 8;
  }
  if (role === 'front') return 3.2;
  if (role === 'flank') return 4.2;
  if (role === 'core') return 5.5;
  if (role === 'swarm') return 2.2;
  return 4.8;
}

function anchorFlankSign(anchor: SpawnAnchor | null | undefined): number {
  if (anchor === 'east') return 1;
  if (anchor === 'west') return -1;
  return 0;
}

/**
 * Lightweight squad controller:
 * - group timing (staggered advance holds)
 * - role preferred distance
 * - flank preference / cohesion toward pack center
 */
export class SquadController {
  private readonly groups = new Map<string, Enemy[]>();
  private engagementClock = 0;

  reset(): void {
    this.groups.clear();
    this.engagementClock = 0;
  }

  /** Called once per frame before Enemy.update. */
  apply(enemies: Enemy[], playerPos: THREE.Vector3, delta: number): void {
    this.engagementClock += delta;
    this.groups.clear();
    for (const e of enemies) {
      if (!e.alive || !e.squadId) continue;
      if (e.squadId === 'stress' || e.squadId === 'boss') continue;
      const list = this.groups.get(e.squadId);
      if (list) list.push(e);
      else this.groups.set(e.squadId, [e]);
    }

    for (const [squadId, members] of this.groups) {
      if (members.length === 0) continue;
      let cx = 0;
      let cz = 0;
      for (const m of members) {
        cx += m.group.position.x;
        cz += m.group.position.z;
      }
      cx /= members.length;
      cz /= members.length;

      const recipe = SQUAD_RECIPES.find((r) => r.id === squadId);
      const squadFlankBase =
        squadId === 'assassin_strike'
          ? 0
          : anchorFlankSign(members[0].squadAnchor as SpawnAnchor | null);

      members.forEach((enemy, index) => {
        const role = squadRoleFor(enemy.stats.kind as EnemyKind, squadId as SquadRecipeId | null);
        enemy.squadRole = role;
        enemy.squadSteer.role = role;
        enemy.squadSteer.preferredDist = preferredDistance(role, squadId);

        // Group timing: only the lead unit presses immediately; escorts trail.
        const engageAt = 0.25 + index * 0.22 + (recipe ? (recipe.threat % 5) * 0.03 : 0);
        enemy.squadSteer.holdTimer = Math.max(0, engageAt - this.engagementClock);

        if (squadId === 'assassin_strike') {
          enemy.squadSteer.flankSign = index % 2 === 0 ? 1 : -1;
        } else if (squadId === 'hunter_pack') {
          const side = squadFlankBase || (enemy.squadAnchor === 'east' ? 1 : -1);
          enemy.squadSteer.flankSign = side;
        } else if (squadId === 'bomb_rush') {
          enemy.squadSteer.flankSign = index % 2 === 0 ? 0.4 : -0.4;
        } else if (squadId === 'disruptor_escort') {
          // Screens orbit the disruptor core rather than the player.
          enemy.squadSteer.flankSign = role === 'core' ? 0 : index % 2 === 0 ? 0.6 : -0.6;
        } else {
          enemy.squadSteer.flankSign = squadFlankBase * (role === 'rear' ? 0.25 : 0.7);
        }

        if (role === 'core' || squadId === 'disruptor_escort') {
          enemy.squadSteer.cohesionX = cx;
          enemy.squadSteer.cohesionZ = cz;
        } else if (squadId === 'hunter_pack' || squadId === 'shield_wall') {
          // Mild pack cohesion so the formation still reads after spawn.
          enemy.squadSteer.cohesionX = cx * 0.35 + playerPos.x * 0.0;
          enemy.squadSteer.cohesionZ = cz;
        } else {
          enemy.squadSteer.cohesionX = null;
          enemy.squadSteer.cohesionZ = null;
        }
      });
    }
  }

  snapshot(enemies: Enemy[]): Array<{
    squadId: string;
    count: number;
    kinds: string[];
    roles: string[];
  }> {
    const map = new Map<string, { count: number; kinds: Set<string>; roles: Set<string> }>();
    for (const e of enemies) {
      if (!e.alive || !e.squadId || e.squadId === 'stress' || e.squadId === 'boss') continue;
      const row = map.get(e.squadId) ?? { count: 0, kinds: new Set(), roles: new Set() };
      row.count += 1;
      row.kinds.add(e.stats.kind);
      if (e.squadRole) row.roles.add(e.squadRole);
      map.set(e.squadId, row);
    }
    return [...map.entries()].map(([squadId, row]) => ({
      squadId,
      count: row.count,
      kinds: [...row.kinds],
      roles: [...row.roles],
    }));
  }
}

export function defaultSquadSteer(): SquadSteer {
  return {
    preferredDist: null,
    flankSign: 0,
    holdTimer: 0,
    cohesionX: null,
    cohesionZ: null,
    role: null,
  };
}
