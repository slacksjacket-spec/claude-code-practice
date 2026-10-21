// 2×2表の計算。表は [a, b, c, d]（上の行が a b、下の行が c d）
export type Design = "cohort" | "rct" | "casecontrol" | "test";
export type Ask = "rr" | "or" | "ard" | "nnt" | "sens" | "spec" | "ppv" | "npv";
export const ASK_LABEL: Record<Ask, string> = { rr: "相対危険", or: "オッズ比", ard: "寄与危険（リスク差）", nnt: "治療必要数（NNT）", sens: "感度", spec: "特異度", ppv: "陽性的中率", npv: "陰性的中率" };
export const ALLOWED: Record<Design, Ask[]> = { cohort: ["rr", "or", "ard"], rct: ["rr", "ard", "nnt"], casecontrol: ["or"], test: ["sens", "spec", "ppv", "npv"] };
export const HEAD: Record<Design, { rows: [string, string]; cols: [string, string] }> = {
  cohort: { rows: ["曝露あり", "曝露なし"], cols: ["発症", "発症せず"] },
  rct: { rows: ["治療群", "対照群"], cols: ["イベントあり", "イベントなし"] },
  casecontrol: { rows: ["曝露あり", "曝露なし"], cols: ["症例", "対照"] },
  test: { rows: ["検査陽性", "検査陰性"], cols: ["病気あり", "病気なし"] },
};
const f2 = (v: number) => (Math.round(v * 100) / 100).toString();
const pc = (v: number) => `${Math.round(v * 1000) / 10}%`;
/** 正解の表示と、まちがえやすい計算の表示 */
export function solve(ask: Ask, [a, b, c, d]: number[]): { ans: string; wrong: string[]; how: string } {
  const r1 = a / (a + b), r0 = c / (c + d);
  switch (ask) {
    case "rr": return { ans: f2(r1 / r0), wrong: [f2((a * d) / (b * c)), f2(r0 / r1), f2((a / (a + c)) / (b / (b + d)))], how: "相対危険 ＝ {a/(a+b)} ÷ {c/(c+d)}（曝露群の発症率 ÷ 非曝露群の発症率）" };
    case "or": return { ans: f2((a * d) / (b * c)), wrong: [f2(r1 / r0), f2((b * c) / (a * d)), f2((a * b) / (c * d))], how: "オッズ比 ＝ (a×d) ÷ (b×c)" };
    case "ard": return { ans: pc(Math.abs(r1 - r0)), wrong: [pc(r1), pc(r0), pc(Math.abs(r1 - r0) / r0)], how: "寄与危険 ＝ a/(a+b) − c/(c+d)（2群の発症率の差）" };
    case "nnt": { const n = Math.ceil(1 / Math.abs(r1 - r0)); return { ans: `${n}人`, wrong: [`${Math.ceil(1 / r0)}人`, `${Math.ceil(1 / r1)}人`, `${Math.max(1, Math.round(n / 2))}人`], how: "NNT ＝ 1 ÷ リスク差（切り上げ）" }; }
    case "sens": return { ans: pc(a / (a + c)), wrong: [pc(a / (a + b)), pc(d / (b + d)), pc(d / (c + d))], how: "感度 ＝ a ÷ (a+c)（病気の人のうち陽性の割合）" };
    case "spec": return { ans: pc(d / (b + d)), wrong: [pc(d / (c + d)), pc(a / (a + c)), pc(b / (b + d))], how: "特異度 ＝ d ÷ (b+d)（病気でない人のうち陰性の割合）" };
    case "ppv": return { ans: pc(a / (a + b)), wrong: [pc(a / (a + c)), pc(d / (c + d)), pc(b / (a + b))], how: "陽性的中率 ＝ a ÷ (a+b)（陽性の人のうち本当に病気の割合）" };
    case "npv": return { ans: pc(d / (c + d)), wrong: [pc(d / (b + d)), pc(a / (a + b)), pc(c / (c + d))], how: "陰性的中率 ＝ d ÷ (c+d)（陰性の人のうち本当に病気でない割合）" };
  }
}
