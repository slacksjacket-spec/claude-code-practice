// 輸液の計算。TODO(review) 4-2-1ルール、Holliday-Segar、自由水欠乏量（体液量の係数）、Na補正の上限（10 mEq/L/日）
export type CalcKind = "maint" | "daily" | "drops" | "freeWater" | "naLimit";
export interface CalcIn { kind: CalcKind; weight?: number; mlh?: number; set?: 20 | 60; na?: number; tbwRatio?: number }
const r1 = (x: number) => Math.round(x * 10) / 10;
export function maint(w: number) { return w <= 10 ? 4 * w : w <= 20 ? 40 + 2 * (w - 10) : 60 + (w - 20); }
export function daily(w: number) { return w <= 10 ? 100 * w : w <= 20 ? 1000 + 50 * (w - 10) : 1500 + 20 * (w - 20); }
/** 答え（数値）と単位、まちがいやすい答え3つ */
export function solve(c: CalcIn): { ans: number; unit: string; wrong: number[]; how: string } {
  switch (c.kind) {
    case "maint": { const w = c.weight!, a = maint(w); return { ans: a, unit: "mL/時", wrong: [4 * w, 2 * w + 20, daily(w) / 24 + 30].map(Math.round), how: `4-2-1ルール：最初の10 kgは4、次の10 kgは2、それ以上は1 mL/kg/時` }; }
    case "daily": { const w = c.weight!, a = daily(w); return { ans: a, unit: "mL/日", wrong: [100 * w, 50 * w, maint(w) * 10], how: `最初の10 kgは100、次の10 kgは50、それ以上は20 mL/kg/日` }; }
    case "drops": { const a = Math.round((c.mlh! * c.set!) / 60); return { ans: a, unit: "滴/分", wrong: [c.mlh!, Math.round(c.mlh! / 60), Math.round((c.mlh! * (c.set === 20 ? 60 : 20)) / 60)], how: `滴/分 ＝ mL/時 × (1 mLあたりの滴数 ${c.set}) ÷ 60` }; }
    case "freeWater": { const tbw = c.weight! * c.tbwRatio!, a = r1(tbw * (c.na! / 140 - 1)); return { ans: a, unit: "L", wrong: [r1(c.weight! * (c.na! / 140 - 1)), r1(tbw * (c.na! - 140) / 100), r1(a * 2)], how: `自由水欠乏量 ＝ 体液量（体重×${c.tbwRatio}）×（Na÷140 − 1）` }; }
    case "naLimit": { const a = c.na! + 10; return { ans: a, unit: "mEq/L", wrong: [c.na! + 20, c.na! + 30, 135], how: `慢性の低Na血症は、最初の24時間の上昇を10 mEq/L以内に（浸透圧性脱髄症候群を防ぐ。高リスクでは8）` }; }
  }
}
