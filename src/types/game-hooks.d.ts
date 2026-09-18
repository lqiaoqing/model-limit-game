export {};

declare global {
  interface Window {
    __THREE_GAME_TEST_HOOKS__?: {
      seed: (value: number) => void;
      setState: (name: string) => { state: string };
      setPausedForScreenshot: (paused: boolean) => void;
      setReducedMotion: (enabled: boolean) => void;
      hideDebugUi: (hidden: boolean) => void;
      pickUpgrade: (index: number) => { mode: string };
      grantUpgrade?: (id: string) => { ok: boolean; weapon?: string };
      forceWeapon?: (id: string) => { ok: boolean; weapon?: string };
      spawnEnemy?: (
        kind: string,
        x?: number,
        z?: number,
      ) => { ok: boolean; enemies: number };
      getEnemies?: () => Array<{
        id?: string;
        kind: string;
        x: number;
        z: number;
        hp: number;
        alive: boolean;
      }>;
      clearEnemies?: () => { ok: boolean; enemies: number };
      debugHitEnemy?: (
        id: string,
        damage: number,
        fromX?: number,
        fromZ?: number,
      ) => { ok: boolean; hp: number; alive: boolean; kind?: string };
      getPlayerSoftControl?: () => {
        moveSpeedMul: number;
        heatCoolMul: number;
        disruptTimer: number;
      };
      getBuildSnapshot?: () => {
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
    };
    __THREE_GAME_DIAGNOSTICS__?: {
      frame: number;
      elapsed: number;
      score: number;
      complete: boolean;
      mode?: string;
      wave?: number;
      enemies?: number;
      combo?: number;
      peakCombo?: number;
      fps?: number;
      kills?: number;
      stress?: boolean;
      upgradeStacks?: Record<string, number>;
      weapon?: string;
      modifiers?: string[];
      bossPhase?: number | null;
      playerFormTier?: number;
      enemyFormTier?: number;
      targetScore?: number;
      projectiles?: number;
      particles?: number;
      backend?: string;
      webgpuSupported?: boolean;
      combatTime?: number;
      damageDealt?: number;
      shotsFired?: number;
      hitsLanded?: number;
      dps?: number;
      killsPerSec?: number;
      frameMs?: { p50: number; p95: number; p99: number };
      player: {
        hp?: number;
        shield?: number;
        heat?: number;
        overheated?: boolean;
        ult?: number;
        alive?: boolean;
        speed?: number;
        fireInterval?: number;
        projectileDamage?: number;
        projectileSpeed?: number;
        heatPerShot?: number;
        position: { x: number; y: number; z: number };
      };
      renderer: {
        calls: number;
        triangles: number;
        geometries?: number;
        textures?: number;
      };
      canvas?: {
        clientWidth: number;
        clientHeight: number;
        width: number;
        height: number;
        dpr: number;
      };
    };
  }
}
