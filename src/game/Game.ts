import * as THREE from 'three';
import { InputController, type InputFrame } from '../core/InputController';
import { Loop } from '../core/Loop';
import { createRenderBackend, initRenderBackend, resizeBackend, type RenderBackend } from '../core/RenderBackend';
import { Cover } from '../entities/Cover';
import { Pickup, type PickupKind } from '../entities/Pickup';
import { Player, DEFAULT_PLAYER_STATS, type ArenaBounds } from '../entities/Player';
import type { Enemy } from '../entities/Enemy';
import { ProjectilePool } from '../entities/Projectile';
import { AudioSystem } from '../systems/AudioSystem';
import { CameraRig } from '../systems/CameraRig';
import { GameFeel } from '../systems/GameFeel';
import { GroundDecals } from '../systems/GroundDecals';
import { Hud } from '../systems/Hud';
import { PostFx } from '../systems/PostFx';
import { VfxSystem } from '../systems/VfxSystem';
import { WorldFx } from '../systems/WorldFx';
import { WaveDirector } from '../systems/WaveDirector';
import { DebugTools, createDebugFlags, type DebugFlags, type DebugTuning } from '../systems/DebugTools';
import { EnemyBatchRenderer } from '../systems/EnemyBatchRenderer';
import { disposeEnemyAssets } from '../systems/EnemyAssets';
import {
  getUpgrade,
  rollUpgradeOffers,
  UPGRADE_POOL,
  type UpgradeId,
  type UpgradeOffer,
} from '../systems/UpgradePool';
import { enemyFormTierForWave } from '../systems/EnemyAssets';
import { createSeededRandom } from '../utils/random';
import { WEAPON_DEFS, weaponAt, type WeaponId } from '../combat/Weapons';
import { createCombatModifiers, modifierIds, resetCombatModifiers, type CombatModifiers } from '../combat/CombatModifiers';
import { createCombatBuild, resetCombatBuild, resolveWeaponStats } from '../combat/CombatBuild';
import { CombatSystem } from '../combat/CombatSystem';
import {
  advanceBossPhase,
  createBossRuntime,
  getBossPhase,
  type BossRuntime,
} from '../systems/BossPhases';
import { buildDiagnostics } from '../telemetry/buildDiagnostics';
import { bossPhaseName, t, toggleLocale, upgradeText, weaponName, weaponShort } from '../i18n';

const ARENA: ArenaBounds = {
  halfWidth: 14,
  halfDepth: 9,
};

const PLAYER_RADIUS = 0.55;

/** Contact knockback impulse (m/s) — heavier kinds resist more. */
const CONTACT_KNOCKBACK: Record<string, number> = {
  chaser: 12,
  ranged: 10,
  elite: 7,
  boss: 2.8,
};

/** How long an enemy freezes AI after a contact shove (reads as stagger). */
const CONTACT_STAGGER = 0.24;

/** Spatial-hash cell size for enemy-enemy separation (covers 2× largest common radius). */
const ENEMY_SEP_CELL = 2.4;

const BASE_FOV = 48;

export class Game {
  private readonly backend: RenderBackend;
  private readonly renderer: THREE.WebGLRenderer | import('three/webgpu').WebGPURenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(BASE_FOV, 1, 0.1, 140);
  private readonly input: InputController;
  private readonly player = new Player({ ...DEFAULT_PLAYER_STATS });
  private readonly pickups: Pickup[] = [];
  private readonly covers: Cover[] = [];
  private readonly projectiles: ProjectilePool;
  private readonly waves: WaveDirector;
  private readonly audio = new AudioSystem();
  private readonly hud = new Hud();
  private readonly cameraRig = new CameraRig(this.camera);
  private readonly vfx: VfxSystem;
  private readonly worldFx: WorldFx;
  private readonly decals: GroundDecals;
  private readonly feel: GameFeel;
  private hemiLight: THREE.HemisphereLight | null = null;
  private fillLight: THREE.DirectionalLight | null = null;
  private readonly enemyBatch: EnemyBatchRenderer;
  private postFx: PostFx | null = null;
  private readonly loop = new Loop(
    (delta, elapsed) => this.update(delta, elapsed),
    () => this.render(),
  );

  private readonly tuning: DebugTuning = {
    speed: DEFAULT_PLAYER_STATS.moveSpeed,
    dashMultiplier: 1,
    acceleration: 14,
    cameraLag: 0.12,
    exposure: 1.34,
    maxDpr: 2,
  };

  private readonly debugTools: DebugTools;
  private readonly debugFlags: DebugFlags = createDebugFlags();
  private readonly inputFrame: InputFrame = {
    move: new THREE.Vector2(),
    aim: new THREE.Vector2(),
    fireHeld: false,
    dashPressed: false,
    ultPressed: false,
    pausePressed: false,
    restartPressed: false,
    upgradeChoice: -1,
    weaponChoice: -1,
  };

  private readonly tmp = {
    aim: new THREE.Vector2(),
    dir: new THREE.Vector3(),
    shake: new THREE.Vector3(),
    hitPoint: new THREE.Vector3(),
  };

  private frame = 0;
  private score = 0;
  private elapsed = 0;
  private combo = 1;
  private peakCombo = 1;
  private comboTimer = 0;
  private mode: 'play' | 'paused' | 'dead' | 'upgrade' = 'play';
  private rngSeed = 1;
  private rng = createSeededRandom(1);
  private pausedForScreenshot = false;
  private reducedMotion = false;
  private lastWaveShown = 0;
  private lastEnemyFormTier = 0;
  private fpsAccum = 0;
  private fpsFrames = 0;
  private weapon: WeaponId = 'plasma';
  private readonly combatMods: CombatModifiers = createCombatModifiers();
  private readonly combatBuild = createCombatBuild(this.combatMods);
  private combat!: CombatSystem;
  private bossRuntime: BossRuntime = createBossRuntime();
  private lastBossRef: Enemy | null = null;
  private fps = 60;
  private stressMode = false;
  private lowGraphics = false;
  private kills = 0;
  private combatTime = 0;
  private damageDealt = 0;
  private shotsFired = 0;
  private hitsLanded = 0;
  private readonly damageByWeapon: Record<string, number> = {};
  private readonly shotsByWeapon: Record<string, number> = {};
  private readonly frameTimes: number[] = [];
  private lastDeathCause = 'unknown';
  private pickupChain = 0;
  private pickupChainTimer = 0;
  private crosshairEl: HTMLElement | null = null;
  private readonly ndc = new THREE.Vector2();
  private upgradeStacks: Partial<Record<UpgradeId, number>> = {};
  private upgradeOffers: UpgradeOffer[] = [];

  constructor(
    private readonly canvas: HTMLCanvasElement,
    backend?: RenderBackend,
  ) {
    this.backend = backend ?? createRenderBackend(canvas);
    this.renderer = this.backend.renderer;
    this.renderer.toneMappingExposure = this.tuning.exposure;
    this.feel = new GameFeel(BASE_FOV, this.camera);
    this.postFx =
      this.backend.kind === 'webgl2'
        ? new PostFx(this.backend.renderer as THREE.WebGLRenderer, this.scene, this.camera)
        : null;
    this.crosshairEl = document.querySelector('#crosshair');

    this.vfx = new VfxSystem(this.scene, () => this.rng(), 4000);
    this.worldFx = new WorldFx(this.scene, () => this.rng(), ARENA);
    this.decals = new GroundDecals(this.scene, 48);
    this.enemyBatch = new EnemyBatchRenderer(this.scene, 520);
    this.projectiles = new ProjectilePool(this.scene, 2500);
    this.waves = new WaveDirector(this.scene, ARENA, () => this.rng());
    this.combat = new CombatSystem({
      player: this.player,
      projectiles: this.projectiles,
      waves: this.waves,
      vfx: this.vfx,
      audio: this.audio,
      hud: this.hud,
      feel: this.feel,
      worldFx: this.worldFx,
      decals: this.decals,
      combatMods: this.combatMods,
      getBuild: () => this.combatBuild,
      getWeapon: () => this.weapon,
      rng: () => this.rng(),
      onEnemyKilled: (enemy, source) => this.onEnemyKilled(enemy, source),
      onPlayerProjectileHit: () => {
        this.lastDeathCause = 'projectile';
        this.onPlayerHurt();
      },
      onDamageDealt: (amount, weapon) => this.recordDamage(amount, weapon),
      onShot: (count, weapon) => this.recordShots(count, weapon),
      getPlayerDamageMul: () => (this.debugFlags.oneShot ? 20 : 1),
      getEnemyOneHp: () => this.debugFlags.enemyOneHp,
      getEnemyPassive: () => this.debugFlags.enemyPassive,
    });

    const stick = this.getElement('#touch-stick');
    const knob = this.getElement('#touch-knob');
    const dashButton = this.getElement('#dash-button');
    const ultButton = this.getElement('#ult-button');
    this.input = new InputController(canvas, stick, knob, dashButton, ultButton, this.camera);

    this.debugTools = new DebugTools(
      this.tuning,
      this.debugFlags,
      {
        fullHeal: () => {
          this.player.hp = this.player.stats.maxHp;
          this.player.shield = this.player.stats.maxShield;
          this.player.alive = true;
          this.player.group.visible = true;
          if (this.mode === 'dead') this.mode = 'play';
        },
        clearHeat: () => {
          this.player.heat = 0;
          this.player.overheated = false;
        },
        fillUlt: () => {
          this.player.ultCharge = 100;
        },
        grantAllUpgrades: () => {
          for (const def of UPGRADE_POOL) {
            const stacks = this.upgradeStacks[def.id] ?? 0;
            const need = def.maxStacks - stacks;
            for (let i = 0; i < need; i += 1) {
              def.apply({
                stats: this.player.stats,
                build: this.combatBuild,
                mods: this.combatMods,
              });
              this.upgradeStacks[def.id] = (this.upgradeStacks[def.id] ?? 0) + 1;
            }
          }
          this.syncWeaponStats();
          this.player.overheatEmp = this.combatMods.overheatEmp;
          this.player.hp = this.player.stats.maxHp;
          this.player.shield = this.player.stats.maxShield;
          this.refreshPlayerForm();
        },
        killAllEnemies: () => {
          for (const enemy of [...this.waves.enemies]) {
            if (!enemy.alive) continue;
            enemy.takeDamage(999999);
            this.onEnemyKilled(enemy);
          }
        },
        skipWave: () => {
          for (const enemy of [...this.waves.enemies]) {
            if (!enemy.alive) continue;
            enemy.takeDamage(999999);
            this.onEnemyKilled(enemy);
          }
          this.waves.debugClearWave();
        },
        openUpgrade: () => {
          this.lastWaveShown = Math.max(0, this.waves.wave - 1);
          this.mode = 'play';
          this.openUpgrade();
        },
        restart: () => this.restart(),
        setStress: (on) => this.setStressMode(on),
        setLowGraphics: (on) => {
          this.setLowGraphics(on);
          const gfx = document.querySelector<HTMLInputElement>('#gfx-toggle');
          if (gfx) gfx.checked = on;
        },
      },
      () => {
        this.renderer.toneMappingExposure = this.tuning.exposure;
        this.syncPostSize();
      },
    );

    this.hud.setOverlayHandlers(
      () => this.handlePrimaryAction(),
      () => this.restart(),
    );
    this.hud.setStressHandler((on) => this.setStressMode(on));
    this.hud.setGraphicsHandler((low) => this.setLowGraphics(low));
    this.hud.setUpgradePickHandler((index) => this.applyUpgrade(index));
    this.hud.setLocaleToggleHandler(() => toggleLocale());
    this.hud.setWeaponPickHandler((index) => {
      if (this.mode === 'play') this.setWeapon(weaponAt(index));
    });

    this.createScene();
    this.installTestHooks();
    this.restart();
    this.publishDiagnostics();
  }

