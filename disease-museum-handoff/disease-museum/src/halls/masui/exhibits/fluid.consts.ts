// 輸液1 Lが体のどこに分かれるか（模式的な計算）。TODO(review) 各製剤の扱い（乳酸リンゲルを等張とみなす、膠質液はまず血管内にとどまるとみなす）
export const PRODUCTS = {
  ns: { label: "生理食塩水", na: 154, tonic: 1, colloid: false },
  lr: { label: "乳酸リンゲル液（細胞外液）", na: 130, tonic: 1, colloid: false },
  g5: { label: "5%ブドウ糖液", na: 0, tonic: 0, colloid: false },
  s1: { label: "1号液（開始液）", na: 90, tonic: 90 / 154, colloid: false },
  s3: { label: "3号液（維持液）", na: 35, tonic: 35 / 154, colloid: false },
  alb: { label: "5%アルブミン", na: 154, tonic: 1, colloid: true },
} as const;
export type Product = keyof typeof PRODUCTS;
export const PRODUCT_IDS = Object.keys(PRODUCTS) as Product[];
/** 1,000 mLのうち [血管内, 間質, 細胞内] に分かれる量（mL）。等張な分は細胞外液に（血管内1/4、間質3/4）、自由水の分は体液全体に（細胞内2/3） */
export function split(p: Product): [number, number, number] {
  const x = PRODUCTS[p];
  if (x.colloid) return [1000, 0, 0];
  const t = x.tonic, w = 1 - t;
  const iv = 1000 * (t / 4 + w / 12), is = 1000 * ((t * 3) / 4 + (w * 3) / 12), ic = 1000 * ((w * 2) / 3);
  return [Math.round(iv), Math.round(is), Math.round(ic)];
}
