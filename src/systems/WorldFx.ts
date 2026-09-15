import * as THREE from 'three';

/**
 * Ambient world layer: drifting dust motes + periodic ground energy pulses
 * + far skyline second ring. Cheap, instanced, non-gameplay.
 */
export class WorldFx {
  private dust: THREE.Points;
  private dustMat: THREE.PointsMaterial;
  private pulseTimer = 2;
  private readonly pulsePool: Array<{
    mesh: THREE.Mesh;
    mat: THREE.MeshBasicMaterial;
    life: number;
    maxLife: number;
  }> = [];
  private readonly pulseGeo = new THREE.RingGeometry(0.4, 0.55, 48);
  private readonly farGroup = new THREE.Group();

  constructor(
    private readonly scene: THREE.Scene,
    private readonly rng: () => number,
    private readonly bounds: { halfWidth: number; halfDepth: number },
  ) {
    // Dust
    const count = 180;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (this.rng() - 0.5) * bounds.halfWidth * 2.2;
      positions[i * 3 + 1] = 0.3 + this.rng() * 3.5;
      positions[i * 3 + 2] = (this.rng() - 0.5) * bounds.halfDepth * 2.2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.dustMat = new THREE.PointsMaterial({
      color: '#7ae7ff',
      size: 0.06,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
      sizeAttenuation: true,
    });
    this.dust = new THREE.Points(geo, this.dustMat);
    this.scene.add(this.dust);

    this.buildFarSkyline();
    this.scene.add(this.farGroup);
  }

  private buildFarSkyline(): void {
    const mat = new THREE.MeshStandardMaterial({
      color: '#0a1018',
      roughness: 0.9,
      metalness: 0.1,
      emissive: '#061018',
      emissiveIntensity: 0.4,
    });
    const winMat = new THREE.MeshBasicMaterial({ color: '#1a4a6a' });
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const winGeo = new THREE.BoxGeometry(0.2, 0.3, 0.02);

    const buildings: THREE.Matrix4[] = [];
    const windows: THREE.Matrix4[] = [];
    const dummy = new THREE.Object3D();
    const n = 36;
    for (let i = 0; i < n; i += 1) {
      const a = (i / n) * Math.PI * 2 + 0.12;
      const radius = 32 + (i % 4) * 2.5;
      const h = 8 + ((i * 13) % 14);
      const w = 2 + ((i * 7) % 4);
      dummy.position.set(Math.cos(a) * radius, h / 2, Math.sin(a) * radius);
      dummy.scale.set(w, h, w);
      dummy.rotation.set(0, -a, 0);
      dummy.updateMatrix();
      buildings.push(dummy.matrix.clone());

      if (i % 2 === 0) {
        dummy.position.set(
          Math.cos(a) * (radius - w * 0.52),
          h * 0.55,
          Math.sin(a) * (radius - w * 0.52),
        );
        dummy.scale.set(1, 1, 1);
        dummy.lookAt(0, h * 0.55, 0);
        dummy.updateMatrix();
        windows.push(dummy.matrix.clone());
      }
    }

    const bm = new THREE.InstancedMesh(boxGeo, mat, buildings.length);
    buildings.forEach((m, i) => bm.setMatrixAt(i, m));
    bm.instanceMatrix.needsUpdate = true;
    bm.castShadow = false;
    bm.frustumCulled = false;
    this.farGroup.add(bm);

    if (windows.length) {
      const wm = new THREE.InstancedMesh(winGeo, winMat, windows.length);
      windows.forEach((m, i) => wm.setMatrixAt(i, m));
      wm.instanceMatrix.needsUpdate = true;
      wm.frustumCulled = false;
      this.farGroup.add(wm);
    }
  }

  triggerPulse(position: THREE.Vector3, color = '#22d3ee', scale = 6): void {
    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(this.pulseGeo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(position.x, 0.04, position.z);
    this.scene.add(mesh);
    this.pulsePool.push({ mesh, mat, life: 0.9, maxLife: 0.9 });
    void scale;
  }

  update(delta: number, elapsed: number): void {
    // Drift dust
    const pos = this.dust.geometry.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i += 1) {
      let y = pos.getY(i) + delta * (0.15 + (i % 5) * 0.03);
      let x = pos.getX(i) + Math.sin(elapsed * 0.4 + i) * delta * 0.08;
      if (y > 4) y = 0.2;
      const hw = this.bounds.halfWidth * 1.15;
      if (x > hw) x = -hw;
      if (x < -hw) x = hw;
      pos.setY(i, y);
      pos.setX(i, x);
    }
    pos.needsUpdate = true;

    // Ambient floor pulse
    this.pulseTimer -= delta;
    if (this.pulseTimer <= 0) {
      this.pulseTimer = 3.5 + this.rng() * 3;
      this.triggerPulse(
        new THREE.Vector3(
          (this.rng() - 0.5) * this.bounds.halfWidth * 1.6,
          0,
          (this.rng() - 0.5) * this.bounds.halfDepth * 1.6,
        ),
        this.rng() > 0.5 ? '#22d3ee' : '#a78bfa',
        5,
      );
    }

    for (let i = this.pulsePool.length - 1; i >= 0; i -= 1) {
      const p = this.pulsePool[i];
      p.life -= delta;
      const t = 1 - Math.max(0, p.life / p.maxLife);
      p.mesh.scale.setScalar(1 + t * 10);
      p.mat.opacity = 0.55 * (1 - t);
      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        p.mat.dispose();
        this.pulsePool.splice(i, 1);
      }
    }
  }

  reset(): void {
    for (const p of this.pulsePool) {
      this.scene.remove(p.mesh);
      p.mat.dispose();
    }
    this.pulsePool.length = 0;
    this.pulseTimer = 1.5;
  }

  dispose(): void {
    this.reset();
    this.scene.remove(this.dust, this.farGroup);
    this.dust.geometry.dispose();
    this.dustMat.dispose();
    this.pulseGeo.dispose();
    this.farGroup.traverse((o) => {
      if (o instanceof THREE.Mesh) o.geometry.dispose();
    });
  }
}
