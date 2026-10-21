// 救急ER（共通ゲーム scenario）。症例は架空。TODO(review) JATEC、熱中症の重症度と冷却、アセトアミノフェン中毒
import type { ScenarioData } from "../../../engine/games/scenario.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const scenarioContent: ScenarioData = {
  maxMistakes: 1, stampAt: 2,
  scenarios: [
    { ...M, id: "trauma", title: "多発外傷", patient: "40歳 男性。バイク事故。",
      steps: [
        { vitals: "ゴロゴロという呼吸音  顔面の外傷", situation: "到着。最初に確認するのは？", answer: 0,
          options: ["頸椎を守りながら気道（吸引・下顎挙上）", "腹部CT", "骨折の固定", "体温"],
          explanation: "A（気道）から。頸椎の保護も同時に。" },
        { vitals: "SpO₂ 98%  BP 78/40  HR 136  皮膚が冷たい", situation: "気道と呼吸は保たれた。", answer: 0,
          options: ["外出血を止め、太い点滴2本で輸液、FASTと骨盤X線で出血源を探す", "頭部CTを先に", "様子を見る", "昇圧薬だけ"],
          explanation: "C（循環）。外傷のショックの大半は出血。胸・腹・骨盤・長管骨・外出血を探す。" },
        { vitals: "FAST：モリソン窩に液体  輸液しても血圧が戻らない", situation: "次は？", answer: 0,
          options: ["輸血しながら、緊急で止血の手術（またはIVR）", "CTで詳しく調べてから", "さらに輸液を5 L", "経過観察"],
          explanation: "輸液に反応しない出血はCTより先に止血。" },
      ] },
    { ...M, id: "heat", title: "熱中症", patient: "20歳 男性。真夏の部活中に倒れた。",
      steps: [
        { vitals: "深部体温 41.0℃  GCS 9  汗をかいていない", situation: "どうする？", answer: 0,
          options: ["すぐに積極的に冷やす（水をかけて扇ぐ、氷水など）", "解熱薬を飲ませる", "毛布でくるむ", "様子を見る"],
          explanation: "重症熱中症。解熱薬は効かない。冷却が最優先。" },
        { vitals: "体温 38.5℃  CK 12,000  尿が茶色", situation: "体温は下がってきた。", answer: 0,
          options: ["十分な輸液で尿量を保ち、腎障害・DICに注意", "水分を制限する", "すぐ帰宅", "運動を再開"],
          explanation: "横紋筋融解による急性腎障害やDICが起こりうる。" },
      ] },
    { ...M, id: "apap", title: "アセトアミノフェン中毒", patient: "18歳 女性。4時間前に解熱鎮痛薬を大量に飲んだ。",
      steps: [
        { vitals: "意識清明  吐き気のみ", situation: "元気そうに見える。", answer: 0,
          options: ["4時間後の血中濃度を測り、ノモグラムで治療を判断する", "症状がないので帰宅", "下剤を飲ませる", "24時間待って採血"],
          explanation: "初めは症状が軽く、1〜3日後に肝障害。量と時間から評価。" },
        { vitals: "治療ラインを超えている", situation: "治療は？", answer: 0,
          options: ["N-アセチルシステイン", "ナロキソン", "フルマゼニル", "ビタミンK"],
          explanation: "グルタチオンを補って毒性代謝物を無毒化する。8〜10時間以内に始めると効果が高い。" },
      ] },
  ],
};
