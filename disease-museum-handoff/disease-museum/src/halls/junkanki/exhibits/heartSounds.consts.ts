// 心音のパターン（zod を使わない定数）
export const PROFILES = ["normal", "as", "mr", "ar", "ms", "asd", "s3", "vsd"] as const;
export type Profile = (typeof PROFILES)[number];
export const AREAS = ["2RSB", "2LSB", "3LSB", "4LSB", "apex"] as const;
export type Area = (typeof AREAS)[number];
