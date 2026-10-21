// 視力低下の4マス（共通ゲーム grid）。TODO(review) 各症例の分類
import type { GridData } from "../../../engine/games/grid.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const visionContent: GridData = {
  rowLabels: ["急に", "ゆっくり"],
  colLabels: ["痛みあり", "痛みなし"],
  cells: [
    { id: "aPain", row: 0, col: 0, label: "急・痛い", sub: "急性緑内障・角膜炎" },
    { id: "aNo", row: 0, col: 1, label: "急・痛くない", sub: "血管の閉塞・網膜剝離・出血" },
    { id: "sNo", row: 1, col: 1, label: "ゆっくり・痛くない", sub: "白内障・緑内障・黄斑変性" },
  ],
  question: "どのマス？",
  stampAt: 4,
  cases: [
    { ...M, id: "crao", who: "70歳 男性", signs: ["心房細動", "右目が突然まったく見えなくなった", "痛みなし"], cell: "aNo",
      explanation: "網膜中心動脈閉塞症。眼の脳梗塞。発症直後なら眼球マッサージや前房穿刺も。" },
    { ...M, id: "rd", who: "55歳 男性", signs: ["強い近視", "飛蚊症と光が走る", "下からカーテンが上がってくる", "痛みなし"], cell: "aNo",
      explanation: "裂孔原性網膜剝離。手術が必要。" },
    { ...M, id: "aacg", who: "70歳 女性", signs: ["急な眼痛と頭痛", "吐き気", "角膜が濁る"], cell: "aPain",
      explanation: "急性閉塞隅角緑内障。片頭痛やくも膜下出血と間違えやすい。" },
    { ...M, id: "keratitis", who: "22歳 女性", signs: ["コンタクトレンズをつけたまま寝た", "強い痛みと充血", "角膜に白い濁り"], cell: "aPain",
      explanation: "細菌性角膜炎（緑膿菌が多い）。アカントアメーバにも注意。" },
    { ...M, id: "cataract", who: "80歳 女性", signs: ["年単位でかすむ", "まぶしい", "痛みなし"], cell: "sNo",
      explanation: "白内障。" },
    { ...M, id: "poag", who: "60歳 男性", signs: ["気づかないうちに視野が狭くなった", "痛みなし", "乳頭陥凹の拡大"], cell: "sNo",
      explanation: "開放隅角緑内障。自覚が遅く、健診での発見が大事。日本の中途失明の主な原因。" },
    { ...M, id: "gca", who: "78歳 女性", signs: ["こめかみの痛み", "あご跛行", "急に片目が見えない"], cell: "aPain",
      explanation: "巨細胞性動脈炎による虚血性視神経症。頭痛を伴う。すぐにステロイド。" },
  ],
};
