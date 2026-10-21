// ホルモン軸（共通ゲーム axis）。症例は架空。TODO(review) 各症例の軸の矢印
import type { AxisData } from "../../../engine/games/axis.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const axisContent: AxisData = {
  stampAt: 5,
  axes: {
    hpa: { title: "視床下部-下垂体-副腎皮質系", levels: [{ id: "h", organ: "視床下部", hormone: "CRH" }, { id: "p", organ: "下垂体前葉", hormone: "ACTH" }, { id: "t", organ: "副腎皮質", hormone: "コルチゾール" }] },
    hpt: { title: "視床下部-下垂体-甲状腺系", levels: [{ id: "h", organ: "視床下部", hormone: "TRH" }, { id: "p", organ: "下垂体前葉", hormone: "TSH" }, { id: "t", organ: "甲状腺", hormone: "FT4" }] },
    hpg: { title: "視床下部-下垂体-精巣系", levels: [{ id: "h", organ: "視床下部", hormone: "GnRH" }, { id: "p", organ: "下垂体前葉", hormone: "LH・FSH" }, { id: "t", organ: "精巣", hormone: "テストステロン" }] },
  },
  cases: [
    { ...M, id: "cushing-dz", axis: "hpa", who: "35歳 女性", story: "満月様顔貌、中心性肥満、赤紫色の皮膚線条。高用量デキサメタゾンで抑制される。", given: { t: "up" }, answer: { h: "down", p: "up", t: "up" },
      options: ["下垂体のACTH産生腺腫（Cushing病）", "副腎腺腫", "ステロイドの長期内服", "Addison病"], correct: 0,
      explanation: "下垂体が勝手にACTHを出し、コルチゾールが上がる。コルチゾールの負のフィードバックでCRHは下がる。" },
    { ...M, id: "adrenal-adenoma", axis: "hpa", who: "45歳 女性", story: "Cushing徴候。CTで片側の副腎に3 cmの腫瘤。", given: { t: "up" }, answer: { h: "down", p: "down", t: "up" },
      options: ["副腎腺腫（Cushing症候群）", "Cushing病", "異所性ACTH産生腫瘍", "先天性副腎過形成"], correct: 0,
      explanation: "副腎が勝手にコルチゾールを出す。上の階（CRH・ACTH）はどちらも抑えられる。反対側の副腎は萎縮する。" },
    { ...M, id: "exogenous", axis: "hpa", who: "60歳 女性", story: "関節リウマチでプレドニゾロンを長く飲んでいる。早朝の血中コルチゾール（内因性）を測った。", given: { p: "down" }, answer: { h: "down", p: "down", t: "down" },
      options: ["外から入ったステロイドによる軸の抑制", "Addison病", "Cushing病", "副腎腺腫"], correct: 0,
      explanation: "外からのステロイドで軸全体が眠る。急にやめると副腎不全（クリーゼ）になるので、ゆっくり減らす。" },
    { ...M, id: "addison", axis: "hpa", who: "40歳 男性", story: "だるさ、体重減少、歯ぐきや手のしわの色素沈着。低Na・高K。", given: { t: "down" }, answer: { h: "up", p: "up", t: "down" },
      options: ["原発性副腎皮質機能低下症（Addison病）", "下垂体機能低下症", "ステロイドの長期内服", "Cushing病"], correct: 0,
      explanation: "副腎が壊れてコルチゾールが下がり、ACTHが上がる。ACTHと同じ前駆体から作られるMSHの作用で色素沈着。" },
    { ...M, id: "sheehan", axis: "hpa", who: "30歳 女性", story: "分娩時に大量出血。その後、乳汁が出ず、月経も戻らない。色素沈着はない。", given: { t: "down" }, answer: { h: "up", p: "down", t: "down" },
      options: ["下垂体の壊死（Sheehan症候群）", "Addison病", "Cushing病", "ステロイドの長期内服"], correct: 0,
      explanation: "下垂体が壊れてACTHが出ない。ACTHが低いので色素沈着はなく、アルドステロンは保たれるので高Kになりにくい。" },
    { ...M, id: "graves", axis: "hpt", who: "28歳 女性", story: "動悸、体重減少、眼球突出、びまん性の甲状腺腫。TRAb陽性。", given: { t: "up" }, answer: { h: "down", p: "down", t: "up" },
      options: ["バセドウ病", "TSH産生下垂体腺腫", "橋本病", "中枢性甲状腺機能低下症"], correct: 0,
      explanation: "TSH受容体抗体が甲状腺を刺激。上がったFT4のフィードバックでTSHは強く抑えられる。" },
    { ...M, id: "hashimoto", axis: "hpt", who: "50歳 女性", story: "寒がり、便秘、むくみ。硬い甲状腺腫。抗TPO抗体陽性。", given: { t: "down" }, answer: { h: "up", p: "up", t: "down" },
      options: ["橋本病（原発性甲状腺機能低下症）", "中枢性甲状腺機能低下症", "バセドウ病", "無痛性甲状腺炎"], correct: 0,
      explanation: "甲状腺が壊れてFT4が下がる。ブレーキが外れてTRHもTSHも上がる。" },
    { ...M, id: "tshoma", axis: "hpt", who: "45歳 男性", story: "動悸と発汗。両耳側半盲。MRIで下垂体腫瘍。", given: { t: "up" }, answer: { h: "down", p: "up", t: "up" },
      options: ["TSH産生下垂体腺腫", "バセドウ病", "亜急性甲状腺炎", "橋本病"], correct: 0,
      explanation: "FT4が高いのにTSHが抑えられない（不適切分泌）。下垂体の腫瘍がTSHを出している。" },
    { ...M, id: "klinefelter", axis: "hpg", who: "25歳 男性", story: "高身長、小さく硬い精巣、女性化乳房。不妊で受診。染色体は47,XXY。", given: { t: "down" }, answer: { h: "up", p: "up", t: "down" },
      options: ["原発性の性腺機能低下（Klinefelter症候群）", "Kallmann症候群", "プロラクチノーマ", "正常"], correct: 0,
      explanation: "精巣そのものの障害。テストステロンが下がり、ゴナドトロピンが上がる（高ゴナドトロピン性）。" },
    { ...M, id: "kallmann", axis: "hpg", who: "18歳 男性", story: "二次性徴が来ない。においが分からない。", given: { t: "down" }, answer: { h: "down", p: "down", t: "down" },
      options: ["視床下部のGnRH欠損（Kallmann症候群）", "Klinefelter症候群", "精巣腫瘍", "アンドロゲン不応症"], correct: 0,
      explanation: "GnRHを出す神経と嗅神経の発生の異常。いちばん上が出ないので全部下がる（低ゴナドトロピン性）。" },
  ],
};
