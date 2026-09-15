import * as THREE from 'three';

export type PickupKind = 'shield' | 'coolant' | 'heal' | 'ult';

const COLORS: Record<PickupKind, string> = {
  shield: '#3ec6ff',
  coolant: '#ffb020',
  heal: '#4ade80',
  ult: '#a78bfa',
};

const LABELS: Record<PickupKind, string> = {
  shield: 'SHIELD +20',
  coolant: 'COOLANT',
  heal: 'REPAIR +25',
  ult: 'ULT CHARGE',
};

export function pickupLabel(kind: PickupKind): string {
  return LABELS[kind];
}

export function pickupColor(kind: PickupKind): string {
  return COLORS[kind];
}

/**
 * Role-specific pickup forms + ground attract ring + magnet pull.
 * Not a generic icosahedron ball.
 */
export class Pickup {
  readonly group = new THREE.Group();
  readonly radius = 0.55;
  active = true;
  kind: PickupKind = 'shield';
  private visual = new THREE.Group();
  private readonly geometries: THREE.BufferGeometry[] = [];
  private readonly materials: THREE.Material[] = [];
  private coreMat: THREE.MeshStandardMaterial;
  private accentMat: THREE.MeshStandardMaterial;
  private ringMat: THREE.MeshBasicMaterial;
  private groundRing: THREE.Mesh;
  private beam: THREE.Mesh;
  private beamMat: THREE.MeshBasicMaterial;
  private magnet = 0;
  private pop = 0;

