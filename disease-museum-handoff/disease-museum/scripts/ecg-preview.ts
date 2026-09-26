// npm run ecg:preview — 合成した心電図（全調律と全12誘導パターン）を shots/ecg/ に画像で書き出して、目で確かめる
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { RHYTHM_IDS, PATTERN_IDS, makeRhythm, makeTwelve } from "../src/halls/junkanki/ecg/synth";
import { stripSVG, twelveSVG, ECG_CSS } from "../src/halls/junkanki/ecg/render";

const out = resolve(import.meta.dirname, "../shots/ecg");
mkdirSync(out, { recursive: true });
const seed = Number(process.argv.find((a) => a.startsWith("--seed="))?.slice(7) ?? 42);
const page = (body: string) => `<!doctype html><meta charset="utf-8"><style>body{font-family:sans-serif;margin:8px;background:#fff}${ECG_CSS}.ecgBox{box-shadow:none;border-width:1px;margin-bottom:6px;overflow:visible}h3{margin:8px 0 2px;font-size:14px}</style>${body}`;

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 900, height: 800 } });
const shoot = async (name: string, body: string) => { await p.setContent(page(body)); await p.screenshot({ path: resolve(out, `${name}.png`), fullPage: true }); };
for (let i = 0; i < RHYTHM_IDS.length; i += 9)
  await shoot(`rhythms-${i / 9 + 1}`, RHYTHM_IDS.slice(i, i + 9).map((id) => `<h3>${id}</h3><div class="ecgBox">${stripSVG(makeRhythm(id, seed), 8)}</div>`).join(""));
for (const id of PATTERN_IDS) await shoot(`12-${id}`, `<h3>${id}</h3><div class="ecgBox">${twelveSVG(makeTwelve(id, seed), seed)}</div>`);
await b.close();
console.log(`✓ shots/ecg/ に書き出した（seed ${seed}）`);
