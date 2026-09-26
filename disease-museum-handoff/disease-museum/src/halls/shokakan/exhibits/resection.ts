// 切除範囲をなぞる：病変の場所を見て、大腸のどこからどこまで切るかをタップで選ぶ。選んだ範囲から術式名が決まる
import "./resection.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { ResectionData } from "./resection.schema";
import type { Segment } from "./resection.consts";
import { SEGMENTS } from "./resection.consts";
import { $, $$, esc, shuffle } from "../../../engine/dom";

const COINS = 20;
// 大腸の模式図（見る人の左が患者の右）。区間ごとの線
const PATHS: Record<Segment, string> = {
  ileum: "M20 300 L88 300",
  cecum: "M100 300 L100 346",
  asc: "M100 300 L100 150",
  transR: "M100 150 C110 120 140 112 170 112",
  transM: "M170 112 L230 112",
  transL: "M230 112 C260 112 290 118 300 140",
  desc: "M300 140 L300 290",
  sig: "M300 290 C310 350 220 360 230 320 C236 300 206 296 200 318",
  rs: "M200 318 L198 345",
  ra: "M198 345 L198 372",
  rb: "M198 372 L198 398",
  anal: "M198 398 L198 418",
};
// 区間の名前を置く場所と文字揃え（直腸は左側に並べ、右側は「がん」の印のために空けておく）
const LABEL_AT: Partial<Record<Segment, [number, number, "start" | "middle" | "end"]>> = {
  ileum: [22, 282, "start"], cecum: [92, 362, "end"], asc: [90, 230, "end"], transM: [200, 100, "middle"], desc: [312, 220, "start"],
  sig: [300, 372, "start"], rs: [188, 336, "end"], ra: [188, 362, "end"], rb: [188, 390, "end"], anal: [188, 416, "end"],
};
// 「がん」の印の場所（区間の右どなり）
const MARK_AT: Record<Segment, [number, number]> = {
  ileum: [40, 326], cecum: [118, 336], asc: [118, 226], transR: [120, 150], transM: [184, 146], transL: [250, 150], desc: [318, 250],
  sig: [316, 318], rs: [214, 336], ra: [214, 362], rb: [214, 390], anal: [214, 416],
};
const key = (a: Iterable<string>) => [...a].sort().join(",");

