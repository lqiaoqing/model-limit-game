import * as THREE from 'three';
import type { Player } from '../entities/Player';
import type { Projectile, ProjectilePool } from '../entities/Projectile';
import type { Enemy } from '../entities/Enemy';
import type { WaveDirector } from '../systems/WaveDirector';
import type { VfxSystem } from '../systems/VfxSystem';
import type { AudioSystem } from '../systems/AudioSystem';
import type { Hud } from '../systems/Hud';
import type { GameFeel } from '../systems/GameFeel';
import type { WorldFx } from '../systems/WorldFx';
import type { GroundDecals } from '../systems/GroundDecals';
import type { CombatModifiers } from './CombatModifiers';
import {
  ARC_CHAIN_DAMAGE,
  ARC_CHAIN_RANGE,
  CRIT_MULTIPLIER,
  DASH_BLAST_DAMAGE,
  DASH_BLAST_RADIUS,
  DASH_RELOAD_FIRE_MUL,
  DASH_RELOAD_WINDOW,
  ION_AFTERSHOCK_DAMAGE_MUL,
  ION_AFTERSHOCK_DELAY,
  ION_AFTERSHOCK_RADIUS_MUL,
  ION_AOE_FALLOFF,
  ION_HEAT_REFUND_CAP,
  MOMENTUM_MAX,
  OVERHEAT_EMP_DAMAGE,
  OVERHEAT_EMP_RADIUS,
  PLASMA_SUPERCONDUCT_DECAY,
  PLASMA_SUPERCONDUCT_RANGE_MUL,
  RAIL_CHARGE_DMG_MUL,
  RAIL_CHARGE_HEAT_MUL,
  RAIL_CHARGE_IDLE_SEC,
  RAIL_CHARGE_PIERCE_BONUS,
  RAIL_EXECUTE_DMG_MUL,
  RAIL_EXECUTE_HP_RATIO,
  SCATTER_BREACH_DMG_MUL,
  SCATTER_CLOSE_RANGE,
  SCATTER_SHRAPNEL_COUNT,
  SCATTER_SHRAPNEL_DAMAGE,
  SHIELD_NOVA_DAMAGE,
  SHIELD_NOVA_RADIUS,
} from './CombatModifiers';
import type { WeaponId } from './Weapons';
import { resolveWeaponStats, type CombatBuild } from './CombatBuild';
import { t } from '../i18n';

export type CombatDeps = {
  player: Player;
  projectiles: ProjectilePool;
  waves: WaveDirector;
  vfx: VfxSystem;
  audio: AudioSystem;
  hud: Hud;
  feel: GameFeel;
  worldFx: WorldFx;
  decals: GroundDecals;
  combatMods: CombatModifiers;
  getBuild: () => CombatBuild;
  getWeapon: () => WeaponId;
  rng: () => number;
  onEnemyKilled: (enemy: Enemy, source?: { sourceWeapon: string | null; damage: number }) => void;
  onPlayerProjectileHit: () => void;
  onDamageDealt?: (amount: number, weapon: string | null) => void;
  onShot?: (count: number, weapon: string) => void;
  /** Debug: player damage multiplier. */
  getPlayerDamageMul?: () => number;
  /** Debug: enemies die in one hit. */
  getEnemyOneHp?: () => boolean;
  /** Debug: enemy projectiles deal no player damage. */
  getEnemyPassive?: () => boolean;
  /** Boss incoming damage multiplier (warden shield etc.). */
  getBossDamageMul?: () => number;
};

/** Weapon fire, projectile hits, and rule-modifier combat side effects. */
export class CombatSystem {
  private readonly dashBlasts: Array<{ pos: THREE.Vector3; timer: number }> = [];
  private readonly ionBlasts: Array<{
    pos: THREE.Vector3;
    damage: number;
    radius: number;
    timer: number;
  }> = [];
  private chainDepth = 0;
  private railIdleTimer = 0;
  private dashReloadTimer = 0;
  private momentum = 0;
  private readonly tmpDir = new THREE.Vector3();
  private readonly tmpUp = new THREE.Vector3(0, 1, 0);

  constructor(private readonly deps: CombatDeps) {}

  reset(): void {
    this.dashBlasts.length = 0;
    this.ionBlasts.length = 0;
    this.chainDepth = 0;
    this.railIdleTimer = 0;
    this.dashReloadTimer = 0;
    this.momentum = 0;
  }

