// 感染症ホール（NO.10）。医学内容はすべて未レビュー（review: "draft"）。
import type { Hall } from "../../engine/schema";
import { gramContent } from "./content/gram";
import { spectrumContent } from "./content/spectrum";
import { csfContent } from "./content/csf";
import { travelContent } from "./content/travel";
import { memoryContent } from "./content/memory";
import { versusContent } from "./content/versus";
import { precautionContent } from "./content/precaution";
import { scenarioContent } from "./content/scenario";

const D = { review: "draft" as const, sources: [] as string[] };

export const hall: Hall = {
  id: "kansen", no: 10, title: "感染症ホール",
  catch: "菌を見て、薬を選んで、広げない。展示をクリアしてスタンプを8つ集めよう。",
  ticketNote: "その抗菌薬、本当に効く？ まちがいは収蔵庫へ",
  map: {
    viewBox: "0 0 600 400", ariaLabel: "感染症ホールの館内図", hint: "タップすると、その展示室へ移動します",
    organs: [
      { go: "w-micro", label: "菌と薬のウィングへ",
        svg: `<rect x="70" y="90" width="120" height="50" rx="25" fill="#E0507A" stroke="#1C1537" stroke-width="4"/>
        ${[[-40, -30], [0, -36], [40, -30], [-40, 30], [0, 36], [40, 30]].map(([x, y]) => `<path d="M${130 + x * 0.9} ${115 + y * 0.6} l${x * 0.3} ${y * 0.4}" stroke="#1C1537" stroke-width="3"/>`).join("")}
        <circle class="eye" cx="112" cy="110" r="6" fill="#fff"/><circle class="eye" cx="148" cy="110" r="6" fill="#fff"/><path d="M120 124 Q130 130 140 124" stroke="#fff" stroke-width="3" fill="none"/>
        <rect x="80" y="180" width="70" height="30" rx="15" fill="var(--tomato)" stroke="#1C1537" stroke-width="4"/><rect x="115" y="180" width="35" height="30" rx="0" fill="#fff" stroke="#1C1537" stroke-width="4"/>
        <text x="130" y="246" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">菌と薬</text>` },
      { go: "w-dx", label: "感染症の診断のウィングへ",
        svg: `<circle cx="320" cy="130" r="56" fill="#9EC8FF" stroke="#1C1537" stroke-width="4"/><path d="M280 90 L250 60 M360 90 L390 60 M320 74 V40 M264 140 H232 M376 140 H408" stroke="#1C1537" stroke-width="4"/>
        <circle class="eye" cx="302" cy="124" r="7" fill="#1C1537"/><circle class="eye" cx="338" cy="124" r="7" fill="#1C1537"/><path d="M306 150 Q320 140 334 150" stroke="#1C1537" stroke-width="4" fill="none"/>
        <text x="320" y="226" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">感染症の診断</text>` },
      { go: "w-ic", label: "感染対策のウィングへ",
        svg: `<path d="M470 80 C470 60 540 60 540 80 L540 150 C540 170 470 170 470 150Z" fill="#fff" stroke="#1C1537" stroke-width="4"/><path d="M470 100 L450 90 M540 100 L560 90" stroke="#1C1537" stroke-width="3"/><path d="M480 110 H530 M480 125 H530 M480 140 H530" stroke="#9EC8FF" stroke-width="3"/>
        <text x="505" y="200" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">感染対策</text>` },
      { go: "w-er", label: "感染症ERへ",
        svg: `<circle cx="300" cy="320" r="40" fill="var(--tomato)" stroke="#1C1537" stroke-width="4"/>
        <text x="300" y="333" text-anchor="middle" font-family="Dela Gothic One" font-size="30" fill="#fff">ER</text>
        <text x="300" y="384" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">感染症ER</text>` },
    ],
  },
  wings: [
    { id: "w-micro", label: "菌と薬", color: "pink", headline: "見て、選ぶ",
      exhibits: [
        { id: "gram", no: 1, type: "Custom", kind: "microscope", title: "グラム染色で探せ", stampLabel: "グラム染色",
          how: "グラム染色の視野から菌を全部タップで見つけ、菌の名前や治療を答えよう。両方正解を通算4回でスタンプ。", data: gramContent },
        { id: "spectrum", no: 2, type: "Custom", kind: "spectrum", title: "抗菌薬スペクトラム", stampLabel: "抗菌薬",
          how: "薬のカードを見て、ふつう効く菌を全部選ぼう。まちがい1つまでなら合格、通算4回でスタンプ。（国試向けに単純化。実際は地域の耐性率と感受性結果で決める）",
          cheatSheet: { ...D, title: "覚え方のめやす",
            html: `<table><tr><th>腸球菌</th><td>セフェム系はすべて効かない。アンピシリンかバンコマイシン</td></tr><tr><th>緑膿菌</th><td>ピペラシリン・タゾバクタム、セフタジジム・セフェピム、カルバペネム、キノロン、アミノグリコシド</td></tr><tr><th>嫌気性菌</th><td>βラクタマーゼ阻害薬配合、カルバペネム、メトロニダゾール</td></tr><tr><th>MRSA</th><td>バンコマイシン、ダプトマイシン、リネゾリド、（ST合剤）</td></tr></table>` },
          data: spectrumContent },
      ] },
    { id: "w-dx", label: "感染症の診断", color: "cobalt", labelText: "light", headline: "どこから、何が？",
      exhibits: [
        { id: "csf", no: 3, type: "Custom", kind: "grid", title: "髄液を読む", stampLabel: "髄液",
          how: "髄液の細胞と糖からマスを選び、治療を決めよう。両方正解を通算4人でスタンプ。", data: csfContent },
        { id: "travel", no: 4, type: "DiagnosisLab", title: "帰国後の発熱ラボ", stampLabel: "渡航",
          how: "海外から帰ってきた発熱の患者。予算内で検査を選んで診断しよう。4人正解でスタンプ。", data: travelContent },
        { id: "memory", no: 5, type: "MemoryMatch", title: "動物と虫 神経衰弱", stampLabel: "動物と虫",
          how: "動物・虫と、それが運ぶ感染症のカードをペアにしよう。全部そろえるとスタンプ。", data: memoryContent },
        { id: "versus", no: 6, type: "VersusQuiz", title: "ヒントはどっちの味方？", stampLabel: "対決",
          how: "ヒントがどちらの病気のものか左右で答えよう。6問中5問以上でスタンプ。", data: versusContent },
      ] },
    { id: "w-ic", label: "感染対策", color: "mint", headline: "広げない",
      exhibits: [
        { id: "precaution", no: 7, type: "Custom", kind: "grid", title: "どの予防策？", stampLabel: "予防策",
          how: "標準予防策に加えて、接触・飛沫・空気のどれが必要かを選ぼう。通算5人正解でスタンプ。", data: precautionContent },
      ] },
    { id: "w-er", label: "感染症ER", color: "tomato", labelText: "light", headline: "1時間以内に",
      exhibits: [
        { id: "er", no: 8, type: "Custom", kind: "scenario", title: "感染症ER", stampLabel: "ER",
          how: "敗血症性ショック、針刺し事故、重症マラリア。次の一手を選ぼう。ミス1回までならクリア、通算2シナリオでスタンプ。", data: scenarioContent },
      ] },
  ],
  gacha: {
    wing: "w-micro", title: "微生物ガチャ", machineLabel: "微生物", intro: "目に見えない、小さな住人たち。",
    cost: 30, dupRefund: 10, pityAfterDups: 4,
    // TODO(review) 解説文
    items: [
      { ...D, id: "ecoli", name: "大腸菌", rarity: 1, weight: 22, color: "#E0507A", text: "腸の常在菌。尿路感染症の主役。" },
      { ...D, id: "saureus", name: "黄色ブドウ球菌", rarity: 2, weight: 14, color: "#FFC933", text: "ブドウの房。皮膚、骨、心臓の弁まで。" },
      { ...D, id: "spneumo", name: "肺炎球菌", rarity: 2, weight: 14, color: "#4A2A8C", text: "莢膜をもつ双球菌。肺炎・髄膜炎・中耳炎。" },
      { ...D, id: "candida", name: "カンジダ", rarity: 1, weight: 12, color: "#F3EEDF", text: "出芽する酵母。口の中の白い苔から血流感染まで。" },
      { ...D, id: "pseudo", name: "緑膿菌", rarity: 2, weight: 10, color: "#22C1A0", text: "水回りが好き。緑色の色素と独特のにおい。" },
      { ...D, id: "cdiff", name: "クロストリディオイデス・ディフィシル", rarity: 3, weight: 8, color: "#C8A27A", text: "芽胞でアルコールに負けない。抗菌薬のあとの下痢。" },
      { ...D, id: "tb", name: "結核菌", rarity: 3, weight: 7, color: "#FF5A36", text: "抗酸菌。Ziehl-Neelsen染色で赤く光る。" },
      { ...D, id: "listeria", name: "リステリア", rarity: 3, weight: 7, color: "#8BD450", text: "冷蔵庫でも増える。妊婦と高齢者の髄膜炎。" },
      { ...D, id: "plasmodium", name: "熱帯熱マラリア原虫", rarity: 4, weight: 6, color: "#FF7AB6", text: "赤血球の中の輪っか。命にかかわる旅のお土産。" },
    ],
  },
  stampOrder: ["gram", "spectrum", "csf", "travel", "memory", "versus", "precaution", "er"],
};
