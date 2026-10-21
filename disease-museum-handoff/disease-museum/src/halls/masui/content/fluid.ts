// 輸液のゆくえ（ホール専用 fluidSpace）。TODO(review) 各製剤の使い分け
import type { FluidData } from "../exhibits/fluid.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const fluidContent: FluidData = {
  stampAt: 4,
  cases: [
    { ...M, id: "ns", story: "交通外傷で血圧が下がっている。まず細胞外液を急速に入れる。", product: "ns",
      followUp: { question: "生理食塩水を大量に入れると起こりやすいのは？", options: ["高Cl性の代謝性アシドーシス", "低Na血症", "代謝性アルカローシス", "高K血症"], answer: 0 },
      explanation: "細胞外液と同じ濃さなので細胞内には入らず、血管内に1/4ほど残る。Clが多いので大量だとアシドーシスに。" },
    { ...M, id: "g5", story: "高Na血症で、水だけを補いたい。", product: "g5",
      followUp: { question: "5%ブドウ糖液を出血の補充に使わない理由は？", options: ["ブドウ糖は代謝され、水は体じゅう（多くは細胞内）に広がって血管内に残らない", "高カリウム血症になる", "浸透圧が高すぎる", "アルブミンを含むから"], answer: 0 },
      explanation: "ブドウ糖はすぐ代謝されて自由水になる。血管内に残るのは1/12ほど。" },
    { ...M, id: "s3", story: "腸閉塞で絶食中の成人。1日の水分と電解質を補う。", product: "s3",
      followUp: { question: "3号液（維持液）の役割は？", options: ["1日に必要な水・Na・Kを補う", "出血性ショックの急速補液", "高K血症の治療", "低Na血症の急速補正"], answer: 0 },
      explanation: "Naが薄くKを含む。大量・急速には入れない。低Na血症の患者では注意。" },
    { ...M, id: "s1", story: "脱水の幼児。まだ尿が出るか、腎機能がわからない。", product: "s1",
      followUp: { question: "1号液（開始液）がまず使われる理由は？", options: ["Kを含まないので、腎機能がわからなくても使いやすい", "Kが多く低K血症を治すため", "アルブミンを含むため", "浸透圧が最も高いため"], answer: 0 },
      explanation: "尿が出るのを確かめてからKを含む輸液へ。" },
    { ...M, id: "lr", story: "手術中に、出血や不感蒸泄を補う。", product: "lr",
      followUp: { question: "乳酸リンゲル液の乳酸はどうなる？", options: ["肝臓で重炭酸に変わり、アシドーシスを打ち消す", "そのまま尿に出る", "血液を酸性にする", "筋肉にたまる"], answer: 0 },
      explanation: "生理食塩水よりClが少なく、細胞外液により近い。重い肝不全では乳酸を処理しにくい。" },
    { ...M, id: "alb", story: "肝硬変で大量に腹水を抜いた。", product: "alb",
      followUp: { question: "アルブミン製剤が血管内にとどまる理由は？", options: ["大きな分子で膠質浸透圧があり、血管の外へ出にくい", "細胞内に入るから", "すぐ尿に出るから", "Naを含まないから"], answer: 0 },
      explanation: "膠質液は（血管の壁が保たれていれば）血管内にとどまりやすい。ここでは単純化して全部残るとした。" },
  ],
};
