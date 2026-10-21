// トキシドローム：顔（瞳孔・皮膚）とバイタル、腸の音、意識から中毒の症候群を当てる（12）→ 解毒薬や対応（12）
import "./tox.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { ToxData } from "./tox.schema";
import { TOX, TOX_IDS, type Tox } from "./tox.consts";
import { $, $$, esc, shuffle } from "../../../engine/dom";

const C1 = 12, C2 = 12;
const PUP = { miosis: 2.5, mydriasis: 9, normal: 5 }, BOWEL = { up: "亢進", down: "低下", normal: "正常" };

function face(c: ToxData["cases"][number]) {
  const pr = PUP[c.pupils], skin = c.skin === "dry" ? "#F7A890" : "#F6D9BE";
  const sweat = c.skin === "wet" ? [[34, 40], [104, 44], [70, 30], [30, 110]].map(([x, y]) => `<path d="M${x} ${y} q4 6 0 9 q-4 -3 0 -9Z" fill="#7ACFF0" stroke="#3A8AB0" stroke-width="1"/>`).join("") : "";
  return `<svg class="toxFace" viewBox="0 0 140 150" role="img" aria-label="顔：瞳孔は${c.pupils === "miosis" ? "縮瞳" : c.pupils === "mydriasis" ? "散瞳" : "正常"}、皮膚は${c.skin === "dry" ? "赤く乾燥" : c.skin === "wet" ? "汗でぬれている" : "ふつう"}">
    <ellipse cx="70" cy="80" rx="50" ry="60" fill="${skin}" stroke="#1C1537" stroke-width="3"/>
    ${[48, 92].map((x) => `<ellipse cx="${x}" cy="70" rx="14" ry="9" fill="#fff" stroke="#1C1537" stroke-width="2"/><circle cx="${x}" cy="70" r="7" fill="#6A8AC8"/><circle cx="${x}" cy="70" r="${(pr / 9) * 6.5}" fill="#111"/>`).join("")}
    <path d="M56 112 Q70 ${c.mental.includes("興奮") ? 104 : 118} 84 112" stroke="#1C1537" stroke-width="3" fill="none"/>
    ${c.skin === "dry" ? `<circle cx="38" cy="96" r="9" fill="#FF5A36" opacity=".35"/><circle cx="102" cy="96" r="9" fill="#FF5A36" opacity=".35"/>` : ""}${sweat}
  </svg>`;
}

export const toxidrome: CustomModule<ToxData> = {
  mount(root, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`;
    let q = shuffle(d.cases), qi = 0;
    function render() {
      const c = q[qi % q.length], ans = c.answer as Tox, v = c.vitals;
      let stage = 0, ok1 = false;
      ctx.cheat.reset(ex.id);
      root.innerHTML = `<div class="finding" style="border:3px solid var(--line);border-radius:14px;background:var(--bg);padding:10px 12px;font-weight:800">${esc(c.story)}</div>
        <div class="toxWrap">${face(c)}
          <div class="toxVit"><div><small>心拍数</small>${v.HR}</div><div><small>血圧</small>${esc(v.BP)}</div><div><small>呼吸数</small>${v.RR}</div><div><small>体温</small>${v.T}</div></div></div>
        <div class="signs" style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px"><span class="chip">意識：${esc(c.mental)}</span><span class="chip">腸の音：${BOWEL[c.bowel]}</span></div>
        <div class="stepLabel">① どの中毒症候群？</div>
        <div class="toxTypes">${TOX_IDS.map((k) => `<button class="opt" data-k="${k}">${TOX[k]}</button>`).join("")}</div>
        <div class="step2"></div>`;
      $$<HTMLButtonElement>(".toxTypes .opt", root).forEach((b) => (b.onclick = () => {
        if (stage) return;
        stage = 1; ok1 = b.dataset.k === ans;
        $$<HTMLButtonElement>(".toxTypes .opt", root).forEach((x) => { x.disabled = true; if (x.dataset.k === ans) x.classList.add("right"); });
        if (ok1) { ctx.sound.ding(); ctx.award(C1, b); } else { b.classList.add("wrong"); ctx.sound.boo(); }
        const f = c.followUp, box = $(".step2", root);
        box.innerHTML = `<div class="stepLabel">② ${esc(f.question)}</div><div class="opts">${f.options.map((o, i) => `<button class="opt" data-i="${i}">${esc(o)}</button>`).join("")}</div><div class="fbBox"></div>`;
        $$<HTMLButtonElement>(".opt", box).forEach((o) => (o.onclick = () => {
          const ok = +o.dataset.i! === f.answer;
          $$<HTMLButtonElement>(".opt", box).forEach((x) => { x.disabled = true; if (+x.dataset.i! === f.answer) x.classList.add("right"); });
          if (ok) { ctx.sound.ding(); ctx.award(C2, o); ctx.cheat.rewardIfUnpeeked(ex.id, o); } else { o.classList.add("wrong"); ctx.sound.boo(); }
          if (!ok || !ok1) ctx.miss({ id: `${ex.id}-${c.id}`, src: ex.title, q: `${c.story}（${TOX[ans]}）${f.question}`, opts: shuffle([f.options[f.answer], ...shuffle(f.options.filter((_, i) => i !== f.answer)).slice(0, 2)]), ans: f.options[f.answer] });
          if (ok && ok1 && ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id);
          ctx.feedback($(".fbBox", box), ok && ok1, ok && ok1 ? "両方正解！" : ok ? "②は正解！" : `正解は「${esc(f.options[f.answer])}」`, `${TOX[ans]}。${esc(c.explanation)}<div style="margin-top:8px"><button class="btn next">次の患者</button></div>`);
          $(".next", box).onclick = () => { qi++; if (qi % q.length === 0) q = shuffle(d.cases); render(); };
        }));
      }));
    }
    render();
  },
};