  notifyDash(): void {
    if (this.deps.combatMods.scatterDashReload) {
      this.dashReloadTimer = DASH_RELOAD_WINDOW;
    }
  }

  tickRuleRuntime(delta: number, moving: boolean): void {
    if (this.deps.combatMods.railCharge) {
      this.railIdleTimer += delta;
    }
    if (this.dashReloadTimer > 0) this.dashReloadTimer = Math.max(0, this.dashReloadTimer - delta);
    if (this.deps.combatMods.momentumCore > 0) {
      if (moving) this.momentum = Math.min(MOMENTUM_MAX, this.momentum + delta * 0.85);
      else this.momentum = Math.max(0, this.momentum - delta * 2.2);
    } else {
      this.momentum = 0;
    }
  }

  getFireIntervalMul(): number {
    let mul = 1;
    if (this.deps.combatMods.scatterDashReload && this.dashReloadTimer > 0) mul *= DASH_RELOAD_FIRE_MUL;
    if (this.deps.combatMods.momentumCore > 0) {
      mul *= 1 - Math.min(0.16, this.momentum * 0.04 * this.deps.combatMods.momentumCore);
    }
    return mul;
  }

  getMoveSpeedMul(): number {
    if (this.deps.combatMods.momentumCore <= 0) return 1;
    return 1 + Math.min(0.2, this.momentum * 0.035 * this.deps.combatMods.momentumCore);
  }

  queueDashBlast(position: THREE.Vector3): void {
    if (!this.deps.combatMods.dashDetonation) return;
    this.dashBlasts.push({ pos: position.clone().setY(0.2), timer: 0.28 });
    this.deps.vfx.spawnBurst(position.clone().setY(0.2), '#f472b6', 6, 3.5);
  }

  firePlayerWeapon(): void {
    const { player, projectiles, vfx, audio, feel, getBuild, getWeapon } = this.deps;
    const build = getBuild();
    const weapon = getWeapon();
    const resolved = resolveWeaponStats(build, weapon);
    let damage = resolved.damage;
    let pierce = resolved.pierce;
    let heatPerShot = resolved.heatPerShot;
    let charged = false;
    if (weapon === 'rail' && build.modifiers.railCharge && this.railIdleTimer >= RAIL_CHARGE_IDLE_SEC) {
      damage *= RAIL_CHARGE_DMG_MUL;
      pierce += RAIL_CHARGE_PIERCE_BONUS;
      heatPerShot *= RAIL_CHARGE_HEAT_MUL;
      charged = true;
      this.railIdleTimer = 0;
      vfx.spawnBurst(player.muzzle, '#fb923c', 8, 5);
    }
    audio.shoot();
    this.tmpDir.set(player.aim.x, 0, player.aim.y);
    for (let i = 0; i < resolved.pellets; i += 1) {
      const t = resolved.pellets === 1 ? 0 : i / (resolved.pellets - 1) - 0.5;
      const angle = t * resolved.spread * 2;
      const dir = this.tmpDir.clone().applyAxisAngle(this.tmpUp, angle);
      projectiles.spawn(
        player.muzzle,
        dir,
        resolved.projectileSpeed,
        damage,
        'player',
        resolved.color,
        {
          pierce,
          sourceWeapon: resolved.def.id,
          aoeRadius: resolved.aoeRadius,
        },
      );
    }
    if (charged) {
      // Charge consumes extra heat without rewriting weapon base heat identity.
      player.heat = Math.min(player.stats.maxHeat, player.heat + (heatPerShot - resolved.heatPerShot));
    }
    this.railIdleTimer = weapon === 'rail' ? 0 : this.railIdleTimer;
    this.deps.onShot?.(resolved.pellets, resolved.def.id);
    const weaponId = resolved.def.id;
    const burstCount =
      weaponId === 'launcher' ? 10 : weaponId === 'scatter' ? 8 : weaponId === 'rail' ? 6 : 3;
    const burstSpeed =
      weaponId === 'launcher' ? 5.2 : weaponId === 'rail' ? 6.5 : weaponId === 'scatter' ? 4.2 : 3.5;
    vfx.spawnBurst(player.muzzle, resolved.color, burstCount, burstSpeed);
    vfx.spawnBurst(
      player.muzzle
        .clone()
        .add(new THREE.Vector3(-player.aim.y, 0.1, player.aim.x).multiplyScalar(0.2)),
      resolved.color,
      weaponId === 'rail' || weaponId === 'launcher' ? 3 : 1,
      2.2,
    );
    feel.triggerFovPunch(
      resolved.def.id === 'rail' ? 2.2 : resolved.def.id === 'launcher' ? 2.6 : 1.1,
    );
  }

