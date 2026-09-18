import * as THREE from 'three';
import type { Enemy, EnemyKind } from '../entities/Enemy';
import type { Player } from '../entities/Player';
import type { ProjectilePool } from '../entities/Projectile';
import type { ArenaHazardSystem } from './ArenaHazardSystem';
import type { WaveDirector } from './WaveDirector';
import {
  bossPhaseForRatio,
  createBossDirectorState,
  getBossDef,
  getBossPhaseById,
  type BossDirectorState,
  type BossId,
  type BossPhaseDef,
} from './BossDefinitions';

export type BossDirectorDeps = {
  scene: THREE.Scene;
  waves: WaveDirector;
  projectiles: ProjectilePool;
  player: Player;
  hazards: ArenaHazardSystem;
  rng: () => number;
  onPhaseChange: (bossId: BossId, phase: BossPhaseDef, boss: Enemy) => void;
  onBossMessage: (text: string) => void;
};

const BEAM_LENGTH = 9;
const BEAM_HALF_WIDTH = 0.55;

export class BossDirector {
  state: BossDirectorState = createBossDirectorState();
  private lastBossRef: Enemy | null = null;
  /** Visual beam handles for orbital warden (telegraphed rotating lines). */
  private beamVisuals: THREE.Mesh[] = [];
  private beamGeo: THREE.PlaneGeometry | null = null;
  private beamMat: THREE.MeshBasicMaterial | null = null;
  private beamWarn = 0;

  constructor(private readonly deps: BossDirectorDeps) {}

  reset(): void {
    this.clearBeams();
    this.state = createBossDirectorState();
    this.lastBossRef = null;
  }

  private clearBeams(): void {
    for (const m of this.beamVisuals) {
      m.parent?.remove(m);
      m.geometry.dispose();
    }
    this.beamVisuals = [];
    this.beamGeo?.dispose();
    this.beamMat?.dispose();
    this.beamGeo = null;
    this.beamMat = null;
  }

