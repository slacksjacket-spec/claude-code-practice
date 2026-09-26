// コイン・XP・ランク
import { $, replay } from "./dom";

export const RANKS: [number, string][] = [
  [0, "見習い学芸員"], [150, "学芸員"], [400, "主任学芸員"], [800, "副館長"], [1300, "館長"],
];
export const XP_STAMP = 50;
export const XP_GACHA_NEW = 10;
export const XP_GACHA_COMPLETE = 100;

export const rankOf = (xp: number) => RANKS.filter((r) => xp >= r[0]).pop()![1];

/** コイン表示を跳ねさせ、押した要素の上に「+n」を浮かべる */
export function coinFx(n: number, el?: Element | null) {
  replay($("#coinPill"), "bump");
  if (!el) return;
  const r = el.getBoundingClientRect(), f = document.createElement("div");
  f.className = "float";
  f.textContent = "+" + n;
  f.style.left = r.left + r.width / 2 - 20 + "px";
  f.style.top = r.top - 6 + "px";
  document.body.appendChild(f);
  setTimeout(() => f.remove(), 1000);
}
