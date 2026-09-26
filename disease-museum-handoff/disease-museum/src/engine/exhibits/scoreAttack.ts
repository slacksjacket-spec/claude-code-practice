// 3.6 タイムアタック：毎回ランダムに作る検査値タイルから陽性項目を拾い、重症度を判定。画像スコア種目を併設できる
import "./scoreAttack.css";
import type { ExhibitModule } from "./types";
import type { ExhibitOf } from "../schema";
import { $, $$, esc, shuffle } from "../dom";

type Data = ExhibitOf<"ScoreAttack">["data"];
const IMAGE_COINS = 20;             // SPEC 3.6
const BOOST_CHANCE = 0.5;           // 試作の値：半分の確率で、陽性が2つ未満なら2つ足す（重症の問題が出やすいように）

const r1 = (a: number, b: number, d = 0) => +(a + Math.random() * (b - a)).toFixed(d);
const intIn = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));

// SIRS 4項目の値の作り方（試作の値。満たす項目＝左、満たさない＝右）TODO(review) 範囲が現実的か未確認
const SIRS: Record<"t" | "hr" | "rr" | "wbc", [[number, number, number], [number, number, number]]> = {
  t: [[38.3, 39.5, 1], [36.4, 37.8, 1]],
  hr: [[96, 130, 0], [70, 88, 0]],
  rr: [[22, 30, 0], [14, 19, 0]],
  wbc: [[12500, 19000, 0], [6000, 11000, 0]],
};

interface Tile { name: string; value: string; positive: boolean; small: boolean }

function generate(d: Data): Tile[] {
  const pos = d.items.map(() => Math.random() < d.positiveRate);
  if (Math.random() < BOOST_CHANCE && pos.filter(Boolean).length < 2) {
    pos[Math.floor(Math.random() * pos.length)] = true;
    pos[Math.floor(Math.random() * pos.length)] = true;
  }
  return d.items.map((it, i) => {
    const spec = pos[i] ? it.positive : it.negative;
    if (it.compound === "SIRS") {
      const n = intIn(spec.gen.min, spec.gen.max), met = shuffle(["t", "hr", "rr", "wbc"] as const).slice(0, n);
      const v = Object.fromEntries((["t", "hr", "rr", "wbc"] as const).map((k) => {
        const [lo, hi, dg] = SIRS[k][met.includes(k) ? 0 : 1];
        const x = r1(lo, hi, dg);
        return [k, k === "wbc" ? x.toLocaleString() : String(x)];
      }));
      return { name: it.name, value: spec.display.replace(/\{(t|hr|rr|wbc)\}/g, (_, k) => v[k]), positive: pos[i], small: true };
    }
    return { name: it.name, value: spec.display.replace("{v}", String(r1(spec.gen.min, spec.gen.max, spec.gen.digits))), positive: pos[i], small: false };
  });
}

// 急性膵炎の造影CT（冠状断イメージ）の模式図。ext＝膵外進展度 0〜2、poor＝造影不良域 0〜2
function pancCT(ext: number, poor: number) {
  const blob = [
    `<ellipse cx="190" cy="118" rx="112" ry="30" fill="#FF9F43" opacity=".55"/>`,
    `<path d="M80 110 C80 80 300 80 300 110 C300 150 240 200 190 210 C140 200 80 150 80 110Z" fill="#FF9F43" opacity=".55"/>`,
    `<path d="M70 110 C70 70 310 70 310 110 C320 200 300 300 260 330 C200 350 150 340 110 320 C60 280 60 180 70 110Z" fill="#FF9F43" opacity=".55"/>`,
  ][ext];
  const hatch = poor === 0 ? [[120, 150]] : poor === 1 ? [[140, 200]] : [[96, 224]];
  return `<svg viewBox="0 0 380 350" aria-label="急性膵炎の造影CT模式図"><rect x="4" y="4" width="372" height="342" rx="24" fill="#20232B"/>
     ${blob}
     <ellipse cx="96" cy="210" rx="26" ry="60" fill="#8C8C96" stroke="#fff" stroke-width="2"/><ellipse cx="284" cy="210" rx="26" ry="60" fill="#8C8C96" stroke="#fff" stroke-width="2"/>
     <line x1="20" y1="270" x2="360" y2="270" stroke="#fff" stroke-dasharray="4 5" opacity=".6"/><text x="24" y="264" font-size="11" fill="#fff" opacity=".8">腎下極の高さ</text>
     <circle cx="190" cy="200" r="10" fill="#8C8C96" stroke="#fff" stroke-width="2"/><text x="206" y="204" font-size="11" fill="#fff" opacity=".8">結腸間膜根部</text>
     <rect x="96" y="104" width="192" height="28" rx="14" fill="#E4C9B8" stroke="#fff" stroke-width="2"/>
     ${hatch.map(([a, b]) => `<rect x="${a}" y="104" width="${b - a}" height="28" fill="#3A3A44"/>`).join("")}
     <line x1="160" y1="100" x2="160" y2="136" stroke="#fff" stroke-dasharray="3 3"/><line x1="224" y1="100" x2="224" y2="136" stroke="#fff" stroke-dasharray="3 3"/>
     <text x="128" y="96" font-size="11" fill="#fff" text-anchor="middle">頭部</text><text x="192" y="96" font-size="11" fill="#fff" text-anchor="middle">体部</text><text x="256" y="96" font-size="11" fill="#fff" text-anchor="middle">尾部</text>
     <text x="190" y="330" font-size="11" fill="#FF9F43" text-anchor="middle">オレンジ＝炎症の広がり　黒＝造影不良域</text></svg>`;
}

