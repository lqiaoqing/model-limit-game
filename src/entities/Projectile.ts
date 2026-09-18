import * as THREE from 'three';

export type ProjectileOwner = 'player' | 'enemy';
export type ProjectileStyle = 'plasma' | 'rail' | 'scatter' | 'launcher' | 'enemy';

/** Visual + hitbox profile per weapon so shots read differently at a glance. */
const STYLE_PROFILES: Record<
  ProjectileStyle,
  {
    coreScale: [number, number, number];
    trailScale: [number, number, number];
    trailOffsetZ: number;
    trailOpacity: number;
    radius: number;
  }
> = {
  // Round energy bolt, medium streak
  plasma: {
    coreScale: [1.05, 1.05, 1.2],
    trailScale: [0.9, 0.9, 1.4],
    trailOffsetZ: 0.42,
    trailOpacity: 0.5,
    radius: 0.13,
  },
  // Long thin rail slug — needle + long tracer
  rail: {
    coreScale: [0.55, 0.55, 2.4],
    trailScale: [0.35, 0.35, 3.2],
    trailOffsetZ: 0.9,
    trailOpacity: 0.72,
    radius: 0.1,
  },
  // Compact pink pellet — short stubby burst
  scatter: {
    coreScale: [1.25, 1.25, 0.85],
    trailScale: [0.75, 0.75, 0.7],
    trailOffsetZ: 0.28,
    trailOpacity: 0.4,
    radius: 0.11,
  },
  // Heavy ion warhead — fat core + short stubby trail
  launcher: {
    coreScale: [1.7, 1.7, 1.35],
    trailScale: [1.15, 1.15, 0.9],
    trailOffsetZ: 0.38,
    trailOpacity: 0.55,
    radius: 0.22,
  },
  // Enemy shots — larger violet orb
  enemy: {
    coreScale: [1.4, 1.4, 1.35],
    trailScale: [1.1, 1.1, 1.1],
    trailOffsetZ: 0.35,
    trailOpacity: 0.4,
    radius: 0.16,
  },
};

export class Projectile {
  readonly group = new THREE.Group();
  readonly velocity = new THREE.Vector3();
  active = false;
  life = 0;
  damage = 0;
  owner: ProjectileOwner = 'player';
  radius = 0.12;
  pierce = 0;
  crit = false;
  sourceWeapon: string | null = null;
  /** Radial blast on impact; 0 = no explosion. */
  aoeRadius = 0;
  /** Rail ricochet already used for this shot. */
  ricocheted = false;
  /** Targets already damaged by this projectile (prevents pierce re-hits). */
  readonly hitSet = new Set<string>();
  /** How many targets this projectile has already damaged. */
  hitsLanded = 0;

  private readonly core: THREE.Mesh;
  private readonly trail: THREE.Mesh;
  private readonly coreGeo: THREE.SphereGeometry;
  private readonly trailGeo: THREE.BoxGeometry;
  private readonly coreMat: THREE.MeshBasicMaterial;
  private readonly trailMat: THREE.MeshBasicMaterial;

  constructor() {
    // Unit geometry — profile scales applied per shot.
    this.coreGeo = new THREE.SphereGeometry(0.11, 10, 8);
    this.trailGeo = new THREE.BoxGeometry(0.06, 0.06, 0.55);
    this.coreMat = new THREE.MeshBasicMaterial({ color: '#22d3ee' });
    this.trailMat = new THREE.MeshBasicMaterial({
      color: '#22d3ee',
      transparent: true,
      opacity: 0.45,
    });
    this.core = new THREE.Mesh(this.coreGeo, this.coreMat);
    this.trail = new THREE.Mesh(this.trailGeo, this.trailMat);
    this.trail.position.z = 0.35;
    this.group.add(this.trail, this.core);
    this.group.visible = false;
  }

  fire(
    origin: THREE.Vector3,
    direction: THREE.Vector3,
    speed: number,
    damage: number,
    owner: ProjectileOwner,
    color: string,
    extras?: {
      pierce?: number;
      crit?: boolean;
      sourceWeapon?: string | null;
      aoeRadius?: number;
    },
  ): void {
    const weapon = extras?.sourceWeapon;
    const style: ProjectileStyle =
      owner === 'enemy'
        ? 'enemy'
        : weapon === 'rail'
          ? 'rail'
          : weapon === 'scatter'
            ? 'scatter'
            : weapon === 'launcher'
              ? 'launcher'
              : 'plasma';
    const profile = STYLE_PROFILES[style];

    this.active = true;
    this.life = style === 'rail' ? 2.6 : style === 'launcher' ? 2.8 : 2.2;
    this.damage = damage;
    this.owner = owner;
    this.pierce = extras?.pierce ?? 0;
    this.crit = extras?.crit ?? false;
    this.sourceWeapon = weapon ?? null;
    this.aoeRadius = extras?.aoeRadius ?? 0;
    this.ricocheted = false;
    this.hitSet.clear();
    this.hitsLanded = 0;
    this.group.visible = true;
    this.group.position.copy(origin);
    this.velocity.copy(direction).normalize().multiplyScalar(speed);
    this.coreMat.color.set(color);
    this.trailMat.color.set(color);
    this.trailMat.opacity = profile.trailOpacity;
    this.radius = profile.radius;

    const [cx, cy, cz] = profile.coreScale;
    this.core.scale.set(cx, cy, cz);
    const [tx, ty, tz] = profile.trailScale;
    this.trail.scale.set(tx, ty, tz);
    this.trail.position.z = profile.trailOffsetZ;

    // Crit hits glow hotter / slightly fatter core
    if (this.crit) {
      this.core.scale.multiplyScalar(1.25);
      this.trailMat.opacity = Math.min(1, profile.trailOpacity + 0.25);
    }

    this.group.rotation.set(0, 0, 0);
    const dir = this.velocity.clone().normalize();
    this.group.lookAt(this.group.position.clone().add(dir));
  }

  update(delta: number): void {
    if (!this.active) return;
    this.life -= delta;
    this.group.position.addScaledVector(this.velocity, delta);
    if (this.life <= 0) this.deactivate();
  }

  deactivate(): void {
    this.active = false;
    this.group.visible = false;
  }

  dispose(): void {
    this.coreGeo.dispose();
    this.trailGeo.dispose();
    this.coreMat.dispose();
    this.trailMat.dispose();
  }
}

export class ProjectilePool {
  readonly projectiles: Projectile[] = [];

  constructor(
    private readonly scene: THREE.Scene,
    size = 280,
  ) {
    for (let i = 0; i < size; i += 1) {
      const p = new Projectile();
      this.projectiles.push(p);
      scene.add(p.group);
    }
  }

  spawn(
    origin: THREE.Vector3,
    direction: THREE.Vector3,
    speed: number,
    damage: number,
    owner: ProjectileOwner,
    color: string,
    extras?: {
      pierce?: number;
      crit?: boolean;
      sourceWeapon?: string | null;
      aoeRadius?: number;
    },
  ): Projectile | null {
    for (const p of this.projectiles) {
      if (!p.active) {
        p.fire(origin, direction, speed, damage, owner, color, extras);
        return p;
      }
    }
    return null;
  }

  update(delta: number): void {
    for (const p of this.projectiles) p.update(delta);
  }

  clear(): void {
    for (const p of this.projectiles) p.deactivate();
  }

  activeCount(): number {
    let n = 0;
    for (const p of this.projectiles) if (p.active) n += 1;
    return n;
  }

  dispose(): void {
    for (const p of this.projectiles) {
      this.scene.remove(p.group);
      p.dispose();
    }
  }
}
