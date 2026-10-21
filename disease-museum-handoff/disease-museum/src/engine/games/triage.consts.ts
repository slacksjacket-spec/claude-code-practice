// START法のトリアージ。TODO(review) 呼吸数（30回/分）・毛細血管再充満時間（2秒）の基準
export type Tag = "green" | "yellow" | "red" | "black";
export const TAG_LABEL: Record<Tag, string> = { green: "緑（III）", yellow: "黄（II）", red: "赤（I）", black: "黒（0）" };
export const TAGS: Tag[] = ["red", "yellow", "green", "black"];
export interface Pt { walks: boolean; breathes: boolean; rr: number; radial: boolean; crt: number; obeys: boolean }
/** 色と、その理由 */
export function start(p: Pt): [Tag, string] {
  if (p.walks) return ["green", "歩ける → 緑"];
  if (!p.breathes) return ["black", "気道を確保しても呼吸がない → 黒"];
  if (p.rr > 30) return ["red", "呼吸数が30回/分を超える → 赤"];
  if (!p.radial || p.crt > 2) return ["red", "橈骨動脈が触れない、または毛細血管再充満時間が2秒を超える → 赤"];
  if (!p.obeys) return ["red", "簡単な指示に従えない → 赤"];
  return ["yellow", "歩けないが、呼吸・循環・意識は保たれる → 黄"];
}
