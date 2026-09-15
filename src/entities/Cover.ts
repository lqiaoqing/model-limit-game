import * as THREE from 'three';

function makePanelTexture(rng: () => number): THREE.CanvasTexture {
  const size = 256;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');
  if (!ctx) throw new Error('cover panel texture');

  ctx.fillStyle = '#0e3a48';
  ctx.fillRect(0, 0, size, size);

  // Panel grid
  ctx.strokeStyle = 'rgba(0,0,0,0.45)';
  ctx.lineWidth = 3;
  for (let i = 0; i <= size; i += 64) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, size);
    ctx.moveTo(0, i);
    ctx.lineTo(size, i);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(34,211,238,0.25)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= size; i += 64) {
    ctx.beginPath();
    ctx.moveTo(i + 2, 0);
    ctx.lineTo(i + 2, size);
    ctx.stroke();
  }

  // Wear / scratch
  for (let i = 0; i < 40; i += 1) {
    const x = rng() * size;
    const y = rng() * size;
    ctx.strokeStyle = `rgba(200,220,230,${0.04 + rng() * 0.08})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (rng() - 0.5) * 30, y + (rng() - 0.5) * 8);
    ctx.stroke();
  }

  // Corner bolts
  ctx.fillStyle = '#3d4a5c';
  for (const [x, y] of [
    [12, 12],
    [size - 12, 12],
    [12, size - 12],
    [size - 12, size - 12],
  ]) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeFrameTexture(): THREE.CanvasTexture {
  const size = 128;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');
  if (!ctx) throw new Error('frame tex');
  ctx.fillStyle = '#1c2433';
  ctx.fillRect(0, 0, size, size);
  // Horizontal armor ridges
  ctx.fillStyle = '#243044';
  for (let y = 0; y < size; y += 16) {
    ctx.fillRect(0, y, size, 8);
  }
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  for (let y = 8; y < size; y += 16) {
    ctx.fillRect(0, y, size, 2);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/**
 * Destructible cover: ridged frame + textured energy panel + hazard bar + side decals.
 */
export class Cover {
  readonly mesh = new THREE.Group();
  hp: number;
  alive = true;
  readonly radius: number;
  private readonly geometries: THREE.BufferGeometry[] = [];
  private readonly materials: THREE.Material[] = [];
  private readonly textures: THREE.Texture[] = [];
  private panelMat: THREE.MeshStandardMaterial;

  constructor(
    position: THREE.Vector3,
    readonly size: THREE.Vector3,
    maxHp = 90,
    rng: () => number = Math.random,
  ) {
    this.hp = maxHp;
    this.radius = Math.max(size.x, size.z) * 0.48;

    const panelTex = makePanelTexture(rng);
    const frameTex = makeFrameTexture();
    frameTex.repeat.set(2, 1);
    this.textures.push(panelTex, frameTex);

    const frameMat = new THREE.MeshStandardMaterial({
      color: '#1c2433',
      map: frameTex,
      roughness: 0.62,
      metalness: 0.55,
      emissive: '#05080f',
      emissiveIntensity: 0.08,
    });
    const trimMat = new THREE.MeshStandardMaterial({
      color: '#4a5568',
      roughness: 0.35,
      metalness: 0.75,
    });
    this.panelMat = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      map: panelTex,
      roughness: 0.32,
      metalness: 0.45,
      emissive: '#0a6b80',
      emissiveIntensity: 0.4,
    });
    const edgeMat = new THREE.MeshBasicMaterial({
      color: '#22d3ee',
      transparent: true,
      opacity: 0.5,
    });
    const hazardMat = new THREE.MeshStandardMaterial({
      color: '#f59e0b',
      roughness: 0.48,
      metalness: 0.3,
      emissive: '#92400e',
      emissiveIntensity: 0.3,
    });
    const wearMat = new THREE.MeshStandardMaterial({
      color: '#5c4030',
      roughness: 0.85,
      metalness: 0.15,
      transparent: true,
      opacity: 0.55,
    });
    this.materials.push(frameMat, trimMat, this.panelMat, edgeMat, hazardMat, wearMat);

    const { x: w, y: h, z: d } = size;

    const frame = this.box(w, h * 0.9, d, frameMat, 0, h * 0.45, 0);
    frame.castShadow = true;
    frame.receiveShadow = true;

    const panel = this.box(w * 0.78, 0.05, d * 0.78, this.panelMat, 0, h * 0.9, 0);
    panel.castShadow = false;

    const post = 0.12;
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        this.box(post, h, post, trimMat, sx * (w * 0.5 - post * 0.5), h * 0.5, sz * (d * 0.5 - post * 0.5));
      }
    }

    // Side wear plates (material variation)
    const wear = this.box(w * 0.35, h * 0.25, 0.03, wearMat, (rng() - 0.5) * w * 0.3, h * 0.35, d * 0.51);
    wear.castShadow = false;

    const rim = this.box(w * 0.9, 0.03, 0.04, edgeMat, 0, h * 0.92, d * 0.42);
    const rim2 = this.box(w * 0.9, 0.03, 0.04, edgeMat, 0, h * 0.92, -d * 0.42);
    rim.castShadow = rim2.castShadow = false;

    // Hazard chevron bar
    const stripe = this.box(w * 0.55, 0.1, 0.04, hazardMat, 0, h * 0.28, d * 0.52);
    stripe.castShadow = false;
    const stripe2 = this.box(0.04, 0.1, d * 0.35, hazardMat, w * 0.52, h * 0.28, 0);
    stripe2.castShadow = false;

    this.mesh.position.copy(position);
  }

  private box(
    w: number,
    h: number,
    d: number,
    mat: THREE.Material,
    x: number,
    y: number,
    z: number,
  ): THREE.Mesh {
    const geo = new THREE.BoxGeometry(w, h, d);
    this.geometries.push(geo);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    this.mesh.add(mesh);
    return mesh;
  }

  takeDamage(amount: number): boolean {
    if (!this.alive) return false;
    this.hp -= amount;
    const t = THREE.MathUtils.clamp(this.hp / 90, 0, 1);
    this.panelMat.emissiveIntensity = 0.4 + (1 - t) * 0.9;
    this.panelMat.emissive.set(t > 0.5 ? '#0a6b80' : '#9f1239');
    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
      this.mesh.visible = false;
      return true;
    }
    return false;
  }

  resolveEntity(entityPos: THREE.Vector3, radius: number): void {
    if (!this.alive) return;
    const px = entityPos.x;
    const pz = entityPos.z;
    const cx = this.mesh.position.x;
    const cz = this.mesh.position.z;
    const hx = this.size.x * 0.5 + radius;
    const hz = this.size.z * 0.5 + radius;
    const dx = px - cx;
    const dz = pz - cz;
    if (Math.abs(dx) <= hx && Math.abs(dz) <= hz) {
      const ox = hx - Math.abs(dx);
      const oz = hz - Math.abs(dz);
      if (ox < oz) entityPos.x = cx + Math.sign(dx || 1) * hx;
      else entityPos.z = cz + Math.sign(dz || 1) * hz;
    }
  }

  blocksPoint(point: THREE.Vector3, pad = 0.15): boolean {
    if (!this.alive) return false;
    const hx = this.size.x * 0.5 + pad;
    const hz = this.size.z * 0.5 + pad;
    return (
      Math.abs(point.x - this.mesh.position.x) <= hx &&
      Math.abs(point.z - this.mesh.position.z) <= hz &&
      point.y < this.size.y + 0.2
    );
  }

  reset(hp = 90): void {
    this.hp = hp;
    this.alive = true;
    this.mesh.visible = true;
    this.panelMat.emissiveIntensity = 0.4;
    this.panelMat.emissive.set('#0a6b80');
  }

  dispose(): void {
    for (const g of this.geometries) g.dispose();
    for (const m of this.materials) m.dispose();
    for (const t of this.textures) t.dispose();
  }
}
