// 胸痛ラボ（DiagnosisLab）。症例・検査値は架空。確率バーは手で決めたイメージ値（画面にも明記される）。
// TODO(review) 各検査結果の書き方と、理想の流れ・確率の動き
import type { ExhibitOf } from "../../../engine/schema";

const M = { review: "draft" as const, sources: [] as string[] };
type R = Record<string, { text: string; abnormal: boolean }>;
const r = (o: Record<string, [string, boolean]>): R => Object.fromEntries(Object.entries(o).map(([k, [text, abnormal]]) => [k, { text, abnormal }]));

export const chestLabContent: ExhibitOf<"DiagnosisLab">["data"] = {
  budget: 7,
  stampAt: 4,
  tests: [
    { id: "ecg", name: "12誘導心電図", cost: 1 },
    { id: "trop", name: "心筋トロポニン", cost: 1 },
    { id: "cxr", name: "胸部X線", cost: 1 },
    { id: "echo", name: "心エコー", cost: 2 },
    { id: "dd", name: "D-ダイマー", cost: 1 },
    { id: "ct", name: "造影CT", cost: 3 },
    { id: "bp", name: "左右の上肢の血圧", cost: 1 },
  ],
  diagnoses: [
    { name: "急性冠症候群", short: "ACS" },
    { name: "急性大動脈解離", short: "大動脈解離" },
    { name: "急性肺血栓塞栓症", short: "肺塞栓" },
    { name: "緊張性気胸", short: "緊張性気胸" },
    { name: "急性心膜炎", short: "心膜炎" },
    { name: "特発性食道破裂", short: "食道破裂" },
  ],
  cases: [
    { ...M, who: "64歳 男性", vignette: "30分前から続く、締めつけられるような前胸部痛。冷や汗。糖尿病と喫煙歴。", faceColor: "#F2C6A0", answer: 0,
      results: r({ ecg: ["II・III・aVFでST上昇、I・aVLでST低下", true], trop: ["上昇（発症早期で軽度）", true], cxr: ["異常なし", false], echo: ["下壁の壁運動低下", true], dd: ["正常", false], ct: ["大動脈に解離なし", false], bp: ["左右差なし", false] }),
      explanation: "締めつけられる痛み＋冷汗＋下壁誘導のST上昇。急性下壁心筋梗塞（STEMI）。トロポニンの結果を待たずに緊急カテーテル（再灌流）へ。",
      flow: { prior: [60, 15, 10, 3, 7, 5], priorWhy: "危険因子の多い中年男性の締めつけ感と冷汗。まずACSを考え、10分以内に心電図。",
        steps: [{ test: "ecg", finding: "下壁誘導のST上昇＋鏡像変化", why: "冠動脈の支配に合うST上昇と鏡像変化。STEMIでほぼ確定。", probs: [94, 3, 1, 0, 1, 1] }],
        note: "STEMIは心電図だけで再灌流療法を決める。トロポニンは発症早期には上がりきっていないことがある。" } },
    { ...M, who: "58歳 男性", vignette: "突然、背中に突き抜ける引き裂かれるような激痛。痛みは胸から腰へ移動。高血圧を放置。", faceColor: "#F0C09C", answer: 1,
      results: r({ ecg: ["明らかなST変化なし", false], trop: ["正常", false], cxr: ["上縦隔の拡大", true], echo: ["上行大動脈にフラップ、少量の心嚢液", true], dd: ["著明に上昇", true], ct: ["上行大動脈から始まる解離（Stanford A）", true], bp: ["右 168/90、左 120/70（左右差あり）", true] }),
      explanation: "突然の移動する激痛、血圧の左右差、縦隔の拡大。Stanford A型の急性大動脈解離で、緊急手術。血栓溶解や抗血小板薬は禁忌。",
      flow: { prior: [30, 45, 10, 3, 5, 7], priorWhy: "突然発症の引き裂かれる痛みが移動する。まず解離を疑う。",
        steps: [
          { test: "bp", finding: "左右差あり", why: "鎖骨下動脈に解離が及んでいる可能性。解離をさらに疑う。", probs: [12, 75, 6, 2, 2, 3] },
          { test: "ct", finding: "上行大動脈から始まる解離", why: "解離の範囲と型を確定。上行大動脈を含むのでStanford A型。", probs: [1, 98, 0, 0, 0, 1] },
        ],
        note: "ACSと思っていても、解離を否定する前に抗血栓療法をしない。下壁梗塞に解離が合併することもある。" } },
    { ...M, who: "45歳 女性", vignette: "長時間のフライトのあと、急な息切れと胸痛。右下腿がむくんでいる。経口避妊薬を内服。", faceColor: "#F4D2B4", answer: 2,
      results: r({ ecg: ["洞性頻脈、V1〜V3で陰性T", true], trop: ["軽度上昇", true], cxr: ["明らかな異常なし", false], echo: ["右室の拡大、D字型の左室", true], dd: ["上昇", true], ct: ["両側の肺動脈に血栓", true], bp: ["左右差なし", false] }),
      explanation: "エコノミークラス症候群。深部静脈血栓から肺塞栓。頻脈と低酸素のわりに胸部X線がきれいなのが特徴。造影CTで確定し、抗凝固療法。",
      flow: { prior: [15, 5, 55, 10, 8, 7], priorWhy: "長時間の座位、下腿のむくみ、ホルモン剤。肺塞栓の危険因子がそろう。",
        steps: [
          { test: "dd", finding: "上昇", why: "陰性なら除外に使えるが、陽性だけでは確定できない。可能性は上がる。", probs: [12, 8, 70, 3, 4, 3] },
          { test: "ct", finding: "肺動脈に血栓", why: "造影CTで血栓を直接確認して確定。", probs: [1, 0, 98, 0, 1, 0] },
        ],
        note: "D-ダイマーは「低リスクの人で陰性なら否定」に使う検査。高リスクなら最初から造影CT。" } },
    { ...M, who: "22歳 男性", vignette: "やせ型で背が高い。突然の右胸痛と呼吸困難が急に悪化。頸静脈が怒張し、血圧が下がってきた。", faceColor: "#EFD2B8", answer: 3,
      results: r({ ecg: ["洞性頻脈", false], trop: ["正常", false], cxr: ["右肺の虚脱、縦隔の左への偏位", true], echo: ["右室の圧排", true], dd: ["正常", false], ct: ["（撮影中に血圧がさらに低下）", true], bp: ["左右差なし、低血圧", true] }),
      explanation: "緊張性気胸はX線を待たずに身体所見で診断し、すぐに胸腔穿刺（脱気）。CTに行くのは危険。",
      flow: { prior: [5, 5, 20, 55, 5, 10], priorWhy: "やせ型の若年男性の突然の胸痛と呼吸困難＋ショック＋頸静脈怒張。緊張性気胸を疑う。",
        steps: [{ test: "cxr", finding: "肺の虚脱と縦隔の偏位", why: "確認できたが、本来は所見だけで先に脱気してよい。", probs: [1, 1, 3, 94, 0, 1] }],
        note: "造影CTは不安定な患者には危険。今回は「使わない」のが正解の流れ。" } },
    { ...M, who: "30歳 男性", vignette: "1週間前にかぜ。胸痛が息を吸うと強くなり、前かがみになると楽になる。", faceColor: "#F2D0AE", answer: 4,
      results: r({ ecg: ["広い誘導で下に凸のST上昇、PR低下、aVRでST低下", true], trop: ["正常〜軽度上昇", false], cxr: ["異常なし", false], echo: ["少量の心嚢液", true], dd: ["軽度上昇", true], ct: ["心膜の肥厚", true], bp: ["左右差なし", false] }),
      explanation: "ウイルス感染のあと、体位で変わる胸痛、広範なST上昇とPR低下。急性心膜炎。NSAIDsとコルヒチン。",
      flow: { prior: [20, 5, 10, 5, 50, 10], priorWhy: "感冒のあと、吸気で増強し前屈で軽くなる痛み。心膜炎らしい。",
        steps: [
          { test: "ecg", finding: "冠動脈の支配に合わない広範なST上昇＋PR低下", why: "STEMIとちがい鏡像変化がない。心膜炎の心電図。", probs: [6, 2, 3, 1, 86, 2] },
          { test: "echo", finding: "少量の心嚢液", why: "心膜炎を支持。タンポナーデになっていないかも確認。", probs: [3, 1, 2, 0, 93, 1] },
        ],
        note: "心膜摩擦音が聴こえれば決め手になる。" } },
    { ...M, who: "48歳 男性", vignette: "大量に飲酒して何度も激しく吐いたあと、突然の胸痛。首の皮膚を押すとプチプチする。", faceColor: "#EEC4A2", answer: 5,
      results: r({ ecg: ["洞性頻脈", false], trop: ["正常", false], cxr: ["縦隔気腫、左胸水", true], echo: ["異常なし", false], dd: ["軽度上昇", true], ct: ["縦隔気腫と、食道下部の周囲の液体", true], bp: ["左右差なし", false] }),
      explanation: "Boerhaave症候群（特発性食道破裂）。嘔吐後の胸痛、皮下気腫・縦隔気腫。重い縦隔炎になるので早期に手術・ドレナージ。",
      flow: { prior: [15, 10, 5, 10, 5, 55], priorWhy: "激しい嘔吐のあとの胸痛と皮下気腫。食道破裂を疑う。",
        steps: [
          { test: "cxr", finding: "縦隔気腫と左胸水", why: "食道破裂を強く支持。", probs: [3, 3, 1, 5, 1, 87] },
          { test: "ct", finding: "食道周囲の液体と気腫", why: "破裂部位と広がりを確認（食道造影は水溶性造影剤で）。", probs: [1, 1, 0, 1, 0, 97] },
        ],
        note: "Mallory-Weiss症候群は粘膜の裂傷、Boerhaave症候群は全層の破裂。" } },
  ],
};
