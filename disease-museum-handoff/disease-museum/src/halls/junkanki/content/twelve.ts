// 12誘導読影。TODO(review) 誘導と責任血管の対応は典型例（個人差・優位性で変わる）
import type { TwelveData } from "../exhibits/twelve.schema";
import { PATTERNS } from "./ecgInfo";

const M = { review: "draft" as const, sources: [] as string[] };
const T = {
  antsep: "前壁中隔・左前下行枝",
  extant: "広範前壁・左前下行枝の近位部",
  inf: "下壁・右冠動脈",
  lat: "側壁・左回旋枝",
  post: "後壁・左回旋枝（または右冠動脈）",
  peri: "冠動脈の支配に合わない（心膜炎を疑う）",
};

export const twelveContent: TwelveData = {
  stampAt: 5,
  territories: Object.values(T),
  stCases: [
    { ...M, pattern: "antMI", territory: T.antsep, explanation: "V1〜V4のST上昇は前壁中隔。左前下行枝の閉塞。" },
    { ...M, pattern: "extAntMI", territory: T.extant, explanation: "V1〜V6に加えてI・aVLまで上昇していれば、左前下行枝の近位部（対角枝より手前）の閉塞で範囲が広い。" },
    { ...M, pattern: "infMI", territory: T.inf, explanation: "II・III・aVFは下壁。多くは右冠動脈。IIIのST上昇がIIより大きければ右冠動脈らしい。" },
    { ...M, pattern: "latMI", territory: T.lat, explanation: "I・aVL・V5・V6は側壁。左回旋枝や対角枝。" },
    { ...M, pattern: "postMI", territory: T.post, explanation: "通常の12誘導にST上昇が出ない。V1〜V3のST低下と高いR波は後壁梗塞の鏡像。V7〜V9で確認する。" },
    { ...M, pattern: "pericarditis", territory: T.peri, explanation: "ひとつの冠動脈では説明できない広い範囲のST上昇で、鏡像変化がない。急性心膜炎を考える。" },
  ],
  patterns: PATTERNS.filter((p) => !["antMI", "extAntMI", "latMI"].includes(p.id)),
};
