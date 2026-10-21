export const LUNG = ["normal", "wheeze", "rhonchi", "fine", "coarse", "stridor", "rub"] as const;
export type LungProfile = (typeof LUNG)[number];
