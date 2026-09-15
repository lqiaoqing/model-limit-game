export class AudioSystem {
  private context: AudioContext | null = null;
  private unlocked = false;
  private muted = false;

  constructor() {
    const unlock = () => {
      void this.unlock();
    };
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
  }

  async unlock(): Promise<void> {
    if (this.unlocked) return;
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    this.context = new AudioContextClass();
    await this.context.resume();
    this.unlocked = true;
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
  }

  shoot(): void {
    this.blip(880, 0.04, 'square', 0.03, 220);
  }

  hit(): void {
    this.blip(180, 0.05, 'sawtooth', 0.04, 90);
  }

  kill(): void {
    this.blip(320, 0.12, 'triangle', 0.06, 720);
  }

  hurt(): void {
    this.blip(120, 0.18, 'sawtooth', 0.07, 60);
  }

  dash(): void {
    this.blip(240, 0.08, 'sine', 0.05, 640);
  }

  ult(): void {
    this.blip(90, 0.35, 'sawtooth', 0.08, 40);
  }

  overheat(): void {
    this.blip(200, 0.25, 'square', 0.05, 50);
  }

  pickup(): void {
    this.blip(520, 0.1, 'triangle', 0.05, 900);
  }

  /** Rising pitch for pickup chains within a short window. */
  pickupChain(chain: number): void {
    const base = 480 + Math.min(chain, 8) * 40;
    this.blip(base, 0.1, 'triangle', 0.05, base * 1.6);
  }

  wave(): void {
    this.blip(440, 0.15, 'sine', 0.05, 660);
  }

  boss(): void {
    this.blip(70, 0.5, 'sawtooth', 0.09, 40);
  }

  death(): void {
    this.blip(160, 0.6, 'sawtooth', 0.09, 30);
  }

  dispose(): void {
    void this.context?.close();
    this.context = null;
  }

  private blip(
    freq: number,
    duration: number,
    type: OscillatorType,
    gainValue: number,
    endFreq: number,
  ): void {
    if (this.muted || !this.context || this.context.state !== 'running') return;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    const now = this.context.currentTime;
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, now);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + duration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(gainValue, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain).connect(this.context.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }
}