export const resection: CustomModule<ResectionData> = {
  mount(root, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`;
    let q = shuffle(d.cases), qi = 0;

    function render() {
      const c = q[qi % q.length], sel = new Set<Segment>();
      let done = false;
      const mark = c.lesion[Math.floor(c.lesion.length / 2)];
      root.innerHTML = `<div class="pcard"><span class="tagk">患者 ${(qi % q.length) + 1}</span><div class="chips">${Object.entries(c.card).map(([k, v]) => `<span class="chip">${esc(k)}：${esc(v)}</span>`).join("")}</div></div>
        <div class="stepLabel">切る範囲をタップ（もう一度タップで外す）</div>
        <svg class="colonFig" viewBox="0 88 360 352" role="group" aria-label="大腸の模式図。見る人の左が患者の右">
          ${SEGMENTS.map((s) => `<g class="seg" data-s="${s}" tabindex="0" role="button" aria-label="${esc(d.labels[s])}"><path class="base" d="${PATHS[s]}"/><path class="hit" d="${PATHS[s]}"/></g>`).join("")}
          ${c.lesion.map((s) => `<path d="${PATHS[s]}" stroke="${c.kind === "tumor" ? "#8E3B6E" : c.kind === "stricture" ? "#6B4A3A" : "#E23B3B"}" stroke-width="${c.kind === "inflammation" ? 8 : 14}" stroke-dasharray="${c.kind === "inflammation" ? "4 6" : "none"}" stroke-linecap="round" fill="none" pointer-events="none"/>`).join("")}
          ${c.kind !== "inflammation" ? `<text x="${MARK_AT[mark][0]}" y="${MARK_AT[mark][1]}" font-size="13" font-weight="800" fill="var(--ink)" pointer-events="none">◀ ${c.kind === "tumor" ? "がん" : "狭窄"}</text>` : ""}
          ${Object.entries(LABEL_AT).map(([s, [x, y, a]]) => `<text x="${x}" y="${y}" text-anchor="${a}" font-size="11" font-weight="800" fill="var(--sub)" pointer-events="none">${esc(d.labels[s as Segment])}</text>`).join("")}
          <text x="10" y="436" font-size="11" fill="var(--sub)" pointer-events="none">患者の右 ←　→ 患者の左</text>
        </svg>
        <div class="segChips">${SEGMENTS.map((s) => `<button data-s="${s}" aria-pressed="false">${esc(d.labels[s])}</button>`).join("")}</div>
        <div class="procName"></div>
        <div class="row" style="justify-content:center"><button class="btn go">この範囲で切る</button><button class="btn alt clear">選びなおす</button></div>
        <div class="fbBox"></div>`;
      const name = () => d.procedures.find((p) => key(p.segments) === key(sel))?.name;
      const sync = () => {
        $$(".colonFig .seg", root).forEach((g) => g.classList.toggle("sel", sel.has(g.getAttribute("data-s") as Segment)));
        $$(".segChips button", root).forEach((b) => b.setAttribute("aria-pressed", String(sel.has(b.dataset.s as Segment))));
        $(".procName", root).textContent = sel.size ? (name() ?? "（この範囲の術式はない）") : "";
      };
      const toggle = (s: Segment) => { if (done) return; sel.has(s) ? sel.delete(s) : sel.add(s); ctx.sound.beep(sel.has(s) ? 760 : 420, 0.05, "triangle", 0.05); sync(); };
      $$(".colonFig .seg", root).forEach((g) => {
        const s = g.getAttribute("data-s") as Segment;
        g.addEventListener("click", () => toggle(s));
        g.addEventListener("keydown", (e) => { if ((e as KeyboardEvent).key === "Enter" || (e as KeyboardEvent).key === " ") { e.preventDefault(); toggle(s); } });
      });
      $$<HTMLButtonElement>(".segChips button", root).forEach((b) => (b.onclick = () => toggle(b.dataset.s as Segment)));
      $(".clear", root).onclick = () => { if (!done) { sel.clear(); sync(); } };
      const go = $<HTMLButtonElement>(".go", root);
      go.onclick = () => {
        if (done) return;
        if (!sel.size) { ctx.toast("切る範囲を選んでね"); return; }
        done = true;
        const mine = name(), ok = mine === c.answer, ans = d.procedures.find((p) => p.name === c.answer)!;
        $$(".colonFig .seg", root).forEach((g) => {
          const s = g.getAttribute("data-s") as Segment;
          g.classList.toggle("ans", ans.segments.includes(s));
          g.classList.toggle("over", sel.has(s) && !ans.segments.includes(s));
        });
        if (ok) { ctx.sound.ding(); ctx.award(COINS, go); if (ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id); }
        else {
          ctx.sound.boo();
          const others = shuffle(d.procedures.filter((p) => p.name !== c.answer)).slice(0, 2).map((p) => p.name);
          ctx.miss({ id: `${ex.id}-${c.id}`, src: ex.title, q: `${Object.entries(c.card).map(([k, v]) => `${k} ${v}`).join("、")}。術式は？`, opts: shuffle([c.answer, ...others]), ans: c.answer });
        }
        const fb = $(".fbBox", root);
        ctx.feedback(fb, ok, ok ? `正解！${esc(c.answer)}` : `正解は「${esc(c.answer)}」（緑の範囲）`,
          `${mine && !ok ? `あなたの切り方は「${esc(mine)}」。<br>` : ""}${esc(c.explanation)}${ans.note ? `<br><span class="small">${esc(ans.note)}</span>` : ""}<div style="margin-top:8px"><button class="btn next">次の患者</button></div>`);
        $(".next", fb).onclick = () => { qi++; if (qi % q.length === 0) q = shuffle(d.cases); render(); };
      };
    }
    render();
  },
};
