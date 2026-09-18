import * as THREE from 'three';
import type { EnemyKind } from '../entities/Enemy';

export type EnemyFormTier = 0 | 1 | 2 | 3;

export type SharedEnemyAssets = {
  shellGeo: THREE.BufferGeometry;
  glowGeo: THREE.BufferGeometry;
  shellMat: THREE.MeshStandardMaterial;
  glowMat: THREE.MeshStandardMaterial;
  darkMat: THREE.MeshStandardMaterial;
  footGeo: THREE.RingGeometry;
  footMat: THREE.MeshBasicMaterial;
};

const cache = new Map<string, SharedEnemyAssets>();

/**
 * Form tiers unlock only at boss milestones (after waves 5 / 10 / 15),
 * not every wave — difficulty steps are discrete so player retrofits can keep pace.
 */
export function enemyFormTierForWave(wave: number): EnemyFormTier {
  if (wave >= 16) return 3;
  if (wave >= 11) return 2;
  if (wave >= 6) return 1;
  return 0;
}

function makeChaser(tier: EnemyFormTier): SharedEnemyAssets {
  const parts: THREE.BufferGeometry[] = [];
  parts.push(new THREE.ConeGeometry(0.42 + tier * 0.04, 0.95 + tier * 0.08, 5));
  if (tier >= 1) {
    const blade = new THREE.ConeGeometry(0.14, 0.55, 4);
    blade.translate(0.28, -0.08, 0);
    const blade2 = new THREE.ConeGeometry(0.14, 0.55, 4);
    blade2.translate(-0.28, -0.08, 0);
    parts.push(blade, blade2);
  }
  const shell = mergeGeos(parts);
  shell.rotateX(Math.PI / 2);
  shell.rotateZ(Math.PI);
  shell.translate(0, 0.28, 0.1);
  return pack('chaser', shell, makeChaserGlow(tier), chaserColor(tier), chaserEmissive(tier), 0.48);
}

function makeChaserGlow(tier: EnemyFormTier): THREE.BufferGeometry {
  const glow = new THREE.ConeGeometry(0.18 + tier * 0.03, 0.55 + tier * 0.1, 4);
  glow.rotateX(-Math.PI / 2);
  glow.translate(0, 0.28, -0.55 - tier * 0.08);
  return glow;
}

function chaserColor(tier: EnemyFormTier): string {
  return ['#ef4444', '#f97316', '#fb7185', '#f43f5e'][tier] ?? '#ef4444';
}

function chaserEmissive(tier: EnemyFormTier): string {
  return ['#7f1d1d', '#9a3412', '#9f1239', '#881337'][tier] ?? '#7f1d1d';
}

function makeRanged(tier: EnemyFormTier): SharedEnemyAssets {
  const parts: THREE.BufferGeometry[] = [];
  const inner = new THREE.TorusGeometry(0.38 + tier * 0.05, 0.08 + tier * 0.015, 6, 16);
  parts.push(inner);
  if (tier >= 1) {
    const outer = new THREE.TorusGeometry(0.52 + tier * 0.04, 0.05, 5, 14);
    outer.rotateX(0.35);
    outer.translate(0, 0.03, 0);
    parts.push(outer);
  }
  const shell = mergeGeos(parts);
  shell.rotateX(Math.PI / 2);
  shell.translate(0, 0.45, 0);
  return pack('ranged', shell, makeRangedGlow(tier), rangedColor(tier), rangedEmissive(tier), 0.45);
}

function makeRangedGlow(tier: EnemyFormTier): THREE.BufferGeometry {
  const glow =
    tier >= 2
      ? new THREE.OctahedronGeometry(0.24 + tier * 0.03, 0)
      : new THREE.IcosahedronGeometry(0.22 + tier * 0.02, 0);
  glow.translate(0, 0.55, 0);
  return glow;
}

function rangedColor(tier: EnemyFormTier): string {
  return ['#a78bfa', '#818cf8', '#c4b5fd', '#e879f9'][tier] ?? '#a78bfa';
}

function rangedEmissive(tier: EnemyFormTier): string {
  return ['#4c1d95', '#312e81', '#5b21b6', '#86198f'][tier] ?? '#4c1d95';
}

