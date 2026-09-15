import * as THREE from 'three';

export type ProjectileOwner = 'player' | 'enemy';

export class Projectile {
  readonly group = new THREE.Group();
  readonly velocity = new THREE.Vector3();
  active = false;
  life = 0;
  damage = 0;
  owner: ProjectileOwner = 'player';
  radius = 0.12;

  private readonly core: THREE.Mesh;
  private readonly trail: THREE.Mesh;
  private readonly coreGeo: THREE.SphereGeometry;
  private readonly trailGeo: THREE.BoxGeometry;
  private readonly coreMat: THREE.MeshBasicMaterial;
  private readonly trailMat: THREE.MeshBasicMaterial;

  constructor() {
    this.coreGeo = new THREE.SphereGeometry(0.11, 8, 8);
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
  ): void {
    this.active = true;
    this.life = 2.2;
    this.damage = damage;
    this.owner = owner;
    this.group.visible = true;
    this.group.position.copy(origin);
    this.velocity.copy(direction).normalize().multiplyScalar(speed);
    this.coreMat.color.set(color);
    this.trailMat.color.set(color);
    this.radius = owner === 'player' ? 0.12 : 0.16;
    const scale = owner === 'player' ? 1 : 1.35;
    this.core.scale.setScalar(scale);
    this.trail.scale.set(scale, scale, scale * 1.2);
    // Orient trail along velocity
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
    size = 180,
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
  ): Projectile | null {
    for (const p of this.projectiles) {
      if (!p.active) {
        p.fire(origin, direction, speed, damage, owner, color);
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
