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
  /** When true, hitting max heat fires an EMP pulse instead of locking the gun. */
  overheatEmp = false;
  /** Set for one update when heat max triggers the EMP path. */
  overheatPulse = false;
  ultCharge = 0;
  dashTimer = 0;
  dashCooldown = 0;
  fireCooldown = 0;
  invulnTimer = 0;
  alive = true;
  /** Debug/live tuning multipliers (not reset by stats rebuild). */
  dashSpeedMul = 1;
  moveAccel = 14;
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
  private ringGeo: THREE.RingGeometry;
  private readonly ringMat: THREE.MeshBasicMaterial;
  private readonly ring: THREE.Mesh;
  private readonly thrusters: THREE.Mesh[] = [];
  private formTier = 0;
  private readonly formGroups: THREE.Group[] = [];
  private readonly formAccents: THREE.MeshStandardMaterial[] = [];
  private weaponId: 'plasma' | 'rail' | 'scatter' | 'launcher' = 'plasma';
  private cannonBody!: THREE.Mesh;
  private cannonShroud!: THREE.Mesh;
  private muzzleRing!: THREE.Mesh;
  private formAccent = '#22d3ee';

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
    cannonShroud.castShadow = true;
    const muzzleRingGeo = new THREE.TorusGeometry(0.11, 0.03, 6, 12);
    this.geometries.push(muzzleRingGeo);
    const muzzleRing = new THREE.Mesh(muzzleRingGeo, this.glowMat);
    muzzleRing.position.set(-0.42, 0.55, -1.35);
    muzzleRing.rotation.y = Math.PI / 2;
    this.cannonBody = cannonBody;
    this.cannonShroud = cannonShroud;
    this.muzzleRing = muzzleRing;

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

    // Form evolution parts (hidden until setFormTier unlocks them).
    this.formGroups.push(this.buildFormTier1(), this.buildFormTier2(), this.buildFormTier3());
    for (const g of this.formGroups) {
      g.visible = false;
      this.visual.add(g);
    }
  }

  /**
   * Morphological upgrades driven by retrofit stacks.
   * 0 Scout → 1 Striker → 2 Assault → 3 Siege Frame.
   */
  setFormTier(
    tier: number,
    bias: { weapon: number; defense: number; total: number } = { weapon: 0, defense: 0, total: 0 },
  ): void {
    const next = Math.max(0, Math.min(3, Math.floor(tier)));
    this.formTier = next;
    for (let i = 0; i < this.formGroups.length; i += 1) {
      this.formGroups[i].visible = i < next;
    }
    const scales = [1.15, 1.2, 1.28, 1.36];
    this.group.scale.setScalar(scales[next] ?? 1.15);

    // Dominant retrofit path tints the accent package.
    const weapon = bias.weapon;
    const defense = bias.defense;
    let accent = '#22d3ee';
    let armor = '#2dd4e8';
    if (next > 0) {
      if (weapon > defense + 1) {
        accent = '#fbbf24';
        armor = '#f59e0b';
      } else if (defense > weapon + 1) {
        accent = '#3ec6ff';
        armor = '#60a5fa';
      } else if (bias.total >= 3) {
        accent = '#a78bfa';
        armor = '#c4b5fd';
      }
    }
    this.accentMat.color.set(accent);
    this.accentMat.emissive.set(accent);
    this.armorMat.color.set(armor);
    this.armorMat.emissiveIntensity = 0.35 + next * 0.12;
    this.glowMat.emissiveIntensity = 1.4 + next * 0.25;
    this.ringMat.color.set(accent);
    this.ghostMat.color.set(accent);
    this.ringGeo.dispose();
    const ringInner = 0.78 + next * 0.06;
    this.ringGeo = new THREE.RingGeometry(ringInner, ringInner + 0.12, 40);
    (this.ring as THREE.Mesh).geometry = this.ringGeo;

    for (const mat of this.formAccents) {
      mat.color.set(accent);
      mat.emissive.set(accent);
      mat.emissiveIntensity = 0.9 + next * 0.2;
    }
    this.formAccent = accent;
    this.applyWeaponVisual();
  }

  /**
   * Make plasma / rail / scatter read differently on the mech:
   * barrel length/width, muzzle glow, and weapon-color tint.
   */
  setWeaponVisual(id: 'plasma' | 'rail' | 'scatter' | 'launcher'): void {
    this.weaponId = id;
    this.applyWeaponVisual();
  }

  private applyWeaponVisual(): void {
    const id = this.weaponId;
    const weaponColor =
      id === 'rail'
        ? '#fbbf24'
        : id === 'scatter'
          ? '#f472b6'
          : id === 'launcher'
            ? '#4ade80'
            : '#22d3ee';

    // Barrel silhouette
    if (id === 'rail') {
      // Long heavy rail — longer + thicker + coils feel via shroud stretch
      this.cannonBody.scale.set(1.15, 1.15, 1.35);
      this.cannonBody.position.set(-0.42, 0.55, -0.95);
      this.cannonShroud.scale.set(1.25, 1.25, 1.6);
      this.cannonShroud.position.set(-0.42, 0.55, -0.25);
      this.muzzleRing.scale.set(1.35, 1.35, 1.35);
      this.muzzleRing.position.set(-0.42, 0.55, -1.55);
      this.glowMat.emissiveIntensity = 2.0;
    } else if (id === 'scatter') {
      // Wide short scatter — shorter + fatter + bigger ring
      this.cannonBody.scale.set(1.55, 1.35, 0.72);
      this.cannonBody.position.set(-0.42, 0.55, -0.72);
      this.cannonShroud.scale.set(1.5, 1.3, 1.1);
      this.cannonShroud.position.set(-0.42, 0.55, -0.28);
      this.muzzleRing.scale.set(1.7, 1.7, 1.7);
      this.muzzleRing.position.set(-0.42, 0.55, -1.18);
      this.glowMat.emissiveIntensity = 1.6;
    } else if (id === 'launcher') {
      // Fat ion tube — short, wide muzzle, bulky shroud
      this.cannonBody.scale.set(1.35, 1.45, 0.95);
      this.cannonBody.position.set(-0.42, 0.58, -0.78);
      this.cannonShroud.scale.set(1.45, 1.4, 1.2);
      this.cannonShroud.position.set(-0.42, 0.58, -0.22);
      this.muzzleRing.scale.set(1.85, 1.85, 1.35);
      this.muzzleRing.position.set(-0.42, 0.58, -1.22);
      this.glowMat.emissiveIntensity = 2.2;
    } else {
      // Balanced plasma repeater
      this.cannonBody.scale.set(1, 1, 1);
      this.cannonBody.position.set(-0.42, 0.55, -0.85);
      this.cannonShroud.scale.set(1, 1, 1);
      this.cannonShroud.position.set(-0.42, 0.55, -0.35);
      this.muzzleRing.scale.set(1, 1, 1);
      this.muzzleRing.position.set(-0.42, 0.55, -1.35);
      this.glowMat.emissiveIntensity = 1.4 + this.formTier * 0.25;
    }

    // Weapon identity wins on muzzle glow + ring; chassis keeps form-tier accent
    // blended toward weapon color so the switch is readable at a glance.
    this.glowMat.color.set(weaponColor);
    this.glowMat.emissive.set(weaponColor);
    this.muzzleRing.material = this.glowMat;
    this.accentMat.color.set(weaponColor);
    this.accentMat.emissive.set(weaponColor);
    this.ringMat.color.set(weaponColor);
    this.ghostMat.color.set(weaponColor);
    // Keep a hint of form-tier armor tone
    if (this.formTier > 0 && this.formAccent !== weaponColor) {
      this.accentMat.emissiveIntensity = 0.2 + this.formTier * 0.05;
    } else {
      this.accentMat.emissiveIntensity = 0.18;
    }
  }

  getFormTier(): number {
    return this.formTier;
  }

  private buildFormTier1(): THREE.Group {
    const g = new THREE.Group();
    const plate = this.box(0.5, 0.1, 0.55, this.armorMat, 0, 0.62, 0.15);
    plate.castShadow = true;
    const plate2 = this.box(0.42, 0.08, 0.4, this.armorMat, 0, 0.58, -0.45);
    // Secondary stub cannon (right)
    const stub = this.box(0.12, 0.12, 0.55, this.accentMat, 0.48, 0.55, -0.7);
    stub.castShadow = true;
    const stubRingMat = this.makeFormAccentMat();
    const stubRingGeo = new THREE.TorusGeometry(0.08, 0.025, 6, 10);
    this.geometries.push(stubRingGeo);
    const stubRing = new THREE.Mesh(stubRingGeo, stubRingMat);
    stubRing.position.set(0.48, 0.55, -1.0);
    stubRing.rotation.y = Math.PI / 2;
    g.add(plate, plate2, stub, stubRing);
    return g;
  }

  private buildFormTier2(): THREE.Group {
    const g = new THREE.Group();
    // Barrel shrouds
    const shroudGeo = new THREE.BoxGeometry(0.2, 0.2, 0.35);
    this.geometries.push(shroudGeo);
    const s1 = new THREE.Mesh(shroudGeo, this.chassisMat);
    s1.position.set(-0.42, 0.55, -1.05);
    const s2 = new THREE.Mesh(shroudGeo, this.chassisMat);
    s2.position.set(0.48, 0.55, -0.95);
    // Side blades
    const bladeGeo = new THREE.BoxGeometry(0.06, 0.4, 0.7);
    this.geometries.push(bladeGeo);
    const b1 = new THREE.Mesh(bladeGeo, this.makeFormAccentMat());
    b1.position.set(-0.95, 0.55, 0.1);
    b1.rotation.z = 0.55;
    const b2 = new THREE.Mesh(bladeGeo, this.makeFormAccentMat());
    b2.position.set(0.9, 0.52, 0.15);
    b2.rotation.z = -0.55;
    // Wing thrusters
    const wingGeo = new THREE.CylinderGeometry(0.08, 0.11, 0.42, 6);
    this.geometries.push(wingGeo);
    const w1 = new THREE.Mesh(wingGeo, this.thrusterMat);
    w1.rotation.x = Math.PI / 2;
    w1.position.set(-0.55, 0.48, 0.65);
    const w2 = new THREE.Mesh(wingGeo, this.thrusterMat);
    w2.rotation.x = Math.PI / 2;
    w2.position.set(0.5, 0.46, 0.62);
    this.thrusters.push(w1, w2);
    g.add(s1, s2, b1, b2, w1, w2);
    return g;
  }

  private buildFormTier3(): THREE.Group {
    const g = new THREE.Group();
    // Heavy side pods
    const podGeo = new THREE.BoxGeometry(0.28, 0.32, 0.85);
    this.geometries.push(podGeo);
    const p1 = new THREE.Mesh(podGeo, this.chassisMat);
    p1.position.set(-0.85, 0.55, -0.05);
    p1.castShadow = true;
    const p2 = new THREE.Mesh(podGeo, this.chassisMat);
    p2.position.set(0.82, 0.52, -0.02);
    p2.castShadow = true;
    // Spine antenna
    const spineGeo = new THREE.BoxGeometry(0.08, 0.35, 0.5);
    this.geometries.push(spineGeo);
    const spine = new THREE.Mesh(spineGeo, this.makeFormAccentMat());
    spine.position.set(0, 0.85, 0.25);
    // Core halo
    const haloGeo = new THREE.TorusGeometry(0.55, 0.04, 6, 24);
    this.geometries.push(haloGeo);
    const halo = new THREE.Mesh(haloGeo, this.makeFormAccentMat());
    halo.rotation.x = Math.PI / 2;
    halo.position.set(0, 0.35, 0.05);
    // Collar
    const collar = this.box(1.15, 0.12, 0.35, this.armorMat, 0, 0.68, 0.05);
    g.add(p1, p2, spine, halo, collar);
    return g;
  }

  private makeFormAccentMat(): THREE.MeshStandardMaterial {
    const mat = new THREE.MeshStandardMaterial({
      color: '#22d3ee',
      emissive: '#22d3ee',
      emissiveIntensity: 1.1,
      roughness: 0.3,
      metalness: 0.4,
    });
    this.formAccents.push(mat);
    return mat;
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
    this.overheatEmp = false;
    this.overheatPulse = false;
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
    this.setFormTier(0);
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
    this.overheatPulse = false;
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

    const speed =
      this.dashTimer > 0 ? this.stats.dashSpeed * this.dashSpeedMul : this.stats.moveSpeed;
    if (this.dashTimer > 0) this.dashTimer = Math.max(0, this.dashTimer - delta);

    const target = new THREE.Vector3(move.x, 0, move.y).multiplyScalar(speed);
    if (wantDash || this.dashTimer > 0) {
      if (move.lengthSq() < 0.01) {
        target.set(this.aim.x, 0, this.aim.y).multiplyScalar(speed);
      }
    }

    const smoothing = 1 - Math.exp(-Math.max(1, this.moveAccel) * delta);
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
        if (this.overheatEmp) {
          this.heat = this.stats.maxHeat * 0.32;
          this.overheated = false;
          this.overheatPulse = true;
        } else {
          this.overheated = true;
        }
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

  takeDamage(amount: number): { hit: boolean; shieldBroke: boolean } {
    if (!this.alive || this.invulnTimer > 0) return { hit: false, shieldBroke: false };
    const shieldBefore = this.shield;
    let remaining = amount;
    if (this.shield > 0) {
      const absorbed = Math.min(this.shield, remaining);
      this.shield -= absorbed;
      remaining -= absorbed;
    }
    const shieldBroke = shieldBefore > 0 && this.shield <= 0;
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
    return { hit: true, shieldBroke };
  }

  /** Heat ratio 0–1 for steam VFX. */
  getHeatRatio(): number {
    return this.heat / this.stats.maxHeat;
  }

  dispose(): void {
    for (const g of this.ghosts) this.group.remove(g.mesh);
    this.ghosts.length = 0;
    for (const geo of this.geometries) geo.dispose();
    for (const mat of this.formAccents) mat.dispose();
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
