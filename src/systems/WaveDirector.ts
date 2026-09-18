import * as THREE from 'three';
import {
  Enemy,
  ENEMY_TEMPLATES,
  type EnemyKind,
  type EnemyFormTier,
  type EnemyStats,
} from '../entities/Enemy';
import { enemyFormTierForWave } from './EnemyAssets';
import { composeWaveTickets, type SpawnTicket, type SquadRecipeId } from './EncounterDirector';
import { SquadController } from './SquadController';

export type WaveState = {
  wave: number;
  alive: number;
  spawning: boolean;
  intermission: number;
  bossActive: boolean;
  totalToSpawn: number;
  spawned: number;
};

export class WaveDirector {
  private spawnQueue: SpawnTicket[] = [];
  private spawnTimer = 0;
  private waveClock = 0;
  private intermission = 0;
  private spawnedThisWave = 0;
  private totalThisWave = 0;
  private bossRef: Enemy | null = null;
  private lastSquads: SquadRecipeId[] = [];

  wave = 1;
  stressMode = false;
  /** Debug: skip enemy AI/movement updates. */
  freezeEnemies = false;
  readonly squadController = new SquadController();
  /** Last composed wave tickets (diagnostics/tests). */
  lastTickets: SpawnTicket[] = [];

  constructor(
    private readonly scene: THREE.Scene,
    private readonly bounds: { halfWidth: number; halfDepth: number },
    private readonly rng: () => number,
  ) {}

  reset(): void {
    for (const e of this.activeEnemies()) {
      this.scene.remove(e.group);
      e.dispose();
    }
    this.enemies.length = 0;
    this.wave = 1;
    this.spawnQueue = [];
    this.spawnTimer = 0;
    this.waveClock = 0;
    this.intermission = this.stressMode ? 0.15 : 1.2;
    this.spawnedThisWave = 0;
    this.totalThisWave = 0;
    this.bossRef = null;
    this.lastSquads = [];
    this.lastTickets = [];
    this.squadController.reset();
  }

  readonly enemies: Enemy[] = [];

  activeEnemies(): Enemy[] {
    return this.enemies.filter((e) => e.alive);
  }

  get boss(): Enemy | null {
    if (this.bossRef && this.bossRef.alive) return this.bossRef;
    return null;
  }

  get squads(): SquadRecipeId[] {
    return this.lastSquads;
  }

  getState(): WaveState {
    const alive = this.enemies.filter((e) => e.alive).length;
    return {
      wave: this.wave,
      alive,
      spawning: this.spawnQueue.length > 0 || this.intermission > 0,
      intermission: this.intermission,
      bossActive: Boolean(this.bossRef?.alive),
      totalToSpawn: this.totalThisWave,
      spawned: this.spawnedThisWave,
    };
  }

  update(delta: number, playerPos: THREE.Vector3, elapsed: number): void {
    for (let i = this.enemies.length - 1; i >= 0; i -= 1) {
      if (!this.enemies[i].alive) {
        const dead = this.enemies[i];
        this.scene.remove(dead.group);
        dead.dispose();
        this.enemies.splice(i, 1);
      }
    }

    if (this.intermission > 0) {
      this.intermission -= delta;
      if (this.intermission <= 0) {
        this.beginWave();
      }
      if (this.intermission > 0) return;
    }

    this.waveClock += delta;
    if (this.spawnQueue.length > 0) {
      this.spawnTimer -= delta;
      if (this.spawnTimer <= 0) {
        let idx = -1;
        for (let i = 0; i < this.spawnQueue.length; i += 1) {
          if (this.spawnQueue[i].delay <= this.waveClock) {
            idx = i;
            break;
          }
        }
        if (idx >= 0) {
          const ticket = this.spawnQueue.splice(idx, 1)[0];
          this.spawnTimer = this.stressMode ? 0.08 : 0.16 + this.rng() * 0.1;
          this.spawnFromTicket(ticket, playerPos);
        } else {
          this.spawnTimer = 0.05;
        }
      }
    }

    const alive = this.enemies.filter((e) => e.alive).length;
    if (this.spawnQueue.length === 0 && alive === 0) {
      this.wave += 1;
      this.intermission = this.stressMode ? 0.6 : 2.5;
      this.bossRef = null;
    }

    this.squadController.apply(this.enemies, playerPos, delta);
    for (const enemy of this.enemies) {
      if (this.freezeEnemies) continue;
      enemy.update(delta, elapsed, playerPos, this.bounds);
    }
  }

  forceStartWave(playerPos?: THREE.Vector3): void {
    this.intermission = 0;
    this.beginWave();
    if (playerPos && this.stressMode) {
      for (let i = 0; i < 48; i += 1) {
        this.spawnEnemyAt('chaser', playerPos.x, playerPos.z, true);
      }
    }
  }

  /** Debug: wipe current wave (enemies + queue) and advance wave counter. */
  debugClearWave(): void {
    for (const e of this.enemies) {
      if (!e.alive) continue;
      e.takeDamage(999999);
    }
    this.spawnQueue = [];
    this.wave += 1;
    this.intermission = 0.08;
    this.bossRef = null;
  }

  /** Debug: force a specific wave number and restart its spawn. */
  debugSetWave(wave: number, playerPos?: THREE.Vector3): void {
    this.wave = Math.max(1, wave);
    this.debugClearWave();
    // undo the auto +1 from clear so caller sets exact wave
    this.wave = Math.max(1, wave);
    this.spawnQueue = [];
    this.intermission = 0.05;
    this.beginWave();
    if (playerPos && this.stressMode) {
      for (let i = 0; i < 48; i += 1) {
        this.spawnEnemyAt('chaser', playerPos.x, playerPos.z, true);
      }
    }
  }

