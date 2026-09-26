// 心電図を方眼紙に描く（25 mm/秒、10 mm/mV。小さいマス1mm＝0.04秒・0.1mV、大きいマス5mm＝0.2秒・0.5mV）
import type { Lead, Rhythm, TwelveLead } from "./synth";
import { leadRhythm, signal } from "./synth";

export const MM_PER_S = 25, MM_PER_MV = 10;
const PX_PER_MM = 3.2; // 画面での大きさ（横にスクロールして見る）
let uid = 0;

function grid(w: number, h: number) {
  const id = `ecgGrid${uid++}`;
  return {
    defs: `<defs><pattern id="${id}s" width="1" height="1" patternUnits="userSpaceOnUse"><path d="M1 0 L0 0 0 1" fill="none" stroke="#F6C6C2" stroke-width=".08"/></pattern>
      <pattern id="${id}" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="url(#${id}s)"/><path d="M5 0 L0 0 0 5" fill="none" stroke="#E99A94" stroke-width=".2"/></pattern></defs>`,
    rect: `<rect width="${w}" height="${h}" fill="#FFF7F5"/><rect width="${w}" height="${h}" fill="url(#${id})"/>`,
  };
}

/** 波形の path。x0 から seconds 秒ぶん、y0 が基線 */
export function trace(r: Rhythm, from: number, seconds: number, x0: number, y0: number, step = 0.004) {
  const pts: string[] = [];
  for (let t = from; t <= from + seconds + 1e-9; t += step) pts.push(`${(x0 + (t - from) * MM_PER_S).toFixed(2)} ${(y0 - signal(r, t) * MM_PER_MV).toFixed(2)}`);
  return `M${pts.join(" L")}`;
}
const cal = (x: number, y0: number) => `M${x} ${y0} L${x + 1} ${y0} L${x + 1} ${y0 - 10} L${x + 6} ${y0 - 10} L${x + 6} ${y0} L${x + 7} ${y0}`;
const PATH = `fill="none" stroke="#1C1537" stroke-width=".32" stroke-linejoin="round"`;

/** 1誘導の記録（リズムストリップ）。高さ h mm、基線は上から base mm */
export function stripSVG(r: Rhythm, seconds: number, opts: { label?: string; h?: number; base?: number; from?: number; extra?: string; cls?: string; monitor?: boolean; px?: number } = {}) {
  const h = opts.h ?? 34, base = opts.base ?? 20, w = seconds * MM_PER_S + 8, g = grid(w, h);
  // monitor：ベッドサイドモニター風（黒地に緑、方眼なし）
  const bg = opts.monitor ? `<rect width="${w}" height="${h}" fill="#0B1A14"/>` : `${g.defs}${g.rect}`;
  const stroke = opts.monitor ? `fill="none" stroke="#5CFF9D" stroke-width=".45" stroke-linejoin="round"` : PATH;
  return `<svg class="${opts.cls ?? "ecg"}" viewBox="0 0 ${w} ${h}" style="width:${(w * (opts.px ?? PX_PER_MM)).toFixed(0)}px" role="img" aria-label="心電図${opts.label ? "（" + opts.label + "）" : ""}">${bg}
    ${opts.monitor ? "" : `<path d="${cal(0, base)}" ${PATH}/>`}
    <path d="${trace(r, opts.from ?? 0, seconds, 8, base)}" ${stroke}/>
    ${opts.label ? `<text x="9" y="4.5" font-size="3.4" font-weight="800" fill="${opts.monitor ? "#5CFF9D" : "#1C1537"}">${opts.label}</text>` : ""}
    ${opts.extra ?? ""}</svg>`;
}

/** 標準12誘導（4列×3段、各2.5秒）＋ II誘導のリズムストリップ */
export const LAYOUT: Lead[][] = [["I", "aVR", "V1", "V4"], ["II", "aVL", "V2", "V5"], ["III", "aVF", "V3", "V6"]];
export function twelveSVG(tw: TwelveLead, seed: number, opts: { tappable?: boolean } = {}) {
  const rowH = 30, w = 8 + 10 * MM_PER_S, h = rowH * 4 + 4, g = grid(w, h), seg = 2.5;
  const rs = new Map<Lead, Rhythm>();
  const get = (l: Lead) => rs.get(l) ?? (rs.set(l, leadRhythm(tw, l, seed)), rs.get(l)!);
  let body = "";
  LAYOUT.forEach((row, ri) => {
    const y0 = rowH * ri + 17;
    body += `<path d="${cal(0, y0)}" ${PATH}/>`;
    row.forEach((l, ci) => {
      const x0 = 8 + ci * seg * MM_PER_S;
      body += `<path d="${trace(get(l), ci * seg, seg, x0, y0)}" ${PATH}/>`;
      if (ci) body += `<path d="M${x0} ${y0 - 4} L${x0} ${y0 + 4}" stroke="#1C1537" stroke-width=".3"/>`;
      body += `<text x="${x0 + 1.5}" y="${rowH * ri + 5}" font-size="3.6" font-weight="800" fill="#1C1537">${l}</text>`;
      if (opts.tappable) body += `<rect class="leadHit" data-lead="${l}" x="${x0}" y="${rowH * ri + 1}" width="${seg * MM_PER_S}" height="${rowH - 2}" rx="2" fill="transparent" tabindex="0" role="button" aria-label="${l}誘導"/>`;
    });
  });
  const yR = rowH * 3 + 19;
  body += `<path d="${cal(0, yR)}" ${PATH}/><path d="${trace(get("II"), 0, 10, 8, yR)}" ${PATH}/><text x="9.5" y="${rowH * 3 + 6}" font-size="3.6" font-weight="800" fill="#1C1537">II</text>`;
  return `<svg class="ecg ecg12" viewBox="0 0 ${w} ${h}" style="width:${(w * 2.7).toFixed(0)}px;overflow:visible" role="img" aria-label="12誘導心電図">${g.defs}${g.rect}${body}</svg>`;
}

export const ECG_CSS = `.ecgBox{overflow-x:auto;border:3px solid var(--line);border-radius:14px;background:#FFF7F5;box-shadow:var(--shadow);-webkit-overflow-scrolling:touch}
.ecgBox svg{display:block;height:auto;max-width:none}
.ecgHint{font-size:12px;font-weight:800;color:var(--sub);margin:4px 2px 0}`;
