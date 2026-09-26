// 消化管ホール（NO.02）。Phase 2 で新しく作ったホール。医学内容はすべて未レビュー（review: "draft"）。
// 展示のうち6つはこのホール専用のゲーム（exhibits/）。データは content/ に分けてある。
import type { Hall } from "../../engine/schema";
import { revealContent } from "./content/reveal";
import { endoscopyContent } from "./content/endoscopy";
import { depthContent } from "./content/depth";
import { pyloriContent } from "./content/pylori";
import { resectionContent } from "./content/resection";
import { versusContent } from "./content/versus";
import { foodTimelineContent } from "./content/foodTimeline";
import { clueRaceContent } from "./content/clueRace";

const face = (x: number, y: number, r = 5) =>
  `<circle class="eye" cx="${x}" cy="${y}" r="${r}" fill="#1C1537"/><circle class="eye" cx="${x + r * 5}" cy="${y - 2}" r="${r}" fill="#1C1537"/>`;

export const hall: Hall = {
  id: "shokakan",
  no: 2,
  title: "消化管ホール",
  catch: "のぞいて、見つけて、切って、ときどき早押し。展示をクリアしてスタンプを8つ集めよう。",
  ticketNote: "正解でコイン、まちがいは収蔵庫へ",

  map: {
    viewBox: "0 0 600 440",
    ariaLabel: "消化管ホールの館内図",
    hint: "臓器をタップすると、その展示室へ移動します",
    organs: [
      {
        go: "w-lower", label: "腸ウィングへ（大腸）",
        svg: `<path d="M150 410 L150 300 C150 280 160 272 182 272 L428 272 C450 272 460 280 460 300 L460 380 C460 414 420 424 396 404 L372 428" fill="none" stroke="var(--sun)" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M150 410 L150 300 C150 280 160 272 182 272 L428 272 C450 272 460 280 460 300 L460 380 C460 414 420 424 396 404 L372 428" fill="none" stroke="#1C1537" stroke-width="3" stroke-dasharray="2 14" stroke-linecap="round"/>
        ${face(222, 272, 5)}
        <text x="486" y="330" font-family="Dela Gothic One" font-size="17" fill="var(--ink)">大腸</text>`,
      },
      {
        go: "w-lower", label: "腸ウィングへ（小腸）",
        svg: `<path d="M204 330 C224 306 262 350 284 326 C304 304 342 346 364 324 C386 302 420 334 408 364 C398 390 356 374 334 386 C304 402 266 374 236 390 C214 402 192 376 204 354" fill="none" stroke="var(--bile)" stroke-width="20" stroke-linecap="round"/>
        ${face(296, 356, 4)}
        <path d="M300 370 Q308 376 316 368" stroke="#1C1537" stroke-width="3" fill="none" stroke-linecap="round"/>
        <text x="268" y="420" font-family="Dela Gothic One" font-size="15" fill="var(--ink)">小腸</text>`,
      },
      {
        go: "w-upper", label: "食道・胃ウィングへ（食道）",
        svg: `<path d="M282 14 L288 120" stroke="var(--pink)" stroke-width="22" stroke-linecap="round"/>
        <text x="306" y="60" font-family="Dela Gothic One" font-size="16" fill="var(--ink)">食道</text>`,
      },
      {
        go: "w-upper", label: "食道・胃ウィングへ（胃）",
        svg: `<path d="M288 116 C250 120 232 170 256 208 C284 252 384 256 406 198 C420 160 386 128 354 146 C332 160 318 168 300 146 C292 134 294 122 288 116Z" fill="#FF9E80" stroke="#1C1537" stroke-width="4"/>
        <ellipse cx="316" cy="200" rx="11" ry="12" fill="#fff" stroke="#1C1537" stroke-width="3"/><circle class="eye" cx="318" cy="203" r="5" fill="#1C1537"/>
        <ellipse cx="350" cy="196" rx="11" ry="12" fill="#fff" stroke="#1C1537" stroke-width="3"/><circle class="eye" cx="352" cy="199" r="5" fill="#1C1537"/>
        <path d="M322 226 Q336 238 350 224" stroke="#1C1537" stroke-width="4" fill="none" stroke-linecap="round"/>
        <ellipse cx="298" cy="222" rx="10" ry="6" fill="var(--pink)" opacity=".8"/><ellipse cx="372" cy="216" rx="10" ry="6" fill="var(--pink)" opacity=".8"/>
        <text x="410" y="150" font-family="Dela Gothic One" font-size="20" fill="var(--ink)">胃</text>`,
      },
      {
        go: "w-food", label: "食中毒の間へ",
        svg: `<path d="M520 40 C528 40 572 116 566 124 C562 130 478 130 474 124 C468 116 512 40 520 40Z" fill="#fff" stroke="#1C1537" stroke-width="4"/>
        <rect x="500" y="100" width="40" height="28" rx="4" fill="#1C1537"/>
        ${face(508, 84, 4)}
        <text x="520" y="156" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">食中毒の間</text>`,
      },
      {
        go: "w-abd", label: "急性腹症ERへ",
        svg: `<circle cx="84" cy="96" r="44" fill="var(--cobalt)" stroke="#1C1537" stroke-width="4"/>
        <text x="84" y="110" text-anchor="middle" font-family="Dela Gothic One" font-size="34" fill="#fff">ER</text>
        <text x="84" y="160" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">急性腹症ER</text>`,
      },
    ],
  },

  wings: [
    {
      id: "w-upper", label: "食道・胃ウィング", color: "pink", headline: "のぞいて、見つけて、けずる",
      exhibits: [
        { id: "reveal", no: 1, type: "Custom", kind: "reveal", title: "造影シルエット早押し", stampLabel: "影絵",
          how: "ぼやけた造影の模式図が少しずつくっきりする。早く当てるほどコインが多い。まちがえると1段見えてしまう。通算4枚を一発正解でスタンプ。",
          data: revealContent },
        { id: "endoscopy", no: 2, type: "Custom", kind: "endoscopy", title: "内視鏡ラン", stampLabel: "内視鏡",
          how: "内視鏡を進めると病変が次々に現れる。見つけたら、どうするかを即決しよう。5つ中4つ正しければ検査クリアでスタンプ。",
          // TODO(review) Forrest分類と止血の適応
          cheatSheet: { review: "draft", sources: [], title: "上部消化管出血：Forrest分類",
            html: `<table><tr><th>Ia</th><td>噴出性の出血</td></tr><tr><th>Ib</th><td>湧き出るような出血</td></tr><tr><th>IIa</th><td>露出血管（いまは止まっている）</td></tr><tr><th>IIb</th><td>凝血塊が付いている</td></tr><tr><th>IIc</th><td>潰瘍底に黒い点（平坦な色素沈着）</td></tr><tr><th>III</th><td>潰瘍底はきれい（白苔のみ）</td></tr></table><p>Ia・Ib・IIa は内視鏡的止血の適応。IIb は凝血塊を除いて判断。IIc・III は止血不要。</p><p>止血のあとはPPIで治療し、ピロリ菌を調べて除菌する。</p>` },
          data: endoscopyContent },
        { id: "depth", no: 3, type: "Custom", kind: "depth", title: "深達度タップ", stampLabel: "深達度",
          how: "壁の断面図で、がんがどこまで届いたかをタップ。それから治療を選ぼう。両方正解を通算4症例でスタンプ。",
          // TODO(review) 胃癌治療ガイドライン第6版の内視鏡的切除の適応、大腸T1癌の基準
          cheatSheet: { review: "draft", sources: ["胃癌治療ガイドライン 第6版（2021）", "大腸癌治療ガイドライン"], title: "内視鏡的切除の適応（早期癌）",
            html: `<h4>胃癌（cT1a＝粘膜内、が前提）</h4><table><tr><th>分化型・潰瘍なし</th><td>大きさを問わず適応</td></tr><tr><th>分化型・潰瘍あり</th><td>3cm以下なら適応</td></tr><tr><th>未分化型・潰瘍なし</th><td>2cm以下なら適応</td></tr></table><p>粘膜下層に深く入る（cT1b）、固有筋層より深いものは外科手術（リンパ節郭清）。</p><h4>大腸癌</h4><p>粘膜内癌（Tis）とSM浸潤が浅いもの（1000μm未満）は内視鏡的切除。1000μm以上は外科手術を考える。</p>` },
          data: depthContent },
        { id: "pylori", no: 4, type: "AlgorithmBoard", title: "ピロリ除菌すごろく", stampLabel: "ピロリ",
          how: "患者カードを見て分かれ道を選び、ゴールで次の一手を決めよう。まちがえるとコマが戻る。4人ゴールでスタンプ。",
          // TODO(review)
          cheatSheet: { review: "draft", sources: ["H. pylori感染の診断と治療のガイドライン 2016改訂版"], title: "ピロリ菌の診断と除菌",
            html: `<h4>感染診断</h4><table><tr><th>内視鏡で</th><td>迅速ウレアーゼ試験、鏡検、培養</td></tr><tr><th>内視鏡なしで</th><td>尿素呼気試験、便中抗原、血清・尿の抗体</td></tr></table><p>PPI・P-CABは、抗体以外の検査を偽陰性にしうる。</p><h4>除菌</h4><table><tr><th>一次</th><td>P-CABかPPI＋アモキシシリン＋クラリスロマイシン（7日）</td></tr><tr><th>二次</th><td>P-CABかPPI＋アモキシシリン＋メトロニダゾール（7日）</td></tr></table><p>除菌判定は治療終了から4週以上あけて、尿素呼気試験か便中抗原で。</p>` },
          data: pyloriContent },
      ],
    },
    {
      id: "w-lower", label: "腸ウィング", color: "sun", headline: "ただれる、つまる、切る",
      exhibits: [
        { id: "resection", no: 5, type: "Custom", kind: "resection", title: "切除範囲をなぞる", stampLabel: "切除",
          how: "病変の場所を見て、大腸のどこからどこまで切るかをタップで選ぼう。選んだ範囲で術式が決まる。通算4人正解でスタンプ。",
          data: resectionContent },
        { id: "versus", no: 6, type: "VersusQuiz", title: "ヒントはどっちの味方？", stampLabel: "対決",
          how: "ヒントがどちらの病気のものか左右で答えよう。連続正解でコンボ。6問中5問以上でスタンプ。",
          data: versusContent },
      ],
    },
    {
      id: "w-food", label: "食中毒の間", color: "mint", headline: "いつ、なにを食べた？",
      exhibits: [
        { id: "food", no: 7, type: "Custom", kind: "foodTimeline", title: "食中毒の犯人さがし", stampLabel: "食中毒",
          how: "発症から時計を巻き戻して、あやしい食事を見つけ、原因を当てよう。両方正解を通算4件でスタンプ。",
          // TODO(review) 潜伏期の値
          cheatSheet: { review: "draft", sources: [], title: "おもな食中毒の潜伏期",
            html: `<table><tr><th>〜6時間</th><td>黄色ブドウ球菌、セレウス菌（嘔吐型）…毒素型で熱が出にくい</td></tr><tr><th>6〜24時間</th><td>ウェルシュ菌、腸炎ビブリオ</td></tr><tr><th>半日〜3日</th><td>サルモネラ</td></tr><tr><th>1〜2日</th><td>ノロウイルス</td></tr><tr><th>2〜7日</th><td>カンピロバクター</td></tr><tr><th>3〜8日</th><td>腸管出血性大腸菌</td></tr></table>` },
          data: foodTimelineContent },
      ],
    },
    {
      id: "w-abd", label: "急性腹症ER", color: "cobalt", labelText: "light", headline: "どこが、いつから痛い？",
      exhibits: [
        { id: "race", no: 8, type: "Custom", kind: "clueRace", title: "早押し問診", stampLabel: "早押し",
          how: "問診・所見・検査のカードが1枚ずつめくれる。わかった瞬間に答えよう。少ない枚数ほど高得点。3枚以内の正解を通算4人でスタンプ。",
          data: clueRaceContent },
      ],
    },
  ],

  gacha: {
    wing: "w-lower",
    title: "ポリープガチャ",
    machineLabel: "ポリープ",
    intro: "消化管のポリープは、できる場所と組織でまったく違う。",
    cost: 30,
    dupRefund: 10,
    pityAfterDups: 4,
    // 重みは肝胆膵と同じ（コンプまで平均約20回）。TODO(review) 解説文
    items: [
      { review: "draft", sources: [], id: "hyper", name: "過形成性ポリープ", rarity: 1, weight: 22, color: "#FFD95A", text: "胃にも大腸にも多い。多くは癌にならず、大きいものや出血するものは切除。" },
      { review: "draft", sources: [], id: "inflam", name: "炎症性ポリープ", rarity: 2, weight: 14, color: "#FF9E80", text: "潰瘍性大腸炎などの炎症のあとにできる、残った粘膜の盛り上がり（偽ポリープ）。" },
      { review: "draft", sources: [], id: "juvenile", name: "若年性ポリープ", rarity: 2, weight: 14, color: "#FF7AB6", text: "子どもの血便の原因。赤くて表面がなめらか、自然に取れることもある。" },
      { review: "draft", sources: [], id: "fundic", name: "胃底腺ポリープ", rarity: 1, weight: 12, color: "#BFE8FF", text: "ピロリ菌のいない胃に多い。癌になることはまれで経過観察。" },
      { review: "draft", sources: [], id: "adenoma", name: "大腸腺腫", rarity: 2, weight: 10, color: "#8BD450", text: "大腸癌の多くは腺腫から育つ（adenoma-carcinoma sequence）。内視鏡で切除する。" },
      { review: "draft", sources: [], id: "ssl", name: "鋸歯状病変（SSL）", rarity: 3, weight: 8, color: "#C8453B", text: "右側結腸に多い平たい病変。鋸歯状経路で癌になることがあり、見逃しやすい。" },
      { review: "draft", sources: [], id: "pj", name: "Peutz-Jeghers症候群", rarity: 3, weight: 7, color: "#6CC9FF", text: "過誤腫性ポリープが多発し、唇や指先に色素斑。常染色体顕性遺伝（STK11）。腸重積の原因にも。" },
      { review: "draft", sources: [], id: "fap", name: "家族性大腸腺腫症", rarity: 3, weight: 7, color: "#F4F4F4", text: "大腸に100個以上の腺腫。APC遺伝子。放っておくとほぼ必ず癌になるので、予防的に大腸全摘。" },
      { review: "draft", sources: [], id: "ccs", name: "Cronkhite-Canada症候群", rarity: 4, weight: 6, color: "#3D5AFE", text: "遺伝しないポリポーシス。脱毛、爪の萎縮、皮膚の色素沈着、下痢と低たんぱく血症。" },
    ],
  },

  stampOrder: ["reveal", "endoscopy", "depth", "pylori", "resection", "versus", "food", "race"],
};
