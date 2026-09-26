// npm run check の後半：全ホールのデータを zod で検証し、ガチャのコンプリート回数をシミュレーションする。
// 1つでも失敗したら終了コード1（ビルドも止まる）。
import { readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { Hall } from "../src/engine/schema";
import { draw } from "../src/engine/gacha";
import { HALLS } from "../src/halls/registry";

const hallsDir = resolve(import.meta.dirname, "../src/halls");
let failed = false;

/** review フィールドを持つデータ（問題・症例・解説）を全部集める */
function collectMeta(x: unknown, out: string[] = []): string[] {
  if (Array.isArray(x)) x.forEach((v) => collectMeta(v, out));
  else if (x && typeof x === "object") {
    const o = x as Record<string, unknown>;
    if (o.review === "draft" || o.review === "reviewed") out.push(o.review);
    Object.values(o).forEach((v) => collectMeta(v, out));
  }
  return out;
}

function simulateGacha(h: Hall, runs = 20000) {
  const counts: number[] = [];
  for (let r = 0; r < runs; r++) {
    const got: Record<string, 1> = {};
    let dry = 0, n = 0;
    while (h.gacha.items.some((s) => !got[s.id])) {
      const pk = draw(h.gacha, got, dry);
      n++;
      if (got[pk.id]) dry++; else { got[pk.id] = 1; dry = 0; }
    }
    counts.push(n);
  }
  counts.sort((a, b) => a - b);
  const avg = counts.reduce((a, b) => a + b, 0) / runs;
  return { avg, p90: counts[Math.floor(runs * 0.9)] };
}

for (const id of readdirSync(hallsDir)) {
  const file = resolve(hallsDir, id, "data.ts");
  if (!existsSync(file)) continue;
  const mod = await import(pathToFileURL(file).href);
  const res = Hall.safeParse(mod.hall);
  if (!res.success) {
    failed = true;
    console.error(`✗ ${id}: データ検証に失敗`);
    for (const i of res.error.issues) console.error(`   ${i.path.join(".") || "(hall)"}: ${i.message}`);
    continue;
  }
  const h = res.data;
  if (h.id !== id) { failed = true; console.error(`✗ ${id}: hall.id（${h.id}）がフォルダ名と違う`); continue; }
  const exhibits = h.wings.flatMap((w) => w.exhibits);
  const reg = HALLS.find((r) => r.id === id);
  if (!reg) { failed = true; console.error(`✗ ${id}: src/halls/registry.ts に載っていない`); continue; }
  if (reg.no !== h.no || reg.title !== h.title || reg.stamps !== h.stampOrder.length) {
    failed = true; console.error(`✗ ${id}: registry.ts と data.ts が食い違う（no / title / stamps）`); continue;
  }
  const metas = collectMeta(h), drafts = metas.filter((m) => m === "draft").length;
  const sim = simulateGacha(h);
  console.log(`✓ ${id}: 展示 ${exhibits.length}、医学データ ${metas.length}件（未レビュー ${drafts}）、ガチャ ${h.gacha.items.length}種 → コンプまで平均 ${sim.avg.toFixed(1)}回、9割が ${sim.p90}回以内`);
}

if (failed) process.exit(1);
