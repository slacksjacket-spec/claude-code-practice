// 呼吸器ホール（NO.04）。医学内容はすべて未レビュー（review: "draft"）。
import type { Hall } from "../../engine/schema";
import { cxrContent } from "./content/cxr";
import { lungSoundsContent } from "./content/lungSounds";
import { spiroContent } from "./content/spiro";
import { abgContent } from "./content/abg";
import { pleuralContent } from "./content/pleural";
import { adropContent } from "./content/adrop";
import { versusContent } from "./content/versus";
import { scenarioContent } from "./content/scenario";

const D = { review: "draft" as const, sources: [] as string[] };

export const hall: Hall = {
  id: "kokyuki", no: 4, title: "呼吸器ホール",
  catch: "聴いて、測って、読み解いて、息を取り戻す。展示をクリアしてスタンプを8つ集めよう。",
  ticketNote: "肺音は合成した模式。まちがいは収蔵庫へ",
  map: {
    viewBox: "0 0 600 400", ariaLabel: "呼吸器ホールの館内図", hint: "タップすると、その展示室へ移動します",
    organs: [
      { go: "w-image", label: "画像と音のウィングへ",
        svg: `<path d="M300 40 L300 140 M300 140 L262 170 M300 140 L338 170" stroke="#B9BCC5" stroke-width="14" stroke-linecap="round" fill="none"/>
        <path d="M262 160 C200 150 168 220 172 290 C176 340 240 350 280 320 C292 270 290 200 262 160Z" fill="var(--pink)" stroke="#1C1537" stroke-width="4"/>
        <path d="M338 160 C400 150 432 220 428 290 C424 340 360 350 320 320 C308 270 310 200 338 160Z" fill="var(--pink)" stroke="#1C1537" stroke-width="4"/>
        <circle class="eye" cx="226" cy="240" r="7" fill="#1C1537"/><circle class="eye" cx="374" cy="240" r="7" fill="#1C1537"/>
        <path d="M212 272 Q228 284 244 272 M356 272 Q372 284 388 272" stroke="#1C1537" stroke-width="3" fill="none" stroke-linecap="round"/>
        <text x="300" y="380" text-anchor="middle" font-family="Dela Gothic One" font-size="16" fill="var(--ink)">肺（画像と音）</text>` },
      { go: "w-func", label: "呼吸機能と血液ガスのウィングへ",
        svg: `<rect x="40" y="60" width="120" height="90" rx="14" fill="var(--sun)" stroke="#1C1537" stroke-width="4"/>
        <path d="M56 130 C70 70 90 72 100 100 C110 124 130 128 146 128" stroke="#1C1537" stroke-width="4" fill="none"/>
        <text x="100" y="178" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">呼吸機能</text>` },
      { go: "w-dz", label: "病気を見きわめるウィングへ",
        svg: `<path d="M500 60 L500 100 L470 160 C464 176 476 186 490 186 L530 186 C544 186 556 176 550 160 L520 100 L520 60Z" fill="var(--mint)" stroke="#1C1537" stroke-width="4"/>
        <path d="M470 150 L550 150" stroke="#1C1537" stroke-width="3"/>
        <text x="510" y="214" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">病気を見きわめる</text>` },
      { go: "w-er", label: "呼吸器ERへ",
        svg: `<circle cx="510" cy="300" r="40" fill="var(--tomato)" stroke="#1C1537" stroke-width="4"/>
        <text x="510" y="313" text-anchor="middle" font-family="Dela Gothic One" font-size="30" fill="#fff">ER</text>
        <text x="510" y="362" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">呼吸器ER</text>` },
    ],
  },
  wings: [
    { id: "w-image", label: "画像と音", color: "cobalt", labelText: "light", headline: "影を読む、音を聴く",
      exhibits: [
        { id: "cxr", no: 1, type: "Custom", kind: "tapMap", title: "シルエットサイン探し", stampLabel: "X線",
          how: "胸部X線の模式図で、病変がどの肺葉にあるかをタップしよう。輪郭が消える場所がヒント。通算4回正解でスタンプ。",
          cheatSheet: { ...D, title: "シルエットサインと肺葉",
            html: `<table><tr><th>右第1弓（上大静脈）</th><td>右上葉</td></tr><tr><th>右第2弓（右房）</th><td>右中葉</td></tr><tr><th>右横隔膜</th><td>右下葉</td></tr><tr><th>左第1弓（大動脈弓）</th><td>左上葉（上区）</td></tr><tr><th>左第4弓（左室）</th><td>左上葉（舌区）</td></tr><tr><th>左横隔膜・下行大動脈</th><td>左下葉</td></tr></table>` },
          data: cxrContent },
        { id: "lung", no: 2, type: "Custom", kind: "lungSounds", title: "肺音ミキサー", stampLabel: "肺音",
          how: "合成した呼吸音を聴いて（波形も見て）音の種類を当て、考える病気を選ぼう。両方正解を通算4回でスタンプ。",
          cheatSheet: { ...D, title: "副雑音の分類",
            html: `<table><tr><th>連続性・高調</th><td>笛声音（wheezes）…喘息、COPD</td></tr><tr><th>連続性・低調</th><td>いびき音（rhonchi）…痰、太い気道</td></tr><tr><th>断続性・細かい</th><td>捻髪音（fine crackles）…吸気後半、間質性肺炎</td></tr><tr><th>断続性・粗い</th><td>水泡音（coarse crackles）…吸気前半〜、肺水腫・肺炎</td></tr><tr><th>吸気性の喘鳴</th><td>stridor…上気道の狭窄</td></tr><tr><th>胸膜摩擦音</th><td>胸膜炎</td></tr></table>` },
          data: lungSoundsContent },
      ] },
    { id: "w-func", label: "呼吸機能と血液ガス", color: "sun", headline: "測って、読み解く",
      exhibits: [
        { id: "spiro", no: 3, type: "Custom", kind: "grid", title: "スパイロメトリー判定", stampLabel: "スパイロ",
          how: "%肺活量と1秒率から、換気障害の型をマスで答えよう。通算4人正解でスタンプ。", data: spiroContent },
        { id: "abg", no: 4, type: "Custom", kind: "abg", title: "血液ガス道場", stampLabel: "血ガス",
          how: "pH → 一次性の障害 → 代償 →（アニオンギャップ）→ 原因、の順に読もう。全部正解を通算3回でスタンプ。",
          cheatSheet: { ...D, title: "血液ガスを読む順番",
            html: `<ol><li>pH：7.35未満アシデミア、7.45超アルカレミア</li><li>一次性：pHを説明できるのはPaCO₂（呼吸性）かHCO₃⁻（代謝性）か</li><li>代償：代謝性アシドーシスはWinterの式（PaCO₂＝1.5×HCO₃⁻＋8±2）。呼吸性は急性と慢性で変わる</li><li>代謝性アシドーシスならAG＝Na−（Cl＋HCO₃⁻）、12を超えれば開大</li></ol>` },
          data: abgContent },
      ] },
    { id: "w-dz", label: "病気を見きわめる", color: "mint", headline: "水を調べ、重さを数える",
      exhibits: [
        { id: "pleural", no: 5, type: "DiagnosisLab", title: "胸水ラボ", stampLabel: "胸水",
          how: "胸水がたまった患者が次々やってくる。予算内で検査を選んで、原因を診断しよう。4人正解でスタンプ。",
          cheatSheet: { ...D, title: "Lightの基準",
            html: `<p>次のどれか1つでもみたせば滲出性。</p><ul><li>胸水蛋白／血清蛋白 ＞ 0.5</li><li>胸水LDH／血清LDH ＞ 0.6</li><li>胸水LDH ＞ 血清LDHの正常上限の2/3</li></ul><p>漏出性：心不全、肝硬変、ネフローゼ。滲出性：感染、結核（ADA高値）、癌。</p>` },
          data: pleuralContent },
        { id: "adrop", no: 6, type: "ScoreAttack", title: "A-DROPタイムアタック", stampLabel: "A-DROP",
          how: "肺炎の患者の情報から、A-DROPに当てはまる項目をタップして重症度を判定しよう。2回正解でスタンプ。", data: adropContent },
        { id: "versus", no: 7, type: "VersusQuiz", title: "ヒントはどっちの味方？", stampLabel: "対決",
          how: "ヒントがどちらの病気のものか左右で答えよう。6問中5問以上でスタンプ。", data: versusContent },
      ] },
    { id: "w-er", label: "呼吸器ER", color: "tomato", labelText: "light", headline: "息を取り戻す",
      exhibits: [
        { id: "er", no: 8, type: "Custom", kind: "scenario", title: "呼吸器ER", stampLabel: "ER",
          how: "喘息の大発作、COPDの増悪、気胸。状況とバイタルを見て次の一手を選ぼう。ミス1回までならクリア、通算2シナリオでスタンプ。", data: scenarioContent },
      ] },
  ],
  gacha: {
    wing: "w-dz", title: "職業と肺ガチャ", machineLabel: "職業と肺", intro: "吸いこんだものが、肺に病気をつくる。",
    cost: 30, dupRefund: 10, pityAfterDups: 4,
    // 重みは肝胆膵と同じ（コンプまで平均約20回）。TODO(review) 解説文
    items: [
      { ...D, id: "silicosis", name: "珪肺", rarity: 1, weight: 22, color: "#D8D2C4", text: "鋳物工・トンネル工事。上肺野の粒状影、肺門リンパ節の卵殻状石灰化。結核を合併しやすい。" },
      { ...D, id: "plaque", name: "胸膜プラーク", rarity: 2, weight: 14, color: "#F4F4F4", text: "石綿（アスベスト）曝露の目印。壁側胸膜の板状の石灰化。" },
      { ...D, id: "farmer", name: "農夫肺", rarity: 2, weight: 14, color: "#C9A86A", text: "カビの生えた干し草の好熱性放線菌による過敏性肺炎。" },
      { ...D, id: "summer", name: "夏型過敏性肺炎", rarity: 1, weight: 12, color: "#8BD450", text: "日本で多い。古い家のカビ（トリコスポロン）。夏に発症し、家を離れると良くなる。" },
      { ...D, id: "bird", name: "鳥関連過敏性肺炎", rarity: 2, weight: 10, color: "#FFC933", text: "鳥の羽や糞。慢性化して線維化することがある。" },
      { ...D, id: "meso", name: "悪性胸膜中皮腫", rarity: 3, weight: 8, color: "#C8453B", text: "石綿曝露から数十年たって発症。胸膜が厚く不整になる。" },
      { ...D, id: "hardmetal", name: "超硬合金肺", rarity: 3, weight: 7, color: "#6CC9FF", text: "コバルトなど。巨細胞性間質性肺炎。" },
      { ...D, id: "beryllium", name: "ベリリウム肺", rarity: 3, weight: 7, color: "#B05A8A", text: "サルコイドーシスに似た肉芽腫をつくる。" },
      { ...D, id: "humidifier", name: "加湿器肺", rarity: 4, weight: 6, color: "#3D5AFE", text: "汚れた加湿器の微生物による過敏性肺炎。" },
    ],
  },
  stampOrder: ["cxr", "lung", "spiro", "abg", "pleural", "adrop", "versus", "er"],
};
