/**
 * Test-hook installer for Playwright / balance harness.
 * Production gameplay must not depend on this module.
 */
import { createSeededRandom } from '../utils/random';
import { composeWaveTickets } from '../systems/EncounterDirector';
import { auditWaveTickets, fullCyclePlan, wavePlan } from '../systems/WaveProgression';
import { WEAPON_DEFS } from '../combat/Weapons';
import { getUpgrade, type UpgradeId, type UpgradeDef } from '../systems/UpgradePool';
import { ENEMY_TEMPLATES, type EnemyKind } from '../entities/Enemy';

export type ListedEnemy = {
  id: string;
  kind: string;
  x: number;
  z: number;
  hp: number;
  alive: boolean;
  squadId: string | null;
  squadRole: string | null;
  anchor: string | null;
};

export type GameTestHooksHost = {
  seedRng(value: number): void;
  restart(): void;
  setScore(v: number): void;
  setElapsed(v: number): void;
  setCombo(v: number): void;
  setPeakCombo(v: number): void;
  setUltCharge(v: number): void;
  setKills(v: number): void;
  setMode(v: string): void;
  setStressMode(on: boolean): void;
  syncEnemyBatch(): void;
  pushHud(delta: number): void;
  render(): void;
  publishDiagnostics(): void;
  setPausedForScreenshot(v: boolean): void;
  setReducedMotion(v: boolean): void;
  stabilizeVisuals(): void;
  setHiddenDebugUi(hidden: boolean): void;
  setPerfVisible(v: boolean): void;
  applyUpgrade(index: number): void;
  getMode(): string;
  applyUpgradeDef(def: UpgradeDef): void;
  bumpUpgradeStack(id: string): void;
  syncWeaponStats(): void;
  setOverheatEmp(v: boolean): void;
  getWeapon(): string;
  setWeapon(id: string): boolean;
  getCombatModsOverheatEmp(): boolean;
  getWavesEnemies(): number;
  spawnEnemyAt(kind: string, x: number, z: number): void;
  forceSpawnNearPlayer(kind: string): void;
  clearWavesEnemies(): void;
  listEnemies(): ListedEnemy[];
  forceBossInternal(id: string): { ok: boolean; bossId?: string; bosses?: number };
  setBossHpRatioInternal(ratio: number): {
    ok: boolean;
    hp?: number;
    maxHp?: number;
    phase?: number;
    bossId?: string | null;
  };
  getBossSnapshotInternal(): {
    activeBossId: string;
    bossId: string | null;
    alive: boolean;
    hpRatio: number;
    director: {
      bossId: string | null;
      phase: number;
      shieldActive: boolean;
      shieldDrones: number;
      arenaShrink: number;
      beamAngle: number;
    };
  };
  debugSetWave(wave: number): { wave: number; squads: string[] };
  getEncounterSnapshotInternal(): {
    wave: number;
    squads: string[];
    tickets: Array<{
      kind: string;
      squadId: string;
      anchor: string;
      delay: number;
      offsetX: number;
      offsetZ: number;
    }>;
    enemies: ListedEnemy[];
    squadGroups: Array<{ squadId: string; count: number; kinds: string[]; roles: string[] }>;
  };
  triggerHazardInternal(kind: string): {
    ok: boolean;
    hazard?: {
      id: string;
      kind: string;
      phase: string;
      x: number;
      z: number;
      axis: number;
      radius: number;
      coreHp: number | null;
    };
  };
  getHazardSnapshotInternal(): {
    budget: number;
    hazards: Array<{
      id: string;
      kind: string;
      phase: string;
      x: number;
      z: number;
      coreHp: number | null;
      kills: number;
    }>;
    hazardKills: number;
    playerInShock: boolean;
  };
  planHazardSchedule(wave: number, seed: number): string[];
  debugHitEnemyInternal(
    id: string,
    damage: number,
    fromX?: number,
    fromZ?: number,
  ): { ok: boolean; hp: number; alive: boolean; kind?: string };
  getPlayerSoftControlInternal(): {
    moveSpeedMul: number;
    heatCoolMul: number;
    disruptTimer: number;
  };
  getBuildSnapshotInternal(): {
    weapon: string;
    fireInterval: number;
    damage: number;
    projectileSpeed: number;
    pierce: number;
    spread: number;
    aoeRadius?: number;
    heatPerShot?: number;
    modifiers: string[];
    stacks: Record<string, number>;
    perWeaponDamage?: Record<string, number>;
    poolSize?: number;
    ruleCount?: number;
  };
  setEnemyPassive(v: boolean): void;
  setFreezeEnemies(v: boolean): void;
};

