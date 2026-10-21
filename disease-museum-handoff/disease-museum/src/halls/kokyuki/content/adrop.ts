// 市中肺炎の重症度 A-DROP（ScoreAttack）。値は毎回生成。TODO(review) 各項目の基準値（年齢 男70/女75、BUN 21、SpO₂ 90、収縮期 90）
import type { ExhibitOf } from "../../../engine/schema";

const g = (min: number, max: number, digits = 0) => ({ min, max, digits });

export const adropContent: ExhibitOf<"ScoreAttack">["data"] = {
  scoreName: "A-DROP",
  instructions: "当てはまる項目をタップ → 重症度を判定",
  timeLimitSec: 30,
  stampAt: 2,
  positiveRate: 0.35,
  severeAt: 3,
  items: [
    { name: "Age（年齢）", positive: { gen: g(76, 92), display: "男性 {v}歳" }, negative: { gen: g(35, 68), display: "男性 {v}歳" } },
    { name: "Dehydration（BUN）", positive: { gen: g(21, 45), display: "BUN {v} mg/dL" }, negative: { gen: g(8, 19), display: "BUN {v} mg/dL" } },
    { name: "Respiration（SpO₂）", positive: { gen: g(82, 90), display: "SpO₂ {v}%" }, negative: { gen: g(93, 99), display: "SpO₂ {v}%" } },
    { name: "Orientation（意識）", positive: { gen: g(1, 3), display: "意識障害（JCS {v}）" }, negative: { gen: g(0, 0), display: "意識清明" } },
    { name: "Pressure（収縮期血圧）", positive: { gen: g(70, 90), display: "{v}/50 mmHg" }, negative: { gen: g(108, 150), display: "{v}/70 mmHg" } },
  ],
  explanation: "A-DROPは5項目で各1点。0点は外来、1〜2点は外来か入院、3点は入院（重症）、4〜5点はICU（超重症）。このゲームでは3点以上を「重症」とする。",
  missQuestion: { q: "A-DROPで「重症（入院）」とするのは何点以上？", opts: ["2点以上", "3点以上", "4点以上"], ans: "3点以上" },
};
