// 神経根ごとの所見（国試向けの代表）。TODO(review) 筋・反射・感覚の対応、図の皮膚分節は模式
export const ROOTS = {
  C5: { motor: "三角筋・上腕二頭筋", reflex: "上腕二頭筋反射の低下", sensory: "上腕の外側" },
  C6: { motor: "手首を反らす力（橈側手根伸筋）", reflex: "腕橈骨筋反射の低下", sensory: "前腕の外側〜親指" },
  C7: { motor: "上腕三頭筋", reflex: "上腕三頭筋反射の低下", sensory: "中指" },
  C8: { motor: "指を曲げる力・手の内在筋", reflex: "目立った反射の変化なし", sensory: "小指・前腕の内側" },
  L4: { motor: "大腿四頭筋・前脛骨筋", reflex: "膝蓋腱反射の低下", sensory: "下腿の内側" },
  L5: { motor: "足の親指を反らす力（長母趾伸筋）", reflex: "目立った反射の変化なし", sensory: "下腿の外側〜足の甲" },
  S1: { motor: "つま先立ち（下腿三頭筋）", reflex: "アキレス腱反射の低下", sensory: "足の外側〜足の裏" },
} as const;
export type Root = keyof typeof ROOTS;
export const ROOT_IDS = Object.keys(ROOTS) as Root[];
/** 図（正面の人、患者の右が図の左）で色をつける場所。右半身に描く */
export const AREA: Record<Root, string> = {
  C5: `<path d="M28 70 L38 70 L34 112 L24 112Z"/>`,
  C6: `<path d="M24 114 L30 114 L25 170 L19 170Z"/><circle cx="15" cy="180" r="4"/>`,
  C7: `<rect x="22" y="188" width="5" height="12" rx="2"/>`,
  C8: `<path d="M34 114 L40 114 L33 172 L28 172Z"/><circle cx="31" cy="194" r="3"/>`,
  L4: `<path d="M52 216 L58 216 L58 288 L53 288Z"/>`,
  L5: `<path d="M44 216 L50 216 L50 288 L44 288Z"/><ellipse cx="51" cy="296" rx="6" ry="3.5"/>`,
  S1: `<ellipse cx="41" cy="297" rx="5" ry="4"/>`,
};
