import { buildDiagnostics } from './buildDiagnostics';
import type { RenderBackendKind } from '../core/RenderBackend';

export type GameDiagnosticsHost = {
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
  backend: RenderBackendKind | string;
  webgpuSupported: boolean;
  combatTime: number;
  damageDealt: number;
  shotsFired: number;
  hitsLanded: number;
  dps: number;
  killsPerSec: number;
  hazardKills: number;
  damageByWeapon: Record<string, number>;
  killsByWeapon: Record<string, number>;
  damageByUpgrade: Record<string, number>;
  damageByHazard: Record<string, number>;
  damageTakenBySource: Record<string, number>;
  enemyKillsByType: Record<string, number>;
  bossPhaseDeaths: number;
  frameMs: { p50: number; p95: number; p99: number } | null;
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
    geometries: number;
    textures: number;
  };
  canvas: {
    clientWidth: number;
    clientHeight: number;
    width: number;
    height: number;
    dpr: number;
  };
};

export function publishGameDiagnostics(host: GameDiagnosticsHost): void {
  const backend: RenderBackendKind =
    host.backend === 'webgpu' || host.backend === 'webgl2' ? host.backend : 'webgl2';
  const frameMs = host.frameMs ?? { p50: 0, p95: 0, p99: 0 };
  window.__THREE_GAME_DIAGNOSTICS__ = buildDiagnostics({ ...host, backend, frameMs });
}
