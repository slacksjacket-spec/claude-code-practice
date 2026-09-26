// zod を使わない定数（ブラウザ側のモジュールからも読むので schema と分ける）
export const LOOKS = ["linearErosion", "varixRed", "tear", "spurting", "ulcerVessel", "ulcerClean", "polyps", "depressed", "earlyCa", "advancedCa", "smt"] as const;
export type Look = (typeof LOOKS)[number];
