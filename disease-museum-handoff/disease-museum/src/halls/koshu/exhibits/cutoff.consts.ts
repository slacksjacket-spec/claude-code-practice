// カットオフと2×2表の計算。分布は正規分布の模式
export type Metric = "sens" | "spec" | "ppv" | "npv";
export const METRIC_LABEL: Record<Metric, string> = { sens: "感度", spec: "特異度", ppv: "陽性的中率", npv: "陰性的中率" };
export interface Dist { mu1: number; s1: number; mu0: number; s0: number; prev: number } // 1が病気あり、0がなし
function erf(x: number) { // Abramowitz-Stegun 7.1.26
  const t = 1 / (1 + 0.3275911 * Math.abs(x)), y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return x >= 0 ? y : -y;
}
const above = (c: number, mu: number, s: number) => 0.5 * (1 - erf((c - mu) / (s * Math.SQRT2)));
/** 1万人あたりの2×2表と4つの指標。値がカットオフ以上なら陽性 */
export function table(d: Dist, c: number, n = 10000) {
  const D = n * d.prev, H = n - D, tp = D * above(c, d.mu1, d.s1), fp = H * above(c, d.mu0, d.s0), fn = D - tp, tn = H - fp;
  return { tp, fp, fn, tn, sens: tp / D, spec: tn / H, ppv: tp + fp ? tp / (tp + fp) : 0, npv: tn + fn ? tn / (tn + fn) : 1 };
}
/** need を満たすカットオフのうち、maximize が最大のもの */
export function best(d: Dist, need: Metric, min: number, maximize: Metric) {
  let b: { c: number; v: number } | null = null;
  for (let c = 0; c <= 100; c += 0.5) { const t = table(d, c); if (t[need] >= min && (!b || t[maximize] > b.v)) b = { c, v: t[maximize] }; }
  return b;
}
export const density = (x: number, mu: number, s: number) => Math.exp(-(((x - mu) / s) ** 2) / 2) / (s * Math.sqrt(2 * Math.PI));
