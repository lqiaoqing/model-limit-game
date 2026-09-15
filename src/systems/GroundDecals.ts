import * as THREE from 'three';

type Decal = {
  mesh: THREE.Mesh;
  life: number;
  maxLife: number;
};

/** Pooled ground scorch / impact decals — material language on the floor. */
export class GroundDecals {
  private readonly active: Decal[] = [];
  private readonly pool: THREE.Mesh[] = [];
  private readonly geo: THREE.CircleGeometry;
  private readonly mats = new Map<string, THREE.MeshBasicMaterial>();

  constructor(
    private readonly scene: THREE.Scene,
    private readonly capacity = 40,
  ) {
    this.geo = new THREE.CircleGeometry(0.35, 16);
  }

  private mat(color: string, opacity: number): THREE.MeshBasicMaterial {
    const key = `${color}|${opacity.toFixed(2)}`;
    let m = this.mats.get(key);
    if (!m) {
      m = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      this.mats.set(key, m);
    }
    return m;
  }

  spawn(position: THREE.Vector3, color = '#1a1010', scale = 1, life = 12): void {
    if (this.active.length >= this.capacity) {
      const old = this.active.shift();
      if (old) {
        old.mesh.visible = false;
        this.pool.push(old.mesh);
      }
    }
    let mesh = this.pool.pop();
    if (!mesh) {
      mesh = new THREE.Mesh(this.geo, this.mat(color, 0.55));
      mesh.rotation.x = -Math.PI / 2;
      this.scene.add(mesh);
    }
    mesh.material = this.mat(color, 0.5);
    mesh.position.set(position.x, 0.02, position.z);
    mesh.rotation.z = Math.random() * Math.PI;
    mesh.scale.setScalar(scale);
    mesh.visible = true;
    this.active.push({ mesh, life, maxLife: life });
  }

  spawnScorch(position: THREE.Vector3): void {
    this.spawn(position, '#0a0808', 0.8 + Math.random() * 0.6, 14);
  }

  spawnImpact(position: THREE.Vector3, color: string): void {
    this.spawn(position, color, 0.45 + Math.random() * 0.35, 6);
  }

  update(delta: number): void {
    for (let i = this.active.length - 1; i >= 0; i -= 1) {
      const d = this.active[i];
      d.life -= delta;
      if (d.life <= 0) {
        d.mesh.visible = false;
        this.pool.push(d.mesh);
        this.active.splice(i, 1);
      }
    }
  }

  reset(): void {
    for (const d of this.active) {
      d.mesh.visible = false;
      this.pool.push(d.mesh);
    }
    this.active.length = 0;
  }

  dispose(): void {
    this.reset();
    for (const m of this.pool) this.scene.remove(m);
    this.pool.length = 0;
    this.geo.dispose();
    for (const m of this.mats.values()) m.dispose();
    this.mats.clear();
  }
}
