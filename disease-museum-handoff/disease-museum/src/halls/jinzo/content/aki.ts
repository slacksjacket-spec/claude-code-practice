// 急性腎障害の3分類（共通ゲーム grid）。TODO(review) FENa・尿浸透圧の目安と対応
import type { GridData } from "../../../engine/games/grid.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const akiContent: GridData = {
  rowLabels: ["急性腎障害"],
  colLabels: ["腎前性", "腎性", "腎後性"],
  cells: [
    { id: "pre", row: 0, col: 0, label: "腎前性", sub: "腎臓への血流が足りない" },
    { id: "intra", row: 0, col: 1, label: "腎性", sub: "腎臓そのものが壊れた" },
    { id: "post", row: 0, col: 2, label: "腎後性", sub: "尿の出口がつまった" },
  ],
  question: "どの型？",
  treatQuestion: "まずすることは？",
  treatments: ["輸液で循環血液量を補う", "原因を取り除き、体液・電解質を管理する（必要なら透析）", "閉塞を解除する（尿道カテーテル・腎瘻など）"],
  stampAt: 4,
  cases: [
    { ...M, id: "dehyd", who: "85歳 女性", signs: ["数日の嘔吐と下痢", "口が乾いている", "尿Na 10 mEq/L", "FENa 0.5%", "尿浸透圧 600", "エコーで水腎症なし"], cell: "pre", treatment: 0,
      explanation: "腎臓はNaと水を必死に再吸収している（FENa 1%未満、尿が濃い）。輸液で戻る。" },
    { ...M, id: "atn", who: "68歳 男性", signs: ["大手術で長時間の低血圧", "泥のような茶色の円柱", "尿Na 50 mEq/L", "FENa 3%", "尿浸透圧 300"], cell: "intra", treatment: 1,
      explanation: "急性尿細管壊死。尿細管が壊れてNaを再吸収できない（FENa 2%超、尿は薄い）。" },
    { ...M, id: "contrast", who: "60歳 男性", signs: ["造影CTの2日後からクレアチニン上昇", "糖尿病性腎臓病", "FENa 2.5%"], cell: "intra", treatment: 1,
      explanation: "造影剤腎症。脱水を避け、予防の輸液。腎毒性のある薬も見直す。" },
    { ...M, id: "bph", who: "78歳 男性", signs: ["数日おしっこが出にくい", "下腹部が張って痛い", "エコーで両側の水腎症と膀胱の拡張"], cell: "post", treatment: 2,
      explanation: "前立腺肥大による尿閉。尿道カテーテルで閉塞を解除する。解除後の多尿に注意。" },
    { ...M, id: "nsaid", who: "75歳 女性", signs: ["心不全でACE阻害薬と利尿薬", "腰痛でNSAIDsを追加", "FENa 0.4%"], cell: "pre", treatment: 0,
      explanation: "腎血流を保つしくみ（プロスタグランジン、アンジオテンシンII）が薬で止められ、腎前性になる。原因薬の中止と体液の調整。" },
    { ...M, id: "rhabdo", who: "30歳 男性", signs: ["熱中症で倒れていた", "コーラ色の尿", "尿潜血陽性なのに沈渣で赤血球が少ない", "CK 80,000"], cell: "intra", treatment: 1,
      explanation: "横紋筋融解のミオグロビンによる尿細管障害。大量の輸液で尿量を保つ（ここでは「腎性」として原因除去と体液管理）。" },
  ],
};
