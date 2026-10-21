// 視野欠損：病変の場所 → 視野の欠け方（患者から見た視野。図の左が患者の左）。TODO(review)
export type Quad = "UL" | "UR" | "LL" | "LR";
export interface Field { left: Quad[]; right: Quad[]; spareMacula?: boolean }
export const LESIONS = {
  onL: { label: "左の視神経", field: { left: ["UL", "UR", "LL", "LR"], right: [] } },
  onR: { label: "右の視神経", field: { left: [], right: ["UL", "UR", "LL", "LR"] } },
  chiasm: { label: "視交叉", field: { left: ["UL", "LL"], right: ["UR", "LR"] } },
  tractL: { label: "左の視索", field: { left: ["UR", "LR"], right: ["UR", "LR"] } },
  tractR: { label: "右の視索", field: { left: ["UL", "LL"], right: ["UL", "LL"] } },
  meyerL: { label: "左の側頭葉（Meyerループ）", field: { left: ["UR"], right: ["UR"] } },
  meyerR: { label: "右の側頭葉（Meyerループ）", field: { left: ["UL"], right: ["UL"] } },
  parL: { label: "左の頭頂葉の視放線", field: { left: ["LR"], right: ["LR"] } },
  parR: { label: "右の頭頂葉の視放線", field: { left: ["LL"], right: ["LL"] } },
  occL: { label: "左の後頭葉", field: { left: ["UR", "LR"], right: ["UR", "LR"], spareMacula: true } },
  occR: { label: "右の後頭葉", field: { left: ["UL", "LL"], right: ["UL", "LL"], spareMacula: true } },
} as const satisfies Record<string, { label: string; field: Field }>;
export type LesionId = keyof typeof LESIONS;
export const LESION_IDS = Object.keys(LESIONS) as LesionId[];
