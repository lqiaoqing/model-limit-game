import * as THREE from 'three';
import { Enemy, ENEMY_TEMPLATES, type EnemyKind, type EnemyFormTier, type EnemyStats } from '../entities/Enemy';
import { enemyFormTierForWave } from './EnemyAssets';
import { composeWaveQueue, type SquadRecipeId } from './EncounterDirector';

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
  private spawnQueue: EnemyKind[] = [];
  private spawnTimer = 0;
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
    // Cull dead
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
      // Fall through so a just-started wave can spawn this frame.
      if (this.intermission > 0) return;
    }

    if (this.spawnQueue.length > 0) {
      this.spawnTimer -= delta;
      if (this.spawnTimer <= 0) {
        this.spawnTimer = this.stressMode ? 0.08 : 0.35 + this.rng() * 0.25;
        const kind = this.spawnQueue.shift();
        if (kind) this.spawnEnemy(kind, playerPos);
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
    // Ensure burst uses player-centered ring when provided
    if (playerPos && this.stressMode) {
      // beginWave already burst-spawned at origin; extra ring pack around player
      for (let i = 0; i < 20; i += 1) {
        this.spawnEnemy('chaser', playerPos);
      }
    }
  }

  /** Spawn a unit near a world point (boss reinforcements). */
  forceSpawnNear(position: THREE.Vector3, kind: EnemyKind): void {
    const hw = this.bounds.halfWidth - 1.2;
    const hd = this.bounds.halfDepth - 1.2;
    const angle = this.rng() * Math.PI * 2;
    const radius = 1.6 + this.rng() * 1.4;
    const x = THREE.MathUtils.clamp(position.x + Math.cos(angle) * radius, -hw, hw);
    const z = THREE.MathUtils.clamp(position.z + Math.sin(angle) * radius, -hd, hd);
    this.spawnEnemyAt(kind, x, z);
  }

  private spawnEnemyAt(kind: EnemyKind, x: number, z: number): void {
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
    enemy.telegraphTimer = this.stressMode ? 0.2 : 0.4;
    this.enemies.push(enemy);
    this.scene.add(enemy.group);
    if (kind === 'boss') this.bossRef = enemy;
  }

  private beginWave(): void {
    const wave = this.wave;
    const isBossWave = wave % 5 === 0;
    const { queue, squads } = composeWaveQueue({
      wave,
      stressMode: this.stressMode,
      rng: this.rng,
      bossWave: isBossWave,
    });

    this.spawnQueue = queue;
    this.lastSquads = squads;
    this.totalThisWave = queue.length;
    this.spawnedThisWave = 0;
    this.spawnTimer = 0;

    // Stress: flood a visible pack this frame so the mode is immediately dense.
    if (this.stressMode) {
      const burst = Math.min(40, this.spawnQueue.length);
      for (let i = 0; i < burst; i += 1) {
        const kind = this.spawnQueue.shift();
        if (kind) this.spawnEnemy(kind, new THREE.Vector3(0, 0, 0));
      }
    }
  }

  private spawnEnemy(kind: EnemyKind, playerPos: THREE.Vector3): void {
    const template = ENEMY_TEMPLATES[kind];
    const edge = Math.floor(this.rng() * 4);
    const hw = this.bounds.halfWidth - 1.2;
    const hd = this.bounds.halfDepth - 1.2;
    let x = 0;
    let z = 0;

    if (this.stressMode) {
      // Ring around player so the flood is immediately on-camera.
      const angle = this.rng() * Math.PI * 2;
      const radius = 5.5 + this.rng() * 4.5;
      x = THREE.MathUtils.clamp(playerPos.x + Math.cos(angle) * radius, -hw, hw);
      z = THREE.MathUtils.clamp(playerPos.z + Math.sin(angle) * radius, -hd, hd);
    } else if (edge === 0) {
      x = -hw;
      z = (this.rng() * 2 - 1) * hd;
    } else if (edge === 1) {
      x = hw;
      z = (this.rng() * 2 - 1) * hd;
    } else if (edge === 2) {
      x = (this.rng() * 2 - 1) * hw;
      z = -hd;
    } else {
      x = (this.rng() * 2 - 1) * hw;
      z = hd;
    }
    // Keep away from player spawn
    const dx = x - playerPos.x;
    const dz = z - playerPos.z;
    if (dx * dx + dz * dz < 16) {
      x = THREE.MathUtils.clamp(x + Math.sign(dx || 1) * 6, -hw, hw);
      z = THREE.MathUtils.clamp(z + Math.sign(dz || 1) * 6, -hd, hd);
    }

    /**
     * Difficulty comes only from discrete form tiers after boss milestones.
     * No per-wave HP creep — that stacked with form multipliers and outran
     * the player's retrofit curve.
     */
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
    // Spawn anticipation: longer telegraph on non-stress so squad entries read.
    enemy.telegraphTimer = this.stressMode ? 0.2 : 0.55;
    this.enemies.push(enemy);
    this.scene.add(enemy.group);
    this.spawnedThisWave += 1;
    if (kind === 'boss') this.bossRef = enemy;
  }
}
