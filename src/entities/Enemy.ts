import * as THREE from 'three';
import { getEnemyAssets } from '../systems/EnemyAssets';

export type EnemyKind =
  | 'chaser'
  | 'ranged'
  | 'elite'
  | 'swarm'
  | 'bomber'
  | 'bulwark'
  | 'sniper'
  | 'disruptor'
  | 'boss';
export type EnemyFormTier = 0 | 1 | 2 | 3;

export type EnemyStats = {
  kind: EnemyKind;
  hp: number;
  speed: number;
  radius: number;
  contactDamage: number;
  projectileDamage: number;
  fireInterval: number;
  projectileSpeed: number;
  score: number;
  color: string;
  emissive: string;
  scale: number;
};

export type PendingExplosion = {
  radius: number;
  damage: number;
  /** Damages other enemies (and the player unless passive debug). */
  friendlyFire: boolean;
};

export const ENEMY_TEMPLATES: Record<EnemyKind, EnemyStats> = {
  chaser: {
    kind: 'chaser',
    hp: 28,
    speed: 3.4,
    radius: 0.48,
    contactDamage: 9,
    projectileDamage: 0,
    fireInterval: 0,
    projectileSpeed: 0,
    score: 100,
    color: '#ef4444',
    emissive: '#7f1d1d',
    scale: 1,
  },
  ranged: {
    kind: 'ranged',
    hp: 22,
    speed: 2.1,
    radius: 0.45,
    contactDamage: 6,
    projectileDamage: 10,
    fireInterval: 1.45,
    projectileSpeed: 11,
    score: 150,
    color: '#a78bfa',
    emissive: '#4c1d95',
    scale: 1,
  },
  swarm: {
    kind: 'swarm',
    hp: 10,
    speed: 4.2,
    radius: 0.28,
    contactDamage: 4,
    projectileDamage: 0,
    fireInterval: 0,
    projectileSpeed: 0,
    score: 40,
    color: '#f43f5e',
    emissive: '#9f1239',
    scale: 0.72,
  },
  elite: {
    kind: 'elite',
    hp: 90,
    speed: 2.8,
    radius: 0.62,
    contactDamage: 14,
    projectileDamage: 14,
    fireInterval: 1.1,
    projectileSpeed: 13,
    score: 400,
    color: '#f59e0b',
    emissive: '#92400e',
    scale: 1.2,
  },
  bomber: {
    kind: 'bomber',
    hp: 34,
    speed: 2.6,
    radius: 0.5,
    contactDamage: 6,
    projectileDamage: 0,
    fireInterval: 0,
    projectileSpeed: 0,
    score: 220,
    color: '#fb923c',
    emissive: '#c2410c',
    scale: 1.05,
  },
  bulwark: {
    kind: 'bulwark',
    hp: 120,
    speed: 1.35,
    radius: 0.78,
    contactDamage: 12,
    projectileDamage: 0,
    fireInterval: 0,
    projectileSpeed: 0,
    score: 320,
    color: '#64748b',
    emissive: '#334155',
    scale: 1.25,
  },
  sniper: {
    kind: 'sniper',
    hp: 26,
    speed: 1.6,
    radius: 0.42,
    contactDamage: 5,
    projectileDamage: 22,
    fireInterval: 2.6,
    projectileSpeed: 22,
    score: 280,
    color: '#22d3ee',
    emissive: '#0e7490',
    scale: 0.95,
  },
  disruptor: {
    kind: 'disruptor',
    hp: 48,
    speed: 2.0,
    radius: 0.52,
    contactDamage: 7,
    projectileDamage: 8,
    fireInterval: 1.8,
    projectileSpeed: 9,
    score: 300,
    color: '#c084fc',
    emissive: '#6b21a8',
    scale: 1.0,
  },
  boss: {
    kind: 'boss',
    hp: 720,
    speed: 1.7,
    radius: 1.15,
    contactDamage: 20,
    projectileDamage: 16,
    fireInterval: 0.7,
    projectileSpeed: 12,
    score: 2500,
    color: '#f43f5e',
    emissive: '#881337',
    scale: 1.0,
  },
};

/**
 * Logic-only enemy. Chaser/ranged/elite draw via EnemyBatchRenderer (instanced).
 * Boss builds a unique multi-part visual on demand.
 */
