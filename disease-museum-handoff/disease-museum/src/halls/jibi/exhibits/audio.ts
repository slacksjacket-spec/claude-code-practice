// オージオグラム：純音聴力検査の結果を読んで、難聴の型（12）→ 原因や対応（12）
import "./audio.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { AudioData } from "./audio.schema";
import { AIR_F, BONE_F, HL_LABEL, type HlType } from "./audio.consts";
import { $, $$, esc, shuffle } from "../../../engine/dom";

const C1 = 12, C2 = 12, W = 340, H = 300, L = 40, R = 324, T = 26, B = 284;
const x = (f: number) => L + (Math.log2(f / 125) / 6) * (R - L);
const y = (db: number) => T + ((db + 10) / 130) * (B - T);

function chart(c: AudioData["cases"][number]) {
  const right = c.ear === "R", col = right ? "#E0303A" : "#3D5AFE";
  const mark = (f: number, v: number) => right ? `<circle cx="${x(f)}" cy="${y(v)}" r="5" fill="#fff" stroke="${col}" stroke-width="2.5"/>` : `<path d="M${x(f) - 5} ${y(v) - 5} l10 10 m0 -10 l-10 10" stroke="${col}" stroke-width="2.5"/>`;
  const bmark = (f: number, v: number) => right ? `<path d="M${x(f) - 4} ${y(v) - 7} h-5 v14 h5" stroke="${col}" stroke-width="2.5" fill="none"/>` : `<path d="M${x(f) + 4} ${y(v) - 7} h5 v14 h-5" stroke="${col}" stroke-width="2.5" fill="none"/>`;
  return `<svg class="audioSvg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${right ? "右" : "左"}耳のオージオグラム。気導 ${c.air.join("、")} dB、骨導 ${c.bone.join("、")} dB">
    <rect x="${L}" y="${y(-10)}" width="${R - L}" height="${y(25) - y(-10)}" fill="#E7F7EF"/>
    ${AIR_F.map((f) => `<line x1="${x(f)}" x2="${x(f)}" y1="${T}" y2="${B}" stroke="#E0D8EC"/><text x="${x(f)}" y="${T - 8}" font-size="9" text-anchor="middle">${f >= 1000 ? `${f / 1000}k` : f}</text>`).join("")}
    ${Array.from({ length: 14 }, (_, i) => i * 10 - 10).map((db) => `<line x1="${L}" x2="${R}" y1="${y(db)}" y2="${y(db)}" stroke="${db === 0 ? "#9A8EB8" : "#E0D8EC"}"/>${db % 20 === 0 ? `<text x="${L - 4}" y="${y(db) + 3}" font-size="9" text-anchor="end">${db}</text>` : ""}`).join("")}
    <polyline points="${AIR_F.map((f, i) => `${x(f)},${y(c.air[i])}`).join(" ")}" fill="none" stroke="${col}" stroke-width="2"/>
    ${AIR_F.map((f, i) => mark(f, c.air[i])).join("")}${BONE_F.map((f, i) => bmark(f, c.bone[i])).join("")}
    <text x="${R}" y="${B - 6}" font-size="9" text-anchor="end">${right ? "○ 右・気導　［ 右・骨導" : "× 左・気導　］ 左・骨導"}　縦軸 dB（下ほど聞こえない）</text>
  </svg>`;
}

export const audiogram: CustomModule<AudioData> = {
  mount(root, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`;
    let q = shuffle(d.cases), qi = 0;
    function render() {
      const c = q[qi % q.length];
      let stage = 0, ok1 = false;
      ctx.cheat.reset(ex.id);
      root.innerHTML = `<div class="finding" style="border:3px solid var(--line);border-radius:14px;background:var(--bg);padding:10px 12px;font-weight:800">${esc(c.story)}</div>
        ${chart(c)}
        <div class="stepLabel">① 聴力の型は？</div>
        <div class="hlTypes">${(Object.keys(HL_LABEL) as HlType[]).map((k) => `<button class="opt" data-k="${k}">${HL_LABEL[k]}</button>`).join("")}</div>
        <div class="step2"></div>`;
      $$<HTMLButtonElement>(".hlTypes .opt", root).forEach((b) => (b.onclick = () => {
        if (stage) return;
        stage = 1; ok1 = b.dataset.k === c.answer;
        $$<HTMLButtonElement>(".hlTypes .opt", root).forEach((x) => { x.disabled = true; if (x.dataset.k === c.answer) x.classList.add("right"); });
        if (ok1) { ctx.sound.ding(); ctx.award(C1, b); } else { b.classList.add("wrong"); ctx.sound.boo(); }
        const f = c.followUp, box = $(".step2", root);
        box.innerHTML = `<div class="stepLabel">② ${esc(f.question)}</div><div class="opts">${f.options.map((o, i) => `<button class="opt" data-i="${i}">${esc(o)}</button>`).join("")}</div><div class="fbBox"></div>`;
        $$<HTMLButtonElement>(".opt", box).forEach((o) => (o.onclick = () => {
          const ok = +o.dataset.i! === f.answer;
          $$<HTMLButtonElement>(".opt", box).forEach((x) => { x.disabled = true; if (+x.dataset.i! === f.answer) x.classList.add("right"); });
          if (ok) { ctx.sound.ding(); ctx.award(C2, o); ctx.cheat.rewardIfUnpeeked(ex.id, o); } else { o.classList.add("wrong"); ctx.sound.boo(); }
          if (!ok || !ok1) ctx.miss({ id: `${ex.id}-${c.id}`, src: ex.title, q: `${c.story}（${HL_LABEL[c.answer]}）${f.question}`, opts: shuffle([f.options[f.answer], ...shuffle(f.options.filter((_, i) => i !== f.answer)).slice(0, 2)]), ans: f.options[f.answer] });
          if (ok && ok1 && ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id);
          ctx.feedback($(".fbBox", box), ok && ok1, ok && ok1 ? "両方正解！" : ok ? "②は正解！" : `正解は「${esc(f.options[f.answer])}」`, `型：${HL_LABEL[c.answer]}。${esc(c.explanation)}<div style="margin-top:8px"><button class="btn next">次へ</button></div>`);
          $(".next", box).onclick = () => { qi++; if (qi % q.length === 0) q = shuffle(d.cases); render(); };
        }));
      }));
    }
    render();
  },
};
