// 抗核抗体の染色型（蛍光抗体法、HEp-2細胞）。TODO(review) 各型と対応抗体
export const PATTERNS = { homo: "均等型（Homogeneous）", speckled: "斑紋型（Speckled）", centro: "散在斑紋型（Discrete speckled）", nucleolar: "核小体型（Nucleolar）", periph: "辺縁型（Peripheral）" } as const;
export type Pattern = keyof typeof PATTERNS;
export const PATTERN_IDS = Object.keys(PATTERNS) as Pattern[];
