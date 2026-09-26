// 小さな DOM ユーティリティ（試作の $ / $$ / shuffle / pick を引き継ぐ）
export const $ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => root.querySelector(s) as T;
export const $$ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => [...root.querySelectorAll(s)] as T[];

export function shuffle<T>(a: readonly T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}
export const pick = <T>(a: readonly T[]): T => a[Math.floor(Math.random() * a.length)];
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

const ESC: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
/** データの平文を HTML に差し込むときに使う（html / svg フィールドは信頼済みなのでそのまま） */
export const esc = (s: string | number) => String(s).replace(/[&<>"']/g, (c) => ESC[c]);

/** デザイントークン名なら var(--x)、それ以外はそのまま */
const TOKEN_NAMES = ["tomato", "sun", "mint", "cobalt", "pink", "bile", "liver", "ink"];
export const color = (c: string) => (TOKEN_NAMES.includes(c) ? `var(--${c})` : c);

/** 背景色の上に置く文字色（暗い色なら白） */
export function inkOn(hex: string): string {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return "#1C1537";
  const n = parseInt(m[1], 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b < 90 ? "#fff" : "#1C1537";
}

/** アニメーションのクラスを付け直す（連続で鳴らすため） */
export function replay(el: Element, cls: string) {
  el.classList.remove(cls);
  void (el as HTMLElement).offsetWidth;
  el.classList.add(cls);
}
