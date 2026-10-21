// 熱傷の深さ（共通ゲーム depth）。TODO(review) 深さの分類と治療、各症例の所見
import type { DepthData } from "../../../engine/games/depth.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const burnContent: DepthData = {
  lesionLabel: "熱傷",
  topLabel: "↑ 皮膚の表面",
  hideLesion: true,
  organs: { skin: { name: "皮膚", layers: [{ id: "epi", label: "表皮" }, { id: "sd", label: "真皮の浅いところ" }, { id: "dd", label: "真皮の深いところ" }, { id: "sc", label: "皮下組織" }] } },
  treatments: ["冷やして保湿（跡は残らない）", "軟膏で湿った環境を保つ（2週間ほどで治る）", "壊死組織を取り、植皮を考える", "植皮が必要"],
  stampAt: 4,
  cases: [
    { ...M, id: "sun", organ: "skin", card: { 原因: "海で日焼け", 見た目: "赤い、水疱なし", 痛み: "ヒリヒリ痛い" }, depth: "epi", treatment: 0,
      explanation: "I度熱傷。表皮だけ。数日で治る。面積の計算には入れない。" },
    { ...M, id: "sdb", organ: "skin", card: { 原因: "熱湯をこぼした", 見た目: "水疱、その下は赤い", 痛み: "強く痛い" }, depth: "sd", treatment: 1,
      explanation: "浅達性II度。水疱の底が赤く、痛みが強い。跡はほとんど残らない。" },
    { ...M, id: "ddb", organ: "skin", card: { 原因: "天ぷら油", 見た目: "水疱、その下は白っぽい", 痛み: "鈍い" }, depth: "dd", treatment: 2,
      explanation: "深達性II度。水疱の底が白く、痛みが鈍い。3〜4週かかり、瘢痕が残りやすい。" },
    { ...M, id: "full", organ: "skin", card: { 原因: "火事", 見た目: "白〜黒い革のよう", 痛み: "痛くない" }, depth: "sc", treatment: 3,
      explanation: "III度。神経まで焼けて痛みがない。自然には治らず植皮。" },
    { ...M, id: "lowtemp", organ: "skin", card: { 原因: "使い捨てカイロを貼ったまま寝た", 見た目: "小さいが白っぽく硬い", 痛み: "あまり痛くない" }, depth: "sc", treatment: 3,
      explanation: "低温熱傷は見た目より深いことが多い。" },
    { ...M, id: "kettle", organ: "skin", card: { 原因: "ポットの湯気", 見た目: "赤く、小さな水疱", 痛み: "強く痛い" }, depth: "sd", treatment: 1,
      explanation: "浅達性II度。" },
  ],
};
