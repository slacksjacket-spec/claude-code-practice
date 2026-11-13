// 神経根レベル：筋力低下・反射・感覚障害（図に色）から、障害された神経根を当てる（12）→ 続けて質問（12）
import "./root.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { RootData } from "./root.schema";
import { AREA, ROOTS, ROOT_IDS, type Root } from "./root.consts";
import { esc } from "../../../engine/dom";
import { twoStep } from "../../../engine/games/twoStep";

const limb = (d: string) => `<path d="${d}" fill="#F6D9BE" stroke="#1C1537" stroke-width="2"/>`;
const BODY = `<circle cx="60" cy="30" r="16" fill="#F6D9BE" stroke="#1C1537" stroke-width="2"/>
  ${limb("M44 60 L28 68 L20 170 L32 172 L46 110Z")}${limb("M76 60 L92 68 L100 170 L88 172 L74 110Z")}
  <ellipse cx="24" cy="184" rx="9" ry="13" fill="#F6D9BE" stroke="#1C1537" stroke-width="2"/><ellipse cx="96" cy="184" rx="9" ry="13" fill="#F6D9BE" stroke="#1C1537" stroke-width="2"/>
  <rect x="44" y="50" width="32" height="100" rx="10" fill="#F6D9BE" stroke="#1C1537" stroke-width="2"/>
  ${limb("M44 148 L58 148 L58 290 L44 290Z")}${limb("M62 148 L76 148 L76 290 L62 290Z")}
  <ellipse cx="48" cy="296" rx="12" ry="6" fill="#F6D9BE" stroke="#1C1537" stroke-width="2"/><ellipse cx="72" cy="296" rx="12" ry="6" fill="#F6D9BE" stroke="#1C1537" stroke-width="2"/>`;

export const root: CustomModule<RootData> = {
  mount(rootEl, ex, ctx) {
    twoStep(rootEl, ex, ctx, ex.data.cases, ex.data.stampAt, (c) => {
      const r = c.root as Root, info = ROOTS[r], show = c.show ?? ["motor", "reflex", "sensory"];
      const cards = [["motor", "筋力低下", info.motor], ["reflex", "反射", info.reflex], ["sensory", "感覚低下（図の色）", info.sensory]].filter(([k]) => show.includes(k as "motor")) as [string, string, string][];
      return {
        head: `<div class="finding" style="border:3px solid var(--line);border-radius:14px;background:var(--bg);padding:10px 12px;font-weight:800">${esc(c.story)}</div>
        <div class="rootWrap">
          <svg class="rootFig" viewBox="0 0 120 322" role="img" aria-label="感覚が低下した場所（右半身）">${BODY}${show.includes("sensory") ? `<g fill="var(--tomato)" opacity=".75">${AREA[r]}</g>` : ""}<text x="60" y="318" text-anchor="middle" font-size="9" font-weight="800" fill="#7A5A50">図の左が右半身</text></svg>
          <div class="rootCards">${cards.map(([, k, v]) => `<div><small>${esc(k)}</small>${esc(v)}</div>`).join("")}</div>
        </div>`,
        q1: "障害された神経根は？", o1: [...ROOT_IDS], a1: ROOT_IDS.indexOf(r), s1Class: "roots",
        f: c.followUp, lead: `${r}：${info.motor}／${info.reflex}／${info.sensory}`, expl: c.explanation,
        miss: c.story, miss1: `${cards.map(([, k, v]) => `${k}：${v}`).join("、")}。障害された神経根は？`,
      };
    });
  },
};
