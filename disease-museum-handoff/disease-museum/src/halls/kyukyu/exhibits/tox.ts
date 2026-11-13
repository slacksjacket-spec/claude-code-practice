// トキシドローム：顔（瞳孔・皮膚）とバイタル、腸の音、意識から中毒の症候群を当てる（12）→ 解毒薬や対応（12）
import "./tox.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { ToxData } from "./tox.schema";
import { TOX, TOX_IDS, type Tox } from "./tox.consts";
import { esc } from "../../../engine/dom";
import { twoStep } from "../../../engine/games/twoStep";

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
    twoStep(root, ex, ctx, ex.data.cases, ex.data.stampAt, (c) => {
      const ans = c.answer as Tox, v = c.vitals;
      return {
        head: `<div class="finding" style="border:3px solid var(--line);border-radius:14px;background:var(--bg);padding:10px 12px;font-weight:800">${esc(c.story)}</div>
        <div class="toxWrap">${face(c)}
          <div class="toxVit"><div><small>心拍数</small>${v.HR}</div><div><small>血圧</small>${esc(v.BP)}</div><div><small>呼吸数</small>${v.RR}</div><div><small>体温</small>${v.T}</div></div></div>
        <div class="signs" style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px"><span class="chip">意識：${esc(c.mental)}</span><span class="chip">腸の音：${BOWEL[c.bowel]}</span></div>`,
        q1: "どの中毒症候群？", o1: TOX_IDS.map((k) => TOX[k]), a1: TOX_IDS.indexOf(ans), s1Class: "toxTypes",
        f: c.followUp, lead: TOX[ans], expl: c.explanation, miss: `${c.story}（${TOX[ans]}）`, next: "次の患者",
      };
    });
  },
};
