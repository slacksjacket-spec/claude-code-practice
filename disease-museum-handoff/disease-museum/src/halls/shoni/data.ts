// 小児ホール（NO.12）。医学内容はすべて未レビュー（review: "draft"）。
import type { Hall } from "../../engine/schema";
import { growthContent } from "./content/growth";
import { milestoneContent } from "./content/milestone";
import { feverContent } from "./content/fever";
import { criteriaContent } from "./content/criteria";
import { chdContent } from "./content/chd";
import { memoryContent } from "./content/memory";
import { versusContent } from "./content/versus";
import { scenarioContent } from "./content/scenario";

const D = { review: "draft" as const, sources: [] as string[] };

export const hall: Hall = {
  id: "shoni", no: 12, title: "小児ホール",
  catch: "子どもは小さな大人じゃない。曲線と熱型と月齢で考えよう。展示をクリアしてスタンプを8つ集めよう。",
  ticketNote: "成長曲線に点を打つのが、最初の検査。まちがいは収蔵庫へ",
  map: {
    viewBox: "0 0 600 400", ariaLabel: "小児ホールの館内図", hint: "タップすると、その展示室へ移動します",
    organs: [
      { go: "w-grow", label: "成長と発達のウィングへ",
        svg: `<rect x="70" y="60" width="16" height="170" fill="#fff" stroke="#1C1537" stroke-width="3"/>${[80, 110, 140, 170, 200].map((y) => `<path d="M70 ${y} h10" stroke="#1C1537" stroke-width="2"/>`).join("")}
        <circle cx="140" cy="110" r="30" fill="#F6D9BE" stroke="#1C1537" stroke-width="4"/><rect x="118" y="140" width="44" height="60" rx="14" fill="var(--sun)" stroke="#1C1537" stroke-width="4"/>
        <circle class="eye" cx="130" cy="106" r="4" fill="#1C1537"/><circle class="eye" cx="150" cy="106" r="4" fill="#1C1537"/><path d="M132 120 Q140 128 148 120" stroke="#1C1537" stroke-width="3" fill="none"/>
        <circle cx="122" cy="118" r="5" fill="var(--pink)" opacity=".8"/><circle cx="158" cy="118" r="5" fill="var(--pink)" opacity=".8"/>
        <text x="120" y="250" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">成長と発達</text>` },
      { go: "w-fever", label: "発熱と発疹のウィングへ",
        svg: `<rect x="290" y="50" width="20" height="130" rx="10" fill="#fff" stroke="#1C1537" stroke-width="4"/><circle cx="300" cy="190" r="22" fill="var(--tomato)" stroke="#1C1537" stroke-width="4"/><rect x="295" y="90" width="10" height="100" fill="var(--tomato)"/>
        ${[[340, 80], [360, 110], [335, 140], [370, 160]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="var(--pink)" stroke="#1C1537" stroke-width="2"/>`).join("")}
        <text x="320" y="250" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">発熱と発疹</text>` },
      { go: "w-born", label: "生まれつきの病気のウィングへ",
        svg: `<path d="M490 90 C470 60 430 70 440 110 C446 140 490 170 490 170 C490 170 534 140 540 110 C550 70 510 60 490 90Z" fill="var(--liver)" stroke="#1C1537" stroke-width="4"/>
        <circle class="eye" cx="474" cy="104" r="5" fill="#fff"/><circle class="eye" cx="506" cy="104" r="5" fill="#fff"/><path d="M482 122 Q490 128 498 122" stroke="#fff" stroke-width="3" fill="none"/>
        <text x="490" y="210" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">生まれつき</text>` },
      { go: "w-er", label: "小児ERへ",
        svg: `<circle cx="300" cy="320" r="40" fill="var(--tomato)" stroke="#1C1537" stroke-width="4"/>
        <text x="300" y="333" text-anchor="middle" font-family="Dela Gothic One" font-size="30" fill="#fff">ER</text>
        <text x="300" y="384" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">小児ER</text>` },
    ],
  },
  wings: [
    { id: "w-grow", label: "成長と発達", color: "sun", headline: "曲線と月齢で考える",
      exhibits: [
        { id: "growth", no: 1, type: "Custom", kind: "growth", title: "成長曲線を読め", stampLabel: "成長曲線",
          how: "身長（と体重）の点を成長曲線で見て、伸び方のパターンと原因を答えよう。両方正解を通算4人でスタンプ。曲線は模式。", data: growthContent },
        { id: "milestone", no: 2, type: "Custom", kind: "order", title: "発達の順番", stampLabel: "発達",
          how: "運動・言葉・社会性・手の動き。できるようになる順にタップしよう。ノーミスを通算3問でスタンプ。", data: milestoneContent },
      ] },
    { id: "w-fever", label: "発熱と発疹", color: "tomato", labelText: "light", headline: "熱のカーブと発疹の日",
      exhibits: [
        { id: "fever", no: 3, type: "Custom", kind: "feverChart", title: "熱型表で当てろ", stampLabel: "発疹症",
          how: "毎日の体温と発疹が出た日から病名を当て、続けて質問に答えよう。両方正解を通算4人でスタンプ。", data: feverContent },
        { id: "criteria", no: 4, type: "Custom", kind: "criteria", title: "基準に入るのはどれ？", stampLabel: "診断基準",
          how: "所見の中から、診断基準に入るものだけを全部チェックし、判断しよう。両方正解を通算3回でスタンプ。", data: criteriaContent },
      ] },
    { id: "w-born", label: "生まれつき", color: "pink", headline: "心臓と染色体",
      exhibits: [
        { id: "chd", no: 5, type: "Custom", kind: "grid", title: "先天性心疾患の4マス", stampLabel: "心疾患",
          how: "チアノーゼと肺血流から、先天性心疾患を4マスに分けよう。通算4人正解でスタンプ。", data: chdContent },
        { id: "memory", no: 6, type: "MemoryMatch", title: "染色体 神経衰弱", stampLabel: "染色体",
          how: "染色体の異常と、特徴のカードをペアにしよう。全部そろえるとスタンプ。", data: memoryContent },
      ] },
    { id: "w-er", label: "小児ER", color: "cobalt", labelText: "light", headline: "泣き方にもサインがある",
      exhibits: [
        { id: "versus", no: 7, type: "VersusQuiz", title: "ヒントはどっちの味方？", stampLabel: "対決",
          how: "ヒントがどちらの病気のものか左右で答えよう。6問中5問以上でスタンプ。", data: versusContent },
        { id: "er", no: 8, type: "Custom", kind: "scenario", title: "小児ER", stampLabel: "ER",
          how: "腸重積、乳児の気道異物、胃腸炎の脱水。次の一手を選ぼう。ミス1回までならクリア、通算2シナリオでスタンプ。", data: scenarioContent },
      ] },
  ],
  gacha: {
    wing: "w-grow", title: "予防接種ガチャ", machineLabel: "ワクチン", intro: "子どもを守る、小さな注射たち。",
    cost: 30, dupRefund: 10, pityAfterDups: 4,
    // TODO(review) 解説文と接種時期
    items: [
      { ...D, id: "mr", name: "MRワクチン", rarity: 1, weight: 22, color: "#FF7AB6", text: "麻疹と風疹。1歳と就学前の2回。生ワクチン。" },
      { ...D, id: "hib", name: "Hibワクチン", rarity: 2, weight: 14, color: "#3D5AFE", text: "インフルエンザ菌b型。喉頭蓋炎と髄膜炎が激減した。" },
      { ...D, id: "pcv", name: "肺炎球菌ワクチン", rarity: 2, weight: 14, color: "#22C1A0", text: "乳児の髄膜炎や菌血症を防ぐ結合型ワクチン。" },
      { ...D, id: "bcg", name: "BCG", rarity: 1, weight: 12, color: "#C8453B", text: "結核。管針で9つの跡。川崎病で赤くなることも。" },
      { ...D, id: "rota", name: "ロタウイルスワクチン", rarity: 2, weight: 10, color: "#FFC933", text: "飲むワクチン。腸重積に注意して早めに。" },
      { ...D, id: "vzv", name: "水痘ワクチン", rarity: 3, weight: 8, color: "#8BD450", text: "生ワクチン。2回接種。" },
      { ...D, id: "hbv", name: "B型肝炎ワクチン", rarity: 3, weight: 7, color: "#FF5A36", text: "生後2か月から。母子感染予防では出生直後にも。" },
      { ...D, id: "dpt", name: "五種混合ワクチン", rarity: 3, weight: 7, color: "#9EC8FF", text: "ジフテリア・百日咳・破傷風・ポリオ・Hib。" },
      { ...D, id: "hpv", name: "HPVワクチン", rarity: 4, weight: 6, color: "#F3EEDF", text: "子宮頸癌を防ぐ。小学6年〜高校1年相当。" },
    ],
  },
  stampOrder: ["growth", "milestone", "fever", "criteria", "chd", "memory", "versus", "er"],
};
