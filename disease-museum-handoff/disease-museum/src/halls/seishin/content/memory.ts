// 精神科の薬 神経衰弱（MemoryMatch）。TODO(review)
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const memoryContent: ExhibitOf<"MemoryMatch">["data"] = {
  bonusMoves: 20,
  pairs: [
    { ...M, marker: "クロザピン", disease: "無顆粒球症（定期的な血液検査）" },
    { ...M, marker: "リチウム", disease: "腎性尿崩症・甲状腺機能低下" },
    { ...M, marker: "バルプロ酸", disease: "妊娠で神経管閉鎖不全" },
    { ...M, marker: "カルバマゼピン", disease: "重い薬疹（SJS）" },
    { ...M, marker: "三環系抗うつ薬", disease: "抗コリン作用・過量服薬でQRS延長" },
    { ...M, marker: "ベンゾジアゼピン系", disease: "依存・過量にはフルマゼニル" },
    { ...M, marker: "オランザピン", disease: "体重増加・高血糖（糖尿病で禁忌）" },
    { ...M, marker: "メチルフェニデート", disease: "ADHDの治療・食欲低下" },
  ],
};
