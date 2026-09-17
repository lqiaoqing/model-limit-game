import * as THREE from 'three';
import type { Player } from '../entities/Player';
import type { ProjectilePool } from '../entities/Projectile';
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
  OVERHEAT_EMP_DAMAGE,
  OVERHEAT_EMP_RADIUS,
  SCATTER_CLOSE_RANGE,
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
};

/** Weapon fire, projectile hits, and rule-modifier combat side effects. */
export class CombatSystem {
  private readonly dashBlasts: Array<{ pos: THREE.Vector3; timer: number }> = [];
  private chainDepth = 0;
  private readonly tmpDir = new THREE.Vector3();
  private readonly tmpUp = new THREE.Vector3(0, 1, 0);

  constructor(private readonly deps: CombatDeps) {}

  reset(): void {
    this.dashBlasts.length = 0;
    this.chainDepth = 0;
  }

  queueDashBlast(position: THREE.Vector3): void {
    if (!this.deps.combatMods.dashDetonation) return;
    this.dashBlasts.push({ pos: position.clone().setY(0.2), timer: 0.28 });
    this.deps.vfx.spawnBurst(position.clone().setY(0.2), '#f472b6', 6, 3.5);
  }

  firePlayerWeapon(): void {
    const { player, projectiles, vfx, audio, feel, getBuild, getWeapon } = this.deps;
    const build = getBuild();
    const resolved = resolveWeaponStats(build, getWeapon());
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
        resolved.damage,
        'player',
        resolved.color,
        { pierce: resolved.pierce, sourceWeapon: resolved.def.id },
      );
    }
    this.deps.onShot?.(resolved.pellets, resolved.def.id);
    const weaponId = resolved.def.id;
    const burstCount = weaponId === 'scatter' ? 8 : weaponId === 'rail' ? 6 : 3;
    const burstSpeed = weaponId === 'rail' ? 6.5 : weaponId === 'scatter' ? 4.2 : 3.5;
    vfx.spawnBurst(player.muzzle, resolved.color, burstCount, burstSpeed);
    vfx.spawnBurst(
      player.muzzle
        .clone()
        .add(new THREE.Vector3(-player.aim.y, 0.1, player.aim.x).multiplyScalar(0.2)),
      resolved.color,
      weaponId === 'rail' ? 3 : 1,
      2.2,
    );
    feel.triggerFovPunch(resolved.def.id === 'rail' ? 2.2 : 1.1);
  }

  resolveProjectileHits(arena: { halfWidth: number; halfDepth: number }, covers: { blocksPoint(p: THREE.Vector3): boolean; takeDamage(n: number): void }[]): void {
    const { player, projectiles, waves, vfx, audio, decals, feel, combatMods, onEnemyKilled } =
      this.deps;
    for (const p of projectiles.projectiles) {
      if (!p.active) continue;
      const pos = p.group.position;

      if (Math.abs(pos.x) > arena.halfWidth + 2 || Math.abs(pos.z) > arena.halfDepth + 2) {
        p.deactivate();
        continue;
      }

      let blocked = false;
      for (const cover of covers) {
        if (cover.blocksPoint(pos)) {
          cover.takeDamage(p.damage * 0.5);
          vfx.spawnBurst(pos, '#94a3b8', 4, 3);
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
            let dmg = p.damage;
            const playerMul = this.deps.getPlayerDamageMul?.() ?? 1;
            if (playerMul !== 1) dmg *= playerMul;
            if (this.deps.getEnemyOneHp?.()) dmg = Math.max(dmg, 999999);
            if (
              combatMods.scatterCloseBonus &&
              p.sourceWeapon === 'scatter' &&
              pos.distanceTo(player.group.position) < SCATTER_CLOSE_RANGE
            ) {
              dmg *= 1.35;
            }
            if (combatMods.railPierce > 0 && p.sourceWeapon === 'rail') {
              dmg *= 1 + p.hitsLanded * 0.08;
            }
            p.hitsLanded += 1;
            const died = enemy.takeDamage(dmg);
            this.deps.onDamageDealt?.(dmg, p.sourceWeapon);
            audio.hit();
            vfx.spawnBurst(pos, p.crit ? '#fbbf24' : enemy.stats.color, p.crit ? 10 : 6, 5);
            if (!died) decals.spawnImpact(pos, enemy.stats.color);
            if (died) onEnemyKilled(enemy, p);
            else feel.triggerHitstop(0.03);
            if (p.pierce > 0) p.pierce -= 1;
            else p.deactivate();
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
      const candidates = waves.enemies
        .filter((e) => e.alive)
        .map((e) => ({
          e,
          d:
            (e.group.position.x - from.x) * (e.group.position.x - from.x) +
            (e.group.position.z - from.z) * (e.group.position.z - from.z),
        }))
        .filter((c) => c.d > 0.01 && c.d <= ARC_CHAIN_RANGE * ARC_CHAIN_RANGE)
        .sort((a, b) => a.d - b.d)
        .slice(0, count);

      for (const { e } of candidates) {
        let dmg = ARC_CHAIN_DAMAGE;
        const crit = combatMods.critConductor && rng() < 0.35;
        if (crit) dmg *= CRIT_MULTIPLIER;
        vfx.spawnBurst(e.group.position.clone().setY(0.5), crit ? '#fbbf24' : '#38bdf8', 7, 4.5);
        const died = e.takeDamage(dmg);
        audio.hit();
        if (died) onEnemyKilled(e);
        else e.staggerTimer = Math.max(e.staggerTimer, 0.12);
      }
    } finally {
      this.chainDepth -= 1;
    }
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
}
