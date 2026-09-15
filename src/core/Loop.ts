export class Loop {
  private frameId = 0;
  private lastTime = 0;
  private running = false;
  private accumulator = 0;

  /** Allow larger catch-up steps when the tab/GPU stalls (software GL, hidden tab). */
  private readonly maxStep = 0.1;
  private readonly maxStepsPerFrame = 4;

  constructor(
    private readonly update: (deltaSeconds: number, elapsedSeconds: number) => void,
    private readonly render: () => void,
  ) {}

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.frameId = requestAnimationFrame(this.tick);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.frameId);
  }

  private readonly tick = (time: number) => {
    if (!this.running) return;
    let frameDelta = (time - this.lastTime) / 1000;
    this.lastTime = time;
    // Clamp pathological spikes but keep enough time so waves advance at low FPS.
    frameDelta = Math.min(Math.max(frameDelta, 0), 0.25);
    this.accumulator += frameDelta;

    let steps = 0;
    while (this.accumulator >= 1 / 120 && steps < this.maxStepsPerFrame) {
      const step = Math.min(this.accumulator, this.maxStep);
      this.accumulator -= step;
      this.update(step, time / 1000);
      steps += 1;
    }
    // If we hit the step cap, drop leftover time to avoid spiral of death.
    if (this.accumulator > this.maxStep * 2) this.accumulator = 0;

    this.render();
    this.frameId = requestAnimationFrame(this.tick);
  };
}
