export type HudSnapshot = {
  hp: number;
  maxHp: number;
  shield: number;
  maxShield: number;
  heat: number;
  maxHeat: number;
  overheated: boolean;
  wave: number;
  score: number;
  combo: number;
  enemies: number;
  ult: number;
  time: number;
  status: string;
  boss: { visible: boolean; hpRatio: number; name: string };
  waveBanner: string | null;
  mode: 'play' | 'paused' | 'dead';
  peakCombo: number;
  kills: number;
  deathCause: string;
  stress: boolean;
  lowGraphics: boolean;
};

export class Hud {
  private readonly els = {
    hpText: this.el('#hp-text'),
    hpFill: this.el('#hp-fill'),
    shieldText: this.el('#shield-text'),
    shieldFill: this.el('#shield-fill'),
    heatText: this.el('#heat-text'),
    heatFill: this.el('#heat-fill'),
    waveValue: this.el('#wave-value'),
    timerValue: this.el('#timer-value'),
    scoreValue: this.el('#score-value'),
    comboValue: this.el('#combo-value'),
    comboBlock: this.el('#combo-block'),
    comboPips: this.el('#combo-pips'),
    ultReadout: this.el('#ult-readout'),
    ultRing: this.el('#ult-ring-fill') as unknown as SVGCircleElement,
    enemiesValue: this.el('#enemies-value'),
    statusLine: this.el('#status-line'),
    bossBar: this.el('#boss-bar'),
    bossFill: this.el('#boss-fill'),
    bossName: this.el('#boss-name'),
    overheat: this.el('#overheat-banner'),
    waveBanner: this.el('#wave-banner'),
    killFeed: this.el('#kill-feed'),
    ultFlash: this.el('#ult-flash'),
    overlay: this.el('#overlay'),
    overlayTitle: this.el('#overlay-title'),
    overlaySub: this.el('#overlay-sub'),
    overlayStats: this.el('#overlay-stats'),
    overlayPrimary: this.el<HTMLButtonElement>('#overlay-primary'),
    overlaySecondary: this.el<HTMLButtonElement>('#overlay-secondary'),
    stressToggle: this.el<HTMLInputElement>('#stress-toggle'),
    gfxToggle: this.el<HTMLInputElement>('#gfx-toggle'),
    stressBadge: this.el('#stress-badge'),
    perfHud: this.el('#perf-hud'),
    perfFps: this.el('#perf-fps'),
    perfCalls: this.el('#perf-calls'),
    perfTris: this.el('#perf-tris'),
    perfFoes: this.el('#perf-foes'),
  };

  private waveBannerTimer = 0;
  private readonly ultCircumference = 2 * Math.PI * 18;
  private onPrimary: () => void = () => undefined;
  private onSecondary: () => void = () => undefined;
  private onStress: (on: boolean) => void = () => undefined;
  private onGraphics: (low: boolean) => void = () => undefined;

  constructor() {
    this.els.overlayPrimary.addEventListener('click', () => this.onPrimary());
    this.els.overlaySecondary.addEventListener('click', () => this.onSecondary());
    this.els.stressToggle.addEventListener('change', () => this.onStress(this.els.stressToggle.checked));
    this.els.gfxToggle.addEventListener('change', () => this.onGraphics(this.els.gfxToggle.checked));

    // Combo pips (8 segments)
    for (let i = 0; i < 8; i += 1) {
      const pip = document.createElement('i');
      this.els.comboPips.appendChild(pip);
    }
    this.els.ultRing.style.strokeDasharray = String(this.ultCircumference);
  }

  setOverlayHandlers(primary: () => void, secondary: () => void): void {
    this.onPrimary = primary;
    this.onSecondary = secondary;
  }

  setStressHandler(handler: (on: boolean) => void): void {
    this.onStress = handler;
  }

  setGraphicsHandler(handler: (low: boolean) => void): void {
    this.onGraphics = handler;
  }

  setStressVisible(on: boolean): void {
    this.els.stressBadge.classList.toggle('hidden', !on);
    this.els.stressToggle.checked = on;
  }

  showWaveBanner(text: string, boss = false): void {
    this.waveBannerTimer = 1.6;
    this.els.waveBanner.textContent = text;
    this.els.waveBanner.classList.remove('hidden', 'boss');
    if (boss) this.els.waveBanner.classList.add('boss');
    this.els.waveBanner.style.animation = 'none';
    void this.els.waveBanner.offsetWidth;
    this.els.waveBanner.style.animation = '';
  }

  popScore(points: number): void {
    // Brief score tick emphasis via status when large
    if (points >= 200) {
      this.els.statusLine.textContent = `+${points}`;
      this.els.statusLine.style.borderBottomColor = '#fbbf24';
      window.setTimeout(() => {
        this.els.statusLine.style.borderBottomColor = '';
      }, 400);
    }
  }

  flashUlt(): void {
    const el = this.els.ultFlash;
    el.classList.remove('hidden');
    el.style.animation = 'none';
    // reflow
    void el.offsetWidth;
    el.style.animation = '';
    window.setTimeout(() => el.classList.add('hidden'), 420);
  }

  pushKillFeed(text: string, kind: 'chaser' | 'ranged' | 'elite' | 'boss'): void {
    const item = document.createElement('div');
    item.className = `kill-feed-item ${kind}`;
    item.textContent = text;
    this.els.killFeed.appendChild(item);
    while (this.els.killFeed.children.length > 5) {
      this.els.killFeed.removeChild(this.els.killFeed.firstChild!);
    }
    window.setTimeout(() => item.remove(), 2200);
  }

