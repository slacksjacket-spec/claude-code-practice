// スパイロメトリー判定（共通ゲーム grid）。TODO(review) 基準値（%肺活量80%、1秒率70%）
import type { GridData } from "../../../engine/games/grid.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const spiroContent: GridData = {
  rowLabels: ["%肺活量 80%以上", "%肺活量 80%未満"],
  colLabels: ["1秒率 70%以上", "1秒率 70%未満"],
  cells: [
    { id: "normal", row: 0, col: 0, label: "正常" },
    { id: "obst", row: 0, col: 1, label: "閉塞性換気障害", sub: "息を速く吐き出せない" },
    { id: "rest", row: 1, col: 0, label: "拘束性換気障害", sub: "肺がふくらまない" },
    { id: "mixed", row: 1, col: 1, label: "混合性換気障害" },
  ],
  question: "換気障害の型は？",
  stampAt: 4,
  cases: [
    { ...M, id: "copd", who: "70歳 男性・喫煙50年", signs: ["%肺活量 86%", "1秒率 48%", "気管支拡張薬のあとも1秒率 70%未満"], cell: "obst",
      explanation: "気管支拡張薬を吸入しても1秒率が70%未満なら、COPDの診断の基準をみたす。" },
    { ...M, id: "asthma", who: "25歳 女性・夜の咳と喘鳴", signs: ["%肺活量 92%", "1秒率 62%", "吸入後に1秒量が15%・300mL増えた"], cell: "obst",
      explanation: "閉塞性で、気道可逆性がある。気管支喘息。発作のないときは正常のこともある。" },
    { ...M, id: "ipf", who: "68歳 男性・乾いた咳と労作時の息切れ", signs: ["%肺活量 62%", "1秒率 88%", "両下肺の捻髪音", "拡散能の低下"], cell: "rest",
      explanation: "肺が硬くなってふくらまない。間質性肺炎（特発性肺線維症）。1秒率はむしろ高くなる。" },
    { ...M, id: "als", who: "60歳 女性・手足の筋力低下", signs: ["%肺活量 55%", "1秒率 86%", "肺の画像は正常"], cell: "rest",
      explanation: "呼吸筋の筋力低下（筋萎縮性側索硬化症など）でも拘束性になる。肺そのものは正常。" },
    { ...M, id: "tb", who: "80歳 男性・若い頃に肺結核と胸郭形成術", signs: ["%肺活量 54%", "1秒率 58%"], cell: "mixed",
      explanation: "肺結核後遺症は、胸郭の変形・胸膜の癒着（拘束性）と気道の障害（閉塞性）が重なりやすい。" },
    { ...M, id: "normal", who: "45歳 女性・健診", signs: ["%肺活量 98%", "1秒率 81%"], cell: "normal",
      explanation: "どちらも基準をみたしている。" },
    { ...M, id: "obese", who: "50歳 男性・高度肥満（BMI 42）", signs: ["%肺活量 74%", "1秒率 82%"], cell: "rest",
      explanation: "胸郭・横隔膜の動きが制限されて拘束性になる（肥満低換気症候群）。" },
  ],
};
