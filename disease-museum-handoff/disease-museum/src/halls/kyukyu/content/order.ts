// 順番に並べよ（共通ゲーム order）。TODO(review) JRC蘇生ガイドライン、JATEC
import type { OrderData } from "../../../engine/games/order.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const orderContent: OrderData = {
  stampAt: 3,
  cases: [
    { ...M, id: "bls", prompt: "倒れた人を見つけた。一次救命処置の順は？", ends: ["先", "後"], items: ["周りの安全を確認", "肩をたたいて反応を見る", "助けを呼び、119番とAEDを頼む", "呼吸を見る（10秒以内）", "胸骨圧迫を始める", "AEDが来たら電極を貼る"],
      explanation: "普段どおりの呼吸がなければ（わからなくても）すぐに胸骨圧迫。強く（約5 cm）、速く（100〜120回/分）、絶え間なく。" },
    { ...M, id: "abcde", prompt: "外傷の初期診療（Primary survey）の順は？", ends: ["先", "後"], items: ["A：気道（頸椎を守りながら）", "B：呼吸", "C：循環（止血）", "D：意識・神経", "E：脱衣と体温"],
      explanation: "命にかかわる順に見て、見つけたらその場で処置。" },
    { ...M, id: "burn", prompt: "化学物質を浴びた人への対応の順は？", ends: ["先", "後"], items: ["自分を守る（防護具）", "服を脱がせる", "大量の水で洗う", "病院で評価と治療"],
      explanation: "除染が先。救助者が二次被害にあわないように。" },
  ],
};