  forceSpawnNear(position: THREE.Vector3, kind: EnemyKind): void {
    const hw = this.bounds.halfWidth - 1.2;
    const hd = this.bounds.halfDepth - 1.2;
    const angle = this.rng() * Math.PI * 2;
    const radius = 1.6 + this.rng() * 1.4;
    const x = THREE.MathUtils.clamp(position.x + Math.cos(angle) * radius, -hw, hw);
    const z = THREE.MathUtils.clamp(position.z + Math.sin(angle) * radius, -hd, hd);
    this.spawnEnemyAt(kind, x, z);
  }

  /** Deterministic spawn at an exact world XZ (test hooks / scripted setups). */
  spawnAt(kind: EnemyKind, x: number, z: number): void {
    this.spawnEnemyAt(kind, x, z);
  }

  listEnemies(): Array<{
    id: string;
    kind: string;
    x: number;
    z: number;
    hp: number;
    alive: boolean;
    squadId: string | null;
    squadRole: string | null;
    anchor: string | null;
  }> {
    return this.enemies.map((e) => ({
      id: e.group.uuid,
      kind: e.stats.kind,
      x: e.group.position.x,
      z: e.group.position.z,
      hp: e.hp,
      alive: e.alive,
      squadId: e.squadId,
      squadRole: e.squadRole,
      anchor: e.squadAnchor,
    }));
  }

  /** Test-only: remove every live enemy immediately. */
  clearEnemies(): void {
    for (const e of this.enemies) {
      this.scene.remove(e.group);
      e.dispose();
    }
    this.enemies.length = 0;
    this.spawnQueue = [];
  }

  private spawnFromTicket(ticket: SpawnTicket, playerPos: THREE.Vector3): void {
    const hw = this.bounds.halfWidth - 1.2;
    const hd = this.bounds.halfDepth - 1.2;
    let x = ticket.offsetX;
    let z = ticket.offsetZ;

    if (ticket.squadId === 'stress' || ticket.anchor === 'center') {
      const angle = this.rng() * Math.PI * 2;
      const radius = 5.5 + this.rng() * 4.5;
      x = THREE.MathUtils.clamp(playerPos.x + Math.cos(angle) * radius, -hw, hw);
      z = THREE.MathUtils.clamp(playerPos.z + Math.sin(angle) * radius, -hd, hd);
    } else {
      const dx = x - playerPos.x;
      const dz = z - playerPos.z;
      if (dx * dx + dz * dz < 16) {
        x = THREE.MathUtils.clamp(x + Math.sign(dx || 1) * 6, -hw, hw);
        z = THREE.MathUtils.clamp(z + Math.sign(dz || 1) * 6, -hd, hd);
      }
    }
    const enemy = this.spawnEnemyAt(ticket.kind, x, z);
    if (enemy) {
      enemy.squadId = ticket.squadId;
      enemy.squadAnchor = ticket.anchor;
    }
  }

  private spawnEnemyAt(
    kind: EnemyKind,
    x: number,
    z: number,
    ringAroundPoint = false,
  ): Enemy | null {
    if (ringAroundPoint) {
      const hw = this.bounds.halfWidth - 1.2;
      const hd = this.bounds.halfDepth - 1.2;
      const angle = this.rng() * Math.PI * 2;
      const radius = 5.5 + this.rng() * 4.5;
      x = THREE.MathUtils.clamp(x + Math.cos(angle) * radius, -hw, hw);
      z = THREE.MathUtils.clamp(z + Math.sin(angle) * radius, -hd, hd);
    }
    const template = ENEMY_TEMPLATES[kind];
    const formTier: EnemyFormTier = enemyFormTierForWave(this.wave);
    const formMul = 1 + formTier * 0.18;
    const dmgMul = 1 + formTier * 0.1;
    const speedMul = 1 + formTier * 0.04;
    const radiusMul = 1 + formTier * 0.05;
    const stats: EnemyStats = {
      ...template,
      hp: Math.round(template.hp * formMul),
      speed: template.speed * speedMul,
      radius: template.radius * radiusMul,
      contactDamage: Math.round(template.contactDamage * dmgMul),
      projectileDamage: Math.round(template.projectileDamage * dmgMul),
      scale: template.scale * (1 + formTier * 0.08),
    };
    const enemy = new Enemy(stats, new THREE.Vector3(x, 0, z), this.rng(), formTier);
    enemy.telegraphTimer = this.stressMode ? 0.2 : 0.55;
    this.enemies.push(enemy);
    this.scene.add(enemy.group);
    this.spawnedThisWave += 1;
    if (kind === 'boss') this.bossRef = enemy;
    return enemy;
  }

  private beginWave(): void {
    const wave = this.wave;
    const isBossWave = wave % 5 === 0;
    const { tickets, squads } = composeWaveTickets({
      wave,
      stressMode: this.stressMode,
      rng: this.rng,
      bossWave: isBossWave,
      halfWidth: this.bounds.halfWidth,
      halfDepth: this.bounds.halfDepth,
    });

    this.spawnQueue = tickets;
    this.lastTickets = tickets.slice();
    this.lastSquads = squads;
    this.totalThisWave = tickets.length;
    this.spawnedThisWave = 0;
    this.spawnTimer = 0;
    this.waveClock = 0;

    if (this.stressMode) {
      const burst = Math.min(80, this.spawnQueue.length);
      for (let i = 0; i < burst; i += 1) {
        const ticket = this.spawnQueue.shift();
        if (ticket) this.spawnEnemyAt(ticket.kind, 0, 0, true);
      }
    }
  }
}
