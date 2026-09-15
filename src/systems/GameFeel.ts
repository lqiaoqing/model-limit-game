export class GameFeel {
  private hitstopTimer = 0;
  private fovPunch = 0;
  private hurtFlash = 0;
  private slowmoTimer = 0;
  private slowmoScale = 1;

  constructor(
    private readonly baseFov: number,
    private readonly camera: { fov: number; updateProjectionMatrix: () => void },
  ) {}

  /** Freeze world simulation briefly; UI/VFX still advance with real delta. */
  triggerHitstop(duration: number): void {
    if (duration > this.hitstopTimer) this.hitstopTimer = duration;
  }

  /** Slow-mo beat (wave clear, boss death). Scale 0.35 = 35% speed. */
  triggerSlowmo(duration: number, scale = 0.35): void {
    this.slowmoTimer = Math.max(this.slowmoTimer, duration);
    this.slowmoScale = scale;
  }

  triggerFovPunch(amount = 3.5): void {
    this.fovPunch = Math.min(8, this.fovPunch + amount);
  }

  triggerHurtFlash(amount = 0.85): void {
    this.hurtFlash = Math.min(1, this.hurtFlash + amount);
  }

  isSlowmo(): boolean {
    return this.slowmoTimer > 0;
  }

  /** Returns the delta the world simulation should use this frame. */
  consumeWorldDelta(delta: number): number {
    if (this.hitstopTimer > 0) {
      this.hitstopTimer = Math.max(0, this.hitstopTimer - delta);
      return 0;
    }
    if (this.slowmoTimer > 0) {
      this.slowmoTimer = Math.max(0, this.slowmoTimer - delta);
      return delta * this.slowmoScale;
    }
    return delta;
  }

  update(delta: number): void {
    this.fovPunch = Math.max(0, this.fovPunch - delta * 22);
    this.hurtFlash = Math.max(0, this.hurtFlash - delta * 2.8);
    this.camera.fov = this.baseFov + this.fovPunch;
    this.camera.updateProjectionMatrix();
  }

  getHurtFlash(): number {
    return this.hurtFlash;
  }

  reset(): void {
    this.hitstopTimer = 0;
    this.fovPunch = 0;
    this.hurtFlash = 0;
    this.slowmoTimer = 0;
    this.camera.fov = this.baseFov;
    this.camera.updateProjectionMatrix();
  }
}
