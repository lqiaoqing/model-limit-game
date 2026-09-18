import { UPGRADE_POOL, type UpgradeDef } from '../systems/UpgradePool';
import type { Player } from '../entities/Player';
import type { CombatModifiers } from '../combat/CombatModifiers';
import type { DebugActions } from '../systems/DebugTools';
import type { Enemy } from '../entities/Enemy';

export type DebugActionDeps = {
  getPlayer: () => Player;
  getMode: () => string;
  setMode: (m: string) => void;
  applyUpgradeCtx: (def: UpgradeDef) => void;
  getUpgradeStacks: () => Partial<Record<string, number>>;
  bumpUpgradeStack: (id: string) => void;
  syncWeaponStats: () => void;
  setOverheatEmp: (v: boolean) => void;
  getCombatMods: () => CombatModifiers;
  refreshPlayerForm: () => void;
  forEachLiveEnemy: (fn: (enemy: Enemy) => void) => void;
  onEnemyKilled: (enemy: Enemy) => void;
  debugClearWave: () => void;
  openUpgradePicker: () => void;
  restart: () => void;
  setStressMode: (on: boolean) => void;
  setLowGraphics: (on: boolean) => void;
  setGfxToggleChecked: (on: boolean) => void;
  publishDiagnostics: () => void;
};

export function createDebugActionHandlers(deps: DebugActionDeps): DebugActions {
  return {
    fullHeal: () => {
      const player = deps.getPlayer();
      player.hp = player.stats.maxHp;
      player.shield = player.stats.maxShield;
      player.alive = true;
      player.group.visible = true;
      if (deps.getMode() === 'dead') deps.setMode('play');
    },
    clearHeat: () => {
      const player = deps.getPlayer();
      player.heat = 0;
      player.overheated = false;
    },
    fillUlt: () => {
      deps.getPlayer().ultCharge = 100;
    },
    grantAllUpgrades: () => {
      for (const def of UPGRADE_POOL) {
        const stacks = deps.getUpgradeStacks()[def.id] ?? 0;
        const need = def.maxStacks - stacks;
        for (let i = 0; i < need; i += 1) {
          deps.applyUpgradeCtx(def);
          deps.bumpUpgradeStack(def.id);
        }
      }
      deps.syncWeaponStats();
      deps.setOverheatEmp(Boolean(deps.getCombatMods().overheatEmp));
      const player = deps.getPlayer();
      player.hp = player.stats.maxHp;
      player.shield = player.stats.maxShield;
      deps.refreshPlayerForm();
    },
    killAllEnemies: () => {
      deps.forEachLiveEnemy((enemy) => {
        enemy.takeDamage(999999);
        deps.onEnemyKilled(enemy);
      });
    },
    skipWave: () => {
      deps.forEachLiveEnemy((enemy) => {
        enemy.takeDamage(999999);
        deps.onEnemyKilled(enemy);
      });
      deps.debugClearWave();
    },
    openUpgrade: () => {
      deps.openUpgradePicker();
    },
    restart: () => deps.restart(),
    setStress: (on: boolean) => deps.setStressMode(on),
    setLowGraphics: (on: boolean) => {
      deps.setLowGraphics(on);
      deps.setGfxToggleChecked(on);
    },
  };
}