  private ensureBeamVisuals(scene: THREE.Scene, count: number, color: string): void {
    if (this.beamVisuals.length === count && this.beamMat) {
      this.beamMat.color.set(color);
      return;
    }
    this.clearBeams();
    const len = BEAM_LENGTH;
    this.beamGeo = new THREE.PlaneGeometry(len, BEAM_HALF_WIDTH * 2);
    this.beamMat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    for (let i = 0; i < count; i += 1) {
      const mesh = new THREE.Mesh(this.beamGeo, this.beamMat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.y = 0.12;
      scene.add(mesh);
      this.beamVisuals.push(mesh);
    }
  }

  private syncBeamVisuals(scene: THREE.Scene, boss: Enemy, beams: number, color: string, angle: number): void {
    this.ensureBeamVisuals(scene, beams, color);
    const ox = boss.group.position.x;
    const oz = boss.group.position.z;
    for (let b = 0; b < beams; b += 1) {
      const ang = angle + (b / beams) * Math.PI;
      const mesh = this.beamVisuals[b];
      if (!mesh) continue;
      mesh.position.set(ox + (Math.cos(ang) * BEAM_LENGTH) / 2, 0.12, oz + (Math.sin(ang) * BEAM_LENGTH) / 2);
      mesh.rotation.z = -ang;
      if (this.beamMat) this.beamMat.opacity = this.beamWarn > 0 ? 0.2 : 0.45;
    }
  }

  setBoss(bossId: BossId | null): void {
    this.state.bossId = bossId;
  }

  get shieldActive(): boolean {
    return this.state.shieldActive;
  }

  get arenaShrink(): number {
    return this.state.arenaShrink;
  }

  /** Damage multiplier for the current boss (warden shield). */
  incomingDamageMul(): number {
    if (this.state.bossId === 'orbital_warden' && this.state.shieldActive) return 0.22;
    return 1;
  }

  applyPhaseStats(boss: Enemy): BossPhaseDef {
    const id = this.state.bossId ?? 'titan07';
    const ratio = boss.hp / Math.max(1, boss.maxHp);
    const nextPhase = bossPhaseForRatio(id, ratio);
    const phase = getBossPhaseById(id, nextPhase);
    if (nextPhase !== this.state.phase) {
      this.state.phase = nextPhase;
      this.state.summonTimer = phase.summonEvery * 0.4;
      this.state.ringTimer = 1.4;
      this.state.teleportTimer = phase.teleportEvery ?? 0;
      if (id === 'orbital_warden') {
        // P2 shield until drones die; P3 shield off with dual beams.
        this.state.shieldActive = nextPhase === 2;
        this.state.shieldDrones = nextPhase === 2 ? 3 : 0;
        this.beamWarn = 1.0;
      }
      if (id === 'void_engine') {
        this.state.arenaShrink = phase.arenaShrink ? 0.72 : 1;
        if (phase.arenaShrink) {
          this.deps.hazards.forceSpawn('shock_zone');
        }
      }
      this.deps.onPhaseChange(id, phase, boss);
    }
    boss.bossPhaseColor = phase.color;
    boss.moveSpeedMul = phase.moveSpeedMul;
    boss.fireIntervalMul = phase.fireIntervalMul;
    return phase;
  }

  tick(delta: number, boss: Enemy | null): void {
    const { waves, projectiles, player, hazards, rng } = this.deps;
    if (!boss || !boss.alive) {
      if (this.lastBossRef) {
        this.state.arenaShrink = 1;
        this.lastBossRef = null;
      }
      return;
    }
    if (boss !== this.lastBossRef) {
      const id = this.state.bossId ?? 'titan07';
      this.state = createBossDirectorState();
      this.state.bossId = id;
      this.state.shieldActive = id === 'orbital_warden';
      this.state.shieldDrones = id === 'orbital_warden' ? 2 : 0;
      this.beamWarn = 1.1;
      this.lastBossRef = boss;
    }

    const id = this.state.bossId ?? 'titan07';
    const def = getBossDef(id);
    const phase = this.applyPhaseStats(boss);

    // Summons
    this.state.summonTimer -= delta;
    if (this.state.summonTimer <= 0 && phase.summonCount > 0) {
      this.state.summonTimer = phase.summonEvery;
      const kinds = phase.summonKinds ?? ['chaser'];
      for (let i = 0; i < phase.summonCount; i += 1) {
        const kind = (kinds[Math.floor(rng() * kinds.length)] ?? 'chaser') as EnemyKind;
        waves.forceSpawnNear(boss.group.position, kind);
      }
      if (id === 'orbital_warden' && this.state.shieldActive) {
        // Track shield drones as swarm units near the boss.
        this.state.shieldDrones = Math.min(4, this.state.shieldDrones + phase.summonCount);
      }
    }

    // Count living shield drones for warden expose.
    if (id === 'orbital_warden' && this.state.shieldActive) {
      let drones = 0;
      for (const e of waves.enemies) {
        if (!e.alive) continue;
        if (e.stats.kind !== 'swarm' && e.stats.kind !== 'chaser') continue;
        const dx = e.group.position.x - boss.group.position.x;
        const dz = e.group.position.z - boss.group.position.z;
        if (dx * dx + dz * dz < 25) drones += 1;
      }
      this.state.shieldDrones = drones;
      if (drones === 0 && this.state.phase >= 2) {
        this.state.shieldActive = false;
        this.deps.onBossMessage('WARDEN EXPOSED');
      }
    }

    // Fan / ring fire (also used as radial for void).
    this.state.ringTimer -= delta;
    if (this.state.ringTimer <= 0 && phase.ringEvery > 0) {
      this.state.ringTimer = phase.ringEvery;
      const origin = boss.group.position.clone().setY(0.55);
      const spokes = id === 'void_engine' ? 10 : 12;
      const dmg = boss.stats.projectileDamage * phase.projectileDamageMul * 0.75;
      for (let i = 0; i < spokes; i += 1) {
        const a = this.state.spiralAngle + (i / spokes) * Math.PI * 2;
        const d = new THREE.Vector3(Math.cos(a), 0, Math.sin(a));
        projectiles.spawn(
          origin,
          d,
          boss.stats.projectileSpeed * 0.85,
          dmg,
          'enemy',
          phase.color,
        );
      }
      this.state.spiralAngle += id === 'void_engine' ? 0.5 : 0.35;
    }

    // Rotating beam(s) — orbital warden identity (visual telegraph + short warn window).
    if (def.mechanics.rotatingBeam) {
      const beams = phase.beamCount ?? 1;
      const spin = phase.beamSpin ?? 0.8;
      this.beamWarn = Math.max(0, this.beamWarn - delta);
      this.state.beamAngle += spin * delta;
      this.state.beamTimer = 0.4;
      this.syncBeamVisuals(this.deps.scene, boss, beams, phase.color, this.state.beamAngle);
      // Only deal beam damage after a brief warn flash so it is never silent.
      if (this.beamWarn <= 0) {
        for (let b = 0; b < beams; b += 1) {
          const ang = this.state.beamAngle + (b / beams) * Math.PI;
          this.applyBeamDamage(boss, ang, phase);
        }
      }
    } else {
      this.clearBeams();
    }

    // Teleport — void engine (telegraph flash, then blink).
    if (def.mechanics.teleport && phase.teleportEvery) {
      this.state.teleportTimer -= delta;
      if (this.state.teleportTimer <= phase.teleportEvery * 0.25 && this.state.teleportTimer > 0) {
        boss.telegraphTimer = Math.max(boss.telegraphTimer, 0.2);
      }
      if (this.state.teleportTimer <= 0) {
        this.state.teleportTimer = phase.teleportEvery;
        this.beamWarn = 0; // unused for void
        const hw = 12;
        const hd = 7.5;
        const x = (this.deps.rng() - 0.5) * hw * 1.4;
        const z = (this.deps.rng() - 0.5) * hd * 1.4;
        boss.group.position.x = THREE.MathUtils.clamp(x, -hw, hw);
        boss.group.position.z = THREE.MathUtils.clamp(z, -hd, hd);
        projectiles.spawn(
          boss.group.position.clone().setY(0.55),
          new THREE.Vector3(
            player.group.position.x - boss.group.position.x,
            0,
            player.group.position.z - boss.group.position.z,
          ).normalize(),
          boss.stats.projectileSpeed * 1.2,
          boss.stats.projectileDamage * phase.projectileDamageMul,
          'enemy',
          phase.color,
        );
      }
    }

    // Arena shrink upkeep for void P2/P3.
    if (def.mechanics.arenaShrink) {
      this.state.arenaShrink = phase.arenaShrink ? 0.72 : 1;
    } else {
      this.state.arenaShrink = 1;
    }

    // Keep hazards scheduled pressure during warden/void late phases.
    if (id === 'void_engine' && this.state.phase >= 2 && rng() < delta * 0.05) {
      hazards.forceSpawn(rng() < 0.5 ? 'shock_zone' : 'laser_gate');
    }
  }

  private applyBeamDamage(boss: Enemy, angle: number, phase: BossPhaseDef): void {
    const { player } = this.deps;
    const ox = boss.group.position.x;
    const oz = boss.group.position.z;
    const dx = Math.cos(angle) * BEAM_LENGTH;
    const dz = Math.sin(angle) * BEAM_LENGTH;
    // Distance from player to beam segment.
    const px = player.group.position.x - ox;
    const pz = player.group.position.z - oz;
    const t = THREE.MathUtils.clamp((px * dx + pz * dz) / (BEAM_LENGTH * BEAM_LENGTH), 0, 1);
    const cx = ox + dx * t;
    const cz = oz + dz * t;
    const dist = Math.hypot(player.group.position.x - cx, player.group.position.z - cz);
    if (dist <= BEAM_HALF_WIDTH + 0.45) {
      const dmg = 14 * phase.projectileDamageMul;
      const hurt = player.takeDamage(dmg);
      if (hurt.hit) {
        this.deps.onBossMessage('BEAM HIT');
      }
    }
  }

  snapshot(): {
    bossId: BossId | null;
    phase: number;
    shieldActive: boolean;
    shieldDrones: number;
    arenaShrink: number;
    beamAngle: number;
  } {
    return {
      bossId: this.state.bossId,
      phase: this.state.phase,
      shieldActive: this.state.shieldActive,
      shieldDrones: this.state.shieldDrones,
      arenaShrink: this.state.arenaShrink,
      beamAngle: this.state.beamAngle,
    };
  }
}
