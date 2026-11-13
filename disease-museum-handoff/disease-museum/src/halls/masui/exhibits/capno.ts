// カプノグラム：麻酔中の呼気CO₂の波形（24秒）を読んで何が起きているかを当て（12）、対応を答える（12）
import "./masui.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { CapnoData } from "./capno.schema";
import { CAPNO_HZ, synthCapno, type Capno } from "./capno.consts";
import { esc } from "../../../engine/dom";
import { twoStep } from "../../../engine/games/twoStep";

const W = 600, H = 170, T = 14, B = 150;
const y = (v: number) => B - (Math.min(80, v) / 80) * (B - T);

function chart(p: Capno) {
  const s = synthCapno(p), x = (i: number) => (i / s.length) * W;
  const grid = [0, 20, 40, 60, 80].map((v) => `<line x1="0" x2="${W}" y1="${y(v)}" y2="${y(v)}" stroke="#1E3A2A"/><text x="4" y="${y(v) - 2}" font-size="10" fill="#5A8A6A" font-weight="800">${v}</text>`).join("");
  const sec = Array.from({ length: s.length / CAPNO_HZ / 4 + 1 }, (_, i) => `<line x1="${x(i * 4 * CAPNO_HZ)}" x2="${x(i * 4 * CAPNO_HZ)}" y1="${T}" y2="${B}" stroke="#16281E"/>`).join("");
  return `<svg class="capno" viewBox="0 0 ${W} ${H}" role="img" aria-label="カプノグラム（24秒）">${sec}${grid}
    <polyline points="${s.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ")}" fill="none" stroke="#FFD84A" stroke-width="2.2" stroke-linejoin="round"/>
    <text x="${W - 6}" y="${H - 4}" font-size="10" fill="#BFE8C0" text-anchor="end" font-weight="800">EtCO₂（mmHg）・縦線は4秒ごと</text></svg>`;
}

export const capnogram: CustomModule<CapnoData> = {
  mount(root, ex, ctx) {
    twoStep(root, ex, ctx, ex.data.cases, ex.data.stampAt, (c) => ({
      head: `<div class="finding" style="border:3px solid var(--line);border-radius:14px;background:var(--bg);padding:10px 12px;font-weight:800">${esc(c.story)}</div>${chart(c.pattern as Capno)}`,
      q1: "何が起きている？", o1: c.options, a1: c.answer,
      f: c.followUp, expl: c.explanation, miss: `${c.options[c.answer]}。`, miss1: `${c.story} カプノグラムの変化から考えるのは？`, next: "次の波形",
    }));
  },
};
