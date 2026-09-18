import * as THREE from 'three';
import type { Enemy } from '../entities/Enemy';
import type { Player } from '../entities/Player';

export type HazardKind = 'laser_gate' | 'shock_zone' | 'overload_core';
export type HazardPhase = 'warning' | 'active' | 'cooldown';

export type HazardState = {
  id: string;
  kind: HazardKind;
  phase: HazardPhase;
  timer: number;
  /** Laser: line through center along axis; shock/core: circle. */
  x: number;
  z: number;
  /** Laser orientation (0 = along Z / north-south cut, 1 = along X). */
  axis: 0 | 1;
  radius: number;
  /** Overload core remaining integrity; null for other kinds. */
  coreHp: number | null;
  coreMaxHp: number | null;
  kills: number;
  playerTriggered: boolean;
};

export type HazardDamageEvent = {
  hazardId: string;
  kind: HazardKind;
  target: 'player' | 'enemy';
  amount: number;
  killed: boolean;
};

type ActiveHazard = HazardState & {
  warningDur: number;
  activeDur: number;
  cooldownDur: number;
  dps: number;
  tickAcc: number;
};

const WARNING_COLOR = '#fbbf24';
const ACTIVE_COLORS: Record<HazardKind, string> = {
  laser_gate: '#f43f5e',
  shock_zone: '#a78bfa',
  overload_core: '#4ade80',
};

export type ArenaBounds = { halfWidth: number; halfDepth: number };

/** How many hazards may exist for a given wave. */
export function hazardBudgetForWave(wave: number): number {
  if (wave <= 2) return 0;
  if (wave <= 5) return 1;
  if (wave <= 10) return 2;
  return 2;
}

function kindPoolForWave(wave: number): HazardKind[] {
  const pool: HazardKind[] = ['laser_gate', 'shock_zone'];
  if (wave >= 4) pool.push('overload_core');
  return pool;
}

/**
 * Seeded arena hazards: telegraph → active → cooldown.
 * All player damage is telegraphed; cores can be shot to blast enemies.
 */
export class ArenaHazardSystem {
  readonly hazards: ActiveHazard[] = [];
  private spawnTimer = 4;
  private seq = 0;
  private readonly group = new THREE.Group();
  private readonly visual = new Map<string, THREE.Object3D>();

  constructor(
    private readonly scene: THREE.Scene,
    private readonly bounds: ArenaBounds,
    private readonly rng: () => number,
  ) {
    scene.add(this.group);
  }

  reset(): void {
    for (const h of this.hazards) this.removeVisual(h.id);
    this.hazards.length = 0;
    this.spawnTimer = 3.5;
    this.seq = 0;
  }

  dispose(): void {
    this.reset();
    this.scene.remove(this.group);
  }

  /** Deterministic schedule helper for tests. */
  planSchedule(wave: number, seed: number): HazardKind[] {
    const budget = hazardBudgetForWave(wave);
    if (budget <= 0) return [];
    // Independent RNG stream so schedule does not steal combat dice.
    let s = seed >>> 0 || 1;
    const rand = () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
    const pool = kindPoolForWave(wave);
    const count = 1 + Math.floor(rand() * budget);
    const out: HazardKind[] = [];
    for (let i = 0; i < count; i += 1) {
      out.push(pool[Math.floor(rand() * pool.length)]);
    }
    return out;
  }

  snapshot(): HazardState[] {
    return this.hazards.map((h) => ({
      id: h.id,
      kind: h.kind,
      phase: h.phase,
      timer: h.timer,
      x: h.x,
      z: h.z,
      axis: h.axis,
      radius: h.radius,
      coreHp: h.coreHp,
      coreMaxHp: h.coreMaxHp,
      kills: h.kills,
      playerTriggered: h.playerTriggered,
    }));
  }

  /** Test / design hook: force-spawn a hazard kind. */
  forceSpawn(kind: HazardKind): HazardState {
    const h = this.createHazard(kind);
    this.hazards.push(h);
    this.syncVisual(h);
    return {
      id: h.id,
      kind: h.kind,
      phase: h.phase,
      timer: h.timer,
      x: h.x,
      z: h.z,
      axis: h.axis,
      radius: h.radius,
      coreHp: h.coreHp,
      coreMaxHp: h.coreMaxHp,
      kills: h.kills,
      playerTriggered: h.playerTriggered,
    };
  }

