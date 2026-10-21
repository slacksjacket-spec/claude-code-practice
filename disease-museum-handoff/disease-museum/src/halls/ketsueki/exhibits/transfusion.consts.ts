// 輸血の適合（ABO・RhD）。TODO(review) 血漿のRhの扱い、緊急時の扱い
export const TYPES = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"] as const;
export type BloodType = (typeof TYPES)[number];
export type Recipient = BloodType | "unknown";
export type Product = "rbc" | "ffp";
export const PRODUCT_LABEL: Record<Product, string> = { rbc: "赤血球製剤", ffp: "新鮮凍結血漿" };

const antigens = (t: BloodType) => t.replace(/[+-]$/, "").replace("O", "").split("").filter(Boolean);
const rh = (t: BloodType) => t.endsWith("+");

/** 入れても溶血しないか。赤血球：ドナーの抗原が受血者にあること（Rh陰性の人にはRh陰性）。血漿：受血者の抗原がドナーにあること（Rhは問わない）。
 *  血液型不明の緊急時：赤血球はO型、血漿はAB型 */
export function compatible(recipient: Recipient, donor: BloodType, product: Product): boolean {
  if (recipient === "unknown") return product === "rbc" ? antigens(donor).length === 0 : antigens(donor).length === 2;
  const r = antigens(recipient), d = antigens(donor);
  if (product === "rbc") return d.every((x) => r.includes(x)) && (rh(recipient) || !rh(donor));
  return r.every((x) => d.includes(x));
}
