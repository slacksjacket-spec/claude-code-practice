// 肝胆膵ホール（NO.03）。reference/kantansui_hall_v2.html から移植中。
// Phase 0：ホールの骨格（館内図・ウィング・カンペ・ガチャ）だけ。展示の中身は Phase 1 で移す。
import type { Hall } from "../../engine/schema";

export const hall: Hall = {
  id: "kantansui",
  no: 3,
  title: "肝胆膵ホール",
  version: "ver.2",
  catch: "診断して、治療して、ときどきガチャを回す。展示をクリアしてスタンプを8つ集めよう。",
  ticketNote: "正解でコイン、まちがいは収蔵庫へ",
  footerNote: "肝細胞癌の治療分岐は2021年版の骨格を使用（2025年版で改訂あり）。",

  map: {
    viewBox: "0 0 600 420",
    ariaLabel: "肝胆膵ホールの館内図",
    hint: "臓器をタップすると、その展示室へ移動します",
    // 描く順＝重なり順（後ろほど手前）
    organs: [
      {
        go: "w-marker", label: "マーカーの間へ",
        svg: `<path d="M300 250 C250 250 236 300 250 340 C266 386 360 392 380 350" fill="none" stroke="#FFB38A" stroke-width="44" stroke-linecap="round"/>
        <text x="228" y="398" font-family="Dela Gothic One" font-size="16" fill="var(--ink)">十二指腸（マーカーの間）</text>`,
      },
      {
        go: "w-pan", label: "膵ウィングへ",
        svg: `<path d="M280 318 C300 290 380 292 450 282 C500 276 548 262 556 286 C564 312 520 326 470 330 C410 336 350 350 300 350 C278 350 268 334 280 318Z" fill="var(--sun)" stroke="#1C1537" stroke-width="4"/>
        <circle class="eye" cx="410" cy="306" r="5" fill="#1C1537"/><circle class="eye" cx="436" cy="303" r="5" fill="#1C1537"/>
        <path d="M414 318 Q424 326 434 316" stroke="#1C1537" stroke-width="3" fill="none" stroke-linecap="round"/>
        <text x="456" y="358" font-family="Dela Gothic One" font-size="18" fill="var(--ink)">膵臓</text>`,
      },
      {
        go: "w-duct", label: "胆管ウィングへ",
        svg: `<path d="M300 170 C302 210 296 240 290 280" stroke="var(--bile)" stroke-width="18" fill="none" stroke-linecap="round"/>
        <text x="312" y="236" font-family="Dela Gothic One" font-size="16" fill="var(--ink)">胆管</text>`,
      },
      {
        go: "w-liver", label: "肝ウィングへ",
        svg: `<path d="M40 120 C40 50 150 22 280 30 C390 36 470 60 470 104 C470 150 390 170 320 186 C250 204 150 226 90 206 C54 194 40 160 40 120Z" fill="var(--liver)" stroke="#1C1537" stroke-width="4"/>
        <ellipse cx="200" cy="100" rx="16" ry="18" fill="#fff" stroke="#1C1537" stroke-width="3"/><circle class="eye" cx="204" cy="104" r="8" fill="#1C1537"/>
        <ellipse cx="260" cy="100" rx="16" ry="18" fill="#fff" stroke="#1C1537" stroke-width="3"/><circle class="eye" cx="264" cy="104" r="8" fill="#1C1537"/>
        <path d="M212 140 Q232 158 252 140" stroke="#1C1537" stroke-width="4" fill="none" stroke-linecap="round"/>
        <ellipse cx="172" cy="134" rx="12" ry="7" fill="var(--pink)" opacity=".8"/><ellipse cx="292" cy="134" rx="12" ry="7" fill="var(--pink)" opacity=".8"/>
        <text x="370" y="80" font-family="Dela Gothic One" font-size="26" fill="#fff">肝臓</text>`,
      },
      {
        go: "w-gb", label: "胆のうウィングへ",
        svg: `<path d="M232 196 C220 236 238 276 262 270 C286 264 290 222 282 190 Z" fill="var(--bile)" stroke="#1C1537" stroke-width="4"/>
        <circle class="eye" cx="252" cy="232" r="4" fill="#1C1537"/><circle class="eye" cx="268" cy="230" r="4" fill="#1C1537"/>
        <text x="120" y="260" font-family="Dela Gothic One" font-size="16" fill="var(--ink)">胆のう</text>`,
      },
      {
        go: "w-vs", label: "対決の間へ",
        svg: `<circle cx="530" cy="150" r="44" fill="var(--tomato)" stroke="#1C1537" stroke-width="4"/>
        <text x="530" y="164" text-anchor="middle" font-family="Dela Gothic One" font-size="34" fill="#fff">VS</text>
        <text x="530" y="214" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">対決の間</text>`,
      },
    ],
  },

  wings: [
    {
      id: "w-liver", label: "肝ウィング", color: "liver", labelText: "light", headline: "黄色くなる、つまる、ふえる",
      exhibits: [
        {
          id: "lab", no: 1, type: "Placeholder", plannedType: "DiagnosisLab",
          title: "黄疸診断ラボ", stampLabel: "黄疸ラボ",
          how: "黄疸の患者が次々やってくる。予算内で検査を選んで、診断をつけよう。予算が余るほどボーナス。4人正解でスタンプ。",
        },
        {
          id: "portal", no: 2, type: "Placeholder", plannedType: "PathoSim",
          title: "門脈の渋滞マップ", stampLabel: "門脈",
          how: "門脈圧を上げて、血液がどこへあふれ出すかを見よう。そのあと5つの治療ミッションに挑戦。",
        },
        {
          id: "hbv", no: 3, type: "Placeholder", plannedType: "DecodePuzzle",
          title: "HBVマーカー解読パズル", stampLabel: "HBV",
          how: "ランプの点き方から、この人のB型肝炎の状態を解読しよう。6問中5問正解でスタンプ。「ランプを点けろ」モードもあるよ。",
          // TODO(review) 試作からの転記。「既往感染でHBc抗体を低力価と表示」の簡略化を含む
          cheatSheet: {
            review: "draft", sources: [],
            title: "HBVマーカーの読み方",
            html: `<table><tr><th>HBs抗原</th><td>いま感染している</td></tr><tr><th>HBs抗体</th><td>免疫がある（治癒またはワクチン）</td></tr><tr><th>IgM-HBc抗体</th><td>急性感染（高力価）</td></tr><tr><th>HBc抗体</th><td>感染したことがある。高力価なら持続感染、低力価なら既往。ワクチンではできない</td></tr><tr><th>HBe抗原</th><td>ウイルスの増殖が盛ん</td></tr><tr><th>HBe抗体</th><td>増殖がおさまった（セロコンバージョン）</td></tr></table>
 <h4>パターン</h4><table><tr><th>急性B型肝炎</th><td>HBs抗原＋、IgM-HBc抗体＋</td></tr><tr><th>キャリア</th><td>HBs抗原＋、HBc抗体高力価、IgM-HBc−</td></tr><tr><th>既往感染</th><td>HBs抗原−、HBs抗体＋、HBc抗体＋</td></tr><tr><th>ワクチン後</th><td>HBs抗体のみ＋</td></tr></table>`,
          },
        },
        {
          id: "hcc", no: 4, type: "Placeholder", plannedType: "AlgorithmBoard",
          title: "肝細胞癌 治療すごろく", stampLabel: "肝癌すごろく",
          how: "患者カードを見て分かれ道を選び、ゴールで治療を決めよう。まちがえるとコマが戻る。4人ゴールでスタンプ。",
          // TODO(review) 2021年版の骨格。2025年版（第6版）に合わせるか要判断（ROADMAP 要レビュー一覧）
          cheatSheet: {
            review: "draft", sources: ["肝癌診療ガイドライン 2021年版"],
            title: "肝細胞癌 治療アルゴリズム（2021年版の骨格）",
            html: `<table><tr><th>Child-Pugh C</th><td>ミラノ基準内なら肝移植、外なら緩和ケア</td></tr><tr><th>肝外転移あり</th><td>薬物療法</td></tr><tr><th>脈管侵襲あり</th><td>肝切除、塞栓、薬物療法（動注を含む）</td></tr><tr><th>1個</th><td>肝切除、焼灼</td></tr><tr><th>2〜3個・3cm以内</th><td>肝切除、焼灼</td></tr><tr><th>2〜3個・3cm超</th><td>肝切除、塞栓</td></tr><tr><th>4個以上</th><td>塞栓、薬物療法（動注を含む）</td></tr></table><p>確認する順番：肝予備能 → 肝外転移 → 脈管侵襲 → 腫瘍数 → 腫瘍径。</p><p style="color:var(--sub)">2025年版（第6版）でオプション治療・粒子線・Child-Pugh Bの肝移植などが加わり改訂。</p>`,
          },
        },
      ],
    },
    {
      id: "w-gb", label: "胆のうウィング", color: "bile", headline: "石が生まれる場所", side: "ごほうびコーナー",
      exhibits: [],
    },
    {
      id: "w-duct", label: "胆管ウィング", color: "mint", headline: "つまると、あぶない",
      exhibits: [
        {
          id: "er", no: 5, type: "Placeholder", plannedType: "EmergencySim",
          title: "胆管炎ER", stampLabel: "胆管炎ER",
          how: "救急外来に胆管炎の患者が3人。重症度を判定して、指示を出そう。まちがえると時間が過ぎて容体が悪化する。",
          // TODO(review) 試作からの転記。TG18 の原文とは未照合（診断基準・重症度の閾値・対応）
          cheatSheet: {
            review: "draft", sources: ["TG18（Tokyo Guidelines 2018）"],
            title: "急性胆管炎（TG18）",
            html: `<h4>診断基準</h4><table><tr><th>A 全身の炎症</th><td>発熱・悪寒戦慄、血液検査で炎症反応</td></tr><tr><th>B 胆汁うっ滞</th><td>黄疸、肝機能検査の異常</td></tr><tr><th>C 画像</th><td>胆管拡張、原因（結石・狭窄など）</td></tr></table><p>確診＝A＋B＋C　疑診＝A＋（BまたはC）</p>
 <h4>重症（Grade III）：臓器障害が1つ以上</h4><ul><li>循環：ドパミン5μg/kg/分以上、またはノルアドレナリン使用</li><li>中枢神経：意識障害</li><li>呼吸：PaO₂/FiO₂＜300</li><li>腎：乏尿、Cr＞2.0</li><li>肝：PT-INR＞1.5</li><li>血液：血小板＜10万</li></ul>
 <h4>中等症（Grade II）：2項目以上</h4><ul><li>WBC＞12,000 または＜4,000</li><li>39℃以上の発熱</li><li>75歳以上</li><li>T-Bil 5 mg/dL以上</li><li>低アルブミン（基準下限×0.7未満）</li></ul>
 <h4>軽症（Grade I）</h4><p>重症・中等症のどちらにも当てはまらない</p>
 <h4>対応</h4><table><tr><th>共通</th><td>血液培養、抗菌薬、絶食・輸液</td></tr><tr><th>軽症</th><td>抗菌薬で反応しなければドレナージ</td></tr><tr><th>中等症</th><td>早期（24時間以内）ドレナージ</td></tr><tr><th>重症</th><td>呼吸循環管理＋緊急ドレナージ</td></tr></table>`,
          },
        },
      ],
    },
    {
      id: "w-pan", label: "膵ウィング", color: "sun", headline: "数えて、見きわめる",
      exhibits: [
        {
          id: "panc", no: 6, type: "Placeholder", plannedType: "ScoreAttack",
          title: "急性膵炎 重症度判定", stampLabel: "膵炎判定",
          how: "予後因子タイムアタックと造影CT判定の2種目。それぞれ2回ずつ正解でスタンプ。検査値は毎回ランダムに変わる。",
          // 予後因子の閾値は厚労省2008年基準で確認済み（ROADMAP）。造影CT Grade の配点は未照合 TODO(review)
          cheatSheet: {
            review: "draft", sources: ["急性膵炎重症度判定基準（厚生労働省 2008）"],
            title: "急性膵炎 重症度判定基準（厚労省2008）",
            html: `<h4>予後因子（各1点、3点以上で重症）</h4><ol><li>BE≦−3 mEq/L、またはショック（収縮期血圧＜80）</li><li>PaO₂≦60 mmHg（room air）、または呼吸不全</li><li>BUN≧40 mg/dL（またはCr≧2）、または乏尿</li><li>LDH≧基準上限の2倍</li><li>血小板≦10万/μL</li><li>総Ca≦7.5 mg/dL</li><li>CRP≧15 mg/dL</li><li>SIRS診断基準の陽性項目数≧3</li><li>年齢≧70歳</li></ol>
 <h4>SIRS診断基準</h4><ul><li>体温＞38℃または＜36℃</li><li>脈拍＞90/分</li><li>呼吸数＞20/分またはPaCO₂＜32 mmHg</li><li>WBC＞12,000または＜4,000、または幼若球＞10%</li></ul>
 <h4>造影CT Grade（原則48時間以内）</h4><table><tr><th>膵外進展度</th><td>前腎傍腔 0点／結腸間膜根部 1点／腎下極以遠 2点</td></tr><tr><th>造影不良域</th><td>1区域に限局 0点／2区域にかかる 1点／2区域全体以上 2点</td></tr></table><p>合計1点以下＝Grade 1、2点＝Grade 2、3点以上＝Grade 3。<b>Grade 2以上は重症</b>。</p><p>アミラーゼ・リパーゼの値は重症度に入らない。</p>`,
          },
        },
      ],
    },
    {
      id: "w-vs", label: "対決の間", color: "tomato", labelText: "light", headline: "似たもの同士、白黒つける",
      exhibits: [
        {
          id: "vs", no: 7, type: "Placeholder", plannedType: "VersusQuiz",
          title: "ヒントはどっちの味方？", stampLabel: "対決",
          how: "ヒントがどちらの病気のものか左右で答えよう。連続正解でコンボ。6問中5問以上でスタンプ。",
        },
      ],
    },
    {
      id: "w-marker", label: "マーカーの間", color: "#FFB38A", headline: "この数値、だれのもの？",
      exhibits: [
        {
          id: "memory", no: 8, type: "Placeholder", plannedType: "MemoryMatch",
          title: "マーカー神経衰弱", stampLabel: "マーカー",
          how: "マーカーや抗体（黄色）と、それが目印になる病気をペアでめくろう。20手以内ならボーナス。",
        },
      ],
    },
  ],

  gacha: {
    wing: "w-gb",
    title: "胆石ガチャ",
    machineLabel: "胆石",
    intro: "胆石は成分で大きく3系統。できる場所と原因がちがいます。",
    domeColors: ["var(--sun)", "#3A2A2A", "#A0642E", "var(--pink)", "var(--mint)"],
    cost: 30,
    dupRefund: 10,
    pityAfterDups: 4,
    // 重みは試作の値（コンプまで平均約20回、9割が25回以内。SPEC 3.10）
    items: [
      { review: "draft", sources: [], id: "chol", name: "コレステロール結石", rarity: 1, weight: 22, color: "#FFD95A", text: "胆嚢結石で最多。5F（Female, Forty, Fatty, Fertile, Fair）。エコーで音響陰影。" },
      { review: "draft", sources: [], id: "black", name: "黒色石", rarity: 2, weight: 14, color: "#2E2426", text: "溶血性貧血や肝硬変に多い胆嚢の色素結石。" },
      { review: "draft", sources: [], id: "brown", name: "ビリルビンカルシウム石", rarity: 2, weight: 14, color: "#A0642E", text: "褐色でもろい。細菌感染が関与し、胆管にできやすい。" },
      { review: "draft", sources: [], id: "silent", name: "無症候性胆石", rarity: 1, weight: 12, color: "#BFE8FF", text: "症状がなければ原則は経過観察。" },
      { review: "draft", sources: [], id: "cbd", name: "総胆管結石", rarity: 2, weight: 10, color: "#8BD450", text: "黄疸や胆管炎の原因に。内視鏡で乳頭を切開し（EST）バスケットで除去。" },
      { review: "draft", sources: [], id: "ih", name: "肝内結石", rarity: 3, weight: 8, color: "#C8453B", text: "肝内胆管にできる。胆管癌の合併に注意。東アジアに多い。" },
      { review: "draft", sources: [], id: "porcelain", name: "陶器様胆嚢", rarity: 3, weight: 7, color: "#F4F4F4", text: "胆嚢壁が石灰化。胆嚢癌との関連で胆摘を考える。" },
      { review: "draft", sources: [], id: "mirizzi", name: "Mirizzi症候群", rarity: 3, weight: 7, color: "#6CC9FF", text: "胆嚢頸部の石が総肝管を外から圧迫して黄疸。" },
      { review: "draft", sources: [], id: "ileus", name: "胆石イレウス", rarity: 4, weight: 6, color: "#FF7AB6", text: "胆嚢と腸に瘻孔ができ、石が回腸末端でつまる。胆道気腫がヒント。" },
    ],
  },

  stampOrder: ["lab", "portal", "hbv", "hcc", "er", "panc", "vs", "memory"],
};
