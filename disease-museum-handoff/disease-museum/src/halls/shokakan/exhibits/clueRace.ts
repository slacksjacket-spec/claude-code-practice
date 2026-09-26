// 早押し問診：問診・所見・検査のカードが1枚ずつめくれる。少ないカードで当てるほど高得点。まちがえると1枚めくれてしまう
import "./clueRace.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { ClueRaceData } from "./clueRace.schema";
import type { Region } from "./clueRace.consts";
import { REGIONS } from "./clueRace.consts";
import { $, $$, esc, shuffle } from "../../../engine/dom";

const worth = (opened: number) => Math.max(5, 35 - opened * 5);

/** 腹部9区分の図。regions は痛みの順（最後が今の場所） */
function belly(regions: Region[]) {
  const cell = (r: Region, i: number) => {
    const col = i % 3, row = Math.floor(i / 3), x = 20 + col * 40, y = 30 + row * 40;
    const cls = regions.at(-1) === r ? "on" : regions.includes(r) ? "was" : "";
    return { r, x, y, cls };
  };
  const cells = REGIONS.map(cell);
  const center = (r: Region) => { const c = cells.find((x) => x.r === r)!; return [c.x + 20, c.y + 20]; };
  const arrow = regions.length > 1 ? (() => { const [a, b] = [center(regions[0]), center(regions.at(-1)!)]; return `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#1C1537" stroke-width="3" marker-end="url(#ah)"/>`; })() : "";
  return `<svg class="belly" viewBox="0 0 160 176" aria-label="痛む場所（見る人の左が患者の右）">
    <defs><marker id="ah" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10Z" fill="#1C1537"/></marker></defs>
    <path d="M20 20 C10 60 10 120 30 160 L130 160 C150 120 150 60 140 20Z" fill="none" stroke="var(--line)" stroke-width="3"/>
    ${cells.map((c) => `<rect class="r ${c.cls}" x="${c.x}" y="${c.y}" width="40" height="40"/>`).join("")}
    ${arrow}
    <text x="2" y="14" font-size="10" font-weight="800" fill="var(--sub)">患者の右</text><text x="158" y="14" font-size="10" font-weight="800" fill="var(--sub)" text-anchor="end">左</text>
  </svg>`;
}

export const clueRace: CustomModule<ClueRaceData> = {
  mount(root, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`;
    let q = shuffle(d.cases), qi = 0;

    function render() {
      const c = q[qi % q.length];
      let opened = 1, done = false, first = true;
      root.innerHTML = `<div class="hud"><span class="tagk">患者 ${(qi % q.length) + 1}</span><span class="small" style="font-weight:800">${d.stampMaxCards}枚以内の正解 通算 ${Number(ctx.st.prog[okKey] ?? 0)} / ${d.stampAt}</span></div>
        <div class="clues"></div>
        <div class="raceBar"><span class="worth"></span><button class="btn alt more">次のカードをめくる</button></div>
        <div class="stepLabel">診断は？（いつでも答えてよい）</div>
        <div class="opts">${shuffle(c.options).map((o) => `<button class="opt" data-a="${esc(o)}">${esc(o)}</button>`).join("")}</div>
        <div class="fbBox"></div>`;
      const more = $<HTMLButtonElement>(".more", root);
      const draw = () => {
        $(".clues", root).innerHTML = c.clues.map((k, i) => i < opened
          ? `<div class="clueCard ${i === opened - 1 ? "card-pop" : ""}"><span class="tagk">${esc(k.label)}</span><div>${k.kind === "pain" ? `<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">${belly(k.regions)}<span>${esc(k.text)}</span></div>` : esc(k.text)}</div></div>`
          : `<div class="clueCard hidden"><span class="tagk">？</span><span>カード ${i + 1}</span></div>`).join("");
        $(".worth", root).textContent = done ? "" : `いま当てると +${worth(opened)}`;
        more.disabled = done || opened >= c.clues.length;
      };
      const flip = () => { if (opened < c.clues.length) { opened++; ctx.sound.beep(420 + opened * 60, 0.06, "triangle", 0.05); } draw(); };
      more.onclick = flip;
      draw();
      $$<HTMLButtonElement>(".opt", root).forEach((b) => (b.onclick = () => {
        if (done) return;
        if (b.dataset.a !== c.answer) {
          b.classList.add("wrong"); b.disabled = true; ctx.sound.boo();
          if (first) ctx.miss({ id: `${ex.id}-${c.id}`, src: ex.title, q: c.clues.map((k) => `${k.label}：${k.text}`).slice(0, 3).join("／") + "。診断は？", opts: shuffle([c.answer, ...shuffle(c.options.filter((o) => o !== c.answer)).slice(0, 2)]), ans: c.answer });
          first = false;
          flip();
          return;
        }
        done = true;
        const coins = worth(opened);
        b.classList.add("right");
        $$<HTMLButtonElement>(".opt", root).forEach((x) => (x.disabled = true));
        ctx.sound.ding(); ctx.award(coins, b);
        if (first && opened <= d.stampMaxCards && ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id);
        const usedCards = opened;
        opened = c.clues.length; draw();
        const fb = $(".fbBox", root);
        ctx.feedback(fb, true, `正解！ ${usedCards}枚で +${coins}`, `${esc(c.explanation)}<div style="margin-top:8px"><button class="btn next">次の患者</button></div>`);
        $(".next", fb).onclick = () => { qi++; if (qi % q.length === 0) q = shuffle(d.cases); render(); };
      }));
    }
    render();
  },
};
