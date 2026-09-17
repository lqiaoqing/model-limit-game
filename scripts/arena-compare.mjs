/**
 * Compare Model Arena runs into a leaderboard.
 *
 * Usage:
 *   node scripts/arena-compare.mjs --challenge model-limit-v2
 *   node scripts/arena-compare.mjs --challenge model-limit-v2 --out arena/runs/LEADERBOARD.md
 */
import { mkdir, readFile, writeFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const arenaRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'arena');

function parseArgs(argv) {
  const args = {
    challenge: 'model-limit-v2',
    out: null,
  };
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--challenge') args.challenge = String(argv[++i]);
    else if (a === '--out') args.out = path.resolve(String(argv[++i]));
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv);
  const runsDir = path.join(arenaRoot, 'runs');
  let models;
  try {
    models = await readdir(runsDir, { withFileTypes: true });
  } catch {
    console.error('No arena/runs directory. Run arena:eval first.');
    process.exit(1);
  }

  const rows = [];
  for (const ent of models) {
    if (!ent.isDirectory()) continue;
    const scorePath = path.join(runsDir, ent.name, args.challenge, 'score.json');
    try {
      const raw = JSON.parse(await readFile(scorePath, 'utf8'));
      rows.push({
        model: raw.model ?? ent.name,
        id: ent.name,
        total100: raw.total100 ?? Math.round((raw.total ?? 0) * 100),
        generatedAt: raw.generatedAt,
        dimensions: raw.dimensions ?? {},
        build: raw.checks?.build?.pass,
        bot: raw.checks?.bot?.pass,
        balance: raw.checks?.balance?.pass,
      });
    } catch {
      // no score for this challenge
    }
  }

  rows.sort((a, b) => b.total100 - a.total100);

  const dimNames = [
    'gameplay',
    'depth',
    'visual',
    'performance',
    'architecture',
    'tests',
    'mobile',
    'bugRate',
    'completion',
  ];

  const lines = [];
  lines.push(`# Model Arena Leaderboard — ${args.challenge}`);
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('| Rank | Model | Total | Build | Bot | Balance |');
  lines.push('|---:|---|---:|:---:|:---:|:---:|');
  rows.forEach((r, i) => {
    const flag = (v) => (v == null ? '—' : v ? 'PASS' : 'FAIL');
    lines.push(
      `| ${i + 1} | ${r.model} | **${r.total100}** | ${flag(r.build)} | ${flag(r.bot)} | ${flag(r.balance)} |`,
    );
  });
  lines.push('');
  lines.push('## Dimension breakdown (%)');
  lines.push('');
  lines.push(`| Model | ${dimNames.join(' | ')} |`);
  lines.push(`|---|${dimNames.map(() => '---:').join('|')}|`);
  for (const r of rows) {
    const cells = dimNames.map((n) => {
      const s = r.dimensions?.[n]?.score;
      return s == null ? '—' : String(Math.round(s * 100));
    });
    lines.push(`| ${r.model} | ${cells.join(' | ')} |`);
  }
  lines.push('');
  lines.push('## How to re-run');
  lines.push('');
  lines.push('```bash');
  lines.push('npm run arena:eval -- --model <id> --root <impl>');
  lines.push('npm run arena:compare -- --challenge model-limit-v2');
  lines.push('```');
  lines.push('');

  const out =
    args.out ?? path.join(runsDir, `LEADERBOARD-${args.challenge}.md`);
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, lines.join('\n'));
  console.log(`Models ranked: ${rows.length}`);
  console.log(`Wrote ${out}`);
  if (rows[0]) {
    console.log(`#1 ${rows[0].model} — ${rows[0].total100}/100`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
