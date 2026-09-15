import * as THREE from 'three';

type Particle = {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  scale: number;
};

export class VfxSystem {
  private readonly particles: Particle[] = [];
  private readonly pool: Particle[] = [];
  private readonly geometry = new THREE.SphereGeometry(0.08, 6, 6);
  private trauma = 0;

  constructor(
    private readonly scene: THREE.Scene,
    private readonly rng: () => number = Math.random,
  ) {}

  spawnBurst(position: THREE.Vector3, color: string, count = 10, speed = 6): void {
    for (let i = 0; i < count; i += 1) {
      const p = this.acquire();
      const mat = p.mesh.material as THREE.MeshBasicMaterial;
      mat.color.set(color);
      p.mesh.position.copy(position);
      p.mesh.visible = true;
      const theta = this.rng() * Math.PI * 2;
      const phi = Math.acos(2 * this.rng() - 1);
      const s = speed * (0.4 + this.rng() * 0.8);
      p.velocity.set(
        Math.sin(phi) * Math.cos(theta) * s,
        Math.abs(Math.cos(phi)) * s * 0.6,
        Math.sin(phi) * Math.sin(theta) * s,
      );
      p.maxLife = 0.35 + this.rng() * 0.35;
      p.life = p.maxLife;
      p.scale = 0.7 + this.rng() * 0.8;
      p.mesh.scale.setScalar(p.scale);
      this.particles.push(p);
    }
  }

  spawnShockwave(position: THREE.Vector3, color: string, radius = 7): void {
    const geo = new THREE.RingGeometry(0.2, 0.45, 48);
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
    const start = performance.now();
    const animate = () => {
      const t = (performance.now() - start) / 450;
      if (t >= 1) {
        this.scene.remove(mesh);
        geo.dispose();
        mat.dispose();
        return;
      }
      mesh.scale.setScalar(1 + t * radius);
      mat.opacity = 0.85 * (1 - t);
      requestAnimationFrame(animate);
    };
    animate();
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

  update(delta: number): void {
    for (let i = this.particles.length - 1; i >= 0; i -= 1) {
      const p = this.particles[i];
      p.life -= delta;
      p.velocity.y -= 12 * delta;
      p.mesh.position.addScaledVector(p.velocity, delta);
      if (p.mesh.position.y < 0.05) {
        p.mesh.position.y = 0.05;
        p.velocity.y *= -0.35;
        p.velocity.x *= 0.7;
        p.velocity.z *= 0.7;
      }
      const t = Math.max(0, p.life / p.maxLife);
      p.mesh.scale.setScalar(p.scale * t);
      if (p.life <= 0) {
        p.mesh.visible = false;
        this.particles.splice(i, 1);
        this.pool.push(p);
      }
    }
  }

  reset(): void {
    for (const p of this.particles) {
      p.mesh.visible = false;
      this.pool.push(p);
    }
    this.particles.length = 0;
    this.trauma = 0;
  }

  dispose(): void {
    this.reset();
    for (const p of this.pool) {
      this.scene.remove(p.mesh);
      (p.mesh.material as THREE.Material).dispose();
    }
    this.pool.length = 0;
    this.geometry.dispose();
  }

  private acquire(): Particle {
    const existing = this.pool.pop();
    if (existing) return existing;
    const mat = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    const mesh = new THREE.Mesh(this.geometry, mat);
    mesh.visible = false;
    this.scene.add(mesh);
    return {
      mesh,
      velocity: new THREE.Vector3(),
      life: 0,
      maxLife: 1,
      scale: 1,
    };
  }
}