  start(): void {
    // WebGPU backend needs an async device init before first frame is useful.
    void initRenderBackend(this.backend).catch(() => {
      // Stay on the selected backend; first frames may no-op until ready.
    });
    this.loop.start();
  }

  dispose(): void {
    this.loop.stop();
    this.input.dispose();
    this.audio.dispose();
    this.debugTools.dispose();
    this.projectiles.dispose();
    this.waves.reset();
    for (const pickup of this.pickups) pickup.dispose();
    for (const cover of this.covers) cover.dispose();
    this.player.dispose();
    this.vfx.dispose();
    this.worldFx.dispose();
    this.decals.dispose();
    this.enemyBatch.dispose();
    disposeEnemyAssets();
    this.postFx?.dispose();
    this.renderer.dispose();
    window.__THREE_GAME_DIAGNOSTICS__ = undefined;
    window.__THREE_GAME_TEST_HOOKS__ = undefined;
  }

  private update(delta: number, elapsed: number): void {
    this.frame += 1;
    this.frameTimes.push(delta);
    if (this.frameTimes.length > 240) this.frameTimes.shift();
    this.fpsAccum += delta;
    this.fpsFrames += 1;
    if (this.fpsAccum >= 0.4) {
      this.fps = this.fpsFrames / this.fpsAccum;
      this.fpsAccum = 0;
      this.fpsFrames = 0;
    }

    if (this.pausedForScreenshot) {
      this.publishDiagnostics();
      return;
    }

    this.syncPostSize();
    const animDelta = this.reducedMotion ? 0 : delta;
    const animElapsed = this.reducedMotion ? 0 : elapsed;

    this.input.read(this.inputFrame);
    if (this.inputFrame.restartPressed) {
      this.restart();
      return;
    }
    if (this.mode === 'upgrade') {
      if (this.debugFlags.autoPickUpgrade && this.upgradeOffers.length > 0) {
        this.applyUpgrade(0);
        this.inputFrame.weaponChoice = -1;
      } else if (this.inputFrame.upgradeChoice >= 0) {
        this.applyUpgrade(this.inputFrame.upgradeChoice);
        // Digit 1/2/3 also queues a weapon swap; drop it so resume doesn't switch guns.
        this.inputFrame.weaponChoice = -1;
      }
    } else if (this.mode === 'play' && this.inputFrame.weaponChoice >= 0) {
      this.setWeapon(weaponAt(this.inputFrame.weaponChoice));
    } else if (this.inputFrame.pausePressed && this.mode !== 'dead') {
      this.mode = this.mode === 'paused' ? 'play' : 'paused';
    }

    const worldDelta = this.mode === 'play' ? this.feel.consumeWorldDelta(delta) : 0;

    if (this.mode === 'play' && worldDelta > 0) {
      this.elapsed += worldDelta;
      this.simulate(worldDelta, animElapsed);
    }

    this.input.computeAim(this.player.group.position, this.tmp.aim);
    if (this.mode === 'play') {
      const shake = this.vfx.getShakeOffset(elapsed, this.tmp.shake);
      this.cameraRig.update(delta, this.player.group.position, this.tuning.cameraLag, shake);
    } else {
      this.cameraRig.update(
        delta,
        this.player.group.position,
        this.tuning.cameraLag,
        this.tmp.shake.set(0, 0, 0),
      );
    }

    this.feel.update(delta);
    this.vfx.update(animDelta);
    this.worldFx.update(animDelta, elapsed);
    this.decals.update(animDelta);
    this.applyWaveLighting(animDelta);
    this.updateCrosshair();
    this.applyHurtFlash();
    this.pushHud(delta);
    this.publishDiagnostics();
  }