export const ScoreAttack: ExhibitModule<"ScoreAttack"> = {
  mount(root, ex, ctx) {
    const d = ex.data, img = d.imageMode;
    const labKey = `${ex.id}.lab`, imgKey = `${ex.id}.img`;
    const count = (k: string) => (typeof ctx.st.prog[k] === "number" ? (ctx.st.prog[k] as number) : 0);
    const maybeStamp = () => { if (count(labKey) >= d.stampAt && (!img || count(imgKey) >= d.stampAt)) ctx.stamp(ex.id); };
    let mode: "lab" | "img" = "lab", timer = 0;
    const [labLabel, imgLabel] = d.modeLabels ?? ["タイムアタック", "画像"];

    root.innerHTML = `${img ? `<div class="seg modeTabs"><button aria-pressed="true" data-m="lab">${esc(labLabel)}</button><button aria-pressed="false" data-m="img">${esc(imgLabel)}</button></div>` : ""}<div class="body"></div>`;
    const body = $(".body", root);
    $$<HTMLButtonElement>(".modeTabs button", root).forEach((b) => (b.onclick = () => {
      mode = b.dataset.m as "lab" | "img";
      $$(".modeTabs button", root).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      render();
    }));

    function render() {
      clearInterval(timer);
      ctx.cheat.reset(ex.id);
      if (mode === "lab") renderLab(); else renderImg();
    }

    function renderLab() {
      const L = generate(d), sel = new Set<number>(), T = d.timeLimitSec;
      let left = T, done = false;
      body.innerHTML = `<div class="hud"><span class="tagk">正解 ${count(labKey)} / ${d.stampAt}</span><span class="small" style="font-weight:800">${esc(d.instructions)}</span></div>
    <div class="timer"><i style="width:100%"></i></div>
    <div class="labs">${L.map((x, i) => `<button class="labt" data-i="${i}">${esc(x.name)}<span class="v" style="${x.small ? "font-size:12px;font-family:inherit;font-weight:800" : ""}">${esc(x.value)}</span></button>`).join("")}</div>
    <div class="row" style="margin-top:12px"><button class="btn sev" data-s="1">重症</button><button class="btn alt mild" data-s="0">軽症</button><span class="small" style="font-weight:800">選んだ数：<span class="n">0</span>点</span></div><div class="fbBox"></div>`;
      $$<HTMLButtonElement>(".labt", body).forEach((b) => (b.onclick = () => {
        if (done) return;
        const i = +b.dataset.i!;
        sel.has(i) ? sel.delete(i) : sel.add(i);
        b.classList.toggle("sel");
        $(".n", body).textContent = String(sel.size);
        ctx.sound.beep(640, 0.04, "triangle", 0.04);
      }));
      const sevBtn = $<HTMLButtonElement>(".sev", body);
      const finish = (s: number) => {
        if (done) return;
        done = true; clearInterval(timer);
        const trueN = L.filter((x) => x.positive).length, sev = trueN >= d.severeAt ? 1 : 0;
        let tileErr = 0;
        $$<HTMLButtonElement>(".labt", body).forEach((b) => {
          const i = +b.dataset.i!, x = L[i];
          b.classList.remove("sel");
          if (x.positive && sel.has(i)) b.classList.add("okp");
          else if (x.positive) { b.classList.add("miss"); tileErr++; }
          else if (sel.has(i)) { b.classList.add("fp"); tileErr++; }
        });
        const ok = s === sev && tileErr <= 1, sevName = sev ? "重症" : "軽症";
        if (ok) {
          ctx.sound.ding(); ctx.award(20 + Math.round(left / 3), sevBtn); ctx.cheat.rewardIfUnpeeked(ex.id, sevBtn);
          ctx.prog(labKey); maybeStamp();
        } else {
          ctx.sound.boo();
          ctx.miss({ id: `${ex.id}-lab`, src: ex.title, ...d.missQuestion });
        }
        const fb = $(".fbBox", body);
        ctx.feedback(fb, ok,
          ok ? `正解！${esc(d.scoreName)} ${trueN}点 → ${sevName}` : `${s === -1 ? "時間切れ！" : s === sev ? "重症度は正解！でも拾い方が惜しい。" : ""}${esc(d.scoreName)}は${trueN}点 → ${sevName}（見落とし・余分 ${tileErr}）`,
          `${esc(d.explanation)}緑＝正しく拾えた、ピンク＝見落とし、打ち消し線＝余分。<div style="margin-top:8px"><button class="btn next">次の患者</button></div>`);
        $(".next", fb).onclick = render;
      };
      sevBtn.onclick = () => finish(1);
      $<HTMLButtonElement>(".mild", body).onclick = () => finish(0);
      const bar = $(".timer i", body);
      timer = window.setInterval(() => {
        left -= 0.25;
        if (!bar.isConnected) { clearInterval(timer); return; }
        bar.style.width = (left / T) * 100 + "%";
        if (left <= 10 && Math.abs(left % 1) < 0.01) ctx.sound.beep(1000, 0.03, "square", 0.03);
        if (left <= 0) finish(-1);
      }, 250);
    }

    function renderImg() {
      const m = img!, ext = Math.floor(Math.random() * 3), poor = Math.floor(Math.random() * 3), tot = ext + poor;
      const grade = tot <= 1 ? 1 : tot === 2 ? 2 : 3;
      let aE: number | null = null, aP: number | null = null;
      body.innerHTML = `<div class="hud"><span class="tagk">正解 ${count(imgKey)} / ${d.stampAt}</span><span class="small" style="font-weight:800">${esc(m.prompt)}</span></div>
    <div class="ctFig">${pancCT(ext, poor)}</div>
    <div class="stepLabel">${esc(m.extent.label)}</div><div class="opts ext">${m.extent.options.map((o, i) => `<button class="opt" data-v="${i}">${esc(o)}</button>`).join("")}</div>
    <div class="stepLabel">${esc(m.poor.label)}</div><div class="opts poor">${m.poor.options.map((o, i) => `<button class="opt" data-v="${i}">${esc(o)}</button>`).join("")}</div>
    <div class="row" style="margin-top:12px"><button class="btn go">判定</button></div><div class="fbBox"></div>`;
      $$<HTMLButtonElement>(".ext .opt", body).forEach((b) => (b.onclick = () => { aE = +b.dataset.v!; $$(".ext .opt", body).forEach((x) => x.classList.toggle("sel", x === b)); }));
      $$<HTMLButtonElement>(".poor .opt", body).forEach((b) => (b.onclick = () => { aP = +b.dataset.v!; $$(".poor .opt", body).forEach((x) => x.classList.toggle("sel", x === b)); }));
      const go = $<HTMLButtonElement>(".go", body);
      go.onclick = () => {
        if (aE === null || aP === null) { ctx.toast("2つとも選んでね"); return; }
        const ok = aE === ext && aP === poor;
        if (ok) { ctx.sound.ding(); ctx.award(IMAGE_COINS, go); ctx.cheat.rewardIfUnpeeked(ex.id, go); ctx.prog(imgKey); maybeStamp(); }
        else { ctx.sound.boo(); ctx.miss({ id: `${ex.id}-img`, src: ex.title, ...m.missQuestion }); }
        const fb = $(".fbBox", body);
        ctx.feedback(fb, ok, ok ? `正解！合計${tot}点 → Grade ${grade}` : `正解は 進展度${ext}点＋造影不良${poor}点＝${tot}点 → Grade ${grade}`,
          `${m.explanation}<div style="margin-top:8px"><button class="btn next">次の画像</button></div>`);
        $(".next", fb).onclick = render;
      };
    }

    render();
  },
};

