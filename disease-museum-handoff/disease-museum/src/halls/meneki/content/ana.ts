// 抗核抗体の染色型（ホール専用 ana）。絵は模式。TODO(review) 染色型と抗体・疾患の対応
import type { AnaData } from "../exhibits/ana.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const anaContent: AnaData = {
  stampAt: 4,
  cases: [
    { ...M, id: "sle", story: "22歳 女性。頬の赤い発疹、関節痛、口内炎。", pattern: "homo",
      followUp: { question: "この型で疑う抗体は？", options: ["抗dsDNA抗体・抗ヒストン抗体", "抗セントロメア抗体", "抗Jo-1抗体", "抗CCP抗体"], answer: 0 },
      explanation: "核全体がべったり光る。DNAやヒストンに対する抗体。SLEや薬剤性ループス。" },
    { ...M, id: "drug", story: "65歳 男性。プロカインアミドを飲み始めて半年。発熱と関節痛、胸膜炎。腎炎はない。", pattern: "homo",
      followUp: { question: "考えるのは？", options: ["薬剤性ループス（抗ヒストン抗体）", "全身性強皮症", "皮膚筋炎", "Sjögren症候群"], answer: 0 },
      explanation: "ヒドララジン、プロカインアミド、イソニアジドなど。抗dsDNA抗体は陰性のことが多く、腎・中枢神経の症状は少ない。薬をやめれば治る。" },
    { ...M, id: "mctd", story: "35歳 女性。冷たいと指が白→紫→赤。手の指がソーセージのように腫れている。", pattern: "speckled",
      followUp: { question: "高い値で陽性になる抗体と病名は？", options: ["抗U1-RNP抗体（混合性結合組織病）", "抗dsDNA抗体（SLE）", "抗Scl-70抗体（強皮症）", "抗ARS抗体（多発性筋炎）"], answer: 0 },
      explanation: "細かい粒がたくさん。核の中の可溶性抗原（RNP、Sm、SS-A、SS-B）に対する抗体。MCTDは肺高血圧症に注意。" },
    { ...M, id: "crest", story: "60歳 女性。Raynaud現象、指先の皮膚が硬い。皮下の石灰沈着と毛細血管拡張。", pattern: "centro",
      followUp: { question: "考えるのは？", options: ["限局皮膚硬化型の全身性強皮症（CREST）", "SLE", "関節リウマチ", "皮膚筋炎"], answer: 0 },
      explanation: "同じ大きさの点がぱらぱら（40〜60個）。抗セントロメア抗体。皮膚の硬化は手先に限られ、遅れて肺高血圧症。" },
    { ...M, id: "ssc", story: "50歳 男性。皮膚の硬化が腕から胸へと広がってきた。息切れ。", pattern: "nucleolar",
      followUp: { question: "この病気で、血圧が急に上がり腎機能が悪くなったときの薬は？", options: ["ACE阻害薬", "大量のステロイド", "β遮断薬", "利尿薬だけ"], answer: 0 },
      explanation: "核小体が光る型は全身性強皮症に多い（抗RNAポリメラーゼIII抗体などで腎クリーゼ）。強皮症腎クリーゼはACE阻害薬。大量ステロイドは引き金になる。" },
    { ...M, id: "periph", story: "19歳 女性。むくみと蛋白尿。補体が低い。", pattern: "periph",
      followUp: { question: "この型が示す抗体は？", options: ["抗dsDNA抗体", "抗セントロメア抗体", "抗SS-B抗体", "抗Jo-1抗体"], answer: 0 },
      explanation: "核の縁が輪のように光る。抗dsDNA抗体でSLE（ループス腎炎）に特徴的。" },
    { ...M, id: "sjs", story: "55歳 女性。目と口がひどく乾く。両側の耳下腺が腫れる。", pattern: "speckled",
      followUp: { question: "陽性になりやすい抗体は？", options: ["抗SS-A抗体・抗SS-B抗体", "抗CCP抗体", "抗GBM抗体", "抗TSH受容体抗体"], answer: 0 },
      explanation: "Sjögren症候群。抗SS-A抗体の母からの出生児は先天性房室ブロックに注意。悪性リンパ腫の合併も。" },
  ],
};