  flashPickup(label: string, color: string): void {
    const item = document.createElement('div');
    item.className = 'kill-feed-item pickup';
    item.style.borderLeftColor = color;
    item.style.color = color;
    item.textContent = `◆ ${label}`;
    this.els.killFeed.appendChild(item);
    while (this.els.killFeed.children.length > 5) {
      this.els.killFeed.removeChild(this.els.killFeed.firstChild!);
    }
    // Brief status echo
    this.els.statusLine.textContent = label;
    this.els.statusLine.style.borderBottomColor = color;
    window.setTimeout(() => {
      item.remove();
      this.els.statusLine.style.borderBottomColor = '';
    }, 1600);
  }

  setPerfVisible(visible: boolean): void {
    this.els.perfHud.classList.toggle('hidden', !visible);
  }

  updatePerf(fps: number, calls: number, tris: number, foes: number): void {
    this.els.perfFps.textContent = String(Math.round(fps));
    this.els.perfCalls.textContent = String(calls);
    this.els.perfTris.textContent = tris > 999 ? `${(tris / 1000).toFixed(1)}k` : String(tris);
    this.els.perfFoes.textContent = String(foes);
  }

  update(snapshot: HudSnapshot, delta: number): void {
    const { els } = this;
    els.hpText.textContent = String(Math.ceil(snapshot.hp));
    els.hpFill.style.transform = `scaleX(${Math.max(0, snapshot.hp / snapshot.maxHp)})`;
    els.shieldText.textContent = String(Math.ceil(snapshot.shield));
    els.shieldFill.style.transform = `scaleX(${Math.max(0, snapshot.shield / snapshot.maxShield)})`;
    els.heatText.textContent = `${Math.round((snapshot.heat / snapshot.maxHeat) * 100)}%`;
    els.heatFill.style.transform = `scaleX(${Math.max(0, snapshot.heat / snapshot.maxHeat)})`;

    els.waveValue.textContent = String(snapshot.wave);
    const minutes = Math.floor(snapshot.time / 60).toString().padStart(2, '0');
    const seconds = Math.floor(snapshot.time % 60).toString().padStart(2, '0');
    els.timerValue.textContent = `${minutes}:${seconds}`;
    els.scoreValue.textContent = String(snapshot.score);

    els.comboValue.textContent = `×${snapshot.combo.toFixed(1)}`;
    els.comboBlock.classList.toggle('hot', snapshot.combo >= 2);
    els.comboBlock.classList.toggle('crit', snapshot.combo >= 4);
    const pips = els.comboPips.children;
    const lit = Math.min(8, Math.floor(snapshot.combo));
    for (let i = 0; i < pips.length; i += 1) {
      pips[i].classList.toggle('on', i < lit);
    }

    const ultT = Math.max(0, snapshot.ult / 100);
    els.ultRing.style.strokeDashoffset = String(this.ultCircumference * (1 - ultT));
    els.ultReadout.classList.toggle('ready', snapshot.ult >= 100);

    els.enemiesValue.textContent = String(snapshot.enemies);
    els.statusLine.textContent = snapshot.status;
    els.stressBadge.classList.toggle('hidden', !snapshot.stress);

    if (snapshot.boss.visible) {
      els.bossBar.classList.remove('hidden');
      els.bossName.textContent = snapshot.boss.name;
      els.bossFill.style.transform = `scaleX(${Math.max(0, snapshot.boss.hpRatio)})`;
    } else {
      els.bossBar.classList.add('hidden');
    }

    els.overheat.classList.toggle('hidden', !snapshot.overheated);

    if (this.waveBannerTimer > 0) {
      this.waveBannerTimer -= delta;
      if (this.waveBannerTimer <= 0) els.waveBanner.classList.add('hidden');
    } else if (snapshot.waveBanner) {
      this.showWaveBanner(snapshot.waveBanner);
    }

    if (snapshot.mode === 'play') {
      els.overlay.classList.add('hidden');
    } else {
      els.overlay.classList.remove('hidden');
      if (snapshot.mode === 'paused') {
        els.overlayTitle.textContent = snapshot.stress ? 'PAUSED · STRESS' : 'PAUSED';
        els.overlaySub.textContent = 'Neon Siege Arena';
        els.overlayPrimary.textContent = 'Resume';
        els.overlaySecondary.textContent = 'Restart';
      } else {
        els.overlayTitle.textContent = 'HULL BREACHED';
        els.overlaySub.textContent = `Terminated by ${snapshot.deathCause}`;
        els.overlayPrimary.textContent = 'Retry';
        els.overlaySecondary.textContent = 'Stress Mode';
      }
      els.overlayStats.innerHTML = `
        <div>Wave<strong>${snapshot.wave}</strong></div>
        <div>Score<strong>${snapshot.score}</strong></div>
        <div>Kills<strong>${snapshot.kills}</strong></div>
        <div>Time<strong>${minutes}:${seconds}</strong></div>
        <div>Peak Combo<strong>×${snapshot.peakCombo.toFixed(1)}</strong></div>
        <div>Threat<strong>${snapshot.deathCause}</strong></div>
      `;
    }
  }

  private el<T extends HTMLElement = HTMLElement>(selector: string): T {
    const node = document.querySelector<T>(selector);
    if (!node) throw new Error(`Missing HUD element: ${selector}`);
    return node;
  }
}
