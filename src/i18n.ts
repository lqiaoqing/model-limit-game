export type Locale = 'zh' | 'en';

const STORAGE_KEY = 'mlg-locale';

type Dict = {
  // HUD / meters
  hull: string;
  shield: string;
  heat: string;
  wave: string;
  time: string;
  score: string;
  combo: string;
  ult: string;
  foes: string;
  // status line
  statusDead: string;
  statusUpgrade: string;
  statusCooling: string;
  statusBoss: string;
  statusStress: string;
  statusInbound: string;
  statusHold: string;
  // upgrade panel
  upgradeKicker: string;
  upgradeTitle: (wave: number) => string;
  upgradeSub: string;
  stackLabel: (from: number, to: number) => string;
  // overlay
  paused: string;
  pausedStress: string;
  gameTitle: string;
  resume: string;
  restart: string;
  hullBreached: string;
  terminatedBy: (cause: string) => string;
  retry: string;
  stressMode: string;
  statWave: string;
  statScore: string;
  statKills: string;
  statTime: string;
  statPeakCombo: string;
  statThreat: string;
  toggleStress: string;
  toggleGraphics: string;
  toggleLang: string;
  hint: string;
  // banners / feed
  waveBanner: (wave: number) => string;
  bossBanner: (wave: number) => string;
  hostilesEvolved: (tier: number) => string;
  ultReady: string;
  titanReinforcements: string;
  bossPhase: (id: number, name: string) => string;
  titanName: (phase: string) => string;
  overheatEmp: string;
  empCascade: string;
  shieldNova: string;
  modPick: (name: string) => string;
  weaponPick: (short: string) => string;
  killCount: (n: number) => string;
  killElite: string;
  killRanged: string;
  killBoss: string;
  // pickups
  pickupShield: string;
  pickupCoolant: string;
  pickupHeal: string;
  pickupUlt: string;
  pickupGeneric: string;
  // weapons
  weaponPlasma: string;
  weaponRail: string;
  weaponScatter: string;
  weaponPlasmaShort: string;
  weaponRailShort: string;
  weaponScatterShort: string;
  // boss phases
  phaseSweep: string;
  phaseLockdown: string;
  phaseOverdrive: string;
  // upgrades
  upgrades: Record<string, { name: string; desc: string }>;
};

const zh: Dict = {
  hull: '装甲',
  shield: '护盾',
  heat: '热量',
  wave: '波次',
  time: '时间',
  score: '分数',
  combo: '连击',
  ult: '大招',
  foes: '敌军',
  statusDead: '系统离线',
  statusUpgrade: '选择一个改装模块',
  statusCooling: '武器冷却中',
  statusBoss: '摧毁攻城核心',
  statusStress: '极限压力：守住阵地',
  statusInbound: '下一波即将来袭',
  statusHold: '守住竞技场',
  upgradeKicker: '波次清除',
  upgradeTitle: (wave) => `第 ${wave} 波 · 选择改装`,
  upgradeSub: '选择一个模块 · 按 1 / 2 / 3',
  stackLabel: (from, to) => `层数 ${from} → ${to}`,
  paused: '已暂停',
  pausedStress: '已暂停 · 极限压力',
  gameTitle: '霓虹攻城竞技场',
  resume: '继续',
  restart: '重开',
  hullBreached: '装甲击穿',
  terminatedBy: (cause) => `被 ${cause} 终结`,
  retry: '再来一局',
  stressMode: '极限压力',
  statWave: '波次',
  statScore: '分数',
  statKills: '击杀',
  statTime: '时间',
  statPeakCombo: '最高连击',
  statThreat: '威胁',
  toggleStress: '极限压力（敌潮拉满）',
  toggleGraphics: '低画质',
  toggleLang: '语言',
  hint: 'WASD 移动 · 鼠标瞄准 · 按住射击 · Shift 冲刺 · Q 大招 · P 暂停 · R 重开',
  waveBanner: (wave) => `第 ${wave} 波`,
  bossBanner: (wave) => `首领 · 第 ${wave} 波`,
  hostilesEvolved: (tier) => `敌军进化 · T${tier}`,
  ultReady: '大招就绪',
  titanReinforcements: '泰坦增援',
  bossPhase: (id, name) => `首领阶段 ${id} · ${name}`,
  titanName: (phase) => `TITAN-07 · ${phase}`,
  overheatEmp: '过热 · 电磁脉冲',
  empCascade: '电磁级联',
  shieldNova: '护盾新星',
  modPick: (name) => `改装 · ${name}`,
  weaponPick: (short) => `武器 · ${short}`,
  killCount: (n) => `×${n} 敌军`,
  killElite: '精英击破',
  killRanged: '狙击手清除',
  killBoss: '攻城核心击毁',
  pickupShield: '护盾 +20',
  pickupCoolant: '冷却冲洗',
  pickupHeal: '维修 +25',
  pickupUlt: '大招 +25',
  pickupGeneric: '补给',
  weaponPlasma: '等离子连发',
  weaponRail: '轨道炮',
  weaponScatter: '霰弹枪',
  weaponPlasmaShort: '等离子',
  weaponRailShort: '轨道',
  weaponScatterShort: '霰弹',
  phaseSweep: '横扫',
  phaseLockdown: '封锁',
  phaseOverdrive: '过载',
  upgrades: {
    overclock: { name: '超频', desc: '射速 +10%（全武器）' },
    thrusters: { name: '推进器', desc: '移动速度 +0.45' },
    armor: { name: '装甲板', desc: '最大装甲 +20 · 修复 20' },
    shield_bank: { name: '护盾仓', desc: '最大护盾 +15 · 充能 15' },
    coolant_loop: { name: '冷却环', desc: '热量冷却 +7/秒' },
    capacitor: { name: '电容', desc: '最大热量 +12' },
    dash_servos: { name: '冲刺舵机', desc: '冲刺冷却 −12%' },
    mag_accel: { name: '磁轨加速', desc: '弹速 +8%（全武器）' },
    arc_capacitor: { name: '电弧电容', desc: '击杀连锁闪电 +1 目标' },
    overheat_cascade: { name: '过热级联', desc: '过热改为电磁脉冲' },
    critical_conductor: { name: '暴击导体', desc: '连锁命中可暴击 ×1.5' },
    rail_bore: { name: '轨道膛线', desc: '轨道炮穿透 +1 · 伤害 +2' },
    rail_reactor: { name: '轨道反应堆', desc: '轨道炮击杀返还 20% 热量' },
    scatter_choke: { name: '霰弹收束', desc: '霰弹更集中 · 近距加成' },
    dash_detonation: { name: '冲刺引爆', desc: '冲刺留下延迟爆炸' },
    shield_nova: { name: '护盾新星', desc: '护盾击破时释放新星' },
  },
};

