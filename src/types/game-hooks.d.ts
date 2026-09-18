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
      forceWave?: (wave: number) => { wave: number; squads: string[] };
      forceBoss?: (id: string) => { ok: boolean; bossId?: string; bosses?: number };
      setBossHpRatio?: (ratio: number) => {
        ok: boolean;
        hp?: number;
        maxHp?: number;
        phase?: number;
        bossId?: string | null;
      };
      getBossSnapshot?: () => {
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
      composeEncounter?: (
        wave: number,
        seed: number,
      ) => {
        tickets: Array<{
          kind: string;
          squadId: string;
          anchor: string;
          delay: number;
          offsetX: number;
          offsetZ: number;
          bossId?: string | null;
        }>;
        squads: string[];
        budgetLeft: number;
      };
      getEncounterSnapshot?: () => {
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
        enemies: Array<{
          id?: string;
          kind: string;
          x: number;
          z: number;
          hp: number;
          alive: boolean;
          squadId?: string | null;
          squadRole?: string | null;
          anchor?: string | null;
        }>;
        squadGroups: Array<{
          squadId: string;
          count: number;
          kinds: string[];
          roles: string[];
        }>;
      };
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
      triggerHazard?: (kind: string) => {
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
      getHazardSnapshot?: () => {
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
      planHazardSchedule?: (wave: number, seed: number) => string[];
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
      hazardKills?: number;
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
