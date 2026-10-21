// 輸液ポンプ計算（ホール専用 infusionCalc）。症例は架空。TODO(review)
import type { CalcData } from "../exhibits/calc.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const calcContent: CalcData = {
  stampAt: 4,
  cases: [
    { ...M, id: "m15", story: "4歳 男児。絶食で入院。", kind: "maint", weight: 15, question: "維持輸液の速度は？（4-2-1ルール）", explanation: "40＋2×5＝50 mL/時。" },
    { ...M, id: "m60", story: "成人。手術前の絶飲食。", kind: "maint", weight: 60, question: "維持輸液の速度は？（4-2-1ルール）", explanation: "40＋20＋1×40＝100 mL/時。" },
    { ...M, id: "d25", story: "8歳 女児。", kind: "daily", weight: 25, question: "1日の維持輸液量は？", explanation: "1,000＋500＋20×5＝1,600 mL/日。" },
    { ...M, id: "dr20", story: "輸液ポンプがない病棟。", kind: "drops", mlh: 120, set: 20, question: "1分間に何滴で落とす？", explanation: "成人用（20滴＝1 mL）なら mL/時 ÷ 3。" },
    { ...M, id: "dr60", story: "小児用の輸液セットを使う。", kind: "drops", mlh: 30, set: 60, question: "1分間に何滴で落とす？", explanation: "小児用（60滴＝1 mL）なら mL/時 と同じ数。" },
    { ...M, id: "fw", story: "80歳 男性。脱水で意識がぼんやり。高Na血症。", kind: "freeWater", weight: 70, na: 160, tbwRatio: 0.6, question: "自由水の欠乏量はおよそ？", explanation: "70×0.6＝42 L、42×（160÷140−1）＝6.0 L。高齢者や女性は係数を0.5にすることも。急に下げすぎない。" },
    { ...M, id: "na", story: "慢性の低Na血症の患者。けいれんはない。", kind: "naLimit", na: 110, question: "最初の24時間で、Naをどこまで上げてよい？（上限）", explanation: "急な補正は浸透圧性脱髄症候群（橋中心髄鞘崩壊）を起こす。" },
  ],
};