  /** Radial impact blast — Ion Launcher identity. */
  private explodeIon(pos: THREE.Vector3, damage: number, radius: number): number {
    const { waves, vfx, worldFx, audio, feel, combatMods, onEnemyKilled, onDamageDealt } =
      this.deps;
    const hits: Enemy[] = [];
    let totalDamage = 0;
    for (const enemy of waves.enemies) {
      if (!enemy.alive) continue;
      const dx = enemy.group.position.x - pos.x;
      const dz = enemy.group.position.z - pos.z;
      const distSq = dx * dx + dz * dz;
      if (distSq > radius * radius) continue;
      hits.push(enemy);
    }
    if (hits.length === 0) {
      vfx.spawnShockwave(pos, '#4ade80', radius * 0.7);
      worldFx.triggerPulse(pos, '#4ade80', radius);
      return 0;
    }
    vfx.spawnShockwave(pos, '#4ade80', radius * 0.75);
    worldFx.triggerPulse(pos, '#4ade80', radius);
    audio.hit();
    feel.triggerFovPunch(1.6);
    for (const enemy of hits) {
      const dx = enemy.group.position.x - pos.x;
      const dz = enemy.group.position.z - pos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      const falloff = dist <= 0.05 ? 1 : ION_AOE_FALLOFF + (1 - ION_AOE_FALLOFF) * (1 - dist / radius);
      let dmg = damage * Math.max(ION_AOE_FALLOFF, falloff);
      const playerMul = this.deps.getPlayerDamageMul?.() ?? 1;
      if (playerMul !== 1) dmg *= playerMul;
      if (this.deps.getEnemyOneHp?.()) dmg = Math.max(dmg, 999999);
      if (enemy.stats.kind === 'boss') {
        dmg *= this.deps.getBossDamageMul?.() ?? 1;
      }
      const died = enemy.takeDamage(dmg, pos);
      totalDamage += dmg;
      onDamageDealt?.(dmg, 'launcher');
      vfx.spawnBurst(enemy.group.position.clone().setY(0.4), '#4ade80', 7, 4.5);
      if (!died) {
        enemy.staggerTimer = Math.max(enemy.staggerTimer, 0.2);
        const knock = Math.max(dist, 0.001);
        enemy.knockback(dx / knock, dz / knock, 8, 0.15);
      } else {
        onEnemyKilled(enemy, { sourceWeapon: 'launcher', damage: dmg });
      }
    }
    const refund =
      combatMods.ionHeatRefundPerHit > 0
        ? Math.min(ION_HEAT_REFUND_CAP, combatMods.ionHeatRefundPerHit * hits.length)
        : 0;
    if (refund > 0) {
      this.deps.player.coolHeat(refund);
    }
    return totalDamage;
  }

  private queueIonAftershock(pos: THREE.Vector3, damage: number, radius: number): void {
    if (!this.deps.combatMods.ionAftershock) return;
    this.ionBlasts.push({
      pos: pos.clone().setY(0.2),
      damage: damage * ION_AFTERSHOCK_DAMAGE_MUL,
      radius: radius * ION_AFTERSHOCK_RADIUS_MUL,
      timer: ION_AFTERSHOCK_DELAY,
    });
  }

  private impactIon(projectile: Projectile, pos: THREE.Vector3): void {
    const build = this.deps.getBuild();
    const mods = build.modifiers;
    const expansion = Math.max(1, mods.ionBlastRadiusMul);
    const baseRadius = (projectile.aoeRadius > 0 ? projectile.aoeRadius : 2.4) * expansion;
    // Expansion trades a bit of blast damage for coverage (identity, not a flat nerf elsewhere).
    const dmgMul = expansion > 1.001 ? 0.88 : 1;
    this.explodeIon(pos.clone().setY(0.2), projectile.damage * dmgMul, baseRadius);
    this.queueIonAftershock(pos, projectile.damage * dmgMul, baseRadius);
  }

