// zod を使わない定数（ブラウザ側のモジュールからも読むので schema と分ける）
export const REGIONS = ["RUQ", "EPI", "LUQ", "RL", "UMB", "LL", "RLQ", "HYPO", "LLQ"] as const;
export type Region = (typeof REGIONS)[number];
