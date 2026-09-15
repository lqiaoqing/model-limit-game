import * as THREE from 'three';
import type { EnemyKind } from '../entities/Enemy';

export type SharedEnemyAssets = {
  shellGeo: THREE.BufferGeometry;
  glowGeo: THREE.BufferGeometry;
  shellMat: THREE.MeshStandardMaterial;
  glowMat: THREE.MeshStandardMaterial;
  darkMat: THREE.MeshStandardMaterial;
  footGeo: THREE.RingGeometry;
  footMat: THREE.MeshBasicMaterial;
};

const cache = new Map<EnemyKind, SharedEnemyAssets>();

function makeChaser(): SharedEnemyAssets {
  // Single low wedge body + prow tip (2 draws when instanced)
  const shell = new THREE.ConeGeometry(0.42, 0.95, 5);
  shell.rotateX(Math.PI / 2);
  shell.rotateZ(Math.PI);
  shell.translate(0, 0.28, 0.1);
  const glow = new THREE.ConeGeometry(0.18, 0.55, 4);
  glow.rotateX(-Math.PI / 2);
  glow.translate(0, 0.28, -0.55);
  return pack('chaser', shell, glow, '#ef4444', '#7f1d1d', 0.48);
}

function makeRanged(): SharedEnemyAssets {
  const shell = new THREE.TorusGeometry(0.38, 0.08, 6, 16);
  shell.rotateX(Math.PI / 2);
  shell.translate(0, 0.45, 0);
  const glow = new THREE.IcosahedronGeometry(0.22, 0);
  glow.translate(0, 0.55, 0);
  return pack('ranged', shell, glow, '#a78bfa', '#4c1d95', 0.45);
}

function makeElite(): SharedEnemyAssets {
  const shell = new THREE.BoxGeometry(0.78, 0.5, 0.62);
  shell.translate(0, 0.55, 0);
  const glow = new THREE.SphereGeometry(0.16, 8, 6);
  glow.translate(0, 0.55, -0.32);
  return pack('elite', shell, glow, '#f59e0b', '#92400e', 0.62);
}

function makeBoss(): SharedEnemyAssets {
  const shell = new THREE.IcosahedronGeometry(0.72, 0);
  shell.translate(0, 1.0, 0);
  const glow = new THREE.IcosahedronGeometry(0.5, 1);
  glow.translate(0, 1.0, 0);
  return pack('boss', shell, glow, '#f43f5e', '#881337', 1.15);
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

export function getEnemyAssets(kind: EnemyKind): SharedEnemyAssets {
  const hit = cache.get(kind);
  if (hit) return hit;
  let assets: SharedEnemyAssets;
  if (kind === 'chaser') assets = makeChaser();
  else if (kind === 'ranged') assets = makeRanged();
  else if (kind === 'elite') assets = makeElite();
  else assets = makeBoss();
  cache.set(kind, assets);
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
