// zod を使わない定数（ブラウザ側のモジュールからも読むので schema と分ける）
export const SEGMENTS = ["ileum", "cecum", "asc", "transR", "transM", "transL", "desc", "sig", "rs", "ra", "rb", "anal"] as const;
export type Segment = (typeof SEGMENTS)[number];
