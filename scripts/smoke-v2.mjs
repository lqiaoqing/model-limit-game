import { chromium } from 'playwright';

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto('http://127.0.0.1:5188/');
await page.waitForFunction(() => (window.__THREE_GAME_DIAGNOSTICS__?.frame ?? 0) > 10);
await page.evaluate(async () => {
  await window.__THREE_GAME_TEST_HOOKS__?.seed(42);
  await window.__THREE_GAME_TEST_HOOKS__?.setState('active-play');
});
await page.waitForTimeout(300);

const snap = () =>
  page.evaluate(() => {
    const d = window.__THREE_GAME_DIAGNOSTICS__;
    return {
      weapon: d?.weapon,
      fireInterval: d?.player?.fireInterval,
      damage: d?.player?.projectileDamage,
      speed: d?.player?.projectileSpeed,
      heatPerShot: d?.player?.heatPerShot,
    };
  });

const plasma0 = await snap();
await page.keyboard.press('Digit2');
await page.waitForTimeout(80);
const rail = await snap();
await page.keyboard.press('Digit1');
await page.waitForTimeout(80);
const plasma1 = await snap();
await page.keyboard.press('Digit3');
await page.waitForTimeout(80);
const scatter = await snap();
await page.keyboard.press('Digit1');
await page.waitForTimeout(80);
const plasma2 = await snap();

const report = { plasma0, rail, plasma1, scatter, plasma2, errors };
console.log(JSON.stringify(report, null, 2));
await browser.close();

if (errors.length) process.exit(1);
// Weapon identity must round-trip: plasma stats after rail/scatter must match initial plasma.
const near = (a, b) => Math.abs(a - b) < 1e-6;
if (plasma0.weapon !== 'plasma' || rail.weapon !== 'rail' || scatter.weapon !== 'scatter') {
  console.error('weapon id mismatch');
  process.exit(2);
}
if (!near(plasma0.fireInterval, plasma1.fireInterval) || !near(plasma0.fireInterval, plasma2.fireInterval)) {
  console.error('plasma fireInterval corrupted after switch round-trip');
  process.exit(3);
}
if (!near(plasma0.damage, plasma1.damage) || !near(plasma0.damage, plasma2.damage)) {
  console.error('plasma damage corrupted after switch round-trip');
  process.exit(4);
}
if (near(rail.fireInterval, plasma0.fireInterval) || near(rail.damage, plasma0.damage)) {
  console.error('rail did not differ from plasma');
  process.exit(5);
}
if (near(scatter.heatPerShot, plasma0.heatPerShot) || scatter.damage >= rail.damage) {
  console.error('scatter profile wrong');
  process.exit(6);
}
console.log('SMOKE OK');
