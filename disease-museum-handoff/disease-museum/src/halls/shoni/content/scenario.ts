// 小児ER（共通ゲーム scenario）。症例は架空。TODO(review) 腸重積の整復の適応、乳児の異物除去の手順、脱水の経口補水
import type { ScenarioData } from "../../../engine/games/scenario.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const scenarioContent: ScenarioData = {
  maxMistakes: 1, stampAt: 2,
  scenarios: [
    { ...M, id: "intus", title: "腸重積症", patient: "10か月 男児。",
      steps: [
        { vitals: "T 37.2  HR 140", situation: "急に激しく泣いては静かになる。吐いて、いちごジャムのような便。", answer: 0,
          options: ["腹部エコーで腸重積を確認する", "胃腸炎として整腸剤で帰宅", "浣腸だけして帰宅", "腹部CTを撮ってから3日待つ"],
          explanation: "間欠的な啼泣、嘔吐、血便。エコーで標的のような像（target sign）。" },
        { vitals: "発症から12時間  腹膜刺激症状なし", situation: "腸重積だった。治療は？", answer: 0,
          options: ["透視やエコーで見ながら高圧浣腸で整復", "すぐに開腹手術", "抗菌薬だけ", "経過観察"],
          explanation: "腹膜炎やショックがなければ非観血的整復。だめなら手術。" },
      ] },
    { ...M, id: "fb", title: "乳児の気道異物", patient: "8か月 女児。豆を口に入れたあと、急に苦しそう。",
      steps: [
        { vitals: "声が出ない  咳ができない  顔色が悪い", situation: "意識はある。", answer: 0,
          options: ["頭を下げてうつぶせにし背部叩打、あおむけにして胸部突き上げをくり返す", "腹部突き上げ（ハイムリック法）", "指でのどの奥をさぐる", "水を飲ませる"],
          explanation: "乳児は腹部突き上げをしない。背部叩打と胸部突き上げ。見えない異物を指でかき出さない。" },
        { vitals: "反応がなくなった", situation: "ぐったりして呼びかけに反応しない。", answer: 0,
          options: ["119番とAEDを頼み、心肺蘇生を始める（口の中に異物が見えたら取る）", "背部叩打だけを続ける", "様子を見る", "逆さにして揺さぶる"],
          explanation: "反応がなくなればすぐCPR。人工呼吸の前に口の中を見る。" },
      ] },
    { ...M, id: "dehyd", title: "胃腸炎の脱水", patient: "2歳 男児。保育園でロタウイルスが流行。",
      steps: [
        { vitals: "HR 130  毛細血管再充満時間 2秒  泣くと涙が出る", situation: "半日で5回の嘔吐と下痢。少し元気がない。", answer: 0,
          options: ["経口補水液を少しずつ（スプーンで数分おきに）飲ませる", "すぐに点滴", "制吐薬だけで様子を見る", "水も食事も止める"],
          explanation: "軽〜中等度の脱水はまず経口補水療法。少量頻回で吐きにくい。" },
        { vitals: "HR 170  毛細血管再充満時間 4秒  ぐったり  尿が出ない", situation: "夜になって飲めず、ぐったりしてきた。", answer: 0,
          options: ["細胞外液の点滴で急速に補う", "経口補水だけを続ける", "下痢止めを飲ませる", "朝まで待つ"],
          explanation: "重度の脱水やショックの兆候は静脈から急速輸液。" },
      ] },
  ],
};