  private simulate(delta: number, elapsed: number): void {
    this.combatTime += delta;
    this.input.computeAim(this.player.group.position, this.tmp.aim);

    this.player.overheatEmp = this.combatMods.overheatEmp;
    const dashHeld = this.inputFrame.dashPressed;
    const beforeOverheat = this.player.overheated;
    const dashTimerBefore = this.player.dashTimer;
    const fire = this.player.update(
      delta,
      elapsed,
      this.inputFrame.move,
      this.tmp.aim,
      this.inputFrame.fireHeld,
      dashHeld,
      ARENA,
    );
    const dashStarted = this.player.dashTimer > 0 && dashTimerBefore <= 0;

    // —— Debug cheats that rewrite player state after update ——
    if (this.debugFlags.godMode) {
      this.player.alive = true;
      this.player.group.visible = true;
      this.player.hp = this.player.stats.maxHp;
      this.player.shield = this.player.stats.maxShield;
      this.player.invulnTimer = Math.max(this.player.invulnTimer, 0.35);
      if (this.mode === 'dead') this.mode = 'play';
    }
    if (this.debugFlags.noOverheat) {
      this.player.heat = 0;
      this.player.overheated = false;
      this.player.overheatPulse = false;
    }
    if (this.debugFlags.infiniteDash) this.player.dashCooldown = 0;
    if (this.debugFlags.infiniteUlt) this.player.ultCharge = 100;

    if (dashHeld && this.player.dashCooldown > DEFAULT_PLAYER_STATS.dashCooldown - 0.05) {
      this.audio.dash();
      this.vfx.spawnBurst(this.player.group.position.clone().setY(0.4), '#22d3ee', 8, 4);
      this.feel.triggerFovPunch(2);
    }

    if (dashStarted && this.combatMods.dashDetonation) {
      this.combat.queueDashBlast(this.player.group.position);
    }

    if (this.player.overheatPulse) {
      this.combat.castOverheatEmp();
    } else if (this.player.overheated && !beforeOverheat) {
      this.audio.overheat();
    }

    if (fire.fired) {
      this.combat.firePlayerWeapon();
    }

    this.combat.tickDashBlasts(delta);

    // Heat steam
    if (this.player.getHeatRatio() > 0.45 && this.rng() < 0.35) {
      this.vfx.spawnBurst(
        this.player.group.position.clone().setY(0.7),
        this.player.overheated ? '#ffb020' : '#94a3b8',
        1,
        1.8,
      );
    }

    if (this.inputFrame.ultPressed && this.player.tryUltimate()) {
      this.castUltimate();
    }

    for (const cover of this.covers) {
      cover.resolveEntity(this.player.group.position, 0.55);
    }

    this.waves.update(delta, this.player.group.position, elapsed);
    this.waves.freezeEnemies = this.debugFlags.freezeEnemies;
    this.enemyBatch.sync(this.waves.enemies);
    const state = this.waves.getState();
    if (state.wave !== this.lastWaveShown) {
      const prev = this.lastWaveShown;
      // Commit the wave first — otherwise openUpgrade's early return left
      // lastWaveShown stale and re-opened the picker every resume frame.
      this.lastWaveShown = state.wave;
      const boss = state.wave % 5 === 0;
      this.hud.showWaveBanner(boss ? t().bossBanner(state.wave) : t().waveBanner(state.wave), boss);
      if (boss) this.audio.boss();
      else this.audio.wave();
      // Form tier steps only after boss milestones (waves 6 / 11 / 16).
      const formTier = enemyFormTierForWave(state.wave);
      if (formTier > this.lastEnemyFormTier) {
        this.lastEnemyFormTier = formTier;
        this.hud.pushKillFeed(t().hostilesEvolved(formTier), 'boss');
        window.setTimeout(() => {
          this.hud.showWaveBanner(t().hostilesEvolved(formTier), true);
        }, 900);
      }
      // Wave clear beat: slow-mo + ground pulse when advancing past first wave
      if (prev > 0) {
        this.feel.triggerSlowmo(0.45, 0.4);
        this.feel.triggerFovPunch(3);
        this.worldFx.triggerPulse(this.player.group.position, '#22d3ee', 8);
        this.vfx.spawnShockwave(this.player.group.position, '#7ae7ff', 5);
      }
      if (!this.stressMode && prev >= 1) {
        this.openUpgrade();
        return;
      }
    }
    this.separateEnemies();

    for (const enemy of this.waves.enemies) {
      if (!enemy.alive) continue;

      const dx = enemy.group.position.x - this.player.group.position.x;
      const dz = enemy.group.position.z - this.player.group.position.z;
      const rr = enemy.radius + PLAYER_RADIUS;
      const distSq = dx * dx + dz * dz;
      if (distSq < rr * rr && !this.debugFlags.enemyPassive) {
        const hurt = this.player.takeDamage(enemy.stats.contactDamage);
        if (hurt.hit) {
          this.lastDeathCause = enemy.stats.kind;
          this.onPlayerHurt();
          if (hurt.shieldBroke) this.combat.maybeShieldNova();
          // Shove the attacker back out so it cannot stay glued to the hull.
          const dist = Math.max(Math.sqrt(distSq), 0.0001);
          const strength = CONTACT_KNOCKBACK[enemy.stats.kind] ?? 8;
          enemy.knockback(dx / dist, dz / dist, strength, CONTACT_STAGGER);
          this.vfx.spawnBurst(
            new THREE.Vector3(
              (enemy.group.position.x + this.player.group.position.x) * 0.5,
              0.45,
              (enemy.group.position.z + this.player.group.position.z) * 0.5,
            ),
            '#ff8fa3',
            5,
            4,
          );
        }
        // Soft separation: an enemy that rests inside the player silhouette is
        // hidden under the mech at this camera angle, so its damage reads as
        // coming from nowhere. Keep it on the contact boundary instead.
        if (distSq > 0.000001) {
          const dist = Math.sqrt(distSq);
          const push = (rr - dist) / dist;
          enemy.group.position.x += dx * push;
          enemy.group.position.z += dz * push;
        } else {
          const a = enemy.phase * Math.PI * 2;
          enemy.group.position.x = this.player.group.position.x + Math.cos(a) * rr;
          enemy.group.position.z = this.player.group.position.z + Math.sin(a) * rr;
        }
      }

      for (const cover of this.covers) {
        cover.resolveEntity(enemy.group.position, enemy.radius);
      }

      if (enemy.wantShoot && enemy.stats.fireInterval > 0 && !this.debugFlags.enemyPassive) {
        const origin = enemy.group.position.clone().setY(0.55);
        const dir = new THREE.Vector3(
          this.player.group.position.x - origin.x,
          0,
          this.player.group.position.z - origin.z,
        ).normalize();
        if (enemy.stats.kind === 'boss') {
          this.updateBossPhase(enemy);
          const phase = getBossPhase(this.bossRuntime.phase);
          const count = phase.fanCount;
          const half = ((count - 1) / 2) * phase.fanSpread;
          for (let i = 0; i < count; i += 1) {
            const spread = -half + i * phase.fanSpread;
            const d = dir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), spread);
            this.projectiles.spawn(
              origin,
              d,
              enemy.stats.projectileSpeed * (phase.id === 3 ? 1.12 : 1),
              enemy.stats.projectileDamage * phase.projectileDamageMul,
              'enemy',
              phase.color,
            );
          }
        } else {
          this.projectiles.spawn(
            origin,
            dir,
            enemy.stats.projectileSpeed,
            enemy.stats.projectileDamage,
            'enemy',
            '#c4b5fd',
          );
        }
      }
    }

    this.tickBossLogic(delta);
    this.projectiles.update(delta);
    this.combat.resolveProjectileHits(ARENA, this.covers);

    if (this.comboTimer > 0) {
      this.comboTimer -= delta;
      if (this.comboTimer <= 0) this.combo = 1;
    }
    if (this.pickupChainTimer > 0) {
      this.pickupChainTimer -= delta;
      if (this.pickupChainTimer <= 0) this.pickupChain = 0;
    }

    for (const pickup of this.pickups) {
      pickup.update(delta, elapsed, this.player.group.position);
      if (!pickup.active) continue;
      const pdx = pickup.group.position.x - this.player.group.position.x;
      const pdz = pickup.group.position.z - this.player.group.position.z;
      if (pdx * pdx + pdz * pdz < 0.7 * 0.7) {
        this.collectPickup(pickup);
      }
    }
  }

  /**
   * Soft-separate overlapping enemies so packs cannot form a single blob
   * (one hitbox + unreadable silhouette + stacked shove pressure).
   * Spatial hash keeps stress-wave counts O(n) instead of O(n²).
   */
  private separateEnemies(): void {
    const enemies = this.waves.enemies;
    let count = 0;
    for (const e of enemies) if (e.alive) count += 1;
    if (count < 2) return;

    const cell = ENEMY_SEP_CELL;
    const grid = new Map<number, number[]>();
    const aliveIdx: number[] = [];
    for (let i = 0; i < enemies.length; i += 1) {
      if (!enemies[i].alive) continue;
      aliveIdx.push(i);
      const p = enemies[i].group.position;
      const key = this.hashCell(Math.floor(p.x / cell), Math.floor(p.z / cell));
      let bucket = grid.get(key);
      if (!bucket) {
        bucket = [];
        grid.set(key, bucket);
      }
      bucket.push(i);
    }

    for (let a = 0; a < aliveIdx.length; a += 1) {
      const ia = aliveIdx[a];
      const ea = enemies[ia];
      const cx0 = Math.floor(ea.group.position.x / cell);
      const cz0 = Math.floor(ea.group.position.z / cell);
      for (let ox = -1; ox <= 1; ox += 1) {
        for (let oz = -1; oz <= 1; oz += 1) {
          const bucket = grid.get(this.hashCell(cx0 + ox, cz0 + oz));
          if (!bucket) continue;
          for (const ib of bucket) {
            if (ib <= ia) continue;
            const eb = enemies[ib];
            if (!eb.alive) continue;
            const rr = ea.radius + eb.radius;
            const dx = eb.group.position.x - ea.group.position.x;
            const dz = eb.group.position.z - ea.group.position.z;
            const distSq = dx * dx + dz * dz;
            if (distSq >= rr * rr) continue;
            if (distSq < 1e-8) {
              const ang = (ea.phase + eb.phase) * Math.PI;
              const half = rr * 0.5;
              const mx = ea.group.position.x;
              const mz = ea.group.position.z;
              ea.group.position.x = mx - Math.cos(ang) * half;
              ea.group.position.z = mz - Math.sin(ang) * half;
              eb.group.position.x = mx + Math.cos(ang) * half;
              eb.group.position.z = mz + Math.sin(ang) * half;
              continue;
            }
            const dist = Math.sqrt(distSq);
            const push = ((rr - dist) / dist) * 0.5;
            ea.group.position.x -= dx * push;
            ea.group.position.z -= dz * push;
            eb.group.position.x += dx * push;
            eb.group.position.z += dz * push;
          }
        }
      }
      ea.group.position.x = THREE.MathUtils.clamp(
        ea.group.position.x,
        -ARENA.halfWidth + ea.radius,
        ARENA.halfWidth - ea.radius,
      );
      ea.group.position.z = THREE.MathUtils.clamp(
        ea.group.position.z,
        -ARENA.halfDepth + ea.radius,
        ARENA.halfDepth - ea.radius,
      );
    }
  }

  private hashCell(cx: number, cz: number): number {
    // Pack two 16-bit-ish cell coords into one number key.
    return (cx + 512) * 1024 + (cz + 512);
  }

  private onEnemyKilled(
    enemy: {
      stats: { score: number; kind: string; color?: string };
      group: THREE.Group;
    },
    source?: { sourceWeapon: string | null; damage: number },
  ): void {
    this.kills += 1;
    this.score += Math.round(enemy.stats.score * this.combo);
    this.combo = Math.min(8, this.combo + 0.15);
    this.peakCombo = Math.max(this.peakCombo, this.combo);
    this.comboTimer = 3.2;
    const kind = enemy.stats.kind as 'chaser' | 'ranged' | 'elite' | 'boss';
    this.player.addUltCharge(
      this.player.stats.ultChargePerKill * (kind === 'boss' ? 12 : kind === 'elite' ? 2.5 : 1),
    );
    this.audio.kill();

    if (this.combatMods.railHeatRefund && source?.sourceWeapon === 'rail') {
      this.player.coolHeat(this.player.stats.maxHeat * 0.2);
    }

    if (this.combatMods.arcChain > 0 && kind !== 'boss') {
      this.combat.spawnArcChains(enemy.group.position, this.combatMods.arcChain);
    }

    const pos = enemy.group.position;
    if (kind === 'boss') this.vfx.killBoss(pos);
    else if (kind === 'elite') this.vfx.killElite(pos);
    else if (kind === 'ranged') this.vfx.killRanged(pos);
    else this.vfx.killChaser(pos);
    this.decals.spawnScorch(pos);
    if (kind === 'elite' || kind === 'boss') {
      this.decals.spawnImpact(pos, '#f59e0b');
      this.worldFx.triggerPulse(pos, kind === 'boss' ? '#f43f5e' : '#f59e0b', 7);
    }
    const gained = Math.round(enemy.stats.score * this.combo);
    this.hud.popScore(gained);

    this.feel.triggerHitstop(kind === 'boss' ? 0.14 : kind === 'elite' ? 0.09 : 0.05);
    this.feel.triggerFovPunch(kind === 'boss' ? 5 : kind === 'elite' ? 2.5 : 1.2);
    if (kind === 'boss') this.feel.triggerSlowmo(0.55, 0.35);

    if (kind === 'boss' || kind === 'elite' || kind === 'ranged') {
      const label = kind === 'boss' ? t().killBoss : kind === 'elite' ? t().killElite : t().killRanged;
      this.hud.pushKillFeed(label, kind);
    } else if (this.kills % 5 === 0) {
      this.hud.pushKillFeed(t().killCount(this.kills), 'chaser');
    }

    if (this.player.ultCharge >= 100 && this.player.ultCharge - this.player.stats.ultChargePerKill < 100) {
      this.hud.pushKillFeed(t().ultReady, 'boss');
    }

    if (kind === 'boss' || kind === 'elite') {
      this.dropPickup(pos, kind === 'boss' ? 'ult' : this.rollPickupKind());
    } else if (this.rng() < 0.12) {
      this.dropPickup(pos, this.rollPickupKind());
    }
  }

  private onPlayerHurt(): void {
    this.combo = 1;
    this.comboTimer = 0;
    this.audio.hurt();
    this.feel.triggerHurtFlash(0.9);
    this.feel.triggerHitstop(0.08);
    this.feel.triggerFovPunch(3);
    this.vfx.addTrauma(0.45);
    this.vfx.spawnBurst(this.player.group.position.clone().setY(0.7), '#ff4d6d', 10, 6);
    if (!this.player.alive) {
      this.mode = 'dead';
      this.audio.death();
      this.vfx.spawnShockwave(this.player.group.position, '#ff4d6d', 10);
      this.feel.triggerHitstop(0.18);
    }
  }

  private recordShots(count: number, weapon: string): void {
    this.shotsFired += count;
    this.shotsByWeapon[weapon] = (this.shotsByWeapon[weapon] ?? 0) + count;
  }

  private recordDamage(amount: number, weapon: string | null): void {
    this.damageDealt += amount;
    this.hitsLanded += 1;
    if (weapon) this.damageByWeapon[weapon] = (this.damageByWeapon[weapon] ?? 0) + amount;
  }

  private frameMsSnapshot(): { p50: number; p95: number; p99: number } {
    if (this.frameTimes.length === 0) return { p50: 16.7, p95: 16.7, p99: 16.7 };
    const sorted = this.frameTimes.map((d) => d * 1000).sort((a, b) => a - b);
    const pick = (p: number) => {
      const idx = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
      return Number(sorted[idx].toFixed(2));
    };
    return { p50: pick(50), p95: pick(95), p99: pick(99) };
  }

  private setWeapon(id: WeaponId): void {
    if (this.weapon === id) return;
    this.weapon = id;
    this.combatBuild.weapon = id;
    this.syncWeaponStats();
    this.player.setWeaponVisual(id);
    const def = WEAPON_DEFS[id];
    const label = weaponName(id);
    this.hud.setActiveWeapon(id);
    this.hud.flashPickup(label, def.color);
    this.hud.pushKillFeed(t().weaponPick(weaponShort(id)), 'ranged');
    this.vfx.spawnBurst(this.player.muzzle, def.color, 6, 4);
    this.audio.pickupChain(1);
    this.publishDiagnostics();
  }

  /** Apply resolved weapon identity onto PlayerStats numeric layer. */
  private syncWeaponStats(): void {
    const resolved = resolveWeaponStats(this.combatBuild, this.weapon);
    this.player.stats.fireInterval = resolved.fireInterval;
    this.player.stats.heatPerShot = resolved.heatPerShot;
    this.player.stats.projectileSpeed = resolved.projectileSpeed;
    this.player.stats.projectileDamage = resolved.damage;
  }

  private updateBossPhase(enemy: Enemy): void {
    const ratio = enemy.hp / enemy.maxHp;
    const result = advanceBossPhase(this.bossRuntime, ratio);
    enemy.bossPhaseColor = result.phase.color;
    if (!result.changed) return;
    const phaseName = bossPhaseName(result.phase.id);
    this.hud.showWaveBanner(t().titanName(phaseName), true);
    this.hud.pushKillFeed(t().bossPhase(result.phase.id, phaseName), 'boss');
    this.feel.triggerHitstop(0.12);
    this.feel.triggerFovPunch(5);
    this.worldFx.triggerPulse(enemy.group.position, result.phase.color, 8);
    this.vfx.spawnBurst(enemy.group.position.clone().setY(0.8), result.phase.color, 22, 8);
  }

  private tickBossLogic(delta: number): void {
    const boss = this.waves.boss;
    if (!boss) {
      this.lastBossRef = null;
      return;
    }
    if (boss !== this.lastBossRef) {
      this.bossRuntime = createBossRuntime();
      this.lastBossRef = boss;
    }
    this.updateBossPhase(boss);
    const phase = getBossPhase(this.bossRuntime.phase);
    boss.bossPhaseColor = phase.color;
    // Phase params drive real combat model — not just VFX density.
    boss.moveSpeedMul = phase.moveSpeedMul;
    boss.fireIntervalMul = phase.fireIntervalMul;

    this.bossRuntime.summonTimer -= delta;
    if (this.bossRuntime.summonTimer <= 0 && phase.summonCount > 0) {
      this.bossRuntime.summonTimer = phase.summonEvery;
      for (let i = 0; i < phase.summonCount; i += 1) {
        this.waves.forceSpawnNear(boss.group.position, 'chaser');
      }
      this.hud.pushKillFeed(t().titanReinforcements, 'boss');
    }

    if (phase.ringEvery > 0) {
      this.bossRuntime.ringTimer -= delta;
      if (this.bossRuntime.ringTimer <= 0) {
        this.bossRuntime.ringTimer = phase.ringEvery;
        const origin = boss.group.position.clone().setY(0.55);
        const spokes = phase.id === 3 ? 12 : 8;
        for (let i = 0; i < spokes; i += 1) {
          const a = this.bossRuntime.spiralAngle + (i / spokes) * Math.PI * 2;
          const d = new THREE.Vector3(Math.cos(a), 0, Math.sin(a));
          this.projectiles.spawn(
            origin,
            d,
            boss.stats.projectileSpeed * 0.85,
            boss.stats.projectileDamage * phase.projectileDamageMul * 0.75,
            'enemy',
            phase.color,
          );
        }
        this.bossRuntime.spiralAngle += 0.35;
        this.vfx.spawnBurst(origin, phase.color, 8, 4);
      }
    }
  }

  private castUltimate(): void {
    this.audio.ult();
    this.hud.flashUlt();
    this.vfx.ultWarning(this.player.group.position);
    this.vfx.spawnBurst(this.player.group.position.clone().setY(0.5), '#a78bfa', 28, 10);
    this.vfx.addTrauma(0.7);
    this.feel.triggerHitstop(0.1);
    this.feel.triggerFovPunch(6);
    const radius = this.player.stats.ultRadius;
    for (const enemy of this.waves.enemies) {
      if (!enemy.alive) continue;
      const dx = enemy.group.position.x - this.player.group.position.x;
      const dz = enemy.group.position.z - this.player.group.position.z;
      if (dx * dx + dz * dz <= radius * radius) {
        enemy.hitFlash();
        const died = enemy.takeDamage(this.player.stats.ultDamage);
        if (died) this.onEnemyKilled(enemy);
      }
    }
    for (const p of this.projectiles.projectiles) {
      if (p.active && p.owner === 'enemy') {
        this.vfx.spawnBurst(p.group.position, '#a78bfa', 3, 4);
        p.deactivate();
      }
    }
  }

  private dropPickup(position: THREE.Vector3, kind: PickupKind): void {
    const pickup = this.pickups.find((p) => !p.active) ?? this.createPickup();
    pickup.spawn(position, kind, this.elapsed);
  }

  private rollPickupKind(): PickupKind {
    const r = this.rng();
    if (r < 0.4) return 'coolant';
    if (r < 0.7) return 'shield';
    if (r < 0.9) return 'heal';
    return 'ult';
  }

  private collectPickup(pickup: Pickup): void {
    pickup.collect();
    this.pickupChainTimer = 1.6;
    this.pickupChain += 1;
    this.audio.pickupChain(this.pickupChain);
    const colors: Record<string, string> = {
      shield: '#3ec6ff',
      coolant: '#ffb020',
      heal: '#4ade80',
      ult: '#a78bfa',
    };
    const labels: Record<string, string> = {
      shield: t().pickupShield,
      coolant: t().pickupCoolant,
      heal: t().pickupHeal,
      ult: t().pickupUlt,
    };
    const c = colors[pickup.kind] ?? '#4ade80';
    this.vfx.pickupPop(pickup.group.position, c);
    this.decals.spawnImpact(pickup.group.position, c);
    // Collect beam pulse
    this.worldFx.triggerPulse(pickup.group.position, c, 4);
    const chainTag = this.pickupChain > 1 ? ` ×${this.pickupChain}` : '';
    this.hud.flashPickup(`${labels[pickup.kind] ?? t().pickupGeneric}${chainTag}`, c);
    if (pickup.kind === 'shield') this.player.addShield(20);
    else if (pickup.kind === 'coolant') this.player.coolHeat(45);
    else if (pickup.kind === 'heal') this.player.heal(25);
    else this.player.addUltCharge(25);
    this.score += 50 * this.pickupChain;
    this.feel.triggerFovPunch(1.2 + this.pickupChain * 0.15);
  }

  private handlePrimaryAction(): void {
    if (this.mode === 'paused') this.mode = 'play';
    else if (this.mode === 'dead') this.restart();
  }

  private setStressMode(on: boolean): void {
    this.stressMode = on;
    this.waves.stressMode = on;
    this.hud.setStressVisible(on);
    if (on) {
      this.waves.wave = Math.max(this.waves.wave, 8);
      this.lastWaveShown = 0;
      this.lastEnemyFormTier = enemyFormTierForWave(this.waves.wave);
      this.player.invulnTimer = 3;
      this.waves.forceStartWave(this.player.group.position);
      // Ensure instances exist even if the next frame is a screenshot freeze.
      this.enemyBatch.sync(this.waves.enemies);
    }
  }

  private setLowGraphics(low: boolean): void {
    this.lowGraphics = low;
    this.tuning.maxDpr = low ? 1 : 2;
    this.postFx?.setLowPower(low);
    this.postFx?.setEnabled(!low);
    this.renderer.shadowMap.enabled = !low;
    this.syncPostSize();
  }

  private openUpgrade(): void {
    this.upgradeOffers = rollUpgradeOffers(this.upgradeStacks, () => this.rng(), this.weapon);
    if (this.upgradeOffers.length === 0) return;
    this.mode = 'upgrade';
    this.hud.showUpgradeCards(
      this.upgradeOffers.map((offer) => {
        const stack = this.upgradeStacks[offer.id] ?? 0;
        return {
          name: offer.name,
          desc: offer.desc,
          color: offer.color,
          stackLabel: t().stackLabel(stack, stack + 1),
        };
      }),
      this.waves.wave,
    );
  }

  private applyUpgrade(index: number): void {
    if (this.mode !== 'upgrade') return;
    const offer = this.upgradeOffers[index];
    if (!offer) return;
    const def = getUpgrade(offer.id);
    if (!def) return;
    if ((this.upgradeStacks[offer.id] ?? 0) >= def.maxStacks) {
      this.upgradeOffers = [];
      this.hud.hideUpgradeCards();
      this.mode = 'play';
      return;
    }
    def.apply({ stats: this.player.stats, build: this.combatBuild, mods: this.combatMods });
    this.upgradeStacks[offer.id] = (this.upgradeStacks[offer.id] ?? 0) + 1;
    if (offer.id === 'armor') this.player.heal(20);
    if (offer.id === 'shield_bank') this.player.addShield(15);
    this.syncWeaponStats();
    this.player.overheatEmp = this.combatMods.overheatEmp;
    const label = upgradeText(offer.id);
    this.hud.flashPickup(label.name, offer.color);
    this.hud.pushKillFeed(t().modPick(label.name), 'ranged');
    this.audio.pickupChain(1);
    this.feel.triggerFovPunch(1.6);
    this.upgradeOffers = [];
    this.hud.hideUpgradeCards();
    this.mode = 'play';
    this.refreshPlayerForm();
    this.publishDiagnostics();
  }

  private refreshPlayerForm(): void {
    const stacks = this.upgradeStacks;
    const total = Object.values(stacks).reduce((sum, n) => sum + (n ?? 0), 0);
    const weapon =
      (stacks.overclock ?? 0) +
      (stacks.mag_accel ?? 0) +
      (stacks.arc_capacitor ?? 0) +
      (stacks.overheat_cascade ?? 0) +
      (stacks.critical_conductor ?? 0) +
      (stacks.rail_bore ?? 0) +
      (stacks.rail_reactor ?? 0) +
      (stacks.scatter_choke ?? 0) +
      (stacks.dash_detonation ?? 0);
    const defense =
      (stacks.armor ?? 0) + (stacks.shield_bank ?? 0) + (stacks.shield_nova ?? 0);
    let tier = 0;
    if (total >= 12) tier = 3;
    else if (total >= 7) tier = 2;
    else if (total >= 3) tier = 1;
    this.player.setFormTier(tier, { weapon, defense, total });
  }

  private restart(): void {
    this.score = 0;
    this.elapsed = 0;
    this.combo = 1;
    this.peakCombo = 1;
    this.comboTimer = 0;
    this.kills = 0;
    this.combatTime = 0;
    this.damageDealt = 0;
    this.shotsFired = 0;
    this.hitsLanded = 0;
    for (const k of Object.keys(this.damageByWeapon)) delete this.damageByWeapon[k];
    for (const k of Object.keys(this.shotsByWeapon)) delete this.shotsByWeapon[k];
    this.frameTimes.length = 0;
    this.lastDeathCause = 'unknown';
    this.pickupChain = 0;
    this.pickupChainTimer = 0;
    this.mode = 'play';
    this.lastWaveShown = 0;
    this.lastEnemyFormTier = 0;
    this.rng = createSeededRandom(this.rngSeed);
    this.upgradeStacks = {};
    this.upgradeOffers = [];
    this.weapon = 'plasma';
    this.player.setWeaponVisual('plasma');
    resetCombatModifiers(this.combatMods);
    resetCombatBuild(this.combatBuild, this.combatMods);
    this.bossRuntime = createBossRuntime();
    this.lastBossRef = null;
    this.combat.reset();
    this.hud.hideUpgradeCards();
    this.hud.setActiveWeapon('plasma');
    this.feel.reset();
    this.player.reset();
    this.player.stats = { ...DEFAULT_PLAYER_STATS, moveSpeed: this.tuning.speed };
    this.player.overheatEmp = false;
    this.syncWeaponStats();
    this.player.setFormTier(0);
    this.projectiles.clear();
    this.vfx.reset();
    this.worldFx.reset();
    this.decals.reset();
    this.waves.reset();
    this.waves.stressMode = this.stressMode;
    if (this.stressMode) {
      this.waves.wave = 8;
      this.waves.forceStartWave(this.player.group.position);
      this.player.invulnTimer = 3;
    }
    for (const cover of this.covers) cover.reset(90);
    for (const pickup of this.pickups) pickup.reset();
    this.dropPickup(new THREE.Vector3(-8, 0, -4), 'shield');
    this.dropPickup(new THREE.Vector3(7, 0, 3), 'coolant');
    this.cameraRig.snapTo(this.player.group.position);
    this.render();
    this.publishDiagnostics();
  }

  private render(): void {
    this.renderer.info.reset();
    const rendered = this.postFx?.render();
    if (!rendered) {
      const maybePromise = (
        this.renderer as THREE.WebGLRenderer
      ).render(this.scene, this.camera) as unknown;
      // WebGPURenderer.render returns a Promise — ignore it (fire-and-forget).
      if (maybePromise && typeof (maybePromise as Promise<void>).catch === 'function') {
        (maybePromise as Promise<void>).catch(() => undefined);
      }
    }
  }

  private syncPostSize(): void {
    const width = Math.max(1, Math.floor(this.canvas.clientWidth));
    const height = Math.max(1, Math.floor(this.canvas.clientHeight));
    const dpr = Math.min(window.devicePixelRatio || 1, this.tuning.maxDpr);
    resizeBackend(this.backend, this.camera, this.tuning.maxDpr);
    this.postFx?.setSize(width, height, dpr);
  }

  private updateCrosshair(): void {
    if (!this.crosshairEl) return;
    if (this.mode !== 'play' || window.matchMedia('(pointer: coarse)').matches) {
      this.crosshairEl.style.opacity = '0';
      return;
    }
    this.crosshairEl.style.opacity = '1';
    const rect = this.canvas.getBoundingClientRect();
    this.ndc.set(this.tmp.aim.x, this.tmp.aim.y);
    // Project a point along aim onto ground for screen position
    const world = this.player.group.position
      .clone()
      .add(new THREE.Vector3(this.tmp.aim.x, 0, this.tmp.aim.y).multiplyScalar(4));
    world.project(this.camera);
    const x = ((world.x + 1) / 2) * rect.width;
    const y = ((-world.y + 1) / 2) * rect.height;
    this.crosshairEl.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    const hot = this.player.overheated ? '0.35' : this.player.heat / this.player.stats.maxHeat;
    this.crosshairEl.style.setProperty('--heat', String(hot));
  }

  private applyHurtFlash(): void {
    const flash = this.feel.getHurtFlash();
    this.canvas.style.filter = flash > 0.01 ? `saturate(${1 + flash * 0.5}) contrast(${1 + flash * 0.25})` : '';
  }

  private applyWaveLighting(delta: number): void {
    if (!this.hemiLight || !this.fillLight) return;
    const wave = this.waves.wave;
    // Cool early → warmer/magenta late waves
    const t = THREE.MathUtils.clamp((wave - 1) / 12, 0, 1);
    const sky = new THREE.Color('#9db7d9').lerp(new THREE.Color('#c4a0e0'), t);
    const ground = new THREE.Color('#1a1410').lerp(new THREE.Color('#201018'), t);
    const fill = new THREE.Color('#5ec8ff').lerp(new THREE.Color('#ff6b9d'), t * 0.7);
    this.hemiLight.color.lerp(sky, 1 - Math.exp(-2 * delta));
    this.hemiLight.groundColor.lerp(ground, 1 - Math.exp(-2 * delta));
    this.fillLight.color.lerp(fill, 1 - Math.exp(-2 * delta));
  }

  private createScene(): void {
    this.scene.background = new THREE.Color('#070b12');
    // Lighter fog keeps mid-ground props readable while still framing the arena.
    this.scene.fog = new THREE.FogExp2('#070b12', 0.016);

    // Cool ambient + warm key + cyan rim — cold/warm split
    const hemisphere = new THREE.HemisphereLight('#b7c9e4', '#241810', 1.15);
    this.hemiLight = hemisphere;
    this.scene.add(hemisphere);

    const sun = new THREE.DirectionalLight('#ffd7a8', 3.6);
    sun.position.set(-8, 16, 6);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 42;
    sun.shadow.camera.left = -18;
    sun.shadow.camera.right = 18;
    sun.shadow.camera.top = 14;
    sun.shadow.camera.bottom = -14;
    sun.shadow.bias = -0.0004;
    this.scene.add(sun);

    const fill = new THREE.DirectionalLight('#5ec8ff', 0.85);
    this.fillLight = fill;
    fill.position.set(10, 5, -8);
    this.scene.add(fill);

    const rim = new THREE.DirectionalLight('#22d3ee', 0.7);
    rim.position.set(0, 3, 12);
    this.scene.add(rim);

    // Soft bounce from the arena floor — lifts cover/player undersides.
    const bounce = new THREE.DirectionalLight('#7dd3fc', 0.35);
    bounce.position.set(0, -2, 0);
    bounce.castShadow = false;
    this.scene.add(bounce);

    this.scene.add(this.createArena());
    this.scene.add(this.createSkyline());
    this.scene.add(this.createDebris());
    this.scene.add(this.createMidProps());
    this.createCovers();
    this.scene.add(this.player.group);

    for (let i = 0; i < 8; i += 1) {
      const pickup = new Pickup(i);
      this.pickups.push(pickup);
      this.scene.add(pickup.group);
    }
  }

  /** Low mid-arena props: read as cover without blocking the play path. */
  private createMidProps(): THREE.Group {
    const group = new THREE.Group();
    const matA = new THREE.MeshStandardMaterial({
      color: '#243044',
      roughness: 0.7,
      metalness: 0.45,
      emissive: '#0a2030',
      emissiveIntensity: 0.15,
    });
    const matB = new THREE.MeshStandardMaterial({
      color: '#3d4a5c',
      roughness: 0.4,
      metalness: 0.7,
      emissive: '#22d3ee',
      emissiveIntensity: 0.12,
    });
    const matC = new THREE.MeshStandardMaterial({
      color: '#1a2230',
      roughness: 0.85,
      metalness: 0.25,
    });
    const layouts: Array<[number, number, number, number, number, number]> = [
      [-2.2, -3.8, 1.1, 0.28, 0.7, 0],
      [2.4, 3.6, 0.9, 0.22, 0.9, 1],
      [-6.2, 0.5, 0.7, 0.35, 0.7, 0],
      [6.0, -1.2, 0.8, 0.3, 0.55, 1],
      [0.5, -6.8, 1.4, 0.18, 0.45, 0],
      [-1.2, 6.5, 1.2, 0.2, 0.5, 1],
      [4.2, -5.5, 0.6, 0.4, 0.6, 2],
      [-4.5, 5.2, 0.55, 0.32, 0.9, 2],
      [8.5, 5.8, 1.0, 0.25, 0.4, 0],
      [-8.8, -5.0, 0.9, 0.22, 0.5, 1],
      [3.8, 1.5, 0.45, 0.5, 0.45, 2],
      [-3.6, -1.0, 0.4, 0.42, 0.7, 2],
    ];
    for (const [x, z, w, h, d, mi] of layouts) {
      const mat = mi === 1 ? matB : mi === 2 ? matC : matA;
      const geo = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, h * 0.5, z);
      mesh.rotation.y = this.rng() * Math.PI;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      if (mi !== 2) {
        const strip = new THREE.Mesh(
          new THREE.BoxGeometry(w * 0.6, 0.02, 0.04),
          new THREE.MeshBasicMaterial({
            color: mi ? '#22d3ee' : '#f59e0b',
            transparent: true,
            opacity: 0.45,
          }),
        );
        strip.position.set(x, h + 0.01, z);
        strip.rotation.y = mesh.rotation.y;
        group.add(strip);
      }
    }

    // Instanced floor bolts / plates — density without draw-call flood
    const boltGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.06, 6);
    const boltMat = new THREE.MeshStandardMaterial({
      color: '#4a5568',
      roughness: 0.35,
      metalness: 0.8,
      emissive: '#0a3040',
      emissiveIntensity: 0.2,
    });
    const plateGeo = new THREE.BoxGeometry(0.55, 0.04, 0.55);
    const plateMat = new THREE.MeshStandardMaterial({
      color: '#1c2433',
      roughness: 0.6,
      metalness: 0.5,
    });
    const boltCount = 48;
    const plateCount = 24;
    const bolts = new THREE.InstancedMesh(boltGeo, boltMat, boltCount);
    const plates = new THREE.InstancedMesh(plateGeo, plateMat, plateCount);
    bolts.castShadow = plates.castShadow = false;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i += 1) {
      const a = this.rng() * Math.PI * 2;
      const r = 2 + this.rng() * 10;
      dummy.position.set(Math.cos(a) * r, 0.03, Math.sin(a) * r * 0.7);
      dummy.rotation.set(0, this.rng() * Math.PI, 0);
      dummy.scale.setScalar(0.7 + this.rng() * 0.6);
      dummy.updateMatrix();
      bolts.setMatrixAt(i, dummy.matrix);
    }
    for (let i = 0; i < plateCount; i += 1) {
      const a = this.rng() * Math.PI * 2;
      const r = 3 + this.rng() * 9;
      dummy.position.set(Math.cos(a) * r, 0.02, Math.sin(a) * r * 0.65);
      dummy.rotation.set(0, this.rng() * Math.PI, 0);
      dummy.scale.set(0.8 + this.rng() * 0.5, 1, 0.8 + this.rng() * 0.5);
      dummy.updateMatrix();
      plates.setMatrixAt(i, dummy.matrix);
    }
    bolts.instanceMatrix.needsUpdate = true;
    plates.instanceMatrix.needsUpdate = true;
    group.add(bolts, plates);

    // Floor decal rings (hazard / spawn markers)
    const decalMat = new THREE.MeshBasicMaterial({
      color: '#22d3ee',
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const decalGeo = new THREE.RingGeometry(1.1, 1.25, 6);
    for (const [x, z] of [
      [0, 0],
      [-7, 0],
      [7, 0],
      [0, -5.5],
      [0, 5.5],
    ]) {
      const d = new THREE.Mesh(decalGeo, decalMat);
      d.rotation.x = -Math.PI / 2;
      d.rotation.z = Math.PI / 6;
      d.position.set(x, 0.015, z);
      group.add(d);
    }

    return group;
  }

  private createDebris(): THREE.Group {
    const group = new THREE.Group();
    const rubbleMat = new THREE.MeshStandardMaterial({
      color: '#1a2230',
      roughness: 0.9,
      metalness: 0.2,
    });
    const scrapMat = new THREE.MeshStandardMaterial({
      color: '#3d4a5c',
      roughness: 0.45,
      metalness: 0.7,
      emissive: '#0a3040',
      emissiveIntensity: 0.2,
    });
    const layouts: Array<[number, number, number, number, number]> = [
      // x, z, w, h, d
      [-11.5, -6.5, 1.4, 0.55, 0.9],
      [11.2, 6.2, 1.1, 0.4, 1.3],
      [-10.8, 5.8, 0.7, 0.9, 0.7],
      [10.5, -6.0, 0.8, 0.35, 1.6],
      [-6.5, 7.8, 1.8, 0.25, 0.5],
      [7.2, -7.5, 1.5, 0.3, 0.6],
    ];
    for (const [x, z, w, h, d] of layouts) {
      const geo = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geo, this.rng() > 0.5 ? rubbleMat : scrapMat);
      mesh.position.set(x, h * 0.5, z);
      mesh.rotation.y = this.rng() * Math.PI;
      mesh.rotation.z = (this.rng() - 0.5) * 0.2;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
    }
    // Broken pillar
    const pillarGeo = new THREE.CylinderGeometry(0.28, 0.38, 1.6, 6);
    const pillar = new THREE.Mesh(pillarGeo, scrapMat);
    pillar.position.set(-12.2, 0.5, 1.5);
    pillar.rotation.z = 0.35;
    pillar.castShadow = true;
    group.add(pillar);
    return group;
  }

  private createSkyline(): THREE.Group {
    const group = new THREE.Group();
    const buildingMat = new THREE.MeshStandardMaterial({
      color: '#101826',
      roughness: 0.85,
      metalness: 0.15,
      emissive: '#0a2038',
      emissiveIntensity: 0.35,
    });
    const windowMat = new THREE.MeshBasicMaterial({ color: '#22d3ee' });
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const winGeo = new THREE.BoxGeometry(0.14, 0.2, 0.02);

    const buildingCount = 28;
    const buildings = new THREE.InstancedMesh(boxGeo, buildingMat, buildingCount);
    buildings.castShadow = false;
    buildings.receiveShadow = false;

    const windowMatrices: THREE.Matrix4[] = [];
    const dummy = new THREE.Object3D();

    for (let i = 0; i < buildingCount; i += 1) {
      const a = (i / buildingCount) * Math.PI * 2;
      const radius = 22 + (i % 5) * 1.4;
      const h = 3 + ((i * 17) % 9);
      const w = 1.2 + ((i * 13) % 5) * 0.25;
      dummy.position.set(Math.cos(a) * radius, h / 2, Math.sin(a) * radius);
      dummy.scale.set(w, h, w);
      dummy.rotation.set(0, -a, 0);
      dummy.updateMatrix();
      buildings.setMatrixAt(i, dummy.matrix);

      for (let wIndex = 0; wIndex < 3; wIndex += 1) {
        if ((i + wIndex) % 3 === 0) continue;
        dummy.position.set(
          Math.cos(a) * (radius - w * 0.52),
          0.6 + wIndex * (h / 4),
          Math.sin(a) * (radius - w * 0.52),
        );
        dummy.scale.set(1, 1, 1);
        dummy.lookAt(0, dummy.position.y, 0);
        dummy.updateMatrix();
        windowMatrices.push(dummy.matrix.clone());
      }
    }
    buildings.instanceMatrix.needsUpdate = true;
    group.add(buildings);

    const windows = new THREE.InstancedMesh(winGeo, windowMat, windowMatrices.length);
    windowMatrices.forEach((m, i) => windows.setMatrixAt(i, m));
    windows.instanceMatrix.needsUpdate = true;
    group.add(windows);

    return group;
  }

  private createArena(): THREE.Group {
    const arena = new THREE.Group();
    const floorTexture = this.createFloorTexture();
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(ARENA.halfWidth / 2.2, ARENA.halfDepth / 2.2);

    const roughTex = this.createFloorRoughnessTexture();
    roughTex.wrapS = THREE.RepeatWrapping;
    roughTex.wrapT = THREE.RepeatWrapping;
    roughTex.repeat.copy(floorTexture.repeat);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(ARENA.halfWidth * 2, ARENA.halfDepth * 2, 1, 1),
      new THREE.MeshStandardMaterial({
        color: '#1c2433',
        map: floorTexture,
        roughnessMap: roughTex,
        roughness: 0.92,
        metalness: 0.18,
      }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    arena.add(floor);

    const gridMat = new THREE.LineBasicMaterial({ color: '#1e3a5f' });
    const points: THREE.Vector3[] = [];
    for (let x = -ARENA.halfWidth; x <= ARENA.halfWidth; x += 2) {
      points.push(new THREE.Vector3(x, 0.02, -ARENA.halfDepth));
      points.push(new THREE.Vector3(x, 0.02, ARENA.halfDepth));
    }
    for (let z = -ARENA.halfDepth; z <= ARENA.halfDepth; z += 2) {
      points.push(new THREE.Vector3(-ARENA.halfWidth, 0.02, z));
      points.push(new THREE.Vector3(ARENA.halfWidth, 0.02, z));
    }
    const gridGeo = new THREE.BufferGeometry().setFromPoints(points);
    arena.add(new THREE.LineSegments(gridGeo, gridMat));

    const railMaterial = new THREE.MeshStandardMaterial({
      color: '#243044',
      roughness: 0.45,
      metalness: 0.7,
      emissive: '#0a4050',
      emissiveIntensity: 0.25,
    });
    const railGlowMat = new THREE.MeshBasicMaterial({ color: '#22d3ee', transparent: true, opacity: 0.35 });
    const longRail = new THREE.BoxGeometry(ARENA.halfWidth * 2 + 0.8, 0.55, 0.35);
    const shortRail = new THREE.BoxGeometry(0.35, 0.55, ARENA.halfDepth * 2 + 0.8);
    const rails = [
      new THREE.Mesh(longRail, railMaterial),
      new THREE.Mesh(longRail, railMaterial),
      new THREE.Mesh(shortRail, railMaterial),
      new THREE.Mesh(shortRail, railMaterial),
    ];
    rails[0].position.set(0, 0.28, -ARENA.halfDepth - 0.2);
    rails[1].position.set(0, 0.28, ARENA.halfDepth + 0.2);
    rails[2].position.set(-ARENA.halfWidth - 0.2, 0.28, 0);
    rails[3].position.set(ARENA.halfWidth + 0.2, 0.28, 0);
    for (const rail of rails) {
      rail.castShadow = true;
      rail.receiveShadow = true;
      arena.add(rail);
    }
    // Thin glow strip on rail tops (not solid cyan blocks)
    const stripLong = new THREE.BoxGeometry(ARENA.halfWidth * 2 + 0.6, 0.04, 0.08);
    const stripShort = new THREE.BoxGeometry(0.08, 0.04, ARENA.halfDepth * 2 + 0.6);
    const s1 = new THREE.Mesh(stripLong, railGlowMat);
    s1.position.set(0, 0.56, -ARENA.halfDepth - 0.2);
    const s2 = new THREE.Mesh(stripLong, railGlowMat);
    s2.position.set(0, 0.56, ARENA.halfDepth + 0.2);
    const s3 = new THREE.Mesh(stripShort, railGlowMat);
    s3.position.set(-ARENA.halfWidth - 0.2, 0.56, 0);
    const s4 = new THREE.Mesh(stripShort, railGlowMat);
    s4.position.set(ARENA.halfWidth + 0.2, 0.56, 0);
    arena.add(s1, s2, s3, s4);

    // Arena medallion: layered rings + hex — art-direction focal point.
    const medallion = new THREE.Group();
    const ringA = new THREE.Mesh(
      new THREE.RingGeometry(1.55, 1.72, 6),
      new THREE.MeshBasicMaterial({
        color: '#22d3ee',
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    ringA.rotation.x = -Math.PI / 2;
    ringA.rotation.z = Math.PI / 6;
    ringA.position.y = 0.02;
    const ringB = new THREE.Mesh(
      new THREE.RingGeometry(1.95, 2.05, 48),
      new THREE.MeshBasicMaterial({
        color: '#7ae7ff',
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    ringB.rotation.x = -Math.PI / 2;
    ringB.position.y = 0.018;
    const core = new THREE.Mesh(
      new THREE.CircleGeometry(0.55, 6),
      new THREE.MeshBasicMaterial({
        color: '#22d3ee',
        transparent: true,
        opacity: 0.14,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    core.rotation.x = -Math.PI / 2;
    core.rotation.z = Math.PI / 6;
    core.position.y = 0.016;
    medallion.add(ringA, ringB, core);
    arena.add(medallion);

    // Perimeter hazard chevrons — arena identity at the rail line.
    const chevGeo = new THREE.BoxGeometry(0.55, 0.06, 0.14);
    const chevMat = new THREE.MeshBasicMaterial({
      color: '#fbbf24',
      transparent: true,
      opacity: 0.55,
    });
    const chevCount = 36;
    const chevs = new THREE.InstancedMesh(chevGeo, chevMat, chevCount);
    chevs.frustumCulled = false;
    {
      const dummy = new THREE.Object3D();
      let i = 0;
      const place = (x: number, z: number, rotY: number) => {
        dummy.position.set(x, 0.03, z);
        dummy.rotation.set(0, rotY, 0);
        dummy.updateMatrix();
        chevs.setMatrixAt(i, dummy.matrix);
        i += 1;
      };
      const spanX = ARENA.halfWidth - 0.4;
      const spanZ = ARENA.halfDepth - 0.4;
      for (let k = 0; k < 9; k += 1) {
        const t = (k / 8) * 2 - 1;
        place(t * spanX, -spanZ, 0);
        place(t * spanX, spanZ, Math.PI);
        place(-spanX, t * spanZ, Math.PI / 2);
        place(spanX, t * spanZ, -Math.PI / 2);
      }
      chevs.instanceMatrix.needsUpdate = true;
    }
    arena.add(chevs);

    const pylonGeo = new THREE.CylinderGeometry(0.25, 0.35, 2.2, 6);
    const pylonMat = new THREE.MeshStandardMaterial({
      color: '#243044',
      roughness: 0.45,
      metalness: 0.5,
      emissive: '#1ec8df',
      emissiveIntensity: 0.35,
    });
    for (const [x, z] of [
      [-ARENA.halfWidth + 1.2, -ARENA.halfDepth + 1.2],
      [ARENA.halfWidth - 1.2, -ARENA.halfDepth + 1.2],
      [-ARENA.halfWidth + 1.2, ARENA.halfDepth - 1.2],
      [ARENA.halfWidth - 1.2, ARENA.halfDepth - 1.2],
    ]) {
      const pylon = new THREE.Mesh(pylonGeo, pylonMat);
      pylon.position.set(x, 1.1, z);
      pylon.castShadow = true;
      arena.add(pylon);
    }

    return arena;
  }

  private createCovers(): void {
    const layouts: Array<[number, number, number, number, number]> = [
      [-5, -2.5, 2.4, 1.2, 1.1],
      [5, 2.5, 2.4, 1.2, 1.1],
      [0, -5.2, 1.4, 2.2, 1.3],
      [0, 5.2, 1.4, 2.2, 1.3],
      [-8, 2.8, 1.2, 1.2, 0.9],
      [8, -2.8, 1.2, 1.2, 0.9],
      [-3.5, 0, 1.0, 2.8, 1.0],
      [3.5, 0, 1.0, 2.8, 1.0],
    ];
    for (const [x, z, w, d, h] of layouts) {
      const cover = new Cover(new THREE.Vector3(x, 0, z), new THREE.Vector3(w, h, d), 90, () => this.rng());
      this.covers.push(cover);
      this.scene.add(cover.mesh);
    }
  }

  private createPickup(): Pickup {
    const pickup = new Pickup(this.pickups.length);
    this.pickups.push(pickup);
    this.scene.add(pickup.group);
    return pickup;
  }

  private createFloorRoughnessTexture(): THREE.CanvasTexture {
    const size = 256;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');
    if (!ctx) throw new Error('roughness tex');
    // Mid-gray base
    ctx.fillStyle = '#b0b0b0';
    ctx.fillRect(0, 0, size, size);
    // Polished lanes (darker = smoother/more reflective)
    ctx.fillStyle = '#707070';
    for (let i = 0; i < 6; i += 1) {
      const x = this.rng() * size;
      const y = this.rng() * size;
      ctx.fillRect(x, y, 40 + this.rng() * 80, 18 + this.rng() * 30);
    }
    // Rough scuffs (lighter)
    for (let i = 0; i < 500; i += 1) {
      ctx.fillStyle = `rgba(255,255,255,${0.05 + this.rng() * 0.1})`;
      ctx.fillRect(this.rng() * size, this.rng() * size, 2 + this.rng() * 4, 2);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.NoColorSpace;
    return tex;
  }

  private createFloorTexture(): THREE.CanvasTexture {
    const size = 512;
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = size;
    textureCanvas.height = size;
    const context = textureCanvas.getContext('2d');
    if (!context) throw new Error('Could not create floor texture context.');

    // Base concrete/asphalt
    context.fillStyle = '#151a22';
    context.fillRect(0, 0, size, size);

    // Large tonal patches
    for (let i = 0; i < 18; i += 1) {
      const x = this.rng() * size;
      const y = this.rng() * size;
      const r = 40 + this.rng() * 90;
      const g = context.createRadialGradient(x, y, 0, x, y, r);
      const warm = this.rng() > 0.6;
      g.addColorStop(0, warm ? 'rgba(60,45,30,0.18)' : 'rgba(20,40,60,0.2)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      context.fillStyle = g;
      context.beginPath();
      context.arc(x, y, r, 0, Math.PI * 2);
      context.fill();
    }

    // Panel seams (industrial plating)
    context.strokeStyle = 'rgba(0,0,0,0.35)';
    context.lineWidth = 2;
    for (let i = 0; i <= size; i += 64) {
      context.beginPath();
      context.moveTo(i, 0);
      context.lineTo(i, size);
      context.moveTo(0, i);
      context.lineTo(size, i);
      context.stroke();
    }
    context.strokeStyle = 'rgba(120,150,180,0.08)';
    context.lineWidth = 1;
    for (let i = 0; i <= size; i += 64) {
      context.beginPath();
      context.moveTo(i + 1, 0);
      context.lineTo(i + 1, size);
      context.stroke();
    }

    // Fine cyan guide lines (sparse)
    context.strokeStyle = 'rgba(34, 211, 238, 0.12)';
    context.lineWidth = 1;
    context.setLineDash([8, 16]);
    context.beginPath();
    context.moveTo(size * 0.5, 0);
    context.lineTo(size * 0.5, size);
    context.stroke();
    context.setLineDash([]);

    // Noise grain
    for (let i = 0; i < 5000; i += 1) {
      const x = this.rng() * size;
      const y = this.rng() * size;
      const a = 0.02 + this.rng() * 0.06;
      const bright = this.rng() > 0.5;
      context.fillStyle = bright
        ? `rgba(200,220,255,${a})`
        : `rgba(0,0,0,${a * 1.4})`;
      context.fillRect(x, y, 1.2, 1.2);
    }

    // Scorch
    for (let i = 0; i < 14; i += 1) {
      const x = this.rng() * size;
      const y = this.rng() * size;
      const r = 18 + this.rng() * 45;
      const g = context.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(25,15,10,0.35)');
      g.addColorStop(1, 'rgba(25,15,10,0)');
      context.fillStyle = g;
      context.beginPath();
      context.arc(x, y, r, 0, Math.PI * 2);
      context.fill();
    }

    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return texture;
  }

  private pushHud(delta: number): void {
    const waveState = this.waves.getState();
    const boss = this.waves.boss;
    const dict = t();
    const status =
      this.mode === 'dead'
        ? dict.statusDead
        : this.mode === 'upgrade'
          ? dict.statusUpgrade
          : this.player.overheated
            ? dict.statusCooling
            : boss
              ? dict.statusBoss
              : this.stressMode
                ? dict.statusStress
                : waveState.intermission > 0
                  ? dict.statusInbound
                  : dict.statusHold;

    this.hud.update(
      {
        hp: this.player.hp,
        maxHp: this.player.stats.maxHp,
        shield: this.player.shield,
        maxShield: this.player.stats.maxShield,
        heat: this.player.heat,
        maxHeat: this.player.stats.maxHeat,
        overheated: this.player.overheated,
        wave: waveState.wave,
        score: this.score,
        combo: this.combo,
        enemies: waveState.alive,
        ult: this.player.ultCharge,
        time: this.elapsed,
        status,
        boss: {
          visible: Boolean(boss),
          hpRatio: boss ? boss.hp / boss.maxHp : 0,
          name: boss
            ? dict.titanName(bossPhaseName(this.bossRuntime.phase))
            : 'TITAN-07',
        },
        waveBanner: null,
        mode: this.mode,
        peakCombo: this.peakCombo,
        kills: this.kills,
        deathCause: this.lastDeathCause,
        stress: this.stressMode,
        lowGraphics: this.lowGraphics,
        weapon: this.weapon,
      },
      delta,
    );

    this.hud.updatePerf(
      this.fps,
      this.renderer.info.render.calls,
      this.renderer.info.render.triangles,
      waveState.alive,
    );
  }

  private installTestHooks(): void {
    window.__THREE_GAME_TEST_HOOKS__ = {
      seed: (value: number) => {
        this.rngSeed = value;
        this.rng = createSeededRandom(value);
      },
      setState: (name: string) => {
        if (name !== 'active-play' && name !== 'complete' && name !== 'stress') {
          throw new Error(`Unknown test state: ${name}`);
        }
        this.restart();
        if (name === 'complete') {
          this.score = 12800;
          this.elapsed = 95;
          this.combo = 3.5;
          this.peakCombo = 4.2;
          this.player.ultCharge = 100;
          this.kills = 87;
          this.mode = 'play';
        }
        if (name === 'stress') {
          this.setStressMode(true);
          this.restart();
          this.setStressMode(true);
          this.enemyBatch.sync(this.waves.enemies);
          this.pushHud(0);
        }
        this.render();
        this.publishDiagnostics();
        return { state: name };
      },
      setPausedForScreenshot: (paused: boolean) => {
        this.pausedForScreenshot = paused;
      },
      setReducedMotion: (enabled: boolean) => {
        this.reducedMotion = enabled;
        if (enabled) this.player.stabilizeVisuals();
        this.render();
        this.publishDiagnostics();
      },
      hideDebugUi: (hidden: boolean) => {
        this.debugTools.setHidden(hidden);
        this.hud.setPerfVisible(!hidden);
      },
      pickUpgrade: (index: number) => {
        this.applyUpgrade(index);
        return { mode: this.mode };
      },
      grantUpgrade: (id: string) => {
        const def = getUpgrade(id as UpgradeId);
        if (!def) return { ok: false };
        def.apply({ stats: this.player.stats, build: this.combatBuild, mods: this.combatMods });
        this.upgradeStacks[id as UpgradeId] = (this.upgradeStacks[id as UpgradeId] ?? 0) + 1;
        this.syncWeaponStats();
        this.player.overheatEmp = this.combatMods.overheatEmp;
        this.publishDiagnostics();
        return { ok: true, weapon: this.weapon };
      },
      getBuildSnapshot: () => {
        const resolved = resolveWeaponStats(this.combatBuild, this.weapon);
        return {
          weapon: this.weapon,
          fireInterval: resolved.fireInterval,
          damage: resolved.damage,
          projectileSpeed: resolved.projectileSpeed,
          pierce: resolved.pierce,
          spread: resolved.spread,
          modifiers: modifierIds(this.combatMods),
          stacks: { ...this.upgradeStacks },
        };
      },
    };
  }

  private publishDiagnostics(): void {
    const info = this.renderer.info;
    const waveState = this.waves.getState();
    window.__THREE_GAME_DIAGNOSTICS__ = buildDiagnostics({
      frame: this.frame,
      elapsed: this.elapsed,
      score: this.score,
      mode: this.mode,
      wave: waveState.wave,
      enemies: waveState.alive,
      combo: this.combo,
      peakCombo: this.peakCombo,
      fps: this.fps,
      kills: this.kills,
      stress: this.stressMode,
      upgradeStacks: { ...this.upgradeStacks },
      weapon: this.weapon,
      modifiers: modifierIds(this.combatMods),
      bossPhase: this.waves.boss ? this.bossRuntime.phase : null,
      playerFormTier: this.player.getFormTier(),
      enemyFormTier: enemyFormTierForWave(waveState.wave),
      projectiles: this.projectiles.activeCount(),
      particles: this.vfx.activeCount(),
      backend: this.backend.kind,
      webgpuSupported: this.backend.webgpuSupported,
      combatTime: this.combatTime,
      damageDealt: this.damageDealt,
      shotsFired: this.shotsFired,
      hitsLanded: this.hitsLanded,
      dps: this.combatTime > 0.05 ? Number((this.damageDealt / this.combatTime).toFixed(2)) : 0,
      killsPerSec:
        this.combatTime > 0.05 ? Number((this.kills / this.combatTime).toFixed(2)) : 0,
      frameMs: this.frameMsSnapshot(),
      player: {
        hp: this.player.hp,
        shield: this.player.shield,
        heat: this.player.heat,
        overheated: this.player.overheated,
        ult: this.player.ultCharge,
        alive: this.player.alive,
        fireInterval: this.player.stats.fireInterval,
        projectileDamage: this.player.stats.projectileDamage,
        projectileSpeed: this.player.stats.projectileSpeed,
        heatPerShot: this.player.stats.heatPerShot,
        speed: this.player.velocity.length(),
        position: {
          x: this.player.group.position.x,
          y: this.player.group.position.y,
          z: this.player.group.position.z,
        },
      },
      renderer: {
        calls: info.render.calls,
        triangles: info.render.triangles,
        geometries: info.memory.geometries,
        textures: info.memory.textures,
      },
      canvas: {
        clientWidth: this.canvas.clientWidth,
        clientHeight: this.canvas.clientHeight,
        width: this.canvas.width,
        height: this.canvas.height,
        dpr: Math.min(window.devicePixelRatio || 1, this.tuning.maxDpr),
      },
    });
  }

  private getElement(selector: string): HTMLElement {
    const element = document.querySelector<HTMLElement>(selector);
    if (!element) throw new Error(`Missing element: ${selector}`);
    return element;
  }
}
