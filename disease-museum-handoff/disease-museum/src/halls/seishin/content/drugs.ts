// 薬の副作用の4マス（共通ゲーム grid）。TODO(review) 各症例の分類と治療
import type { GridData } from "../../../engine/games/grid.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const drugsContent: GridData = {
  rowLabels: ["副作用"],
  colLabels: ["悪性症候群", "セロトニン症候群", "リチウム中毒", "錐体外路症状"],
  cells: [
    { id: "nms", row: 0, col: 0, label: "悪性症候群" },
    { id: "ss", row: 0, col: 1, label: "セロトニン症候群" },
    { id: "li", row: 0, col: 2, label: "リチウム中毒" },
    { id: "eps", row: 0, col: 3, label: "錐体外路症状" },
  ],
  question: "どの副作用？",
  treatQuestion: "対応は？",
  treatments: ["原因薬を中止し、冷却・輸液、ダントロレン", "原因薬を中止し、シプロヘプタジン", "リチウムを中止し、輸液、重ければ血液透析", "抗コリン薬（ビペリデン）か原因薬の減量"],
  stampAt: 4,
  cases: [
    { ...M, id: "nms", who: "30歳 男性", signs: ["ハロペリドールを増やした数日後", "40℃の発熱", "筋肉がこわばる", "CK 15,000"], cell: "nms", treatment: 0,
      explanation: "ドパミン遮断による。数日かけて起こり、筋強剛と高CK。パーキンソン病の薬を急にやめても起こる。" },
    { ...M, id: "ss", who: "45歳 女性", signs: ["SSRIにトラマドールを追加", "数時間で発汗・下痢", "ミオクローヌス・反射亢進", "散瞳"], cell: "ss", treatment: 1,
      explanation: "数時間で急に起こる。筋の症状はミオクローヌスや反射亢進（悪性症候群は鉛管様の固縮）。" },
    { ...M, id: "li", who: "60歳 男性", signs: ["双極性障害でリチウム内服", "最近NSAIDsとサイアザイドを開始", "粗いふるえ・下痢・ぼんやり"], cell: "li", treatment: 2,
      explanation: "NSAIDs・利尿薬・ACE阻害薬・脱水でリチウム濃度が上がる。治療域が狭いので血中濃度を測る。" },
    { ...M, id: "dystonia", who: "18歳 男性", signs: ["抗精神病薬を始めた翌日", "目が上を向いたまま戻らない", "首がねじれる"], cell: "eps", treatment: 3,
      explanation: "急性ジストニア。抗コリン薬の注射ですぐよくなる。" },
    { ...M, id: "akathisia", who: "35歳 女性", signs: ["抗精神病薬を始めて1週間", "じっとしていられず歩き回る"], cell: "eps", treatment: 3,
      explanation: "アカシジア。症状の悪化と見誤らない。減量やβ遮断薬など。" },
    { ...M, id: "nms2", who: "70歳 男性", signs: ["パーキンソン病の薬を急にやめた", "高熱・意識障害", "強い固縮", "CK上昇"], cell: "nms", treatment: 0,
      explanation: "ドパミン作動薬の中断でも悪性症候群と同じ状態が起こる。薬を再開。" },
  ],
};
