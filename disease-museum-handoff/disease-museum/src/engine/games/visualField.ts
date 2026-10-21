// 視野と病変：視野の欠け方を見て、視覚路のどこに病変があるかをタップする。続けて質問が出せる
import "./visualField.css";
import type { CustomModule } from "../exhibits/types";
import type { VisualFieldData } from "./visualField.schema";
import { LESIONS, LESION_IDS, type Field, type LesionId, type Quad } from "./visualField.consts";
import { $, $$, esc, shuffle } from "../dom";

const TAP_COINS = 15, FOLLOW_COINS = 10;
const QUAD_PATH: Record<Quad, string> = { UL: "M50 50 L50 6 A44 44 0 0 0 6 50Z", UR: "M50 50 L94 50 A44 44 0 0 0 50 6Z", LL: "M50 50 L6 50 A44 44 0 0 0 50 94Z", LR: "M50 50 L50 94 A44 44 0 0 0 94 50Z" };

function eye(qs: readonly Quad[], spare: boolean) {
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="44" fill="#fff" stroke="#1C1537" stroke-width="3"/>
    ${qs.map((q) => `<path d="${QUAD_PATH[q]}" fill="#1C1537" opacity=".85"/>`).join("")}
    ${spare && qs.length ? `<circle cx="50" cy="50" r="10" fill="#fff"/>` : ""}
    <path d="M6 50 H94 M50 6 V94" stroke="#9A8EB8" stroke-width="1.5"/><circle cx="50" cy="50" r="2.5" fill="var(--tomato)"/></svg>`;
}
const fieldHTML = (f: Field) => `<div class="vfFields" role="img" aria-label="視野の図"><figure>${eye(f.left, !!f.spareMacula)}左眼</figure><figure>${eye(f.right, !!f.spareMacula)}右眼</figure></div>`;

// 上から見た視覚路（図の上が前、左が患者の左）
const PATH_SVG = `<ellipse cx="90" cy="34" rx="26" ry="20" fill="#fff" stroke="#1C1537" stroke-width="3"/><ellipse cx="230" cy="34" rx="26" ry="20" fill="#fff" stroke="#1C1537" stroke-width="3"/>
  <circle cx="90" cy="30" r="8" fill="#3D5AFE"/><circle cx="230" cy="30" r="8" fill="#3D5AFE"/>
  <text x="54" y="38" text-anchor="end" font-size="11" font-weight="800">左眼</text><text x="266" y="38" font-size="11" font-weight="800">右眼</text>
  <path d="M90 54 L160 120 L230 54" stroke="#F2B3A6" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M160 120 L110 180 M160 120 L210 180" stroke="#F2B3A6" stroke-width="10" fill="none" stroke-linecap="round"/>
  <circle cx="110" cy="184" r="9" fill="#E8A87C" stroke="#1C1537" stroke-width="2"/><circle cx="210" cy="184" r="9" fill="#E8A87C" stroke="#1C1537" stroke-width="2"/>
  <text x="160" y="196" text-anchor="middle" font-size="9" font-weight="800" fill="#7A5A50">外側膝状体</text>
  <path d="M110 192 C70 220 60 260 120 300 M110 192 C112 230 116 260 124 300" stroke="#F7C9A0" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M210 192 C250 220 260 260 200 300 M210 192 C208 230 204 260 196 300" stroke="#F7C9A0" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M100 300 Q160 330 220 300" stroke="#C8453B" stroke-width="10" fill="none" stroke-linecap="round"/>
  <text x="160" y="342" text-anchor="middle" font-size="10" font-weight="800" fill="#7A5A50">後頭葉（視覚野）</text>
  <text x="22" y="246" font-size="9" font-weight="800" fill="#7A5A50">側頭葉</text><text x="262" y="246" font-size="9" font-weight="800" fill="#7A5A50">側頭葉</text>
  <text x="128" y="250" font-size="9" font-weight="800" fill="#7A5A50" text-anchor="start">頭頂葉</text><text x="192" y="250" font-size="9" font-weight="800" fill="#7A5A50" text-anchor="end">頭頂葉</text>`;
const HIT: Record<LesionId, string> = {
  onL: `<ellipse class="hit" cx="118" cy="82" rx="14" ry="14"/>`, onR: `<ellipse class="hit" cx="202" cy="82" rx="14" ry="14"/>`,
  chiasm: `<ellipse class="hit" cx="160" cy="120" rx="16" ry="14"/>`,
  tractL: `<ellipse class="hit" cx="133" cy="152" rx="13" ry="13"/>`, tractR: `<ellipse class="hit" cx="187" cy="152" rx="13" ry="13"/>`,
  meyerL: `<ellipse class="hit" cx="72" cy="246" rx="14" ry="18"/>`, meyerR: `<ellipse class="hit" cx="248" cy="246" rx="14" ry="18"/>`,
  parL: `<ellipse class="hit" cx="115" cy="234" rx="11" ry="16"/>`, parR: `<ellipse class="hit" cx="205" cy="234" rx="11" ry="16"/>`,
  occL: `<ellipse class="hit" cx="122" cy="310" rx="18" ry="13"/>`, occR: `<ellipse class="hit" cx="198" cy="310" rx="18" ry="13"/>`,
};

export const visualField: CustomModule<VisualFieldData> = {
  mount(root, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`;
    let q = shuffle(d.cases), qi = 0;
    function render() {
      const c = q[qi % q.length], ans = c.lesion as LesionId;
      let stage = 0;
      ctx.cheat.reset(ex.id);
      root.innerHTML = `<div class="finding" style="border:3px solid var(--line);border-radius:14px;background:var(--bg);padding:10px 12px;font-weight:800">${esc(c.story)}</div>
        ${fieldHTML(LESIONS[ans].field)}
        <p class="small" style="text-align:center;font-weight:800;color:var(--sub);margin:2px 0 0">黒が見えない範囲（患者から見た視野）</p>
        <div class="stepLabel">① 病変はどこ？（図の点線の丸をタップ）</div>
        <svg class="vfPath" viewBox="0 0 320 352" role="group" aria-label="上から見た視覚路。図の左が患者の左">${PATH_SVG}
          ${LESION_IDS.map((id) => `<g class="les" data-l="${id}" tabindex="0" role="button" aria-label="${esc(LESIONS[id].label)}">${HIT[id]}</g>`).join("")}</svg>
        <p class="small" style="text-align:center;font-weight:800;color:var(--sub);margin:4px 0 0">上から見た図。左が患者の左</p>
        <div class="fb1"></div><div class="step2"></div>`;
      const pick = (id: LesionId) => {
        if (stage) return;
        stage = 1;
        const ok = id === ans;
        $(`.les[data-l="${ans}"]`, root).classList.add("right");
        if (!ok) $(`.les[data-l="${id}"]`, root).classList.add("wrong");
        if (ok) { ctx.sound.ding(); ctx.award(TAP_COINS, $(".vfPath", root)); } else ctx.sound.boo();
        $(".fb1", root).innerHTML = `<p class="small" style="font-weight:800;margin:8px 0 0">${ok ? "正解！" : `おしい。選んだのは「${esc(LESIONS[id].label)}」。`}答え：${esc(LESIONS[ans].label)}</p>`;
        const done = (all: boolean, title: string) => {
          if (!all) {
            const fu = c.followUp;
            const a = fu ? fu.options[fu.answer] : LESIONS[ans].label;
            const others = fu ? fu.options.filter((_, i) => i !== fu.answer) : LESION_IDS.filter((x) => x !== ans).map((x) => LESIONS[x].label);
            ctx.miss({ id: `${ex.id}-${c.id}`, src: ex.title, q: `${c.story}${fu ? fu.question : "病変はどこ？"}`, opts: shuffle([a, ...shuffle(others).slice(0, 2)]), ans: a });
          }
          if (all) { ctx.cheat.rewardIfUnpeeked(ex.id, $(".vfPath", root)); if (ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id); }
          const fb = document.createElement("div"); $(".step2", root).append(fb);
          ctx.feedback(fb, all, title, `${esc(c.explanation)}<div style="margin-top:8px"><button class="btn next">次へ</button></div>`);
          $(".next", fb).onclick = () => { qi++; if (qi % q.length === 0) q = shuffle(d.cases); render(); };
        };
        if (!c.followUp) { done(ok, ok ? "正解！" : "答えは緑の場所"); return; }
        const fu = c.followUp, box = $(".step2", root);
        box.innerHTML = `<div class="stepLabel">② ${esc(fu.question)}</div><div class="opts">${fu.options.map((o, i) => `<button class="opt" data-i="${i}">${esc(o)}</button>`).join("")}</div>`;
        $$<HTMLButtonElement>(".opt", box).forEach((b) => (b.onclick = () => {
          const ok2 = +b.dataset.i! === fu.answer;
          $$<HTMLButtonElement>(".opt", box).forEach((x) => { x.disabled = true; if (+x.dataset.i! === fu.answer) x.classList.add("right"); });
          if (ok2) { ctx.sound.ding(); ctx.award(FOLLOW_COINS, b); } else { b.classList.add("wrong"); ctx.sound.boo(); }
          done(ok && ok2, ok && ok2 ? "両方正解！" : ok2 ? "②は正解！" : `②の正解は「${esc(fu.options[fu.answer])}」`);
        }));
      };
      $$(".vfPath .les", root).forEach((g) => {
        const id = g.getAttribute("data-l") as LesionId;
        g.addEventListener("click", () => pick(id));
        g.addEventListener("keydown", (e) => { if ((e as KeyboardEvent).key === "Enter" || (e as KeyboardEvent).key === " ") { e.preventDefault(); pick(id); } });
      });
    }
    render();
  },
};