const en: Dict = {
  hull: 'HULL',
  shield: 'SHIELD',
  heat: 'HEAT',
  wave: 'WAVE',
  time: 'TIME',
  score: 'SCORE',
  combo: 'COMBO',
  ult: 'ULT',
  foes: 'FOES',
  statusDead: 'Systems offline',
  statusUpgrade: 'Select a retrofit module',
  statusCooling: 'Cooling weapon',
  statusBoss: 'Destroy the Siege Core',
  statusStress: 'STRESS: hold the line',
  statusInbound: 'Next wave inbound',
  statusHold: 'Hold the arena',
  upgradeKicker: 'WAVE CLEARED',
  upgradeTitle: (wave) => `WAVE ${wave} · SELECT RETROFIT`,
  upgradeSub: 'Pick one module · 1 / 2 / 3',
  stackLabel: (from, to) => `Stack ${from} → ${to}`,
  paused: 'PAUSED',
  pausedStress: 'PAUSED · STRESS',
  gameTitle: 'Neon Siege Arena',
  resume: 'Resume',
  restart: 'Restart',
  hullBreached: 'HULL BREACHED',
  terminatedBy: (cause) => `Terminated by ${cause}`,
  retry: 'Retry',
  stressMode: 'Stress Mode',
  statWave: 'Wave',
  statScore: 'Score',
  statKills: 'Kills',
  statTime: 'Time',
  statPeakCombo: 'Peak Combo',
  statThreat: 'Threat',
  toggleStress: 'Stress (max enemy flood)',
  toggleGraphics: 'Low Graphics',
  toggleLang: 'Language',
  hint: 'WASD move · Mouse aim · Hold fire · Shift dash · Q ult · P pause · R restart',
  waveBanner: (wave) => `WAVE ${wave}`,
  bossBanner: (wave) => `BOSS · WAVE ${wave}`,
  hostilesEvolved: (tier) => `HOSTILES EVOLVED · T${tier}`,
  ultReady: 'ULT READY',
  titanReinforcements: 'TITAN REINFORCEMENTS',
  bossPhase: (id, name) => `BOSS PHASE ${id} · ${name}`,
  titanName: (phase) => `TITAN-07 · ${phase}`,
  overheatEmp: 'OVERHEAT · EMP',
  empCascade: 'EMP CASCADE',
  shieldNova: 'SHIELD NOVA',
  modPick: (name) => `MOD · ${name}`,
  weaponPick: (short) => `WEAPON · ${short}`,
  killCount: (n) => `×${n} HOSTILES`,
  killElite: 'ELITE SHATTERED',
  killRanged: 'SNIPER PICKED',
  killBoss: 'SIEGE CORE DOWN',
  pickupShield: 'SHIELD +20',
  pickupCoolant: 'COOLANT FLUSH',
  pickupHeal: 'REPAIR +25',
  pickupUlt: 'ULT +25',
  pickupGeneric: 'PICKUP',
  weaponPlasma: 'Plasma Repeater',
  weaponRail: 'Railgun',
  weaponScatter: 'Scattergun',
  weaponPlasmaShort: 'PLS',
  weaponRailShort: 'RAIL',
  weaponScatterShort: 'SCT',
  phaseSweep: 'SWEEP',
  phaseLockdown: 'LOCKDOWN',
  phaseOverdrive: 'OVERDRIVE',
  upgrades: {
    overclock: { name: 'Overclock', desc: 'Fire rate +10% (all weapons)' },
    thrusters: { name: 'Thrusters', desc: 'Move speed +0.45' },
    armor: { name: 'Armor Plate', desc: 'Max hull +20 · repair 20' },
    shield_bank: { name: 'Shield Bank', desc: 'Max shield +15 · charge 15' },
    coolant_loop: { name: 'Coolant Loop', desc: 'Heat cooling +7/s' },
    capacitor: { name: 'Capacitor', desc: 'Max heat +12' },
    dash_servos: { name: 'Dash Servos', desc: 'Dash cooldown −12%' },
    mag_accel: { name: 'Mag Accelerator', desc: 'Projectile speed +8% (all weapons)' },
    arc_capacitor: { name: 'Arc Capacitor', desc: 'Kills chain lightning to +1 nearby' },
    overheat_cascade: { name: 'Overheat Cascade', desc: 'Overheat becomes EMP blast' },
    critical_conductor: { name: 'Critical Conductor', desc: 'Chain hits may crit ×1.5' },
    rail_bore: { name: 'Rail Bore', desc: 'Rail pierce +1 · rail damage +2 only' },
    rail_reactor: { name: 'Rail Reactor', desc: 'Rail kills refund 20% heat' },
    scatter_choke: { name: 'Scatter Choke', desc: 'Scatter tighter + close bonus only' },
    dash_detonation: { name: 'Dash Detonation', desc: 'Dash leaves a delayed blast' },
    shield_nova: { name: 'Shield Nova', desc: 'Shield break emits a nova' },
  },
};