export class Enemy {
  readonly group = new THREE.Group();
  readonly velocity = new THREE.Vector3();
  readonly radius: number;
  /** Stable per-enemy value in [0,1) — used to break degenerate overlaps. */
  readonly phase: number;
  hp: number;
  maxHp: number;
  alive = true;
  fireTimer = 0;
  lungeTimer = 0;
  telegraphTimer = 0;
  wantShoot = false;
  hitFlashTimer = 0;
  /** Brief AI freeze after contact knockback so the shove reads as a real stagger. */
  staggerTimer = 0;
  /** Boss phase multipliers — owned by Game/BossPhases, applied in update. */
  moveSpeedMul = 1;
  fireIntervalMul = 1;
  /** Visual/stat form unlocked by wave progression. */
  readonly formTier: EnemyFormTier;
  /** Titan phase emissive tint; null keeps template color. */
  bossPhaseColor: string | null = null;
  /** Bomber fuse countdown; <0 = not armed. */
  fuseTimer = -1;
  /** Set when this unit should explode this frame (fuse or death). */
  pendingExplosion: PendingExplosion | null = null;
  /** Disruptor pulse request for Game soft-control application. */
  wantDisruptPulse = false;
  /** Sniper laser lock remaining (readable telegraph). */
  lockTimer = 0;

  private bossVisual: THREE.Group | null = null;
  private bossRings: THREE.Mesh[] = [];
  private bossCore: THREE.Mesh | null = null;
  private chargeScale = 1;
  private disruptCycle = 2.2;

  constructor(
    readonly stats: EnemyStats,
    position: THREE.Vector3,
    private readonly seedPhase: number,
    formTier: EnemyFormTier = 0,
  ) {
    this.formTier = formTier;
    this.hp = stats.hp;
    this.maxHp = stats.hp;
    this.radius = stats.radius * (stats.kind === 'boss' ? 1 : stats.scale);
    this.phase = seedPhase % 1;
    this.group.position.copy(position);
    this.fireTimer = stats.fireInterval * 0.4 + seedPhase * 0.3;
  }

  hideLegacyVisual(): void {
    // Batch path owns drawing for non-boss kinds.
    if (this.bossVisual) this.bossVisual.visible = false;
  }