export function installGameTestHooks(host: GameTestHooksHost): void {
  window.__THREE_GAME_TEST_HOOKS__ = {
    seed: (value: number) => {
      host.seedRng(value);
    },
    setState: (name: string) => {
      if (name !== 'active-play' && name !== 'complete' && name !== 'stress') {
        throw new Error(`Unknown test state: ${name}`);
      }
      host.restart();
      if (name === 'complete') {
        host.setScore(12800);
        host.setElapsed(95);
        host.setCombo(3.5);
        host.setPeakCombo(4.2);
        host.setUltCharge(100);
        host.setKills(87);
        host.setMode('play');
      }
      if (name === 'stress') {
        host.setStressMode(true);
        host.restart();
        host.setStressMode(true);
        host.syncEnemyBatch();
        host.pushHud(0);
      }
      host.render();
      host.publishDiagnostics();
      return { state: name };
    },
    setPausedForScreenshot: (paused: boolean) => {
      host.setPausedForScreenshot(paused);
    },
    setReducedMotion: (enabled: boolean) => {
      host.setReducedMotion(enabled);
      if (enabled) host.stabilizeVisuals();
      host.render();
      host.publishDiagnostics();
    },
    hideDebugUi: (hidden: boolean) => {
      host.setHiddenDebugUi(hidden);
      host.setPerfVisible(!hidden);
    },
    pickUpgrade: (index: number) => {
      host.applyUpgrade(index);
      return { mode: host.getMode() };
    },
    grantUpgrade: (id: string) => {
      const def = getUpgrade(id as UpgradeId);
      if (!def) return { ok: false };
      host.applyUpgradeDef(def);
      host.bumpUpgradeStack(id);
      host.syncWeaponStats();
      host.setOverheatEmp(host.getCombatModsOverheatEmp());
      host.publishDiagnostics();
      return { ok: true, weapon: host.getWeapon() };
    },
    forceWeapon: (id: string) => {
      if (!(id in WEAPON_DEFS)) return { ok: false, weapon: host.getWeapon() };
      const ok = host.setWeapon(id);
      return { ok, weapon: host.getWeapon() };
    },
    spawnEnemy: (kind: string, x?: number, z?: number) => {
      const k = kind as EnemyKind;
      if (!(k in ENEMY_TEMPLATES)) return { ok: false, enemies: host.getWavesEnemies() };
      if (typeof x === 'number' && typeof z === 'number') host.spawnEnemyAt(k, x, z);
      else host.forceSpawnNearPlayer(k);
      host.syncEnemyBatch();
      return { ok: true, enemies: host.getWavesEnemies() };
    },
    forceBoss: (id: string) => host.forceBossInternal(id),
    setBossHpRatio: (ratio: number) => host.setBossHpRatioInternal(ratio),
    getBossSnapshot: () => host.getBossSnapshotInternal(),
    getEnemies: () => host.listEnemies(),
    clearEnemies: () => {
      host.clearWavesEnemies();
      host.syncEnemyBatch();
      return { ok: true, enemies: 0 };
    },
    forceWave: (wave: number) => host.debugSetWave(wave),
    composeEncounter: (wave: number, seed: number) => {
      const rng = createSeededRandom(seed);
      return composeWaveTickets({
        wave,
        stressMode: false,
        rng,
        bossWave: wave % 5 === 0,
        halfWidth: 14,
        halfDepth: 9,
      });
    },
    getWavePlan: (wave: number) => wavePlan(wave),
    getFullCyclePlan: () => fullCyclePlan(),
    auditWave: (wave: number, seed: number) => {
      const rng = createSeededRandom(seed);
      const enc = composeWaveTickets({
        wave,
        stressMode: false,
        rng,
        bossWave: wave % 5 === 0,
        halfWidth: 14,
        halfDepth: 9,
      });
      return auditWaveTickets(wave, enc.tickets, enc.squads);
    },
    getEncounterSnapshot: () => host.getEncounterSnapshotInternal(),
    triggerHazard: (kind: string) => host.triggerHazardInternal(kind),
    getHazardSnapshot: () => host.getHazardSnapshotInternal(),
    planHazardSchedule: (wave: number, seed: number) => host.planHazardSchedule(wave, seed),
    debugHitEnemy: (id: string, damage: number, fromX?: number, fromZ?: number) =>
      host.debugHitEnemyInternal(id, damage, fromX, fromZ),
    getPlayerSoftControl: () => host.getPlayerSoftControlInternal(),
    getBuildSnapshot: () => host.getBuildSnapshotInternal(),
    setEnemyPassive: (v: boolean) => host.setEnemyPassive(v),
    setFreezeEnemies: (v: boolean) => host.setFreezeEnemies(v),
  };
}
