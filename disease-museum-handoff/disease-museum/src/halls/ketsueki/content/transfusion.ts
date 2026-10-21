// 輸血バッグ（ホール専用 transfusion）。症例は架空。TODO(review) 緊急時の扱い、Rh陰性女性への配慮
import type { TransfusionData } from "../exhibits/transfusion.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const transfusionContent: TransfusionData = {
  stampAt: 4,
  cases: [
    { ...M, id: "a-rbc", story: "消化管出血。Hb 6。A型 Rh＋。赤血球を入れたい。", recipient: "A+", product: "rbc",
      explanation: "受血者がもつ抗体（A型なら抗B）に当たらない赤血球＝O型かA型。Rh＋ならRh−も入れられる。原則は同型。" },
    { ...M, id: "o-rbc", story: "手術中の出血。O型 Rh＋。", recipient: "O+", product: "rbc",
      explanation: "O型の人は抗Aと抗Bの両方をもつので、O型の赤血球しか入れられない。" },
    { ...M, id: "abneg-rbc", story: "AB型 Rh−の女性。", recipient: "AB-", product: "rbc",
      explanation: "AB型は抗A・抗Bをもたないので、ABOはどれでもよい。ただしRh−なのでRh−だけ（抗D抗体ができると次の妊娠で胎児溶血）。" },
    { ...M, id: "b-ffp", story: "DICでフィブリノゲンが低い。B型 Rh＋。血漿を入れたい。", recipient: "B+", product: "ffp",
      explanation: "血漿は逆に考える。ドナーの血漿の抗体が受血者の赤血球に当たらないもの＝B型かAB型（抗Bをもたない）。" },
    { ...M, id: "o-ffp", story: "ワルファリン内服中の頭蓋内出血。O型 Rh−。血漿を入れたい。", recipient: "O-", product: "ffp",
      explanation: "O型の赤血球にはA・B抗原がないので、どの型の血漿でも当たらない。血漿ではRhはふつう問わない。" },
    { ...M, id: "unknown-rbc", story: "交通外傷で出血性ショック。血液型を調べる時間がない。", recipient: "unknown", product: "rbc",
      explanation: "緊急時はO型の赤血球（できればRh−）。同時に採血して型を調べ、わかりしだい同型へ。" },
    { ...M, id: "unknown-ffp", story: "大量出血で血液型が未確定のまま、血漿も必要になった。", recipient: "unknown", product: "ffp",
      explanation: "血液型不明ならAB型の血漿（抗A・抗Bをもたない）。" },
  ],
};
