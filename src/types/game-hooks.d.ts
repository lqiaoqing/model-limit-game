export {};

declare global {
  interface Window {
    __THREE_GAME_TEST_HOOKS__?: {
      seed: (value: number) => void;
      setState: (name: string) => { state: string };
      setPausedForScreenshot: (paused: boolean) => void;
      setReducedMotion: (enabled: boolean) => void;
      hideDebugUi: (hidden: boolean) => void;
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
      targetScore?: number;
      projectiles?: number;
      player: {
        hp?: number;
        shield?: number;
        heat?: number;
        overheated?: boolean;
        ult?: number;
        alive?: boolean;
        speed?: number;
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
