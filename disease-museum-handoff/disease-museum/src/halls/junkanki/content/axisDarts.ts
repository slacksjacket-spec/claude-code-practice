// 電気軸ダーツ。TODO(review) 正常軸の範囲は教科書により -30〜+90°、0〜+90°、-30〜+110°などの違いがある。ここでは -30〜+90°
import type { AxisDartsData } from "../exhibits/axisDarts.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const axisDartsContent: AxisDartsData = {
  range: [-90, 170],
  bands: [{ within: 15, coins: 20, label: "ど真ん中！" }, { within: 30, coins: 12, label: "いい線" }, { within: 45, coins: 6, label: "おしい" }],
  stampWithin: 30,
  stampAt: 3,
  classes: [
    { ...M, label: "正常軸（−30°〜+90°）", from: -30, to: 90, note: "I誘導とaVF誘導のQRSがどちらも上向きなら、ほぼ正常軸（0〜+90°）。IIが上向きなら −30°まで正常。" },
    { ...M, label: "左軸偏位（−30°より左）", from: -90, to: -30, note: "Iが上向き、IIとaVFが下向き。左脚前枝ブロック、左室肥大、下壁梗塞など。" },
    { ...M, label: "右軸偏位（+90°より右）", from: 90, to: 180, note: "Iが下向き、aVFが上向き。右室肥大、肺塞栓、左脚後枝ブロック、やせ型の若年者など。" },
    { ...M, label: "北西軸（−90°〜−180°）", from: -180, to: -90, note: "IとaVFがどちらも下向き。心室頻拍、電極の付け間違い（左右の手）などを考える。" },
  ],
};
