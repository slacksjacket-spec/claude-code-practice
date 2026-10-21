// 免疫・膠原病ホール（NO.09）。医学内容はすべて未レビュー（review: "draft"）。
import type { Hall } from "../../engine/schema";
import { anaContent } from "./content/ana";
import { memoryContent } from "./content/memory";
import { feverContent } from "./content/fever";
import { handContent } from "./content/hand";
import { vasculitisContent } from "./content/vasculitis";
import { versusContent } from "./content/versus";
import { allergyContent } from "./content/allergy";
import { scenarioContent } from "./content/scenario";

const D = { review: "draft" as const, sources: [] as string[] };

export const hall: Hall = {
  id: "meneki", no: 9, title: "免疫・膠原病ホール",
  catch: "味方のはずの免疫が、自分を攻める。抗体と関節と血管を読み解こう。展示をクリアしてスタンプを8つ集めよう。",
  ticketNote: "光る核に、病気の名前が書いてある。まちがいは収蔵庫へ",
  map: {
    viewBox: "0 0 600 400", ariaLabel: "免疫・膠原病ホールの館内図", hint: "タップすると、その展示室へ移動します",
    organs: [
      { go: "w-ab", label: "自己抗体のウィングへ",
        svg: `<path d="M130 200 L130 120 L80 60 M130 120 L180 60" stroke="#1C1537" stroke-width="18" stroke-linecap="round" fill="none"/>
        <path d="M130 200 L130 120 L80 60 M130 120 L180 60" stroke="var(--mint)" stroke-width="11" stroke-linecap="round" fill="none"/>
        <circle class="eye" cx="120" cy="150" r="5" fill="#1C1537"/><circle class="eye" cx="140" cy="150" r="5" fill="#1C1537"/><path d="M122 166 Q130 172 138 166" stroke="#1C1537" stroke-width="3" fill="none"/>
        <text x="130" y="236" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">自己抗体</text>` },
      { go: "w-joint", label: "関節と血管のウィングへ",
        svg: `<rect x="270" y="50" width="34" height="80" rx="16" fill="#F6D9BE" stroke="#1C1537" stroke-width="4"/><rect x="270" y="140" width="34" height="70" rx="16" fill="#F6D9BE" stroke="#1C1537" stroke-width="4"/>
        <ellipse cx="287" cy="135" rx="26" ry="14" fill="var(--tomato)" opacity=".6" stroke="#1C1537" stroke-width="3"/>
        <path d="M340 60 C360 100 330 140 350 200" stroke="var(--liver)" stroke-width="10" fill="none" stroke-linecap="round"/>
        <text x="310" y="236" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">関節と血管</text>` },
      { go: "w-allergy", label: "アレルギーのウィングへ",
        svg: `<circle cx="490" cy="120" r="50" fill="var(--sun)" stroke="#1C1537" stroke-width="4"/>
        ${[[0, -64], [56, -32], [56, 32], [0, 64], [-56, 32], [-56, -32]].map(([x, y]) => `<circle cx="${490 + x}" cy="${120 + y}" r="12" fill="var(--pink)" stroke="#1C1537" stroke-width="3"/>`).join("")}
        <circle class="eye" cx="474" cy="112" r="6" fill="#1C1537"/><circle class="eye" cx="506" cy="112" r="6" fill="#1C1537"/><path d="M478 134 Q490 142 502 134" stroke="#1C1537" stroke-width="4" fill="none"/>
        <text x="490" y="226" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">アレルギー</text>` },
      { go: "w-er", label: "免疫ERへ",
        svg: `<circle cx="300" cy="310" r="40" fill="var(--tomato)" stroke="#1C1537" stroke-width="4"/>
        <text x="300" y="323" text-anchor="middle" font-family="Dela Gothic One" font-size="30" fill="#fff">ER</text>
        <text x="300" y="374" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">免疫ER</text>` },
    ],
  },
  wings: [
    { id: "w-ab", label: "自己抗体", color: "mint", headline: "光る核を読む",
      exhibits: [
        { id: "ana", no: 1, type: "Custom", kind: "ana", title: "抗核抗体の光り方", stampLabel: "抗核抗体",
          how: "蛍光顕微鏡の細胞の光り方から染色型を当て、関係する抗体や病気を答えよう。両方正解を通算4回でスタンプ。", data: anaContent },
        { id: "memory", no: 2, type: "MemoryMatch", title: "自己抗体 神経衰弱", stampLabel: "抗体",
          how: "自己抗体と病気のカードをペアにしよう。全部そろえるとスタンプ。", data: memoryContent },
        { id: "fever", no: 3, type: "DiagnosisLab", title: "熱と関節痛ラボ", stampLabel: "膠原病",
          how: "熱や関節痛の患者が次々やってくる。予算内で検査を選んで診断しよう。4人正解でスタンプ。", data: feverContent },
      ] },
    { id: "w-joint", label: "関節と血管", color: "tomato", labelText: "light", headline: "どこが腫れる？どの太さ？",
      exhibits: [
        { id: "hand", no: 4, type: "Custom", kind: "tapMap", title: "手の関節をタップ", stampLabel: "関節",
          how: "症状から、侵されている手の関節をタップしよう。複数あれば全部選んで決定。通算4回正解でスタンプ。", data: handContent },
        { id: "vasc", no: 5, type: "Custom", kind: "grid", title: "血管炎の太さ", stampLabel: "血管炎",
          how: "症状と検査から、血管炎を大きさで分けよう。通算5人正解でスタンプ。",
          cheatSheet: { ...D, title: "血管炎の分類（Chapel Hill 2012）",
            html: `<table><tr><th>大型</th><td>高安動脈炎、巨細胞性動脈炎</td></tr><tr><th>中型</th><td>結節性多発動脈炎、川崎病</td></tr><tr><th>小型（ANCA）</th><td>顕微鏡的多発血管炎、多発血管炎性肉芽腫症、好酸球性多発血管炎性肉芽腫症</td></tr><tr><th>小型（免疫複合体）</th><td>IgA血管炎、クリオグロブリン血症性血管炎、抗GBM病</td></tr></table>` },
          data: vasculitisContent },
        { id: "versus", no: 6, type: "VersusQuiz", title: "ヒントはどっちの味方？", stampLabel: "対決",
          how: "ヒントがどちらの病気のものか左右で答えよう。6問中5問以上でスタンプ。", data: versusContent },
      ] },
    { id: "w-allergy", label: "アレルギー", color: "sun", headline: "4つの型",
      exhibits: [
        { id: "allergy", no: 7, type: "Custom", kind: "grid", title: "アレルギーの4つの型", stampLabel: "アレルギー",
          how: "病気がどの型のアレルギー反応かを選ぼう。通算5人正解でスタンプ。", data: allergyContent },
      ] },
    { id: "w-er", label: "免疫ER", color: "cobalt", labelText: "light", headline: "暴走を止める",
      exhibits: [
        { id: "er", no: 8, type: "Custom", kind: "scenario", title: "免疫ER", stampLabel: "ER",
          how: "アナフィラキシー、強皮症腎クリーゼ、巨細胞性動脈炎。次の一手を選ぼう。ミス1回までならクリア、通算2シナリオでスタンプ。", data: scenarioContent },
      ] },
  ],
  gacha: {
    wing: "w-ab", title: "免疫の仲間ガチャ", machineLabel: "免疫", intro: "体を守る、たくさんの仲間たち。",
    cost: 30, dupRefund: 10, pityAfterDups: 4,
    // TODO(review) 解説文
    items: [
      { ...D, id: "igg", name: "IgG", rarity: 1, weight: 22, color: "#22C1A0", text: "いちばん多い抗体。胎盤を通る。" },
      { ...D, id: "igm", name: "IgM", rarity: 2, weight: 14, color: "#3D5AFE", text: "5量体。感染の最初に出てくる。" },
      { ...D, id: "iga", name: "IgA", rarity: 2, weight: 14, color: "#FFC933", text: "粘膜と母乳を守る2量体。" },
      { ...D, id: "mac", name: "マクロファージ", rarity: 1, weight: 12, color: "#C8A27A", text: "なんでも食べる掃除屋。抗原を見せる係も。" },
      { ...D, id: "ige", name: "IgE", rarity: 2, weight: 10, color: "#FF7AB6", text: "肥満細胞にくっつき、アレルギーと寄生虫に。" },
      { ...D, id: "c3", name: "補体C3", rarity: 3, weight: 8, color: "#8BD450", text: "補体の中心。下がる腎炎を覚えよう。" },
      { ...D, id: "dc", name: "樹状細胞", rarity: 3, weight: 7, color: "#FF5A36", text: "抗原をT細胞に見せる、いちばんの先生。" },
      { ...D, id: "treg", name: "制御性T細胞", rarity: 3, weight: 7, color: "#9EC8FF", text: "免疫のブレーキ。FOXP3が目印。" },
      { ...D, id: "igd", name: "IgD", rarity: 4, weight: 6, color: "#F3EEDF", text: "B細胞の表面にいる、なぞの多い抗体。" },
    ],
  },
  stampOrder: ["ana", "memory", "fever", "hand", "vasc", "versus", "allergy", "er"],
};
