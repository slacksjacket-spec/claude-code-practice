// 糖尿病の薬 神経衰弱（MemoryMatch）。TODO(review) 各薬の特徴
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const drugsContent: ExhibitOf<"MemoryMatch">["data"] = {
  bonusMoves: 20,
  pairs: [
    { ...M, marker: "メトホルミン", disease: "乳酸アシドーシス（腎機能低下・造影剤で注意）" },
    { ...M, marker: "SU薬", disease: "膵β細胞を刺激。低血糖と体重増加" },
    { ...M, marker: "SGLT2阻害薬", disease: "尿に糖を出す。尿路感染・脱水・正常血糖DKA" },
    { ...M, marker: "DPP-4阻害薬", disease: "インクレチンを長持ちさせる。単独で低血糖が少ない" },
    { ...M, marker: "GLP-1受容体作動薬", disease: "注射や内服。体重が減る、吐き気" },
    { ...M, marker: "チアゾリジン薬", disease: "インスリン抵抗性を改善。むくみ・心不全" },
    { ...M, marker: "α-グルコシダーゼ阻害薬", disease: "糖の吸収を遅らせる。低血糖にはブドウ糖で" },
    { ...M, marker: "インスリン", disease: "1型糖尿病では必須。DKAの治療" },
  ],
};
