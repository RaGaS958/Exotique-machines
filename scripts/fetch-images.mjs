// Downloads every Unsplash photo the site uses into <outDir>/img, at 800 and 1600px wide.
// Usage: node scripts/fetch-images.mjs dist-local
import fs from 'node:fs';
import path from 'node:path';

const out = path.resolve(process.argv[2] ?? 'dist', 'img');
fs.mkdirSync(out, { recursive: true });

const ids = new Set();
const walk = (dir) => {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p);
    else if (/\.(ts|tsx)$/.test(f.name)) for (const m of fs.readFileSync(p, 'utf8').matchAll(/photo-\d{10,13}-[0-9a-f]{12}/g)) ids.add(m[0]);
  }
};
walk(path.resolve('src'));

const jobs = [];
for (const id of ids) for (const w of [800, 1600]) jobs.push({ id, w });
let done = 0;
async function run({ id, w }) {
  const file = path.join(out, `${id}-${w}.jpg`);
  if (fs.existsSync(file)) return done++;
  const res = await fetch(`https://images.unsplash.com/${id}?fm=jpg&fit=crop&q=${w > 1000 ? 72 : 70}&w=${w}`);
  if (!res.ok) throw new Error(`${id} ${w}: ${res.status}`);
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  done++;
}
const queue = [...jobs];
await Promise.all(Array.from({ length: 8 }, async () => { while (queue.length) await run(queue.shift()); }));
console.log(`${ids.size} photos, ${done} files in ${out}`);
