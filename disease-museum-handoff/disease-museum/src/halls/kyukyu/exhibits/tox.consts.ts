// トキシドローム。TODO(review) 各症候群の所見
export const TOX = { anticholinergic: "抗コリン症候群", cholinergic: "コリン作動性症候群", sympathomimetic: "交感神経刺激症候群", opioid: "オピオイド中毒", sedative: "鎮静催眠薬中毒" } as const;
export type Tox = keyof typeof TOX;
export const TOX_IDS = Object.keys(TOX) as Tox[];
