import GUI from 'lil-gui';

export type DebugTuning = {
  speed: number;
  dashMultiplier: number;
  acceleration: number;
  cameraLag: number;
  exposure: number;
  maxDpr: number;
};

export type DebugFlags = {
  /** 无限命：锁满血护盾 + 无敌，不会死。 */
  godMode: boolean;
  /** 永不过热。 */
  noOverheat: boolean;
  /** 冲刺无冷却。 */
  infiniteDash: boolean;
  /** 大招常满。 */
  infiniteUlt: boolean;
  /** 玩家伤害 ×20，近似秒杀。 */
  oneShot: boolean;
  /** 敌人不开火、接触不掉血。 */
  enemyPassive: boolean;
  /** 敌人定身。 */
  freezeEnemies: boolean;
  /** 升级面板自动选第一项。 */
  autoPickUpgrade: boolean;
  /** 敌人一击必死。 */
  enemyOneHp: boolean;
};

export function createDebugFlags(): DebugFlags {
  return {
    godMode: false,
    noOverheat: false,
    infiniteDash: false,
    infiniteUlt: false,
    oneShot: false,
    enemyPassive: false,
    freezeEnemies: false,
    autoPickUpgrade: false,
    enemyOneHp: false,
  };
}

export type DebugActions = {
  fullHeal: () => void;
  clearHeat: () => void;
  fillUlt: () => void;
  grantAllUpgrades: () => void;
  killAllEnemies: () => void;
  skipWave: () => void;
  openUpgrade: () => void;
  restart: () => void;
  setStress: (on: boolean) => void;
  setLowGraphics: (on: boolean) => void;
};

const FLAG_LABELS: Array<{ key: keyof DebugFlags; label: string }> = [
  { key: 'godMode', label: '无限命 God Mode' },
  { key: 'noOverheat', label: '永不过热 No Overheat' },
  { key: 'infiniteDash', label: '无限冲刺 Infinite Dash' },
  { key: 'infiniteUlt', label: '无限大招 Infinite Ult' },
  { key: 'oneShot', label: '玩家秒杀 Player One-Shot' },
  { key: 'enemyPassive', label: '敌人无害 Enemy Passive' },
  { key: 'freezeEnemies', label: '敌人定身 Freeze Enemies' },
  { key: 'autoPickUpgrade', label: '自动选升级 Auto Pick' },
  { key: 'enemyOneHp', label: '敌人一击必杀 Enemy 1HP' },
];

/**
 * 测试调试面板。
 * 打开方式：URL `?debug`，或 HUD「调试」按钮，或按 `` ` `` / F2。
 */
export class DebugTools {
  private gui: GUI | null = null;
  private open = false;
  private readonly trigger: HTMLButtonElement;

  constructor(
    private readonly tuning: DebugTuning,
    private readonly flags: DebugFlags,
    private readonly actions: DebugActions,
    onChange: () => void,
  ) {
    this.trigger = this.ensureTrigger();
    this.trigger.addEventListener('click', () => this.toggle());

    window.addEventListener('keydown', this.onKeyDown);

    const params = new URLSearchParams(window.location.search);
    if (params.has('debug')) this.setOpen(true);

    void onChange;
  }

  private ensureTrigger(): HTMLButtonElement {
    let el = document.querySelector<HTMLButtonElement>('#debug-trigger');
    if (el) return el;
    el = document.createElement('button');
    el.id = 'debug-trigger';
    el.type = 'button';
    el.textContent = '调试';
    el.title = '打开测试面板（` 或 F2）';
    el.addEventListener('click', (e) => e.stopPropagation());
    document.querySelector('#app')?.appendChild(el);
    return el;
  }

  private readonly onKeyDown = (event: KeyboardEvent) => {
    if (event.code === 'Backquote' || event.code === 'F2') {
      event.preventDefault();
      this.toggle();
    }
  };

  isOpen(): boolean {
    return this.open;
  }

  toggle(): void {
    this.setOpen(!this.open);
  }

  setOpen(open: boolean): void {
    this.open = open;
    this.trigger.classList.toggle('active', open);
    this.trigger.textContent = open ? '关闭调试' : '调试';
    if (open) {
      if (!this.gui) this.buildGui();
      this.gui?.show();
    } else {
      this.gui?.hide();
    }
  }

  private buildGui(): void {
    const gui = new GUI({ title: '测试 / Debug Panel' });
    gui.domElement.classList.add('debug-panel');

    const cheats = gui.addFolder('作弊 Cheats');
    for (const { key, label } of FLAG_LABELS) {
      cheats.add(this.flags, key).name(label);
    }
    cheats.open();

    const actions = gui.addFolder('动作 Actions');
    actions.add(this.actions, 'fullHeal').name('满血满盾 Full Heal');
    actions.add(this.actions, 'clearHeat').name('清空热量 Clear Heat');
    actions.add(this.actions, 'fillUlt').name('充能大招 Fill Ult');
    actions.add(this.actions, 'grantAllUpgrades').name('拉满升级 Max Upgrades');
    actions.add(this.actions, 'killAllEnemies').name('清场 Kill All');
    actions.add(this.actions, 'skipWave').name('跳过本波 Skip Wave');
    actions.add(this.actions, 'openUpgrade').name('弹出升级 Open Upgrade');
    actions.add(this.actions, 'restart').name('重开 Restart');
    actions.open();

    const modes = gui.addFolder('模式 Modes');
    modes
      .add({ stress: false }, 'stress')
      .name('极限压力 Stress')
      .onChange((on: boolean) => this.actions.setStress(on));
    modes
      .add({ low: false }, 'low')
      .name('低画质 Low Graphics')
      .onChange((on: boolean) => this.actions.setLowGraphics(on));

    const tune = gui.addFolder('手感 Tuning');
    tune.add(this.tuning, 'speed', 2, 14, 0.1).name('移速 Speed');
    tune.add(this.tuning, 'dashMultiplier', 1, 3, 0.05).name('冲刺倍率 Dash ×');
    tune.add(this.tuning, 'acceleration', 4, 22, 0.1).name('加速度 Accel');
    tune.add(this.tuning, 'cameraLag', 0.02, 0.8, 0.01).name('镜头延迟 Cam Lag');
    tune.add(this.tuning, 'maxDpr', 1, 2, 0.25).name('DPR');
    tune.add(this.tuning, 'exposure', 0.6, 1.8, 0.01).name('曝光 Exposure');

    // Keep panel on screen
    gui.domElement.style.position = 'fixed';
    gui.domElement.style.right = '12px';
    gui.domElement.style.top = '56px';
    gui.domElement.style.zIndex = '20';
    gui.domElement.style.maxHeight = 'calc(100vh - 72px)';
    gui.domElement.style.overflowY = 'auto';

    this.gui = gui;
    gui.hide();
  }

  /** legacy API used by hideDebugUi test hook */
  setHidden(hidden: boolean): void {
    if (hidden) this.setOpen(false);
  }

  dispose(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    this.gui?.destroy();
    this.gui = null;
    this.trigger.remove();
  }
}
