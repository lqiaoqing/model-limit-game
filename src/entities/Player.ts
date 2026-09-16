import * as THREE from 'three';

export type PlayerStats = {
  maxHp: number;
  maxShield: number;
  maxHeat: number;
  moveSpeed: number;
  dashSpeed: number;
  dashDuration: number;
  dashCooldown: number;
  fireInterval: number;
  heatPerShot: number;
  heatCoolPerSec: number;
  overheatLockPerSec: number;
  projectileSpeed: number;
  projectileDamage: number;
  ultChargePerKill: number;
  ultDamage: number;
  ultRadius: number;
  invulnAfterHit: number;
};

export const DEFAULT_PLAYER_STATS: PlayerStats = {
  maxHp: 100,
  maxShield: 50,
  maxHeat: 100,
  moveSpeed: 6.2,
  dashSpeed: 16,
  dashDuration: 0.16,
  dashCooldown: 1.1,
  fireInterval: 0.11,
  heatPerShot: 4.2,
  heatCoolPerSec: 28,
  overheatLockPerSec: 22,
  projectileSpeed: 28,
  projectileDamage: 12,
  ultChargePerKill: 8,
  ultDamage: 55,
  ultRadius: 7.5,
  invulnAfterHit: 0.65,
};

export type ArenaBounds = {
  halfWidth: number;
  halfDepth: number;
};

/**
 * Hero hover-assault frame: wide shoulders, offset cannon, twin thrusters.
 * Built for top-down readability — not a lollipop capsule.
 */
export class Player {
  readonly group = new THREE.Group();
  readonly visual = new THREE.Group();
  readonly velocity = new THREE.Vector3();
  readonly aim = new THREE.Vector2(0, -1);

  hp = DEFAULT_PLAYER_STATS.maxHp;
  shield = DEFAULT_PLAYER_STATS.maxShield;
  heat = 0;
  overheated = false;
  ultCharge = 0;
  dashTimer = 0;
  dashCooldown = 0;
  fireCooldown = 0;
  invulnTimer = 0;
  alive = true;
  readonly muzzle = new THREE.Vector3();

  private recoil = 0;
  private dashGhostTimer = 0;
  private readonly ghosts: Array<{ mesh: THREE.Group; life: number }> = [];
  private readonly ghostMat: THREE.MeshBasicMaterial;
  private readonly chassisMat: THREE.MeshStandardMaterial;
  private readonly armorMat: THREE.MeshStandardMaterial;
  private readonly accentMat: THREE.MeshStandardMaterial;
  private readonly glowMat: THREE.MeshStandardMaterial;
  private readonly visorMat: THREE.MeshStandardMaterial;
  private readonly thrusterMat: THREE.MeshStandardMaterial;
  private readonly geometries: THREE.BufferGeometry[] = [];
  private readonly ringGeo: THREE.RingGeometry;
  private readonly ringMat: THREE.MeshBasicMaterial;
  private readonly ring: THREE.Mesh;
  private readonly thrusters: THREE.Mesh[] = [];

