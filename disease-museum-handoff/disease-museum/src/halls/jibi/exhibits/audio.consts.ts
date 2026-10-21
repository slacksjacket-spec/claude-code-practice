// オージオグラムの判定。TODO(review) 閾値（25 dB）と気骨導差（15 dB）
export const AIR_F = [125, 250, 500, 1000, 2000, 4000, 8000];
export const BONE_F = [250, 500, 1000, 2000, 4000];
export type HlType = "normal" | "conductive" | "sensorineural" | "mixed";
export const HL_LABEL: Record<HlType, string> = { normal: "正常", conductive: "伝音難聴", sensorineural: "感音難聴", mixed: "混合難聴" };
/** どこかの気導が25 dBを超えれば難聴。骨導の周波数で平均した気骨導差が15 dB以上なら伝音の成分、骨導が25 dBを超えれば感音の成分 */
export function hlType(air: number[], bone: number[]): HlType {
  if (!air.some((v) => v > 25)) return "normal";
  const gap = BONE_F.reduce((a, f, i) => a + (air[AIR_F.indexOf(f)] - bone[i]), 0) / BONE_F.length >= 15;
  const sn = bone.some((v) => v > 25);
  return gap ? (sn ? "mixed" : "conductive") : "sensorineural";
}