  /** Called when a player projectile may hit a core. Returns true if core broke. */
  tryDamageCore(hazardId: string, damage: number): boolean {
    const h = this.hazards.find((x) => x.id === hazardId && x.kind === 'overload_core');
    if (!h || h.coreHp == null || h.phase === 'cooldown') return false;
    h.coreHp -= damage;
    h.playerTriggered = true;
    if (h.coreHp > 0) return false;
    h.coreHp = 0;
    h.phase = 'active';
    h.timer = 0.01; // explode immediately on next tick
    return true;
  }

  private createHazard(kind: HazardKind): ActiveHazard {
    this.seq += 1;
    const hw = this.bounds.halfWidth - 1.5;
    const hd = this.bounds.halfDepth - 1.5;
    const x = (this.rng() - 0.5) * hw * 1.2;
    const z = (this.rng() - 0.5) * hd * 1.2;
    const axis: 0 | 1 = this.rng() < 0.5 ? 0 : 1;
    const base = {
      id: `hz_${this.seq}`,
      kind,
      phase: 'warning' as HazardPhase,
      x,
      z,
      axis,
      radius: kind === 'overload_core' ? 2.8 : kind === 'shock_zone' ? 2.4 : 0,
      coreHp: kind === 'overload_core' ? 40 : null,
      coreMaxHp: kind === 'overload_core' ? 40 : null,
      kills: 0,
      playerTriggered: false,
      tickAcc: 0,
    };
    if (kind === 'laser_gate') {
      return { ...base, warningDur: 1.2, activeDur: 2.2, cooldownDur: 3.5, dps: 18, timer: 1.2 };
    }
    if (kind === 'shock_zone') {
      return { ...base, warningDur: 1.0, activeDur: 2.8, cooldownDur: 3.2, dps: 12, timer: 1.0 };
    }
    // Overload core sits until destroyed or times out into a voluntary blast window.
    return { ...base, warningDur: 0.8, activeDur: 0.35, cooldownDur: 4.0, dps: 36, timer: 0.8 };
  }

