// 精神ホール（NO.13）。医学内容はすべて未レビュー（review: "draft"）。
import type { Hall } from "../../engine/schema";
import { chatContent } from "./content/chat";
import { versusContent } from "./content/versus";
import { bodyContent } from "./content/body";
import { drugsContent } from "./content/drugs";
import { memoryContent } from "./content/memory";
import { admissionContent } from "./content/admission";
import { orderContent } from "./content/order";
import { scenarioContent } from "./content/scenario";

const D = { review: "draft" as const, sources: [] as string[] };

export const hall: Hall = {
  id: "seishin", no: 13, title: "精神ホール",
  catch: "言葉に耳をすまし、体の病気を見逃さない。展示をクリアしてスタンプを8つ集めよう。",
  ticketNote: "その一言に、名前をつけよう。まちがいは収蔵庫へ",
  map: {
    viewBox: "0 0 600 400", ariaLabel: "精神ホールの館内図", hint: "タップすると、その展示室へ移動します",
    organs: [
      { go: "w-talk", label: "言葉を聞くウィングへ",
        svg: `<path d="M60 70 H220 A20 20 0 0 1 240 90 V160 A20 20 0 0 1 220 180 H110 L80 210 L86 180 H60 A20 20 0 0 1 40 160 V90 A20 20 0 0 1 60 70Z" fill="#fff" stroke="#1C1537" stroke-width="4"/>
        <circle cx="100" cy="125" r="9" fill="var(--pink)"/><circle cx="140" cy="125" r="9" fill="var(--sun)"/><circle cx="180" cy="125" r="9" fill="var(--mint)"/>
        <text x="140" y="240" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">言葉を聞く</text>` },
      { go: "w-body", label: "体と薬のウィングへ",
        svg: `<path d="M330 80 C300 80 290 120 304 140 C290 160 310 190 340 186 C350 200 380 200 390 186 C420 190 434 160 420 140 C434 120 424 80 394 80 C384 66 340 66 330 80Z" fill="var(--pink)" stroke="#1C1537" stroke-width="4"/>
        <circle class="eye" cx="346" cy="128" r="6" fill="#1C1537"/><circle class="eye" cx="378" cy="128" r="6" fill="#1C1537"/><path d="M352 152 Q362 160 372 152" stroke="#1C1537" stroke-width="4" fill="none"/>
        <text x="362" y="232" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">体と薬</text>` },
      { go: "w-law", label: "制度と経過のウィングへ",
        svg: `<rect x="460" y="80" width="90" height="110" rx="8" fill="#fff" stroke="#1C1537" stroke-width="4"/><path d="M474 104 H536 M474 124 H536 M474 144 H520" stroke="#9EC8FF" stroke-width="4"/><circle cx="530" cy="172" r="12" fill="var(--tomato)" stroke="#1C1537" stroke-width="3"/>
        <text x="505" y="226" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">制度と経過</text>` },
      { go: "w-er", label: "精神科ERへ",
        svg: `<circle cx="300" cy="320" r="40" fill="var(--tomato)" stroke="#1C1537" stroke-width="4"/>
        <text x="300" y="333" text-anchor="middle" font-family="Dela Gothic One" font-size="30" fill="#fff">ER</text>
        <text x="300" y="384" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">精神科ER</text>` },
    ],
  },
  wings: [
    { id: "w-talk", label: "言葉を聞く", color: "pink", headline: "その一言に名前を",
      exhibits: [
        { id: "chat", no: 1, type: "Custom", kind: "chat", title: "問診チャット", stampLabel: "症状用語",
          how: "患者の言葉が1つずつ届く。その症状の名前を選び、最後に診断を答えよう。用語のまちがい1つまでで診断も正解なら合格、通算3人でスタンプ。", data: chatContent },
        { id: "versus", no: 2, type: "VersusQuiz", title: "ヒントはどっちの味方？", stampLabel: "対決",
          how: "ヒントがどちらの病気のものか左右で答えよう。6問中5問以上でスタンプ。", data: versusContent },
      ] },
    { id: "w-body", label: "体と薬", color: "mint", headline: "体を疑い、薬を知る",
      exhibits: [
        { id: "body", no: 3, type: "DiagnosisLab", title: "まず体を疑えラボ", stampLabel: "器質因",
          how: "精神症状の患者が次々やってくる。予算内で検査を選んで、体の病気がかくれていないか確かめよう。4人正解でスタンプ。", data: bodyContent },
        { id: "drugs", no: 4, type: "Custom", kind: "grid", title: "薬の副作用の4マス", stampLabel: "副作用",
          how: "経過と症状から副作用の種類を選び、対応を決めよう。両方正解を通算4人でスタンプ。", data: drugsContent },
        { id: "memory", no: 5, type: "MemoryMatch", title: "精神科の薬 神経衰弱", stampLabel: "薬",
          how: "薬と、その特徴・副作用のカードをペアにしよう。全部そろえるとスタンプ。", data: memoryContent },
      ] },
    { id: "w-law", label: "制度と経過", color: "sun", headline: "時間と法律",
      exhibits: [
        { id: "admission", no: 6, type: "AlgorithmBoard", title: "入院形態すごろく", stampLabel: "入院形態",
          how: "本人の同意 → 自傷他害 → 指定医・家族等。分かれ道を進んで入院形態を決めよう。4人ゴールでスタンプ。",
          cheatSheet: { ...D, title: "5つの入院形態",
            html: `<table><tr><th>任意入院</th><td>本人の同意</td></tr><tr><th>医療保護入院</th><td>指定医1名＋家族等の同意</td></tr><tr><th>措置入院</th><td>自傷他害のおそれ。指定医2名＋知事</td></tr><tr><th>緊急措置入院</th><td>指定医1名、72時間まで</td></tr><tr><th>応急入院</th><td>家族等の同意が得られない急を要する場合、72時間まで</td></tr></table>` },
          data: admissionContent },
        { id: "order", no: 7, type: "Custom", kind: "order", title: "順番に並べよ", stampLabel: "経過",
          how: "離脱症状、見当識、睡眠、薬の効き方。正しい順にタップしよう。ノーミスを通算3問でスタンプ。", data: orderContent },
      ] },
    { id: "w-er", label: "精神科ER", color: "cobalt", labelText: "light", headline: "安全をまもる",
      exhibits: [
        { id: "er", no: 8, type: "Custom", kind: "scenario", title: "精神科ER", stampLabel: "ER",
          how: "振戦せん妄、神経性やせ症の入院、自殺の危険。次の一手を選ぼう。ミス1回までならクリア、通算2シナリオでスタンプ。", data: scenarioContent },
      ] },
  ],
  gacha: {
    wing: "w-talk", title: "神経伝達物質ガチャ", machineLabel: "伝達物質", intro: "心を動かす、小さな化学のメッセンジャー。",
    cost: 30, dupRefund: 10, pityAfterDups: 4,
    // TODO(review) 解説文
    items: [
      { ...D, id: "da", name: "ドパミン", rarity: 1, weight: 22, color: "#FF5A36", text: "報酬と運動。多すぎると幻覚、少なすぎるとパーキンソン症状。" },
      { ...D, id: "5ht", name: "セロトニン", rarity: 2, weight: 14, color: "#FFC933", text: "気分と不安。SSRIで増やす。" },
      { ...D, id: "ne", name: "ノルアドレナリン", rarity: 2, weight: 14, color: "#C8453B", text: "覚醒と注意。青斑核から。" },
      { ...D, id: "gaba", name: "GABA", rarity: 1, weight: 12, color: "#3D5AFE", text: "脳のブレーキ。ベンゾジアゼピンとアルコールが効く場所。" },
      { ...D, id: "glu", name: "グルタミン酸", rarity: 2, weight: 10, color: "#22C1A0", text: "脳のアクセル。NMDA受容体。" },
      { ...D, id: "ach", name: "アセチルコリン", rarity: 3, weight: 8, color: "#8BD450", text: "記憶。Alzheimer型認知症で減る。" },
      { ...D, id: "hist", name: "ヒスタミン", rarity: 3, weight: 7, color: "#FF7AB6", text: "目を覚ます。抗ヒスタミン薬で眠くなる理由。" },
      { ...D, id: "orexin", name: "オレキシン", rarity: 3, weight: 7, color: "#9EC8FF", text: "覚醒を保つ。足りないとナルコレプシー。" },
      { ...D, id: "mel", name: "メラトニン", rarity: 4, weight: 6, color: "#F3EEDF", text: "夜をつげる松果体のホルモン。" },
    ],
  },
  stampOrder: ["chat", "versus", "body", "drugs", "memory", "admission", "order", "er"],
};
