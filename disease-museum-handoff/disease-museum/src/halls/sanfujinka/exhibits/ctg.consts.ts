// 胎児心拍数陣痛図（CTG）の合成。波形は模式（実際の記録ではない）。TODO(review) 各パターンの形
export type Variability = "absent" | "minimal" | "moderate" | "marked";
export type Decel = "none" | "early" | "late" | "variable" | "prolonged";
export const DECEL_LABEL: Record<Decel, string> = { none: "一過性徐脈なし", early: "早発一過性徐脈", late: "遅発一過性徐脈", variable: "変動一過性徐脈", prolonged: "遷延一過性徐脈" };
export const DECEL_IDS = Object.keys(DECEL_LABEL) as Decel[];
export interface CtgParams { baseline: number; variability: Variability; accel: boolean; decel: Decel; sinusoidal?: boolean }

const SEC = 600; // 10分
const AMP: Record<Variability, number> = { absent: 0.6, minimal: 3, moderate: 9, marked: 20 };

/** 1秒ごとの FHR と子宮収縮（UC）。乱数は呼び出し側の Math.random を使う */
export function synthCtg(p: CtgParams) {
  const uc: number[] = [], fhr: number[] = [];
  const peaks = [70, 250, 430].map((t) => t + Math.random() * 30); // 約3分ごとの収縮
  for (let t = 0; t < SEC; t++) uc.push(10 + peaks.reduce((a, c) => a + 55 * Math.exp(-(((t - c) / 22) ** 2)), 0));
  // 細かい変動：ランダムウォークを平滑化
  let w = 0, s = 0;
  const amp = p.sinusoidal ? 0.3 : AMP[p.variability];
  for (let t = 0; t < SEC; t++) {
    w += (Math.random() - 0.5) * amp * 0.9; w *= 0.9; s = s * 0.6 + w * 0.4;
    let v = p.baseline + s * 1.6;
    if (p.sinusoidal) v += 10 * Math.sin((2 * Math.PI * t) / 20);
    fhr.push(v);
  }
  const add = (center: number, width: number, depth: number, shape: "smooth" | "v") => {
    for (let t = 0; t < SEC; t++) {
      const x = (t - center) / width;
      const f = shape === "smooth" ? Math.exp(-(x ** 2)) : Math.max(0, 1 - Math.abs(x)) ** 0.6;
      fhr[t] -= depth * f;
    }
  };
  if (p.accel && !p.sinusoidal) [150, 340, 520].forEach((c) => add(c + Math.random() * 20, 9, -22, "smooth"));
  if (p.decel === "early") peaks.forEach((c) => add(c, 22, 18, "smooth"));
  if (p.decel === "late") peaks.forEach((c) => add(c + 32, 22, 20, "smooth"));
  if (p.decel === "variable") peaks.forEach((c, i) => add(c - 8 + i * 12, 14, 45 + Math.random() * 15, "v"));
  if (p.decel === "prolonged") for (let t = 260; t < 470; t++) fhr[t] -= 45 * Math.min(1, (t - 260) / 25, (470 - t) / 30);
  return { fhr, uc };
}
