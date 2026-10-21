// 神経ホール（NO.08）。医学内容はすべて未レビュー（review: "draft"）。
import type { Hall } from "../../engine/schema";
import { localizeContent } from "./content/localize";
import { visualContent } from "./content/visual";
import { gcsContent } from "./content/gcs";
import { strokeContent } from "./content/stroke";
import { weaknessContent } from "./content/weakness";
import { memoryContent } from "./content/memory";
import { versusContent } from "./content/versus";
import { scenarioContent } from "./content/scenario";

const D = { review: "draft" as const, sources: [] as string[] };

export const hall: Hall = {
  id: "shinkei", no: 8, title: "神経ホール",
  catch: "症状から、病変の場所を当てる。局在診断の探偵になろう。展示をクリアしてスタンプを8つ集めよう。",
  ticketNote: "どこが壊れると、何が起こる？ まちがいは収蔵庫へ",
  map: {
    viewBox: "0 0 600 400", ariaLabel: "神経ホールの館内図", hint: "タップすると、その展示室へ移動します",
    organs: [
      { go: "w-loc", label: "局在診断のウィングへ",
        svg: `<path d="M60 150 C50 80 110 40 170 44 C230 48 260 90 250 150 C246 180 210 186 190 180 C160 196 100 196 80 180 C64 172 60 162 60 150Z" fill="#F7D3D0" stroke="#1C1537" stroke-width="4"/>
        <path d="M120 60 C116 90 130 110 120 140 M180 60 C176 100 190 120 180 160" stroke="#B85A50" stroke-width="3" fill="none"/>
        <circle class="eye" cx="120" cy="120" r="7" fill="#1C1537"/><circle class="eye" cx="180" cy="120" r="7" fill="#1C1537"/><path d="M138 146 Q150 156 162 146" stroke="#1C1537" stroke-width="4" fill="none"/>
        <circle cx="104" cy="140" r="8" fill="var(--pink)" opacity=".8"/><circle cx="196" cy="140" r="8" fill="var(--pink)" opacity=".8"/>
        <text x="155" y="226" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">局在診断</text>` },
      { go: "w-stroke", label: "脳卒中と意識のウィングへ",
        svg: `<path d="M360 60 L340 120 L370 120 L350 190" stroke="var(--sun)" stroke-width="12" fill="none" stroke-linejoin="round"/><path d="M360 60 L340 120 L370 120 L350 190" stroke="#1C1537" stroke-width="3" fill="none" stroke-linejoin="round"/>
        <text x="360" y="226" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">脳卒中と意識</text>` },
      { go: "w-dz", label: "神経の病気のウィングへ",
        svg: `<circle cx="500" cy="110" r="20" fill="#C8D8F4" stroke="#1C1537" stroke-width="4"/><path d="M520 110 L570 110 M480 110 L440 90 M480 110 L440 130 M500 90 L500 60" stroke="#1C1537" stroke-width="4"/>
        <circle cx="574" cy="110" r="6" fill="var(--mint)" stroke="#1C1537" stroke-width="3"/>
        <text x="505" y="176" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">神経の病気</text>` },
      { go: "w-er", label: "神経ERへ",
        svg: `<circle cx="300" cy="310" r="40" fill="var(--tomato)" stroke="#1C1537" stroke-width="4"/>
        <text x="300" y="323" text-anchor="middle" font-family="Dela Gothic One" font-size="30" fill="#fff">ER</text>
        <text x="300" y="374" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">神経ER</text>` },
    ],
  },
  wings: [
    { id: "w-loc", label: "局在診断", color: "pink", headline: "症状から場所を当てる",
      exhibits: [
        { id: "localize", no: 1, type: "Custom", kind: "tapMap", title: "病変はどこだ？", stampLabel: "局在",
          how: "失語、失調、感覚の解離。症状から大脳・脳幹・小脳・脊髄のどこが壊れたかをタップしよう。通算5回正解でスタンプ。",
          cheatSheet: { ...D, title: "脊髄の通り道",
            html: `<table><tr><th>後索</th><td>振動覚・位置覚。延髄で交叉</td></tr><tr><th>脊髄視床路</th><td>温痛覚。入ってすぐ反対側へ交叉</td></tr><tr><th>外側皮質脊髄路</th><td>運動。延髄の錐体で交叉</td></tr><tr><th>前角</th><td>下位運動ニューロン</td></tr></table>` },
          data: localizeContent },
        { id: "vf", no: 2, type: "Custom", kind: "visualField", title: "視野と病変", stampLabel: "視野",
          how: "視野の欠け方を見て、視覚路のどこに病変があるかをタップしよう。正解を通算4回でスタンプ。", data: visualContent },
      ] },
    { id: "w-stroke", label: "脳卒中と意識", color: "sun", headline: "時間が脳を救う",
      exhibits: [
        { id: "gcs", no: 3, type: "Custom", kind: "gcs", title: "GCSを付けろ", stampLabel: "GCS",
          how: "患者の様子を読んで、開眼・言葉・運動を採点しよう。E・V・Mすべて正解を通算4人でスタンプ。", data: gcsContent },
        { id: "stroke", no: 4, type: "Custom", kind: "grid", title: "脳梗塞の3病型", stampLabel: "脳梗塞",
          how: "経過と背景から病型を決め、再発予防を選ぼう。両方正解を通算4人でスタンプ。", data: strokeContent },
      ] },
    { id: "w-dz", label: "神経の病気", color: "mint", headline: "神経と筋肉のあいだ",
      exhibits: [
        { id: "weak", no: 5, type: "DiagnosisLab", title: "力が入らないラボ", stampLabel: "脱力",
          how: "脱力の患者が次々やってくる。予算内で検査を選んで診断しよう。4人正解でスタンプ。", data: weaknessContent },
        { id: "memory", no: 6, type: "MemoryMatch", title: "自己抗体 神経衰弱", stampLabel: "抗体",
          how: "自己抗体と病気のカードをペアにしよう。全部そろえるとスタンプ。", data: memoryContent },
        { id: "versus", no: 7, type: "VersusQuiz", title: "ヒントはどっちの味方？", stampLabel: "対決",
          how: "ヒントがどちらの病気のものか左右で答えよう。6問中5問以上でスタンプ。", data: versusContent },
      ] },
    { id: "w-er", label: "神経ER", color: "tomato", labelText: "light", headline: "Time is brain",
      exhibits: [
        { id: "er", no: 8, type: "Custom", kind: "scenario", title: "神経ER", stampLabel: "ER",
          how: "急性期脳梗塞、てんかん重積、くも膜下出血。次の一手を選ぼう。ミス1回までならクリア、通算2シナリオでスタンプ。", data: scenarioContent },
      ] },
  ],
  gacha: {
    wing: "w-loc", title: "脳神経ガチャ", machineLabel: "脳神経", intro: "脳から直接出る12対の神経。誰が出るかな？",
    cost: 30, dupRefund: 10, pityAfterDups: 4,
    // TODO(review) 解説文
    items: [
      { ...D, id: "cn7", name: "顔面神経（VII）", rarity: 1, weight: 22, color: "#FFC933", text: "表情筋、味覚（舌の前2/3）、涙。Bell麻痺では額のしわも寄らない。" },
      { ...D, id: "cn3", name: "動眼神経（III）", rarity: 2, weight: 14, color: "#FF7AB6", text: "麻痺で眼瞼下垂と外下方への偏位、散瞳。動脈瘤に注意。" },
      { ...D, id: "cn5", name: "三叉神経（V）", rarity: 2, weight: 14, color: "#22C1A0", text: "顔の感覚と咀嚼筋。三叉神経痛。" },
      { ...D, id: "cn2", name: "視神経（II）", rarity: 1, weight: 12, color: "#3D5AFE", text: "実は中枢神経。視神経炎は多発性硬化症の初発のことも。" },
      { ...D, id: "cn10", name: "迷走神経（X）", rarity: 2, weight: 10, color: "#C8453B", text: "のど、心臓、お腹まで。反回神経は声帯を動かす。" },
      { ...D, id: "cn6", name: "外転神経（VI）", rarity: 3, weight: 8, color: "#8BD450", text: "頭蓋内の長い道のり。頭蓋内圧亢進で麻痺しやすい。" },
      { ...D, id: "cn4", name: "滑車神経（IV）", rarity: 3, weight: 7, color: "#FF5A36", text: "いちばん細い。麻痺すると頭を傾けて代償する。" },
      { ...D, id: "cn12", name: "舌下神経（XII）", rarity: 3, weight: 7, color: "#9EC8FF", text: "麻痺すると、舌を出したとき麻痺側へ曲がる。" },
      { ...D, id: "cn1", name: "嗅神経（I）", rarity: 4, weight: 6, color: "#F3EEDF", text: "においを運ぶ。Kallmann症候群やParkinson病で早くから低下。" },
    ],
  },
  stampOrder: ["localize", "vf", "gcs", "stroke", "weak", "memory", "versus", "er"],
};
