// 瞳孔ラボ：明るさや光の当て方、近見を切り替えて両眼の瞳孔を観察し、原因を当てる（12）→ 続けて質問（12）
import "./pupil.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { PupilData } from "./pupil.schema";
import { ptosis, pupils, STATE_LABEL, STATES, type State } from "./pupil.consts";
import { $, $$, esc } from "../../../engine/dom";
import { twoStep } from "../../../engine/games/twoStep";

const MM = 4.2; // 1 mm = 4.2 px（虹彩の半径 26 px）

function eyeSvg(cx: number, r: number, droop: number, devOut: boolean, isRight: boolean, id: string) {
  const dx = devOut ? (isRight ? -9 : 9) : 0, dy = devOut ? 6 : 0;
  const lid = 20 + droop * 30;
  return `<g><ellipse cx="${cx}" cy="70" rx="56" ry="34" fill="#fff" stroke="#1C1537" stroke-width="3"/>
    <circle cx="${cx + dx}" cy="${70 + dy}" r="26" fill="#6A8AC8"/><circle class="pup" data-e="${id}" cx="${cx + dx}" cy="${70 + dy}" r="${r}" fill="#111"/>
    <circle cx="${cx + dx + 8}" cy="${62 + dy}" r="4" fill="#fff" opacity=".8"/>
    <path d="M${cx - 60} 36 Q${cx} ${36 - 14 + lid} ${cx + 60} 36 L${cx + 60} 20 L${cx - 60} 20Z" fill="#F3D3B8" stroke="#1C1537" stroke-width="3"/></g>`;
}

export const pupil: CustomModule<PupilData> = {
  mount(root, ex, ctx) {
    twoStep(root, ex, ctx, ex.data.cases, ex.data.stampAt, (c) => {
      const droop = ptosis(c.pattern), dev = c.pattern === "cn3";
      let st: State = "bright";
      const [r0, l0] = pupils(c.pattern, c.side, st);
      return {
        head: `<div class="finding" style="border:3px solid var(--line);border-radius:14px;background:var(--bg);padding:10px 12px;font-weight:800">${esc(c.story)}</div>
        <svg class="eyes" viewBox="0 0 340 140" role="img" aria-label="患者の両眼。図の左が患者の右眼" style="background:#FFF4DA">
          <rect x="0" y="0" width="340" height="140" fill="transparent"/>
          ${eyeSvg(90, r0 * MM, c.side === "R" ? droop : 0, dev && c.side === "R", true, "R")}
          ${eyeSvg(250, l0 * MM, c.side === "L" ? droop : 0, dev && c.side === "L", false, "L")}
          <text x="90" y="128" text-anchor="middle" font-size="11" font-weight="800" fill="#1C1537">右眼</text><text x="250" y="128" text-anchor="middle" font-size="11" font-weight="800" fill="#1C1537">左眼</text>
          <g class="beam"></g>
        </svg>
        <div class="pupRead"></div>
        <div class="pupBtns">${STATES.map((s) => `<button data-s="${s}" aria-pressed="${s === st}">${STATE_LABEL[s]}</button>`).join("")}</div>`,
        q1: "原因は？（ボタンでいろいろ試してから）", o1: c.options, a1: c.answer,
        f: c.followUp, expl: c.explanation, miss: `${c.options[c.answer]}。`, miss1: `${c.story} 瞳孔の所見から考える原因は？`, next: "次の患者",
        after: () => {
      const show = () => {
        const [r, l] = pupils(c.pattern, c.side, st);
        $(`.pup[data-e="R"]`, root).setAttribute("r", String(r * MM));
        $(`.pup[data-e="L"]`, root).setAttribute("r", String(l * MM));
        ($(".eyes", root) as unknown as SVGElement).style.background = st === "dark" ? "#2A2440" : "#FFF4DA";
        $(".beam", root).innerHTML = st === "lightR" ? `<path d="M90 0 L70 40 L110 40Z" fill="#FFE066" opacity=".7"/>` : st === "lightL" ? `<path d="M250 0 L230 40 L270 40Z" fill="#FFE066" opacity=".7"/>` : st === "near" ? `<circle cx="170" cy="20" r="8" fill="var(--tomato)"/>` : "";
        $(".pupRead", root).textContent = `${STATE_LABEL[st]}：右 ${r.toFixed(1)} mm／左 ${l.toFixed(1)} mm`;
      };
      show();
      $$<HTMLButtonElement>(".pupBtns button", root).forEach((b) => (b.onclick = () => {
        st = b.dataset.s as State;
        $$<HTMLButtonElement>(".pupBtns button", root).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        ctx.sound.beep(st === "dark" ? 380 : 640, 0.05, "triangle", 0.04);
        show();
      }));
        },
      };
    });
  },
};
