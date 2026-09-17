import * as THREE from 'three';

type BurstParticle = {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  scale: number;
  r: number;
  g: number;
  b: number;
};

type Shockwave = {
  mesh: THREE.Mesh;
  geo: THREE.RingGeometry;
  mat: THREE.MeshBasicMaterial;
  start: number;
  radius: number;
};

/**
 * High-count particle pool rendered as one InstancedMesh.
 * Shockwaves stay as short-lived ring meshes (low count, high readability).
 */
export class VfxSystem {
  private readonly bursts: BurstParticle[] = [];
  private readonly shocks: Shockwave[] = [];
  private readonly dummy = new THREE.Object3D();
  private readonly color = new THREE.Color();
  private trauma = 0;
  private readonly mesh: THREE.InstancedMesh;
  private readonly geometry = new THREE.SphereGeometry(0.08, 5, 4);
  private readonly material = new THREE.MeshBasicMaterial({
    color: '#ffffff',
    transparent: true,
    opacity: 0.95,
    depthWrite: false,
  });

  constructor(
    private readonly scene: THREE.Scene,
    private readonly rng: () => number = Math.random,
    capacity = 4000,
  ) {
    this.mesh = new THREE.InstancedMesh(this.geometry, this.material, capacity);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.frustumCulled = false;
    this.mesh.count = 0;
    this.mesh.castShadow = false;
    this.mesh.receiveShadow = false;
    scene.add(this.mesh);
  }

  spawnBurst(position: THREE.Vector3, color: string, count = 10, speed = 6): void {
    this.color.set(color);
    const r = this.color.r;
    const g = this.color.g;
    const b = this.color.b;
    const budget = Math.max(0, this.mesh.instanceMatrix.count - this.bursts.length);
    const n = Math.min(count, budget);
    for (let i = 0; i < n; i += 1) {
      const theta = this.rng() * Math.PI * 2;
      const phi = Math.acos(2 * this.rng() - 1);
      const s = speed * (0.4 + this.rng() * 0.8);
      const life = 0.35 + this.rng() * 0.35;
      this.bursts.push({
        x: position.x,
        y: position.y,
        z: position.z,
        vx: Math.sin(phi) * Math.cos(theta) * s,
        vy: Math.abs(Math.cos(phi)) * s * 0.6,
        vz: Math.sin(phi) * Math.sin(theta) * s,
        life,
        maxLife: life,
        scale: 0.7 + this.rng() * 0.8,
        r,
        g,
        b,
      });
    }
  }

  spawnShockwave(position: THREE.Vector3, color: string, radius = 7): void {
    if (this.shocks.length > 24) return;
    const geo = new THREE.RingGeometry(0.2, 0.45, 32);
    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(position.x, 0.08, position.z);
    this.scene.add(mesh);
    this.shocks.push({ mesh, geo, mat, start: performance.now(), radius });
    this.addTrauma(0.35);
  }

  /** Chaser: tight red spark pop */
  killChaser(position: THREE.Vector3): void {
    this.spawnBurst(position.clone().setY(0.4), '#ef4444', 16, 8);
    this.spawnBurst(position.clone().setY(0.3), '#fbbf24', 8, 5);
    this.spawnShockwave(position, '#ef4444', 2.2);
    this.addTrauma(0.14);
  }

  /** Ranged: violet ring collapse + purple shards */
  killRanged(position: THREE.Vector3): void {
    this.spawnBurst(position.clone().setY(0.55), '#a78bfa', 18, 6);
    this.spawnShockwave(position, '#c4b5fd', 3.2);
    this.addTrauma(0.12);
  }

  /** Elite: amber armor break, heavier */
  killElite(position: THREE.Vector3): void {
    this.spawnBurst(position.clone().setY(0.6), '#f59e0b', 22, 9);
    this.spawnBurst(position.clone().setY(0.4), '#e8eef7', 10, 7);
    this.spawnShockwave(position, '#f59e0b', 4.5);
    this.addTrauma(0.28);
  }

  /** Boss: multi-ring detonation */
  killBoss(position: THREE.Vector3): void {
    this.spawnBurst(position.clone().setY(0.9), '#f43f5e', 36, 12);
    this.spawnBurst(position.clone().setY(0.6), '#fbbf24', 24, 10);
    this.spawnShockwave(position, '#f43f5e', 8);
    window.setTimeout(() => this.spawnShockwave(position, '#fbbf24', 6), 80);
    this.addTrauma(0.7);
  }

  /** Pickup collect: upward green pop */
  pickupPop(position: THREE.Vector3, color = '#4ade80'): void {
    this.spawnBurst(position.clone().setY(0.7), color, 14, 5);
  }

  /** Ult ready / cast ring from player */
  ultWarning(position: THREE.Vector3): void {
    this.spawnShockwave(position, '#a78bfa', 10);
  }

  addTrauma(amount: number): void {
    this.trauma = Math.min(1, this.trauma + amount);
  }

  getShakeOffset(elapsed: number, out: THREE.Vector3): THREE.Vector3 {
    this.trauma = Math.max(0, this.trauma - 0.9 / 60);
    const shake = this.trauma * this.trauma;
    out.set(
      Math.sin(elapsed * 31) * shake * 0.45,
      Math.sin(elapsed * 27) * shake * 0.2,
      Math.cos(elapsed * 29) * shake * 0.45,
    );
    return out;
  }

  activeCount(): number {
    return this.bursts.length;
  }

  update(delta: number): void {
    for (let i = this.bursts.length - 1; i >= 0; i -= 1) {
      const p = this.bursts[i];
      p.life -= delta;
      p.vy -= 12 * delta;
      p.x += p.vx * delta;
      p.y += p.vy * delta;
      p.z += p.vz * delta;
      if (p.y < 0.05) {
        p.y = 0.05;
        p.vy *= -0.35;
        p.vx *= 0.7;
        p.vz *= 0.7;
      }
      if (p.life <= 0) {
        const last = this.bursts.pop();
        if (last && last !== p) this.bursts[i] = last;
      }
    }

    const max = this.mesh.instanceMatrix.count;
    const n = Math.min(this.bursts.length, max);
    for (let i = 0; i < n; i += 1) {
      const p = this.bursts[i];
      const t = Math.max(0, p.life / Math.max(p.maxLife, 0.0001));
      this.dummy.position.set(p.x, p.y, p.z);
      this.dummy.scale.setScalar(p.scale * t);
      this.dummy.rotation.set(0, 0, 0);
      this.dummy.updateMatrix();
      this.mesh.setMatrixAt(i, this.dummy.matrix);
      this.mesh.setColorAt(i, this.color.setRGB(p.r, p.g, p.b));
    }
    this.mesh.count = n;
    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;

    for (let i = this.shocks.length - 1; i >= 0; i -= 1) {
      const s = this.shocks[i];
      const t = (performance.now() - s.start) / 450;
      if (t >= 1) {
        this.scene.remove(s.mesh);
        s.geo.dispose();
        s.mat.dispose();
        this.shocks.splice(i, 1);
        continue;
      }
      s.mesh.scale.setScalar(1 + t * s.radius);
      s.mat.opacity = 0.85 * (1 - t);
    }
  }

  reset(): void {
    this.bursts.length = 0;
    this.mesh.count = 0;
    this.trauma = 0;
    for (const s of this.shocks) {
      this.scene.remove(s.mesh);
      s.geo.dispose();
      s.mat.dispose();
    }
    this.shocks.length = 0;
  }

  dispose(): void {
    this.reset();
    this.scene.remove(this.mesh);
    this.geometry.dispose();
    this.material.dispose();
  }
}