  constructor(readonly index: number) {
    this.coreMat = new THREE.MeshStandardMaterial({
      color: COLORS.shield,
      emissive: COLORS.shield,
      emissiveIntensity: 0.85,
      roughness: 0.28,
      metalness: 0.35,
    });
    this.accentMat = new THREE.MeshStandardMaterial({
      color: '#e8eef7',
      emissive: COLORS.shield,
      emissiveIntensity: 0.25,
      roughness: 0.25,
      metalness: 0.6,
    });
    this.ringMat = new THREE.MeshBasicMaterial({
      color: COLORS.shield,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    this.materials.push(this.coreMat, this.accentMat, this.ringMat);

    this.beamMat = new THREE.MeshBasicMaterial({
      color: COLORS.shield,
      transparent: true,
      opacity: 0.08,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    this.materials.push(this.beamMat);
    const beamGeo = new THREE.CylinderGeometry(0.06, 0.18, 1.6, 8, 1, true);
    this.geometries.push(beamGeo);
    this.beam = new THREE.Mesh(beamGeo, this.beamMat);
    this.beam.position.y = 0.8;
    this.group.add(this.beam);

    this.buildVisual('shield');
    this.group.add(this.visual);

    const ringGeo = new THREE.RingGeometry(0.55, 0.62, 32);
    this.geometries.push(ringGeo);
    this.groundRing = new THREE.Mesh(ringGeo, this.ringMat);
    this.groundRing.rotation.x = -Math.PI / 2;
    this.groundRing.position.y = 0.03;
    this.group.add(this.groundRing);

    this.group.visible = false;
  }

  private clearVisual(): void {
    this.visual.clear();
  }

  private buildVisual(kind: PickupKind): void {
    this.clearVisual();
    const color = COLORS[kind];

    if (kind === 'shield') {
      // Hex shield plate
      const plate = new THREE.CylinderGeometry(0.28, 0.28, 0.1, 6);
      this.geometries.push(plate);
      const m = new THREE.Mesh(plate, this.coreMat);
      m.rotation.x = Math.PI / 2;
      m.castShadow = true;
      this.visual.add(m);
      const rim = new THREE.TorusGeometry(0.3, 0.035, 6, 6);
      this.geometries.push(rim);
      const r = new THREE.Mesh(rim, this.accentMat);
      this.visual.add(r);
    } else if (kind === 'coolant') {
      // Canister
      const body = new THREE.CylinderGeometry(0.14, 0.14, 0.4, 8);
      this.geometries.push(body);
      const m = new THREE.Mesh(body, this.coreMat);
      m.castShadow = true;
      this.visual.add(m);
      const cap = new THREE.CylinderGeometry(0.16, 0.16, 0.06, 8);
      this.geometries.push(cap);
      const c1 = new THREE.Mesh(cap, this.accentMat);
      c1.position.y = 0.22;
      const c2 = new THREE.Mesh(cap, this.accentMat);
      c2.position.y = -0.22;
      this.visual.add(c1, c2);
    } else if (kind === 'heal') {
      // Cross beacon
      const barA = new THREE.BoxGeometry(0.36, 0.1, 0.1);
      const barB = new THREE.BoxGeometry(0.1, 0.36, 0.1);
      this.geometries.push(barA, barB);
      const a = new THREE.Mesh(barA, this.coreMat);
      const b = new THREE.Mesh(barB, this.coreMat);
      a.castShadow = true;
      this.visual.add(a, b);
    } else {
      // Ult diamond
      const oct = new THREE.OctahedronGeometry(0.28, 0);
      this.geometries.push(oct);
      const m = new THREE.Mesh(oct, this.coreMat);
      m.castShadow = true;
      this.visual.add(m);
      const halo = new THREE.TorusGeometry(0.34, 0.03, 6, 20);
      this.geometries.push(halo);
      const h = new THREE.Mesh(halo, this.accentMat);
      h.rotation.x = Math.PI / 2;
      this.visual.add(h);
    }

    this.coreMat.color.set(color);
    this.coreMat.emissive.set(color);
    this.accentMat.emissive.set(color);
    this.ringMat.color.set(color);
    if (this.beamMat) this.beamMat.color.set(color);
  }

  spawn(position: THREE.Vector3, kind: PickupKind, elapsed: number): void {
    this.kind = kind;
    this.active = true;
    this.magnet = 0;
    this.pop = 1;
    this.group.visible = true;
    this.group.position.set(position.x, 0.55, position.z);
    this.buildVisual(kind);
    this.group.rotation.y = elapsed;
    this.visual.scale.setScalar(1.35);
  }

  /** Returns true if still active (not magnet-collected this frame). */
  update(delta: number, elapsed: number, playerPos?: THREE.Vector3): boolean {
    if (!this.active) return false;

    this.group.rotation.y += delta * 2.2;
    this.visual.rotation.x = Math.sin(elapsed * 2 + this.index) * 0.15;
    this.group.position.y = 0.55 + Math.sin(elapsed * 3 + this.index) * 0.1;

    // Pop settle
    if (this.pop > 0) {
      this.pop = Math.max(0, this.pop - delta * 3);
      this.visual.scale.setScalar(1 + this.pop * 0.35);
    }

    // Magnet when player close
    if (playerPos) {
      const dx = playerPos.x - this.group.position.x;
      const dz = playerPos.z - this.group.position.z;
      const dist = Math.hypot(dx, dz);
      const magnetRange = 2.8;
      if (dist < magnetRange && dist > 0.05) {
        this.magnet = Math.min(1, this.magnet + delta * 3);
        const pull = (1 - dist / magnetRange) * 6.5 * this.magnet;
        this.group.position.x += (dx / dist) * pull * delta;
        this.group.position.z += (dz / dist) * pull * delta;
        this.ringMat.opacity = 0.35 + this.magnet * 0.45;
        this.coreMat.emissiveIntensity = 0.85 + this.magnet * 0.8;
        this.groundRing.scale.setScalar(1 + this.magnet * 0.35);
        this.beamMat.opacity = 0.08 + this.magnet * 0.35;
        this.beam.scale.set(1 + this.magnet * 0.5, 1, 1 + this.magnet * 0.5);
      } else {
        this.magnet = Math.max(0, this.magnet - delta * 2);
        this.ringMat.opacity = 0.35;
        this.coreMat.emissiveIntensity = 0.85;
        this.groundRing.scale.setScalar(1);
        this.beamMat.opacity = 0.08;
        this.beam.scale.setScalar(1);
      }
    }

    return true;
  }

  collect(): void {
    this.active = false;
    this.group.visible = false;
    this.magnet = 0;
  }

  reset(): void {
    this.active = false;
    this.group.visible = false;
    this.magnet = 0;
    this.pop = 0;
  }

  stabilizeVisuals(): void {
    this.group.position.y = 0.55;
    this.visual.scale.setScalar(1);
  }

  dispose(): void {
    for (const g of this.geometries) g.dispose();
    for (const m of this.materials) m.dispose();
  }
}
