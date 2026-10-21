// カプノグラム（ホール専用 capnogram）。波形は合成した模式。TODO(review)
import type { CapnoData } from "../exhibits/capno.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const capnoContent: CapnoData = {
  stampAt: 4,
  cases: [
    { ...M, id: "eso", story: "気管挿管の直後、換気を始めた。", pattern: "esophageal",
      options: ["食道挿管", "正常", "気管支けいれん", "再呼吸"], answer: 0,
      followUp: { question: "すぐにすることは？", options: ["チューブを抜いてマスクで換気し、挿管し直す", "そのまま様子を見る", "筋弛緩薬を追加", "鎮痛薬を追加"], answer: 0 },
      explanation: "胃の中の少しのCO₂で数回だけ波が出て、すぐ消える。挿管の確認にカプノグラフィは必須。" },
    { ...M, id: "bs", story: "喘息の既往。挿管後、換気が重く、喘鳴が聞こえる。", pattern: "bronchospasm",
      options: ["気管支けいれん（呼気の閉塞）", "食道挿管", "回路の外れ", "悪性高熱症"], answer: 0,
      followUp: { question: "治療は？", options: ["麻酔を深くし、β₂刺激薬を吸入", "筋弛緩薬を拮抗する", "利尿薬", "換気を止める"], answer: 0 },
      explanation: "息を吐くのに時間がかかり、上り坂がなだらかなサメのヒレの形（shark fin）。" },
    { ...M, id: "rb", story: "長い手術の途中から、吸気でもCO₂が0に戻らなくなった。", pattern: "rebreathing",
      options: ["再呼吸（CO₂吸収剤の消耗や弁の故障）", "低換気", "気管支けいれん", "自己心拍の再開"], answer: 0,
      followUp: { question: "対処は？", options: ["新鮮ガスの流量を増やし、吸収剤と弁を確認", "筋弛緩薬を追加", "何もしない", "酸素を止める"], answer: 0 },
      explanation: "吸い込むガスにCO₂が混じっているので、基線が上がる。" },
    { ...M, id: "mh", story: "セボフルランとスキサメトニウムで導入。咬筋が硬く、体温が上がり始めた。", pattern: "mh",
      options: ["悪性高熱症", "低換気", "再呼吸", "正常"], answer: 0,
      followUp: { question: "治療は？", options: ["揮発性麻酔薬を止め、ダントロレンを投与し、冷却", "セボフルランを増やす", "解熱薬だけ", "経過観察"], answer: 0 },
      explanation: "換気を増やしてもEtCO₂がどんどん上がる。筋肉の代謝が暴走（RYR1の異常）。" },
    { ...M, id: "dc", story: "手術中、突然アラームが鳴った。", pattern: "disconnect",
      options: ["回路の外れ（または完全な閉塞）", "食道挿管", "気管支けいれん", "悪性高熱症"], answer: 0,
      followUp: { question: "まず確認するのは？", options: ["回路の接続と胸の動き。用手換気に切り替える", "麻酔薬を増やす", "体温", "血糖"], answer: 0 },
      explanation: "それまで正常だった波形が急に0になるのは、外れか閉塞か心停止。" },
    { ...M, id: "rosc", story: "心停止で胸骨圧迫中。挿管してカプノグラフィをつけている。", pattern: "rosc",
      options: ["自己心拍の再開", "食道挿管", "回路の外れ", "気管支けいれん"], answer: 0,
      followUp: { question: "胸骨圧迫中のEtCO₂が示すのは？", options: ["胸骨圧迫でどれだけ血が流れているか（質の目安）", "体温", "血糖", "意識の深さ"], answer: 0 },
      explanation: "心拍が戻ると、肺に届く血液が増えてEtCO₂が急に上がる。" },
    { ...M, id: "cleft", story: "手術の終わりごろ。調節呼吸中。", pattern: "cleft",
      options: ["筋弛緩が切れかけて自発呼吸が出てきた", "食道挿管", "悪性高熱症", "再呼吸"], answer: 0,
      followUp: { question: "このあとは？", options: ["筋弛緩と麻酔の深さを確認し、追加か覚醒の準備", "すぐに抜管", "放置", "換気を止める"], answer: 0 },
      explanation: "高原部のくぼみ（curare cleft）は、横隔膜が少し動き始めたしるし。" },
    { ...M, id: "hv", story: "鎮静中の内視鏡検査。呼吸がゆっくりになってきた。", pattern: "hypovent",
      options: ["低換気（CO₂がたまっている）", "過換気", "再呼吸", "食道挿管"], answer: 0,
      followUp: { question: "対応は？", options: ["声をかけ、あごを上げて換気を助け、鎮静薬を減らす（必要なら拮抗薬）", "鎮静薬を追加", "何もしない", "検査を急ぐ"], answer: 0 },
      explanation: "SpO₂が下がる前に、カプノグラムで低換気に気づける。" },
  ],
};