  ensureBossVisual(scene: THREE.Scene): void {
    if (this.bossVisual || this.stats.kind !== 'boss') return;
    const assets = getEnemyAssets('boss');
    const g = new THREE.Group();
    const shell = new THREE.Mesh(assets.shellGeo, assets.shellMat);
    const glow = new THREE.Mesh(assets.glowGeo, assets.glowMat);
    shell.castShadow = true;
    glow.castShadow = false;
    g.add(shell, glow);

    const ringA = new THREE.Mesh(
      new THREE.TorusGeometry(1.05, 0.06, 6, 28),
      assets.shellMat,
    );
    ringA.rotation.x = Math.PI / 2;
    const ringB = new THREE.Mesh(
      new THREE.TorusGeometry(0.85, 0.05, 6, 24),
      assets.glowMat,
    );
    ringB.rotation.x = Math.PI / 2.4;
    g.add(ringA, ringB);
    this.bossRings = [ringA, ringB];
    this.bossCore = glow;

    // Cannon pods
    for (let i = 0; i < 4; i += 1) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const pod = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 0.55), assets.shellMat);
      pod.position.set(Math.cos(a) * 1.0, 0.7, Math.sin(a) * 1.0);
      pod.lookAt(0, 1.2, 0);
      pod.castShadow = false;
      g.add(pod);
    }
    g.position.y = 0;
    const formScale = 1 + this.formTier * 0.12;
    g.scale.setScalar(formScale);
    this.group.add(g);
    this.bossVisual = g;
    scene.add(this.group);
  }

  syncBossVisual(): void {
    if (!this.bossVisual) return;
    this.bossVisual.visible = this.alive;
    if (this.bossRings[0]) this.bossRings[0].rotation.z += 0.01;
    if (this.bossRings[1]) this.bossRings[1].rotation.z -= 0.014;
    if (this.bossCore) this.bossCore.rotation.y += 0.02;
    if (this.bossPhaseColor && this.bossCore) {
      const mat = this.bossCore.material as THREE.MeshStandardMaterial;
      if (mat?.emissive) mat.emissive.set(this.bossPhaseColor);
    }
  }

  update(
    delta: number,
    elapsed: number,
    playerPos: THREE.Vector3,
    bounds: { halfWidth: number; halfDepth: number },
  ): void {
    if (!this.alive) return;
    this.wantShoot = false;
    this.hitFlashTimer = Math.max(0, this.hitFlashTimer - delta);
    this.telegraphTimer = Math.max(0, this.telegraphTimer - delta);

    if (this.staggerTimer > 0) {
      this.staggerTimer = Math.max(0, this.staggerTimer - delta);
      this.velocity.multiplyScalar(Math.exp(-9 * delta));
      this.group.position.addScaledVector(this.velocity, delta);
      this.group.position.x = THREE.MathUtils.clamp(
        this.group.position.x,
        -bounds.halfWidth + this.radius,
        bounds.halfWidth - this.radius,
      );
      this.group.position.z = THREE.MathUtils.clamp(
        this.group.position.z,
        -bounds.halfDepth + this.radius,
        bounds.halfDepth - this.radius,
      );
      return;
    }

    const toPlayer = new THREE.Vector3(
      playerPos.x - this.group.position.x,
      0,
      playerPos.z - this.group.position.z,
    );
    const dist = toPlayer.length();
    if (dist > 0.001) toPlayer.divideScalar(dist);

    let moveDir = toPlayer.clone();
    let speed = this.stats.speed * this.moveSpeedMul;
    this.wantDisruptPulse = false;

    if (this.stats.kind === 'ranged' || this.stats.kind === 'disruptor') {
      const preferred = this.stats.kind === 'disruptor' ? 5.5 : 6.5;
      if (dist < preferred - 1.2) moveDir.multiplyScalar(-1);
      else if (Math.abs(dist - preferred) < 1.2) {
        moveDir.set(-toPlayer.z, 0, toPlayer.x);
        speed *= 0.7;
      }
    } else if (this.stats.kind === 'sniper') {
      const preferred = 10.5;
      if (dist < preferred - 2) moveDir.multiplyScalar(-1);
      else if (dist > preferred + 1.5) moveDir.multiplyScalar(0.85);
      else {
        moveDir.set(-toPlayer.z, 0, toPlayer.x).multiplyScalar(0.55);
        speed *= 0.45;
      }
    } else if (this.stats.kind === 'boss') {
      const preferred = 5;
      if (dist < preferred - 1.5) moveDir.multiplyScalar(-0.6);
      moveDir.add(new THREE.Vector3(-toPlayer.z, 0, toPlayer.x).multiplyScalar(0.35));
      moveDir.normalize();
    } else if (this.stats.kind === 'chaser') {
      this.lungeTimer = Math.max(0, this.lungeTimer - delta);
      if (this.lungeTimer <= 0 && this.telegraphTimer <= 0 && dist < 4.5) {
        this.telegraphTimer = 0.35;
      }
      if (this.telegraphTimer > 0 && this.telegraphTimer < 0.05) {
        this.lungeTimer = 0.35;
        this.telegraphTimer = 0;
      }
      if (this.lungeTimer > 0) speed = this.stats.speed * 2.4;
    } else if (this.stats.kind === 'swarm') {
      // Lightweight flood: pure chase, no lunge bookkeeping.
      speed *= 1 + Math.sin(elapsed * 6 + this.seedPhase * 9) * 0.08;
    } else if (this.stats.kind === 'bulwark') {
      // Slow advance; faces the player for frontal plate.
      speed *= 0.95;
    } else if (this.stats.kind === 'bomber') {
      if (dist < 2.9 && this.fuseTimer < 0) {
        this.fuseTimer = 1.2;
      }
      if (this.fuseTimer >= 0) {
        this.fuseTimer -= delta;
        this.telegraphTimer = 0.08;
        speed *= 0.35;
        if (this.fuseTimer <= 0) {
          this.alive = false;
          this.group.visible = false;
          this.pendingExplosion = { radius: 3.3, damage: 24, friendlyFire: true };
        }
      }
    } else if (this.stats.kind === 'elite') {
      if (dist < 3) moveDir.multiplyScalar(0.4);
    }

    this.velocity.lerp(moveDir.multiplyScalar(speed), 1 - Math.exp(-6 * delta));
    this.group.position.addScaledVector(this.velocity, delta);
    this.group.position.x = THREE.MathUtils.clamp(
      this.group.position.x,
      -bounds.halfWidth + this.radius,
      bounds.halfWidth - this.radius,
    );
    this.group.position.z = THREE.MathUtils.clamp(
      this.group.position.z,
      -bounds.halfDepth + this.radius,
      bounds.halfDepth - this.radius,
    );
    this.group.rotation.y = Math.atan2(toPlayer.x, toPlayer.z);

    if (
      this.stats.kind === 'ranged' ||
      this.stats.kind === 'boss' ||
      this.stats.kind === 'sniper' ||
      this.stats.kind === 'disruptor'
    ) {
      this.group.position.y = 0.08 + Math.sin(elapsed * 3 + this.seedPhase * 5) * 0.05;
    } else {
      this.group.position.y = Math.abs(Math.sin(elapsed * 8 + this.seedPhase * 3)) * 0.025;
    }

    if (this.stats.kind === 'ranged') {
      this.chargeScale = 0.85 + THREE.MathUtils.clamp(1 - this.fireTimer / this.stats.fireInterval, 0, 1) * 0.55;
    }

    if (this.stats.kind === 'sniper') {
      // Lock window is the last stretch of the fire cycle — never silent.
      if (this.stats.fireInterval > 0) {
        const lockWindow = 0.7;
        this.lockTimer = this.fireTimer > 0 && this.fireTimer < lockWindow ? this.fireTimer : 0;
        if (this.lockTimer > 0) this.telegraphTimer = Math.max(this.telegraphTimer, this.lockTimer);
      }
    }

    if (this.stats.kind === 'disruptor') {
      this.disruptCycle -= delta;
      if (this.disruptCycle <= 0 && dist < 7.5) {
        this.wantDisruptPulse = true;
        this.disruptCycle = 3.4;
        this.telegraphTimer = Math.max(this.telegraphTimer, 0.35);
      }
    }

    if (this.stats.fireInterval > 0 && this.stats.kind !== 'bomber') {
      const interval = Math.max(0.08, this.stats.fireInterval * this.fireIntervalMul);
      this.fireTimer -= delta;
      if (this.fireTimer <= 0) {
        this.fireTimer = interval;
        // Sniper must complete a visible lock before the shot lands.
        if (this.stats.kind === 'sniper' && this.telegraphTimer > 0.05 && this.lockTimer > 0.05) {
          // Defer one tick while lock still visible — keep wantShoot false.
          this.fireTimer = 0.08;
        } else {
          this.wantShoot = true;
        }
      }
    }
  }

  getChargeScale(): number {
    return this.stats.kind === 'ranged' ? this.chargeScale : 1;
  }

  takeDamage(amount: number, fromPos?: THREE.Vector3 | null): boolean {
    if (!this.alive) return false;
    let dmg = amount;
    if (this.stats.kind === 'bulwark' && fromPos) {
      const ax = fromPos.x - this.group.position.x;
      const az = fromPos.z - this.group.position.z;
      const len = Math.hypot(ax, az) || 1;
      const toAttackerX = ax / len;
      const toAttackerZ = az / len;
      const facingX = Math.sin(this.group.rotation.y);
      const facingZ = Math.cos(this.group.rotation.y);
      const dot = facingX * toAttackerX + facingZ * toAttackerZ;
      if (dot > 0.35) dmg *= 0.4;
    }
    this.hp -= dmg;
    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
      this.group.visible = false;
      if (this.stats.kind === 'bomber') {
        // Early kill still detonates — smaller, still friendly-fire capable.
        this.pendingExplosion = {
          radius: this.fuseTimer >= 0 ? 2.8 : 2.2,
          damage: this.fuseTimer >= 0 ? 22 : 16,
          friendlyFire: true,
        };
      }
      return true;
    }
    return false;
  }

  /**
   * Immediate impulse away from the player. `Enemy.update` lerps velocity back
   * toward its steering target, so this decays into a ~0.3s shove instead of a
   * permanent speed change.
   */
  knockback(dirX: number, dirZ: number, strength: number, stagger = 0): void {
    if (!this.alive) return;
    const len = Math.hypot(dirX, dirZ) || 1;
    this.velocity.set((dirX / len) * strength, 0, (dirZ / len) * strength);
    if (stagger > 0) this.staggerTimer = Math.max(this.staggerTimer, stagger);
  }

  hitFlash(): void {
    this.hitFlashTimer = 0.08;
  }

  dispose(): void {
    if (this.bossVisual) {
      this.group.remove(this.bossVisual);
      this.bossVisual.traverse((obj) => {
        if (obj instanceof THREE.Mesh) obj.geometry.dispose();
      });
      this.bossVisual = null;
    }
  }
}