function makeElite(tier: EnemyFormTier): SharedEnemyAssets {
  const w = 0.78 + tier * 0.06;
  const h = 0.5 + tier * 0.06;
  const d = 0.62 + tier * 0.05;
  const parts: THREE.BufferGeometry[] = [];
  const body = new THREE.BoxGeometry(w, h, d);
  body.translate(0, 0.55, 0);
  parts.push(body);
  if (tier >= 1) {
    const wingL = new THREE.BoxGeometry(0.22, 0.28, 0.55);
    wingL.translate(-w * 0.55, 0.55, 0.05);
    const wingR = new THREE.BoxGeometry(0.22, 0.28, 0.55);
    wingR.translate(w * 0.55, 0.55, 0.05);
    parts.push(wingL, wingR);
  }
  if (tier >= 2) {
    const hornL = new THREE.BoxGeometry(0.1, 0.35, 0.18);
    hornL.translate(-0.22, 0.95, -0.2);
    hornL.rotateZ(0.25);
    const hornR = new THREE.BoxGeometry(0.1, 0.35, 0.18);
    hornR.translate(0.22, 0.95, -0.2);
    hornR.rotateZ(-0.25);
    parts.push(hornL, hornR);
  }
  if (tier >= 3) {
    const plate = new THREE.BoxGeometry(w * 0.9, 0.12, d * 0.7);
    plate.translate(0, 0.95, 0);
    parts.push(plate);
  }
  const shell = mergeGeos(parts);
  const glow = new THREE.SphereGeometry(0.16 + tier * 0.03, 8, 6);
  glow.translate(0, 0.55, -0.32);
  return pack('elite', shell, glow, eliteColor(tier), eliteEmissive(tier), 0.62);
}

function eliteColor(tier: EnemyFormTier): string {
  return ['#f59e0b', '#fb923c', '#fbbf24', '#facc15'][tier] ?? '#f59e0b';
}

function eliteEmissive(tier: EnemyFormTier): string {
  return ['#92400e', '#c2410c', '#b45309', '#a16207'][tier] ?? '#92400e';
}

function makeSwarm(tier: EnemyFormTier): SharedEnemyAssets {
  const shell = new THREE.OctahedronGeometry(0.22 + tier * 0.02, 0);
  shell.translate(0, 0.28, 0);
  const glow = new THREE.SphereGeometry(0.08 + tier * 0.01, 6, 4);
  glow.translate(0, 0.3, 0);
  return pack('swarm', shell, glow, '#f43f5e', '#9f1239', 0.28);
}

function makeBomber(tier: EnemyFormTier): SharedEnemyAssets {
  const shell = new THREE.SphereGeometry(0.4 + tier * 0.04, 10, 8);
  shell.translate(0, 0.42, 0);
  const glow = new THREE.SphereGeometry(0.18 + tier * 0.02, 8, 6);
  glow.translate(0, 0.42, 0);
  return pack('bomber', shell, glow, '#fb923c', '#c2410c', 0.5);
}

function makeBulwark(tier: EnemyFormTier): SharedEnemyAssets {
  const parts: THREE.BufferGeometry[] = [];
  const body = new THREE.BoxGeometry(0.9 + tier * 0.06, 0.7, 0.7);
  body.translate(0, 0.55, 0);
  parts.push(body);
  const plate = new THREE.BoxGeometry(0.95 + tier * 0.05, 0.55, 0.12);
  plate.translate(0, 0.55, 0.42);
  parts.push(plate);
  const shell = mergeGeos(parts);
  const glow = new THREE.BoxGeometry(0.2, 0.2, 0.08);
  glow.translate(0, 0.7, 0.5);
  return pack('bulwark', shell, glow, '#64748b', '#334155', 0.78);
}

function makeSniper(tier: EnemyFormTier): SharedEnemyAssets {
  const parts: THREE.BufferGeometry[] = [];
  const body = new THREE.CylinderGeometry(0.16, 0.22, 0.55 + tier * 0.04, 6);
  body.translate(0, 0.45, 0);
  parts.push(body);
  const barrel = new THREE.BoxGeometry(0.08, 0.08, 0.7 + tier * 0.06);
  barrel.translate(0, 0.55, 0.35);
  parts.push(barrel);
  const shell = mergeGeos(parts);
  const glow = new THREE.SphereGeometry(0.1 + tier * 0.02, 6, 5);
  glow.translate(0, 0.72, 0.1);
  return pack('sniper', shell, glow, '#22d3ee', '#0e7490', 0.42);
}

