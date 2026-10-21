// 公衆衛生ホール（NO.20）。疫学と判断に絞る（統計の数値は pubhealth-stats）。医学内容はすべて未レビュー（review: "draft"）。
import type { Hall } from "../../engine/schema";
import { cutoffContent } from "./content/cutoff";
import { versusContent } from "./content/versus";
import { epiContent } from "./content/epi";
import { designContent } from "./content/design";
import { memoryContent } from "./content/memory";
import { preventionContent } from "./content/prevention";
import { occupationalContent } from "./content/occupational";
import { scenarioContent } from "./content/scenario";

const D = { review: "draft" as const, sources: [] as string[] };

export const hall: Hall = {
  id: "koshu", no: 20, title: "公衆衛生ホール",
  catch: "1人ではなく、集団を診る。表とカットオフで考えよう。展示をクリアしてスタンプを8つ集めよう。",
  ticketNote: "a・b・c・dの4つのマスに、答えがある。まちがいは収蔵庫へ",
  map: {
    viewBox: "0 0 600 400", ariaLabel: "公衆衛生ホールの館内図", hint: "タップすると、その展示室へ移動します",
    organs: [
      { go: "w-test", label: "検査を読むウィングへ",
        svg: `<path d="M40 190 C80 190 90 80 130 80 C170 80 180 190 220 190" fill="var(--mint)" fill-opacity=".4" stroke="var(--mint)" stroke-width="4"/>
        <path d="M100 190 C140 190 150 70 190 70 C230 70 240 190 280 190" fill="var(--tomato)" fill-opacity=".35" stroke="var(--tomato)" stroke-width="4"/>
        <line x1="160" y1="50" x2="160" y2="200" stroke="var(--cobalt)" stroke-width="5"/>
        <text x="160" y="230" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">検査を読む</text>` },
      { go: "w-epi", label: "疫学のウィングへ",
        svg: `<rect x="350" y="60" width="160" height="120" rx="12" fill="#fff" stroke="#1C1537" stroke-width="4"/><path d="M430 60 V180 M350 120 H510" stroke="#1C1537" stroke-width="3"/>
        ${[["a", 390, 100], ["b", 470, 100], ["c", 390, 160], ["d", 470, 160]].map(([t, x, y]) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Dela Gothic One" font-size="24" fill="#1C1537">${t}</text>`).join("")}
        <text x="430" y="210" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">疫学</text>` },
      { go: "w-prev", label: "予防と職場のウィングへ",
        svg: `<path d="M120 270 L180 250 L240 270 V320 C240 350 180 370 180 370 C180 370 120 350 120 320Z" fill="var(--sun)" stroke="#1C1537" stroke-width="4"/><path d="M160 310 L176 326 L204 290" stroke="#1C1537" stroke-width="6" fill="none"/>
        <text x="180" y="394" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">予防と職場</text>` },
      { go: "w-field", label: "公衆衛生の現場へ",
        svg: `<circle cx="430" cy="310" r="40" fill="var(--tomato)" stroke="#1C1537" stroke-width="4"/>
        <text x="430" y="320" text-anchor="middle" font-family="Dela Gothic One" font-size="20" fill="#fff">現場</text>
        <text x="430" y="374" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">公衆衛生の現場</text>` },
    ],
  },
  wings: [
    { id: "w-test", label: "検査を読む", color: "cobalt", labelText: "light", headline: "線をどこに引く？",
      exhibits: [
        { id: "cutoff", no: 1, type: "Custom", kind: "cutoff", title: "カットオフを動かせ", stampLabel: "カットオフ",
          how: "病気の人と病気でない人の分布を見ながら、カットオフを動かそう。2×2表と感度・特異度・的中率がその場で変わる。目標を満たして質問にも答えると1回、通算4回でスタンプ。分布は模式。",
          cheatSheet: { ...D, title: "4つの指標",
            html: `<table><tr><th>感度</th><td>a ÷ (a+c)　病気の人のうち陽性</td></tr><tr><th>特異度</th><td>d ÷ (b+d)　病気でない人のうち陰性</td></tr><tr><th>陽性的中率</th><td>a ÷ (a+b)　陽性のうち本当に病気</td></tr><tr><th>陰性的中率</th><td>d ÷ (c+d)　陰性のうち本当に病気でない</td></tr></table><p>的中率は有病率で変わる。</p>` },
          data: cutoffContent },
        { id: "versus", no: 2, type: "VersusQuiz", title: "ヒントはどっちの味方？", stampLabel: "対決",
          how: "ヒントがどちらのものか左右で答えよう。6問中5問以上でスタンプ。", data: versusContent },
      ] },
    { id: "w-epi", label: "疫学", color: "mint", headline: "表から因果を考える",
      exhibits: [
        { id: "epi", no: 3, type: "Custom", kind: "epiCalc", title: "2×2表を計算せよ", stampLabel: "2×2表",
          how: "研究の2×2表から、相対危険・オッズ比・リスク差・NNT・感度などを計算しよう。通算5問正解でスタンプ。", data: epiContent },
        { id: "design", no: 4, type: "Custom", kind: "grid", title: "研究デザインを見抜け", stampLabel: "研究デザイン",
          how: "論文の要旨から研究デザインを選ぼう。通算5本正解でスタンプ。", data: designContent },
        { id: "memory", no: 5, type: "MemoryMatch", title: "バイアス 神経衰弱", stampLabel: "バイアス",
          how: "バイアスの名前と、その例のカードをペアにしよう。全部そろえるとスタンプ。", data: memoryContent },
      ] },
    { id: "w-prev", label: "予防と職場", color: "sun", headline: "病気になる前に",
      exhibits: [
        { id: "prevention", no: 6, type: "Custom", kind: "grid", title: "予防の3段階", stampLabel: "予防",
          how: "取り組みが一次・二次・三次予防のどれかを選ぼう。通算5つ正解でスタンプ。", data: preventionContent },
        { id: "occupational", no: 7, type: "Custom", kind: "grid", title: "産業保健の3管理", stampLabel: "産業保健",
          how: "職場の対策が、作業環境管理・作業管理・健康管理のどれかを選ぼう。通算5つ正解でスタンプ。", data: occupationalContent },
      ] },
    { id: "w-field", label: "公衆衛生の現場", color: "tomato", labelText: "light", headline: "届け出て、広げない",
      exhibits: [
        { id: "field", no: 8, type: "Custom", kind: "scenario", title: "公衆衛生の現場", stampLabel: "現場",
          how: "食中毒の集団発生、結核患者の発生、職場の熱中症。次の一手を選ぼう。ミス1回までならクリア、通算2シナリオでスタンプ。", data: scenarioContent },
      ] },
  ],
  gacha: {
    wing: "w-epi", title: "疫学の道具ガチャ", machineLabel: "疫学の道具", intro: "集団の健康を測る、見えない道具たち。",
    cost: 30, dupRefund: 10, pityAfterDups: 4,
    // TODO(review) 解説文
    items: [
      { ...D, id: "table", name: "2×2表", rarity: 1, weight: 22, color: "#FFFFFF", text: "疫学のすべてはここから。" },
      { ...D, id: "ci", name: "95%信頼区間", rarity: 2, weight: 14, color: "#9EC8FF", text: "相対危険の区間が1をまたげば、有意な差とはいえない。" },
      { ...D, id: "pvalue", name: "p値", rarity: 2, weight: 14, color: "#FF7AB6", text: "差がないとしたときに、これほどの差が偶然出る確率。" },
      { ...D, id: "rr", name: "相対危険", rarity: 1, weight: 12, color: "#22C1A0", text: "曝露で何倍なりやすいか。" },
      { ...D, id: "nnt", name: "NNT", rarity: 2, weight: 10, color: "#FFC933", text: "何人に治療すると1人救えるか。" },
      { ...D, id: "roc", name: "ROC曲線", rarity: 3, weight: 8, color: "#3D5AFE", text: "左上に近いほどよい検査。曲線の下の面積（AUC）で比べる。" },
      { ...D, id: "funnel", name: "ファンネルプロット", rarity: 3, weight: 7, color: "#8BD450", text: "左右非対称なら出版バイアスを疑う。" },
      { ...D, id: "random", name: "無作為化", rarity: 3, weight: 7, color: "#FF5A36", text: "知らない交絡まで両群でそろえる魔法。" },
      { ...D, id: "pump", name: "ブロード街のポンプ", rarity: 4, weight: 6, color: "#C8A27A", text: "John Snowがコレラの地図から止めた井戸。疫学のはじまり。" },
    ],
  },
  stampOrder: ["cutoff", "versus", "epi", "design", "memory", "prevention", "occupational", "field"],
};
