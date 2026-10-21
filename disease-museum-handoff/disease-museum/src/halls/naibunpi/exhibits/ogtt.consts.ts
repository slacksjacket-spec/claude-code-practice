// 75g OGTT の判定（日本糖尿病学会の区分）。TODO(review) 閾値
export type OgttType = "normal" | "border" | "dm";
export const OGTT_LABEL: Record<OgttType, string> = { normal: "正常型", border: "境界型", dm: "糖尿病型" };
export const TIMES = [0, 30, 60, 120] as const;
/** 空腹時 126 以上 または 2時間値 200 以上 → 糖尿病型、空腹時 110 未満 かつ 2時間値 140 未満 → 正常型、それ以外は境界型 */
export function ogttType(fpg: number, pg2h: number): OgttType {
  if (fpg >= 126 || pg2h >= 200) return "dm";
  if (fpg < 110 && pg2h < 140) return "normal";
  return "border";
}