  constructor(public stats: PlayerStats = { ...DEFAULT_PLAYER_STATS }) {
    this.ghostMat = new THREE.MeshBasicMaterial({
      color: '#22d3ee',
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    });
    this.chassisMat = new THREE.MeshStandardMaterial({
      color: '#1a2740',
      roughness: 0.42,
      metalness: 0.55,
      emissive: '#061018',
      emissiveIntensity: 0.15,
    });
    this.armorMat = new THREE.MeshStandardMaterial({
      color: '#2dd4e8',
      roughness: 0.28,
      metalness: 0.62,
      emissive: '#0b4a58',
      emissiveIntensity: 0.35,
    });
    this.accentMat = new THREE.MeshStandardMaterial({
      color: '#e8eef7',
      roughness: 0.22,
      metalness: 0.7,
      emissive: '#22d3ee',
      emissiveIntensity: 0.12,
    });
    this.glowMat = new THREE.MeshStandardMaterial({
      color: '#7ae7ff',
      emissive: '#22d3ee',
      emissiveIntensity: 1.4,
      roughness: 0.3,
      metalness: 0.2,
    });
    this.visorMat = new THREE.MeshStandardMaterial({
      color: '#050a12',
      roughness: 0.15,
      metalness: 0.85,
      emissive: '#67e8f9',
      emissiveIntensity: 1.1,
    });
    this.thrusterMat = new THREE.MeshStandardMaterial({
      color: '#a5f3fc',
      emissive: '#22d3ee',
      emissiveIntensity: 1.6,
      roughness: 0.25,
      metalness: 0.1,
    });

    // Core hull — wide, low, forward-heavy
    const hull = this.box(0.95, 0.32, 1.15, this.chassisMat, 0, 0.42, 0.05);
    hull.castShadow = true;

    // Nose wedge
    const nose = this.box(0.7, 0.22, 0.55, this.armorMat, 0, 0.48, -0.72);
    nose.rotation.x = 0.18;
    nose.castShadow = true;

    // Asymmetric shoulder pods
    const podL = this.box(0.32, 0.38, 0.7, this.armorMat, -0.62, 0.55, -0.05);
    podL.castShadow = true;
    const podR = this.box(0.28, 0.28, 0.5, this.chassisMat, 0.58, 0.5, 0.12);
    podR.castShadow = true;

    // Primary cannon — offset left, long, readable
    const cannonBody = this.box(0.16, 0.16, 0.95, this.accentMat, -0.42, 0.55, -0.85);
    cannonBody.castShadow = true;
    const cannonShroud = this.box(0.22, 0.22, 0.28, this.chassisMat, -0.42, 0.55, -0.35);
    const muzzleRingGeo = new THREE.TorusGeometry(0.11, 0.03, 6, 12);
    this.geometries.push(muzzleRingGeo);
    const muzzleRing = new THREE.Mesh(muzzleRingGeo, this.glowMat);
    muzzleRing.position.set(-0.42, 0.55, -1.35);
    muzzleRing.rotation.y = Math.PI / 2;

    // Cockpit canopy
    const canopy = this.box(0.38, 0.18, 0.42, this.visorMat, 0.05, 0.68, -0.35);

    // Twin thrusters (asymmetric glow)
    const thrusterGeo = new THREE.CylinderGeometry(0.1, 0.14, 0.36, 8);
    this.geometries.push(thrusterGeo);
    const t1 = new THREE.Mesh(thrusterGeo, this.thrusterMat);
    t1.rotation.x = Math.PI / 2;
    t1.position.set(-0.28, 0.42, 0.78);
    const t2 = new THREE.Mesh(thrusterGeo, this.thrusterMat);
    t2.rotation.x = Math.PI / 2;
    t2.position.set(0.22, 0.4, 0.72);
    this.thrusters.push(t1, t2);

    // Side fins
    const finGeo = new THREE.BoxGeometry(0.08, 0.28, 0.55);
    this.geometries.push(finGeo);
    const finL = new THREE.Mesh(finGeo, this.accentMat);
    finL.position.set(-0.78, 0.5, 0.35);
    finL.rotation.z = 0.35;
    finL.castShadow = true;
    const finR = new THREE.Mesh(finGeo, this.accentMat);
    finR.position.set(0.72, 0.48, 0.4);
    finR.rotation.z = -0.25;
    finR.castShadow = true;

    // Belly skid
    const skid = this.box(1.0, 0.05, 0.7, this.chassisMat, 0, 0.22, 0.1);

    this.visual.add(
      hull,
      nose,
      podL,
      podR,
      cannonBody,
      cannonShroud,
      muzzleRing,
      canopy,
      t1,
      t2,
      finL,
      finR,
      skid,
    );
    this.group.add(this.visual);

    this.ringGeo = new THREE.RingGeometry(0.78, 0.9, 40);
    this.ringMat = new THREE.MeshBasicMaterial({
      color: '#22d3ee',
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    this.ring = new THREE.Mesh(this.ringGeo, this.ringMat);
    this.ring.rotation.x = -Math.PI / 2;
    this.ring.position.y = 0.03;
    this.group.add(this.ring);
    this.group.scale.setScalar(1.15);
  }

  private spawnGhost(): void {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.25, 0.9), this.ghostMat.clone());
    body.position.y = 0.45;
    g.add(body);
    g.position.copy(this.group.position);
    g.rotation.y = this.group.rotation.y;
    this.group.add(g);
    this.ghosts.push({ mesh: g, life: 1 });
    if (this.ghosts.length > 8) {
      const old = this.ghosts.shift();
      if (old) this.group.remove(old.mesh);
    }
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
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  reset(): void {
    this.hp = this.stats.maxHp;
    this.shield = this.stats.maxShield;
    this.heat = 0;
    this.overheated = false;
    this.ultCharge = 0;
    this.dashTimer = 0;
    this.dashCooldown = 0;
    this.fireCooldown = 0;
    this.invulnTimer = 0;
    this.recoil = 0;
    this.alive = true;
    this.group.visible = true;
    this.group.position.set(0, 0, 0);
    this.group.rotation.set(0, 0, 0);
    this.visual.rotation.set(0, 0, 0);
    this.visual.position.set(0, 0, 0);
    this.velocity.set(0, 0, 0);
    this.aim.set(0, -1);
    this.stabilizeVisuals();
  }

  stabilizeVisuals(): void {
    this.group.position.y = 0;
    this.visual.position.y = 0;
    this.visual.rotation.z = 0;
    this.visual.position.z = 0;
    this.ringMat.opacity = 0.4;
  }

  update(
    delta: number,
    elapsed: number,
    move: THREE.Vector2,
    aim: THREE.Vector2,
    fireHeld: boolean,
    dashPressed: boolean,
    bounds: ArenaBounds,
  ): { fired: boolean } {
    const result = { fired: false };
    if (!this.alive) return result;

    this.invulnTimer = Math.max(0, this.invulnTimer - delta);
    this.dashCooldown = Math.max(0, this.dashCooldown - delta);
    this.fireCooldown = Math.max(0, this.fireCooldown - delta);
    this.recoil = Math.max(0, this.recoil - delta * 18);

    if (aim.lengthSq() > 0.001) this.aim.copy(aim).normalize();

    const wantDash = dashPressed && this.dashCooldown <= 0;
    if (wantDash) {
      this.dashTimer = this.stats.dashDuration;
      this.dashCooldown = this.stats.dashCooldown;
      this.invulnTimer = Math.max(this.invulnTimer, this.stats.dashDuration + 0.05);
      this.dashGhostTimer = 0;
    }

    // Dash afterimages
    this.dashGhostTimer -= delta;
    if (this.dashTimer > 0 && this.dashGhostTimer <= 0) {
      this.dashGhostTimer = 0.03;
      this.spawnGhost();
    }
    for (let i = this.ghosts.length - 1; i >= 0; i -= 1) {
      const g = this.ghosts[i];
      g.life -= delta * 4;
      const child = g.mesh.children[0];
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.max(0, g.life) * 0.35;
      }
      if (g.life <= 0) {
        this.group.remove(g.mesh);
        this.ghosts.splice(i, 1);
      }
    }

    const speed = this.dashTimer > 0 ? this.stats.dashSpeed : this.stats.moveSpeed;
    if (this.dashTimer > 0) this.dashTimer = Math.max(0, this.dashTimer - delta);

    const target = new THREE.Vector3(move.x, 0, move.y).multiplyScalar(speed);
    if (wantDash || this.dashTimer > 0) {
      if (move.lengthSq() < 0.01) {
        target.set(this.aim.x, 0, this.aim.y).multiplyScalar(speed);
      }
    }

    const smoothing = 1 - Math.exp(-14 * delta);
    this.velocity.lerp(target, smoothing);
    this.group.position.addScaledVector(this.velocity, delta);
    this.group.position.x = THREE.MathUtils.clamp(
      this.group.position.x,
      -bounds.halfWidth + 0.8,
      bounds.halfWidth - 0.8,
    );
    this.group.position.z = THREE.MathUtils.clamp(
      this.group.position.z,
      -bounds.halfDepth + 0.8,
      bounds.halfDepth - 0.8,
    );

    // Face aim primarily; slight blend with velocity
    const face =
      this.velocity.lengthSq() > 1.5
        ? new THREE.Vector3(this.velocity.x * 0.35 + this.aim.x, 0, this.velocity.z * 0.35 + this.aim.y)
        : new THREE.Vector3(this.aim.x, 0, this.aim.y);
    if (face.lengthSq() > 0.001) {
      this.group.rotation.y = Math.atan2(face.x, face.z);
    }

    // Hover + bank + recoil
    const hover = Math.sin(elapsed * 9) * 0.04 + Math.min(this.velocity.length() / 80, 0.05);
    this.group.position.y = hover;
    const bank = THREE.MathUtils.clamp(this.velocity.x * -0.04, -0.28, 0.28);
    this.visual.rotation.z = THREE.MathUtils.lerp(this.visual.rotation.z, bank, 1 - Math.exp(-10 * delta));
    this.visual.position.z = -this.recoil * 0.12;
    this.visual.rotation.x = this.recoil * 0.15;

    const pulse = this.dashTimer > 0 ? 1 : 0.55 + Math.sin(elapsed * 12) * 0.08;
    for (const t of this.thrusters) {
      (t.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.2 + pulse * 0.8;
      t.scale.setScalar(1 + pulse * 0.15);
    }
    this.ringMat.opacity = this.invulnTimer > 0 ? 0.85 : 0.4;

    if (this.overheated) {
      this.heat = Math.max(0, this.heat - this.stats.overheatLockPerSec * delta);
      if (this.heat <= 0) this.overheated = false;
    } else {
      this.heat = Math.max(0, this.heat - this.stats.heatCoolPerSec * delta);
    }

    // Offset muzzle matches left cannon
    const right = new THREE.Vector3(this.aim.y, 0, -this.aim.x);
    this.muzzle.set(
      this.group.position.x + this.aim.x * 1.1 - right.x * 0.42,
      0.55,
      this.group.position.z + this.aim.y * 1.1 - right.y * 0.42,
    );

    if (fireHeld && !this.overheated && this.fireCooldown <= 0) {
      this.fireCooldown = this.stats.fireInterval;
      this.heat += this.stats.heatPerShot;
      this.recoil = 1;
      if (this.heat >= this.stats.maxHeat) {
        this.heat = this.stats.maxHeat;
        this.overheated = true;
      }
      result.fired = true;
    }

    return result;
  }

  tryUltimate(): boolean {
    if (!this.alive || this.ultCharge < 100) return false;
    this.ultCharge = 0;
    return true;
  }

  addUltCharge(amount: number): void {
    this.ultCharge = Math.min(100, this.ultCharge + amount);
  }

  heal(amount: number): void {
    this.hp = Math.min(this.stats.maxHp, this.hp + amount);
  }

  addShield(amount: number): void {
    this.shield = Math.min(this.stats.maxShield, this.shield + amount);
  }

  coolHeat(amount: number): void {
    this.heat = Math.max(0, this.heat - amount);
    if (this.heat < this.stats.maxHeat * 0.35) this.overheated = false;
  }

  takeDamage(amount: number): boolean {
    if (!this.alive || this.invulnTimer > 0) return false;
    let remaining = amount;
    if (this.shield > 0) {
      const absorbed = Math.min(this.shield, remaining);
      this.shield -= absorbed;
      remaining -= absorbed;
    }
    if (remaining > 0) this.hp -= remaining;
    this.invulnTimer = this.stats.invulnAfterHit;
    // Armor crack flash — red emissive pulse on chassis
    this.chassisMat.emissive.set('#ff2a4a');
    this.chassisMat.emissiveIntensity = 1.2;
    window.setTimeout(() => {
      this.chassisMat.emissive.set('#061018');
      this.chassisMat.emissiveIntensity = 0.15;
    }, 120);
    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
      this.group.visible = false;
    }
    return true;
  }

  /** Heat ratio 0–1 for steam VFX. */
  getHeatRatio(): number {
    return this.heat / this.stats.maxHeat;
  }

  dispose(): void {
    for (const g of this.ghosts) this.group.remove(g.mesh);
    this.ghosts.length = 0;
    for (const geo of this.geometries) geo.dispose();
    this.ringGeo.dispose();
    this.chassisMat.dispose();
    this.armorMat.dispose();
    this.accentMat.dispose();
    this.glowMat.dispose();
    this.visorMat.dispose();
    this.thrusterMat.dispose();
    this.ghostMat.dispose();
    this.ringMat.dispose();
  }
}
