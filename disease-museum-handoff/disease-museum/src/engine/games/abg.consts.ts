// 血液ガスの読み方（zod を使わない。ブラウザ側と検証の両方から使う）
// TODO(review) 正常範囲と代償の予測式は教科書的な近似（施設・教科書で値が少しちがう）
export const PRIMARY = ["呼吸性アシドーシス", "呼吸性アルカローシス", "代謝性アシドーシス", "代謝性アルカローシス"] as const;
export type Primary = (typeof PRIMARY)[number];
export interface Gas { pH: number; PaCO2: number; HCO3: number; PaO2?: number; Na?: number; Cl?: number }

export const emia = (g: Gas) => (g.pH < 7.35 ? "アシデミア" : g.pH > 7.45 ? "アルカレミア" : "pHは正常範囲");

/** 一次性の障害（pH の向きと、それを説明できる側） */
export function primaryOf(g: Gas): Primary {
  if (g.pH < 7.4) return g.PaCO2 > 45 ? "呼吸性アシドーシス" : "代謝性アシドーシス";
  return g.PaCO2 < 35 ? "呼吸性アルカローシス" : "代謝性アルカローシス";
}

/** 代償の予測（[下限, 上限]）。呼吸性は急性/慢性で変わる */
export function expected(g: Gas, chronic = false): { what: "PaCO2" | "HCO3"; range: [number, number]; formula: string } {
  const p = primaryOf(g);
  if (p === "代謝性アシドーシス") { const c = 1.5 * g.HCO3 + 8; return { what: "PaCO2", range: [c - 2, c + 2], formula: `予測PaCO₂ ＝ 1.5×HCO₃⁻＋8 ±2 ＝ ${(c - 2).toFixed(0)}〜${(c + 2).toFixed(0)}（Winterの式）` }; }
  if (p === "代謝性アルカローシス") { const c = 40 + 0.7 * (g.HCO3 - 24); return { what: "PaCO2", range: [c - 3, c + 3], formula: `予測PaCO₂ ≒ 40＋0.7×(HCO₃⁻−24) ±3 ＝ ${(c - 3).toFixed(0)}〜${(c + 3).toFixed(0)}` }; }
  const d = g.PaCO2 - 40;
  const k = p === "呼吸性アシドーシス" ? (chronic ? 0.35 : 0.1) : chronic ? 0.5 : 0.2;
  const c = 24 + k * d;
  return { what: "HCO3", range: [c - 2, c + 2], formula: `予測HCO₃⁻ ≒ 24＋${k}×(PaCO₂−40) ±2 ＝ ${(c - 2).toFixed(0)}〜${(c + 2).toFixed(0)}（${chronic ? "慢性" : "急性"}）` };
}
export const compensated = (g: Gas, chronic = false) => { const e = expected(g, chronic), v = e.what === "PaCO2" ? g.PaCO2 : g.HCO3; return v >= e.range[0] && v <= e.range[1]; };
export const anionGap = (g: Gas) => (g.Na !== undefined && g.Cl !== undefined ? g.Na - g.Cl - g.HCO3 : null);
export const AG_HIGH = 12; // これを超えたら開大（アルブミン補正は省略）