const dicts: Record<Locale, Dict> = { zh, en };

function readStoredLocale(): Locale {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'zh' || raw === 'en') return raw;
  } catch {
    // ignore
  }
  return 'zh';
}

let locale: Locale = readStoredLocale();
const listeners = new Set<(locale: Locale) => void>();

export function getLocale(): Locale {
  return locale;
}

export function setLocale(next: Locale): void {
  if (next === locale) return;
  locale = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // ignore
  }
  document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en';
  for (const fn of listeners) fn(next);
}

export function toggleLocale(): Locale {
  setLocale(locale === 'zh' ? 'en' : 'zh');
  return locale;
}

export function onLocaleChange(fn: (locale: Locale) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function t(): Dict {
  return dicts[locale];
}

export function upgradeText(id: string): { name: string; desc: string } {
  const entry = dicts[locale].upgrades[id];
  if (entry) return entry;
  const fallback = en.upgrades[id] ?? { name: id, desc: '' };
  return fallback;
}

export function bossPhaseName(id: number): string {
  if (id === 2) return t().phaseLockdown;
  if (id === 3) return t().phaseOverdrive;
  return t().phaseSweep;
}

export function weaponName(id: string): string {
  if (id === 'rail') return t().weaponRail;
  if (id === 'scatter') return t().weaponScatter;
  return t().weaponPlasma;
}

export function weaponShort(id: string): string {
  if (id === 'rail') return t().weaponRailShort;
  if (id === 'scatter') return t().weaponScatterShort;
  return t().weaponPlasmaShort;
}

/** Apply locale to static HTML labels marked with data-i18n. */
export function applyStaticLocale(): void {
  document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
  const dict = t();
  const map: Record<string, string> = {
    'label.hull': dict.hull,
    'label.shield': dict.shield,
    'label.heat': dict.heat,
    'label.wave': dict.wave,
    'label.time': dict.time,
    'label.score': dict.score,
    'label.combo': dict.combo,
    'label.ult': dict.ult,
    'label.foes': dict.foes,
    'upgrade.kicker': dict.upgradeKicker,
    'upgrade.sub': dict.upgradeSub,
    'toggle.stress': dict.toggleStress,
    'toggle.graphics': dict.toggleGraphics,
    'overlay.hint': dict.hint,
    'lang.toggle': locale === 'zh' ? 'EN' : '中文',
    'toggle.lang': dict.toggleLang,
    'weapon.plasma': dict.weaponPlasmaShort,
    'weapon.rail': dict.weaponRailShort,
    'weapon.scatter': dict.weaponScatterShort,
  };
  for (const [key, value] of Object.entries(map)) {
    document.querySelectorAll<HTMLElement>(`[data-i18n="${key}"]`).forEach((el) => {
      el.textContent = value;
    });
  }

  const titles: Record<string, string> = {
    plasma: `${dict.weaponPlasma} — 1`,
    rail: `${dict.weaponRail} — 2`,
    scatter: `${dict.weaponScatter} — 3`,
  };
  document.querySelectorAll<HTMLElement>('.weapon-chip').forEach((chip) => {
    const id = chip.dataset.weapon ?? 'plasma';
    const short = weaponShort(id);
    const label = chip.querySelector('.weapon-short');
    if (label) label.textContent = short;
    if (titles[id]) chip.title = titles[id];
  });
}
