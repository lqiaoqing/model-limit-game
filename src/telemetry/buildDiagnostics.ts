import type { RenderBackendKind } from '../core/RenderBackend';

export type DiagnosticsInput = {
  frame: number;
  elapsed: number;
  score: number;
  mode: string;
  wave: number;
  enemies: number;
  combo: number;
  peakCombo: number;
  fps: number;
  kills: number;
  stress: boolean;
  upgradeStacks: Record<string, number>;
  weapon: string;
  modifiers: string[];
  bossPhase: number | null;
  playerFormTier: number;
  enemyFormTier: number;
  projectiles: number;
  particles: number;
  backend: RenderBackendKind;
  webgpuSupported: boolean;
  combatTime: number;
  damageDealt: number;
  shotsFired: number;
  hitsLanded: number;
  dps: number;
  killsPerSec: number;
  hazardKills?: number;
  frameMs: { p50: number; p95: number; p99: number };
  player: {
    hp: number;
    shield: number;
    heat: number;
    overheated: boolean;
    ult: number;
    alive: boolean;
    fireInterval: number;
    projectileDamage: number;
    projectileSpeed: number;
    heatPerShot: number;
    speed: number;
    position: { x: number; y: number; z: number };
  };
  renderer: {
    calls: number;
    triangles: number;
    geometries?: number;
    textures?: number;
  };
  canvas: {
    clientWidth: number;
    clientHeight: number;
    width: number;
    height: number;
    dpr: number;
  };
};

export function buildDiagnostics(input: DiagnosticsInput): DiagnosticsInput & { complete: boolean } {
  return {
    ...input,
    complete: input.mode === 'dead',
  };
}
