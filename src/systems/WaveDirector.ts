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

    for (const enemy of this.enemies) {
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

  forceSpawnNear(position: THREE.Vector3, kind: EnemyKind): void {
    const hw = this.bounds.halfWidth - 1.2;
    const hd = this.bounds.halfDepth - 1.2;
    const angle = this.rng() * Math.PI * 2;
    const radius = 1.6 + this.rng() * 1.4;
    const x = THREE.MathUtils.clamp(position.x + Math.cos(angle) * radius, -hw, hw);
    const z = THREE.MathUtils.clamp(position.z + Math.sin(angle) * radius, -hd, hd);
    this.spawnEnemyAt(kind, x, z);
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
    this.spawnEnemyAt(ticket.kind, x, z);
  }

  private spawnEnemyAt(kind: EnemyKind, x: number, z: number, ringAroundPoint = false): void {
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