function makeDisruptor(tier: EnemyFormTier): SharedEnemyAssets {
  const parts: THREE.BufferGeometry[] = [];
  const core = new THREE.IcosahedronGeometry(0.32 + tier * 0.03, 0);
  core.translate(0, 0.5, 0);
  parts.push(core);
  const ring = new THREE.TorusGeometry(0.42 + tier * 0.03, 0.04, 5, 16);
  ring.rotateX(Math.PI / 2);
  ring.translate(0, 0.5, 0);
  parts.push(ring);
  const shell = mergeGeos(parts);
  const glow = new THREE.OctahedronGeometry(0.16 + tier * 0.02, 0);
  glow.translate(0, 0.55, 0);
  return pack('disruptor', shell, glow, '#c084fc', '#6b21a8', 0.52);
}

function makeBoss(_tier: EnemyFormTier): SharedEnemyAssets {
  const shell = new THREE.IcosahedronGeometry(0.72, 0);
  shell.translate(0, 1.0, 0);
  const glow = new THREE.IcosahedronGeometry(0.5, 1);
  glow.translate(0, 1.0, 0);
  return pack('boss', shell, glow, '#f43f5e', '#881337', 1.15);
}

function mergeGeos(list: THREE.BufferGeometry[]): THREE.BufferGeometry {
  // Minimal non-indexed merge (positions + normals).
  const positions: number[] = [];
  const normals: number[] = [];
  for (const geo of list) {
    const g = geo.index ? geo.toNonIndexed() : geo;
    const pos = g.getAttribute('position');
    const nor = g.getAttribute('normal');
    for (let i = 0; i < pos.count; i += 1) {
      positions.push(pos.getX(i), pos.getY(i), pos.getZ(i));
      if (nor) normals.push(nor.getX(i), nor.getY(i), nor.getZ(i));
    }
    if (g !== geo) g.dispose();
    geo.dispose();
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  if (normals.length === positions.length) {
    out.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  } else {
    out.computeVertexNormals();
  }
  return out;
}

function pack(
  _kind: EnemyKind,
  shellGeo: THREE.BufferGeometry,
  glowGeo: THREE.BufferGeometry,
  color: string,
  emissive: string,
  radius: number,
): SharedEnemyAssets {
  return {
    shellGeo,
    glowGeo,
    shellMat: new THREE.MeshStandardMaterial({
      color,
      emissive,
      emissiveIntensity: 0.4,
      roughness: 0.4,
      metalness: 0.45,
    }),
    glowMat: new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 1.2,
      roughness: 0.3,
      metalness: 0.2,
    }),
    darkMat: new THREE.MeshStandardMaterial({
      color: '#1a1020',
      emissive,
      emissiveIntensity: 0.12,
      roughness: 0.55,
      metalness: 0.3,
    }),
    footGeo: new THREE.RingGeometry(radius * 0.92, radius, 20),
    footMat: new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  };
}

export function getEnemyAssets(kind: EnemyKind, tier: EnemyFormTier = 0): SharedEnemyAssets {
  const key = `${kind}:${tier}`;
  const hit = cache.get(key);
  if (hit) return hit;
  let assets: SharedEnemyAssets;
  if (kind === 'chaser') assets = makeChaser(tier);
  else if (kind === 'ranged') assets = makeRanged(tier);
  else if (kind === 'elite') assets = makeElite(tier);
  else if (kind === 'swarm') assets = makeSwarm(tier);
  else if (kind === 'bomber') assets = makeBomber(tier);
  else if (kind === 'bulwark') assets = makeBulwark(tier);
  else if (kind === 'sniper') assets = makeSniper(tier);
  else if (kind === 'disruptor') assets = makeDisruptor(tier);
  else assets = makeBoss(tier);
  cache.set(key, assets);
  return assets;
}

export function disposeEnemyAssets(): void {
  for (const a of cache.values()) {
    a.shellGeo.dispose();
    a.glowGeo.dispose();
    a.shellMat.dispose();
    a.glowMat.dispose();
    a.darkMat.dispose();
    a.footGeo.dispose();
    a.footMat.dispose();
  }
  cache.clear();
}
