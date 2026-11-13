// 館内図の臓器キャラの顔（目はまばたき、口、ほっぺ）。cx, cy は顔の中心、s は大きさ
export function face(cx: number, cy: number, s = 1, ink = "#1C1537"): string {
  const dx = 11 * s, r = 4.5 * s;
  return `<circle class="eye" cx="${cx - dx}" cy="${cy}" r="${r}" fill="${ink}"/><circle class="eye" cx="${cx + dx}" cy="${cy}" r="${r}" fill="${ink}"/>` +
    `<path d="M${cx - 6 * s} ${cy + 9 * s} Q${cx} ${cy + 15 * s} ${cx + 6 * s} ${cy + 9 * s}" stroke="${ink}" stroke-width="${2.5 * s}" fill="none" stroke-linecap="round"/>` +
    `<circle cx="${cx - 19 * s}" cy="${cy + 8 * s}" r="${4 * s}" fill="#FF7AB6" opacity=".7"/><circle cx="${cx + 19 * s}" cy="${cy + 8 * s}" r="${4 * s}" fill="#FF7AB6" opacity=".7"/>`;
}