  private removeVisual(id: string): void {
    const obj = this.visual.get(id);
    if (!obj) return;
    this.group.remove(obj);
    obj.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        node.geometry.dispose();
        const mat = node.material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat.dispose();
      }
    });
    this.visual.delete(id);
  }

  private syncVisual(h: ActiveHazard): void {
    this.removeVisual(h.id);
    const g = new THREE.Group();
    const color =
      h.phase === 'warning' ? WARNING_COLOR : ACTIVE_COLORS[h.kind];
    const opacity = h.phase === 'warning' ? 0.35 : h.phase === 'active' ? 0.7 : 0.12;
    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    if (h.kind === 'laser_gate') {
      const len = (h.axis === 0 ? this.bounds.halfDepth : this.bounds.halfWidth) * 2;
      const geo = new THREE.PlaneGeometry(h.axis === 0 ? 0.28 : len, h.axis === 0 ? len : 0.28);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(h.x, 0.08, h.z);
      g.add(mesh);
    } else if (h.kind === 'shock_zone') {
      const geo = new THREE.RingGeometry(h.radius * 0.55, h.radius, 28);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(h.x, 0.06, h.z);
      g.add(mesh);
    } else {
      const geo = new THREE.IcosahedronGeometry(0.45, 0);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(h.x, 0.55, h.z);
      g.add(mesh);
      const ringGeo = new THREE.RingGeometry(h.radius * 0.7, h.radius, 24);
      const ring = new THREE.Mesh(
        ringGeo,
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.25,
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(h.x, 0.04, h.z);
      g.add(ring);
    }
    this.group.add(g);
    this.visual.set(h.id, g);
  }

  update(
    delta: number,
    wave: number,
    player: Player,
    enemies: Enemy[],
    onEvent: (e: HazardDamageEvent) => void,
  ): void {
    // Natural schedule
    const budget = hazardBudgetForWave(wave);
    if (budget > 0 && this.hazards.length < budget) {
      this.spawnTimer -= delta;
      if (this.spawnTimer <= 0) {
        const pool = kindPoolForWave(wave);
        const kind = pool[Math.floor(this.rng() * pool.length) % pool.length];
        this.forceSpawn(kind);
        this.spawnTimer = 5.5 + this.rng() * 3.5;
      }
    }

    for (let i = this.hazards.length - 1; i >= 0; i -= 1) {
      const h = this.hazards[i];
      h.timer -= delta;

      if (h.phase === 'warning' && h.timer <= 0) {
        h.phase = 'active';
        h.timer = h.kind === 'overload_core' ? h.activeDur : h.activeDur;
        this.syncVisual(h);
      } else if (h.phase === 'active' && h.timer <= 0) {
        if (h.kind === 'overload_core') {
          // Detonation (player-shot cores arrive here with timer ~0).
          this.detonateCore(h, player, enemies, onEvent);
          h.phase = 'cooldown';
          h.timer = h.cooldownDur;
          this.syncVisual(h);
        } else {
          h.phase = 'cooldown';
          h.timer = h.cooldownDur;
          this.syncVisual(h);
        }
      } else if (h.phase === 'cooldown' && h.timer <= 0) {
        this.removeVisual(h.id);
        this.hazards.splice(i, 1);
        continue;
      }

      if (h.phase === 'active' && h.kind !== 'overload_core') {
        this.applyFieldDamage(h, delta, player, enemies, onEvent);
      }

      // Keep visuals fresh on phase transitions only (already synced).
    }
  }

  private pointInHazard(h: ActiveHazard, x: number, z: number): boolean {
    if (h.kind === 'laser_gate') {
      if (h.axis === 0) return Math.abs(x - h.x) < 0.45;
      return Math.abs(z - h.z) < 0.45;
    }
    const dx = x - h.x;
    const dz = z - h.z;
    return dx * dx + dz * dz <= h.radius * h.radius;
  }

  private applyFieldDamage(
    h: ActiveHazard,
    delta: number,
    player: Player,
    enemies: Enemy[],
    onEvent: (e: HazardDamageEvent) => void,
  ): void {
    h.tickAcc += delta;
    if (h.tickAcc < 0.25) return;
    const step = h.tickAcc;
    h.tickAcc = 0;
    const amount = h.dps * step;

    if (player.alive && this.pointInHazard(h, player.group.position.x, player.group.position.z)) {
      const hurt = player.takeDamage(amount);
      onEvent({
        hazardId: h.id,
        kind: h.kind,
        target: 'player',
        amount,
        killed: !player.alive,
      });
      if (h.kind === 'shock_zone' && hurt.hit) {
        // Soft slow is applied by Game via hazard flag; event carries the cue.
      }
    }

    for (const enemy of enemies) {
      if (!enemy.alive) continue;
      if (!this.pointInHazard(h, enemy.group.position.x, enemy.group.position.z)) continue;
      const died = enemy.takeDamage(amount, new THREE.Vector3(h.x, 0, h.z));
      if (died) h.kills += 1;
      onEvent({
        hazardId: h.id,
        kind: h.kind,
        target: 'enemy',
        amount,
        killed: died,
      });
    }
  }

  private detonateCore(
    h: ActiveHazard,
    player: Player,
    enemies: Enemy[],
    onEvent: (e: HazardDamageEvent) => void,
  ): void {
    const radius = h.radius;
    const damage = 48;
    for (const enemy of enemies) {
      if (!enemy.alive) continue;
      const dx = enemy.group.position.x - h.x;
      const dz = enemy.group.position.z - h.z;
      if (dx * dx + dz * dz > radius * radius) continue;
      const died = enemy.takeDamage(damage, new THREE.Vector3(h.x, 0, h.z));
      if (died) h.kills += 1;
      onEvent({
        hazardId: h.id,
        kind: h.kind,
        target: 'enemy',
        amount: damage,
        killed: died,
      });
    }
    // Player only hurt if standing in the blast — fully telegraphed by the core ring.
    if (player.alive && this.pointInHazard(h, player.group.position.x, player.group.position.z)) {
      const amount = 28;
      player.takeDamage(amount);
      onEvent({
        hazardId: h.id,
        kind: h.kind,
        target: 'player',
        amount,
        killed: !player.alive,
      });
    }
  }

  /** Does a player projectile segment currently overlap any shootable core? */
  findCoreHit(x: number, z: number, radius = 0.35): string | null {
    for (const h of this.hazards) {
      if (h.kind !== 'overload_core' || h.phase === 'cooldown') continue;
      if (h.coreHp == null || h.coreHp <= 0) continue;
      const dx = x - h.x;
      const dz = z - h.z;
      const rr = 0.55 + radius;
      if (dx * dx + dz * dz <= rr * rr) return h.id;
    }
    return null;
  }

  /** Shock-zone pressure for Game soft-control. */
  playerInShock(player: Player): boolean {
    for (const h of this.hazards) {
      if (h.kind !== 'shock_zone' || h.phase !== 'active') continue;
      if (this.pointInHazard(h, player.group.position.x, player.group.position.z)) return true;
    }
    return false;
  }
}