  spawnShrapnel(from: THREE.Vector3): void {
    if (!this.deps.combatMods.scatterShrapnel) return;
    const { projectiles, vfx, getBuild } = this.deps;
    const build = getBuild();
    const color = build.modifiers.scatterShrapnel ? '#f9a8d4' : '#f472b6';
    const dmg = SCATTER_SHRAPNEL_DAMAGE + build.perWeapon.scatter.dmgBonus * 0.5;
    for (let i = 0; i < SCATTER_SHRAPNEL_COUNT; i += 1) {
      const angle = (i / SCATTER_SHRAPNEL_COUNT) * Math.PI * 2 + this.deps.rng() * 0.4;
      const dir = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle));
      projectiles.spawn(from.clone().setY(0.4), dir, 16, dmg, 'player', color, {
        sourceWeapon: 'scatter',
        pierce: 0,
      });
    }
    vfx.spawnBurst(from.clone().setY(0.4), color, 5, 4);
  }

  resolveProjectileHits(arena: { halfWidth: number; halfDepth: number }, covers: { blocksPoint(p: THREE.Vector3): boolean; takeDamage(n: number): void }[]): void {
    const { player, projectiles, waves, vfx, audio, decals, feel, combatMods, onEnemyKilled } =
      this.deps;
    for (const p of projectiles.projectiles) {
      if (!p.active) continue;
      const pos = p.group.position;

      if (Math.abs(pos.x) > arena.halfWidth + 2 || Math.abs(pos.z) > arena.halfDepth + 2) {
        if (p.owner === 'player' && p.sourceWeapon === 'launcher' && p.aoeRadius > 0) {
          const clamped = new THREE.Vector3(
            Math.max(-arena.halfWidth, Math.min(arena.halfWidth, pos.x)),
            0.2,
            Math.max(-arena.halfDepth, Math.min(arena.halfDepth, pos.z)),
          );
          this.impactIon(p, clamped);
        }
        this.maybeRailRicochet(p, pos);
        p.deactivate();
        continue;
      }

      let blocked = false;
      for (const cover of covers) {
        if (cover.blocksPoint(pos)) {
          if (p.owner === 'player' && p.sourceWeapon === 'launcher' && p.aoeRadius > 0) {
            cover.takeDamage(p.damage * 0.8);
            this.impactIon(p, pos);
          } else {
            cover.takeDamage(p.damage * 0.5);
            vfx.spawnBurst(pos, '#94a3b8', 4, 3);
          }
          this.maybeRailRicochet(p, pos);
          p.deactivate();
          blocked = true;
          break;
        }
      }
      if (blocked) continue;

      if (p.owner === 'player') {
        for (const enemy of waves.enemies) {
          if (!enemy.alive) continue;
          if (p.hitSet.has(enemy.group.uuid)) continue;
          const dx = pos.x - enemy.group.position.x;
          const dz = pos.z - enemy.group.position.z;
          const rr = enemy.radius + p.radius;
          if (dx * dx + dz * dz <= rr * rr) {
            p.hitSet.add(enemy.group.uuid);
            enemy.hitFlash();
            if (p.sourceWeapon === 'launcher' && p.aoeRadius > 0) {
              this.impactIon(p, pos);
              p.deactivate();
              break;
            }
            let dmg = p.damage;
            const playerMul = this.deps.getPlayerDamageMul?.() ?? 1;
            if (playerMul !== 1) dmg *= playerMul;
            if (this.deps.getEnemyOneHp?.()) dmg = Math.max(dmg, 999999);
            if (enemy.stats.kind === 'boss') {
              dmg *= this.deps.getBossDamageMul?.() ?? 1;
            }
            const close =
              p.sourceWeapon === 'scatter' &&
              pos.distanceTo(player.group.position) < SCATTER_CLOSE_RANGE;
            if (combatMods.scatterCloseBonus && p.sourceWeapon === 'scatter' && close) {
              dmg *= 1.35;
            }
            if (
              combatMods.scatterBreach &&
              p.sourceWeapon === 'scatter' &&
              close &&
              (enemy.stats.kind === 'elite' || enemy.stats.kind === 'boss')
            ) {
              dmg *= SCATTER_BREACH_DMG_MUL;
            }
            if (combatMods.railPierce > 0 && p.sourceWeapon === 'rail') {
              dmg *= 1 + p.hitsLanded * 0.08;
            }
            if (
              combatMods.railExecute &&
              p.sourceWeapon === 'rail' &&
              enemy.hp / Math.max(1, enemy.maxHp) <= RAIL_EXECUTE_HP_RATIO
            ) {
              dmg *= RAIL_EXECUTE_DMG_MUL;
            }
            p.hitsLanded += 1;
            const died = enemy.takeDamage(dmg, player.group.position);
            this.deps.onDamageDealt?.(dmg, p.sourceWeapon);
            audio.hit();
            vfx.spawnBurst(pos, p.crit ? '#fbbf24' : enemy.stats.color, p.crit ? 10 : 6, 5);
            if (!died) decals.spawnImpact(pos, enemy.stats.color);
            if (died) {
              if (p.sourceWeapon === 'scatter' && close) this.spawnShrapnel(enemy.group.position);
              onEnemyKilled(enemy, p);
            } else feel.triggerHitstop(0.03);
            if (p.pierce > 0) p.pierce -= 1;
            else {
              this.maybeRailRicochet(p, pos);
              p.deactivate();
            }
            break;
          }
        }
      } else if (!this.deps.getEnemyPassive?.()) {
        const dx = pos.x - player.group.position.x;
        const dz = pos.z - player.group.position.z;
        const rr = 0.55 + p.radius;
        if (dx * dx + dz * dz <= rr * rr) {
          const hurt = player.takeDamage(p.damage);
          if (hurt.hit) {
            this.deps.onPlayerProjectileHit();
            if (hurt.shieldBroke) this.maybeShieldNova();
          }
          p.deactivate();
        }
      } else {
        // Passive: still despawn enemy bullets so the pool doesn't fill.
        const dx = pos.x - player.group.position.x;
        const dz = pos.z - player.group.position.z;
        const rr = 0.55 + p.radius;
        if (dx * dx + dz * dz <= rr * rr) p.deactivate();
      }
    }
  }

  castOverheatEmp(): void {
    const { player, waves, vfx, audio, hud, feel, worldFx, onEnemyKilled } = this.deps;
    audio.overheat();
    hud.pushKillFeed(t().overheatEmp, 'boss');
    hud.showWaveBanner(t().empCascade, true);
    vfx.spawnShockwave(player.group.position, '#f97316', OVERHEAT_EMP_RADIUS * 0.7);
    worldFx.triggerPulse(player.group.position, '#f97316', OVERHEAT_EMP_RADIUS);
    feel.triggerHitstop(0.1);
    feel.triggerFovPunch(4);
    const origin = player.group.position;
    for (const enemy of waves.enemies) {
      if (!enemy.alive) continue;
      const dx = enemy.group.position.x - origin.x;
      const dz = enemy.group.position.z - origin.z;
      if (dx * dx + dz * dz <= OVERHEAT_EMP_RADIUS * OVERHEAT_EMP_RADIUS) {
        enemy.staggerTimer = Math.max(enemy.staggerTimer, 0.55);
        const died = enemy.takeDamage(OVERHEAT_EMP_DAMAGE);
        vfx.spawnBurst(enemy.group.position.clone().setY(0.4), '#f97316', 8, 5);
        if (died) onEnemyKilled(enemy);
      }
    }
  }

  spawnArcChains(from: THREE.Vector3, count: number): void {
    if (this.chainDepth >= 4) return;
    const { waves, vfx, audio, combatMods, rng, onEnemyKilled } = this.deps;
    this.chainDepth += 1;
    try {
      const range = combatMods.plasmaSuperconduct
        ? ARC_CHAIN_RANGE * PLASMA_SUPERCONDUCT_RANGE_MUL
        : ARC_CHAIN_RANGE;
      const candidates = waves.enemies
        .filter((e) => e.alive)
        .map((e) => ({
          e,
          d:
            (e.group.position.x - from.x) * (e.group.position.x - from.x) +
            (e.group.position.z - from.z) * (e.group.position.z - from.z),
        }))
        .filter((c) => c.d > 0.01 && c.d <= range * range)
        .sort((a, b) => a.d - b.d)
        .slice(0, count);

      let hop = 0;
      for (const { e } of candidates) {
        let dmg = ARC_CHAIN_DAMAGE;
        if (combatMods.plasmaSuperconduct) {
          dmg *= Math.pow(PLASMA_SUPERCONDUCT_DECAY, hop);
        }
        const crit = combatMods.critConductor && rng() < 0.35;
        if (crit) dmg *= CRIT_MULTIPLIER;
        vfx.spawnBurst(e.group.position.clone().setY(0.5), crit ? '#fbbf24' : '#38bdf8', 7, 4.5);
        const died = e.takeDamage(dmg);
        audio.hit();
        if (died) onEnemyKilled(e, { sourceWeapon: 'plasma', damage: dmg });
        else e.staggerTimer = Math.max(e.staggerTimer, 0.12);
        hop += 1;
      }
    } finally {
      this.chainDepth -= 1;
    }
  }

  private maybeRailRicochet(p: Projectile, from: THREE.Vector3): void {
    const { combatMods, projectiles, waves } = this.deps;
    if (!combatMods.railRicochet) return;
    if (p.sourceWeapon !== 'rail' || p.owner !== 'player') return;
    if (p.ricocheted) return;
    p.ricocheted = true;
    let nearest: Enemy | null = null;
    let best = Infinity;
    for (const e of waves.enemies) {
      if (!e.alive || p.hitSet.has(e.group.uuid)) continue;
      const dx = e.group.position.x - from.x;
      const dz = e.group.position.z - from.z;
      const d = dx * dx + dz * dz;
      if (d < best && d > 0.05) {
        best = d;
        nearest = e;
      }
    }
    if (!nearest) return;
    const dir = new THREE.Vector3(
      nearest.group.position.x - from.x,
      0,
      nearest.group.position.z - from.z,
    ).normalize();
    projectiles.spawn(from.clone(), dir, 36, p.damage * 0.85, 'player', '#fcd34d', {
      sourceWeapon: 'rail',
      pierce: 0,
    });
  }

  maybeShieldNova(): void {
    if (!this.deps.combatMods.shieldNova) return;
    const { player, waves, vfx, hud, onEnemyKilled } = this.deps;
    hud.pushKillFeed(t().shieldNova, 'ranged');
    vfx.spawnShockwave(player.group.position, '#3ec6ff', SHIELD_NOVA_RADIUS * 0.75);
    const origin = player.group.position;
    for (const enemy of waves.enemies) {
      if (!enemy.alive) continue;
      const dx = enemy.group.position.x - origin.x;
      const dz = enemy.group.position.z - origin.z;
      const distSq = dx * dx + dz * dz;
      if (distSq > SHIELD_NOVA_RADIUS * SHIELD_NOVA_RADIUS) continue;
      const dist = Math.max(Math.sqrt(distSq), 0.0001);
      enemy.knockback(dx / dist, dz / dist, 14, 0.2);
      const died = enemy.takeDamage(SHIELD_NOVA_DAMAGE);
      if (died) onEnemyKilled(enemy);
    }
  }

  tickDashBlasts(delta: number): void {
    const { waves, vfx, worldFx, feel, onEnemyKilled } = this.deps;
    for (let i = this.dashBlasts.length - 1; i >= 0; i -= 1) {
      const blast = this.dashBlasts[i];
      blast.timer -= delta;
      if (blast.timer > 0) continue;
      vfx.spawnShockwave(blast.pos, '#f472b6', DASH_BLAST_RADIUS * 0.8);
      worldFx.triggerPulse(blast.pos, '#f472b6', DASH_BLAST_RADIUS);
      feel.triggerFovPunch(2);
      for (const enemy of waves.enemies) {
        if (!enemy.alive) continue;
        const dx = enemy.group.position.x - blast.pos.x;
        const dz = enemy.group.position.z - blast.pos.z;
        if (dx * dx + dz * dz > DASH_BLAST_RADIUS * DASH_BLAST_RADIUS) continue;
        const died = enemy.takeDamage(DASH_BLAST_DAMAGE);
        vfx.spawnBurst(enemy.group.position.clone().setY(0.4), '#f472b6', 6, 4);
        if (died) onEnemyKilled(enemy);
      }
      this.dashBlasts.splice(i, 1);
    }
  }

  tickIonBlasts(delta: number): void {
    for (let i = this.ionBlasts.length - 1; i >= 0; i -= 1) {
      const blast = this.ionBlasts[i];
      blast.timer -= delta;
      if (blast.timer > 0) continue;
      this.explodeIon(blast.pos, blast.damage, blast.radius);
      this.ionBlasts.splice(i, 1);
    }
  }
}
