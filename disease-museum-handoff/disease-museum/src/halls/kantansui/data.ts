// 肝胆膵ホール（NO.03）。reference/kantansui_hall_v2.html（試作 ver.2）から移植。
// 医学内容はすべて未レビュー（review: "draft"）。要レビューの箇所は TODO(review) と ROADMAP の一覧を参照。
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
          id: "lab", no: 1, type: "DiagnosisLab",
          title: "黄疸診断ラボ", stampLabel: "黄疸ラボ",
          how: "黄疸の患者が次々やってくる。予算内で検査を選んで、診断をつけよう。予算が余るほどボーナス。4人正解でスタンプ。",
          // TODO(review) 検査結果の数値は架空。確率バー（flow.prior / probs）は手で決めたイメージ値（画面にも明記）
          data: {
            budget: 7,
            stampAt: 4,
            tests: [
              { id: "bil", name: "ビリルビン分画", cost: 1 },
              { id: "ast", name: "AST / ALT", cost: 1 },
              { id: "alp", name: "ALP / γ-GTP", cost: 1 },
              { id: "us", name: "腹部エコー", cost: 2 },
              { id: "hem", name: "網赤血球・ハプトグロビン", cost: 2 },
              { id: "ca", name: "CA19-9", cost: 2 },
              { id: "ct", name: "造影CT / MRCP", cost: 3 },
            ],
            diagnoses: [
              { name: "体質性黄疸（間接型：Gilbert）", short: "Gilbert" },
              { name: "体質性黄疸（直接型：Dubin-Johnsonなど）", short: "直接型体質性" },
              { name: "溶血性貧血", short: "溶血" },
              { name: "急性肝炎", short: "急性肝炎" },
              { name: "総胆管結石", short: "総胆管結石" },
              { name: "膵頭部癌", short: "膵頭部癌" },
            ],
            cases: [
              {
                review: "draft",
                sources: [],
                who: "22歳 男性",
                vignette: "数日絶食したあと白目が黄色いと言われた。元気いっぱい。",
                faceColor: "#F2D36B",
                answer: 0,
                results: {
                  bil: { text: "T-Bil 2.8（直接 0.3）間接優位", abnormal: true },
                  ast: { text: "AST 22 / ALT 18", abnormal: false },
                  alp: { text: "ALP・γ-GTP 正常", abnormal: false },
                  us: { text: "肝・胆管に異常なし", abnormal: false },
                  hem: { text: "網赤血球 正常、ハプトグロビン 正常", abnormal: false },
                  ca: { text: "CA19-9 正常", abnormal: false },
                  ct: { text: "異常なし", abnormal: false },
                },
                explanation: "間接優位だが溶血はない、肝酵素も正常。絶食やストレスで悪化するのがGilbert症候群の特徴。治療不要。",
                flow: {
                  prior: [30, 5, 15, 25, 15, 10],
                  priorWhy: "若くて元気、絶食後に悪化。体質性や溶血をまず考える。",
                  steps: [
                    {
                      test: "bil",
                      finding: "間接優位",
                      why: "直接型の病態（直接型体質性・閉塞・肝炎）の可能性が大きく下がる。残るのは間接型の2択。",
                      probs: [55, 1, 35, 6, 2, 1],
                    },
                    { test: "hem", finding: "網赤血球・ハプトグロビンとも正常", why: "赤血球の破壊が亢進していないので溶血を否定。", probs: [90, 1, 3, 5, 0.5, 0.5] },
                    { test: "ast", finding: "AST・ALT正常", why: "肝細胞障害も否定。間接優位の単独上昇＝Gilbert症候群。", probs: [97, 1, 1, 1, 0, 0] },
                  ],
                  note: "画像検査は不要。「何を否定するか」を考えると安い検査だけで診断できる。",
                },
              },
              {
                review: "draft",
                sources: [],
                who: "31歳 女性",
                vignette: "倦怠感と息切れ、最近顔色が黄色い。",
                faceColor: "#F4D07A",
                answer: 2,
                results: {
                  bil: { text: "T-Bil 3.4（直接 0.4）間接優位", abnormal: true },
                  ast: { text: "AST 48 / ALT 20（ASTだけ軽度↑）", abnormal: true },
                  alp: { text: "ALP・γ-GTP 正常", abnormal: false },
                  us: { text: "軽度の脾腫", abnormal: true },
                  hem: { text: "網赤血球 ↑↑、ハプトグロビン ↓↓", abnormal: true },
                  ca: { text: "CA19-9 正常", abnormal: false },
                  ct: { text: "脾腫。胆管拡張なし", abnormal: true },
                },
                explanation: "間接優位＋網赤血球↑＋ハプトグロビン↓は溶血のサイン。ASTとLDHは赤血球からも出る。",
                flow: {
                  prior: [15, 5, 35, 20, 15, 10],
                  priorWhy: "息切れ・倦怠感は貧血のサインかも。",
                  steps: [
                    { test: "bil", finding: "間接優位", why: "閉塞や肝炎の可能性が下がり、溶血とGilbertが残る。", probs: [30, 1, 60, 6, 2, 1] },
                    {
                      test: "hem",
                      finding: "網赤血球↑↑、ハプトグロビン↓↓",
                      why: "赤血球が壊れて骨髄が頑張っている証拠。溶血でほぼ確定。",
                      probs: [2, 0, 95, 2, 0.5, 0.5],
                    },
                  ],
                  note: "ASTだけ軽度上昇しているのは赤血球由来（LDHも上がる）。肝障害と取り違えないこと。原因検索は直接Coombs試験などへ。",
                },
              },
              {
                review: "draft",
                sources: [],
                who: "28歳 男性",
                vignette: "発熱と倦怠感の数日後、食欲不振と黄疸。1か月前に海外で生ガキを食べた。",
                faceColor: "#EDD24E",
                answer: 3,
                results: {
                  bil: { text: "T-Bil 6.2（直接 3.9）両方↑", abnormal: true },
                  ast: { text: "AST 2140 / ALT 2680 ↑↑↑", abnormal: true },
                  alp: { text: "ALP 軽度↑", abnormal: true },
                  us: { text: "肝腫大、胆管拡張なし", abnormal: true },
                  hem: { text: "網赤血球 正常", abnormal: false },
                  ca: { text: "CA19-9 正常", abnormal: false },
                  ct: { text: "肝腫大、胆管拡張なし", abnormal: true },
                },
                explanation: "トランスアミナーゼが千単位で、胆管拡張なし。肝細胞そのものの障害。IgM-HA抗体で確定。",
                flow: {
                  prior: [5, 3, 5, 50, 25, 12],
                  priorWhy: "前駆症状のあとの黄疸と、生ガキの摂食歴。A型肝炎を強く疑う。",
                  steps: [
                    { test: "ast", finding: "AST・ALTとも千単位", why: "肝細胞がこわれているパターン。溶血・体質性はほぼ否定。", probs: [1, 1, 1, 85, 9, 3] },
                    { test: "us", finding: "胆管拡張なし", why: "出口の閉塞がないことを確認。閉塞性黄疸を否定。", probs: [1, 1, 1, 96, 1, 0] },
                  ],
                  note: "確定は血清のIgM-HA抗体。ビリルビン分画は両方上がるので、今回は決め手になりにくい。",
                },
              },
              {
                review: "draft",
                sources: [],
                who: "56歳 女性",
                vignette: "脂っこい食事のあと右季肋部痛。その後、発熱と黄疸。",
                faceColor: "#E6CE3A",
                answer: 4,
                results: {
                  bil: { text: "T-Bil 4.8（直接 3.6）直接優位", abnormal: true },
                  ast: { text: "AST 180 / ALT 210（軽〜中等度↑）", abnormal: true },
                  alp: { text: "ALP・γ-GTP ↑↑", abnormal: true },
                  us: { text: "総胆管拡張、内部に音響陰影を伴う高エコー", abnormal: true },
                  hem: { text: "網赤血球 正常", abnormal: false },
                  ca: { text: "CA19-9 軽度↑（胆管炎で上がることも）", abnormal: true },
                  ct: { text: "総胆管内に結石、上流の胆管拡張", abnormal: true },
                },
                explanation: "直接優位＋胆道系酵素↑＋胆管拡張＝閉塞性黄疸。痛みと発熱を伴うなら結石を疑う。胆管炎に進めばドレナージ。",
                flow: {
                  prior: [2, 2, 3, 15, 55, 23],
                  priorWhy: "食後の右季肋部痛→発熱・黄疸。胆石と胆管炎を疑う。",
                  steps: [
                    { test: "bil", finding: "直接優位", why: "間接型の病態（Gilbert・溶血）を否定。", probs: [0, 5, 0, 17, 55, 23] },
                    { test: "alp", finding: "ALP・γ-GTP↑↑", why: "胆汁うっ滞パターン。閉塞性黄疸の可能性がさらに上がる。", probs: [0, 2, 0, 8, 62, 28] },
                    {
                      test: "us",
                      finding: "総胆管拡張＋音響陰影を伴う結石",
                      why: "閉塞の場所と原因が見えた。痛みと発熱もそろい、総胆管結石でほぼ確定。",
                      probs: [0, 0, 0, 2, 93, 5],
                    },
                  ],
                  note: "CA19-9は胆管炎でも上がるので、ここで追加すると膵癌と迷わされる。黄疸の鑑別はまずエコーで胆管拡張の有無を。",
                },
              },
              {
                review: "draft",
                sources: [],
                who: "71歳 男性",
                vignette: "痛みはないが、黄疸と体重減少。右季肋部に丸いものを触れる。",
                faceColor: "#E2CB2E",
                answer: 5,
                results: {
                  bil: { text: "T-Bil 9.1（直接 7.2）直接優位", abnormal: true },
                  ast: { text: "AST 96 / ALT 120", abnormal: true },
                  alp: { text: "ALP・γ-GTP ↑↑↑", abnormal: true },
                  us: { text: "胆嚢腫大、総胆管と膵管の拡張", abnormal: true },
                  hem: { text: "網赤血球 正常", abnormal: false },
                  ca: { text: "CA19-9 ↑↑↑", abnormal: true },
                  ct: { text: "膵頭部に乏血性の腫瘤、double duct sign", abnormal: true },
                },
                explanation: "無痛性黄疸＋触知できる胆嚢腫大（Courvoisier徴候）。膵頭部の乏血性腫瘤とCA19-9高値で膵癌を疑う。",
                flow: {
                  prior: [1, 2, 2, 5, 20, 70],
                  priorWhy: "無痛性黄疸＋体重減少＋胆嚢を触れる（Courvoisier徴候）。膵頭部癌を強く疑う。",
                  steps: [
                    {
                      test: "us",
                      finding: "胆嚢腫大、総胆管と膵管の拡張",
                      why: "下部胆管〜乳頭部での閉塞。結石なら痛みが出やすく、無痛性は腫瘍寄り。",
                      probs: [0, 0, 0, 1, 14, 85],
                    },
                    {
                      test: "ct",
                      finding: "膵頭部の乏血性腫瘤、double duct sign",
                      why: "原因の腫瘤を同定。膵頭部癌でほぼ確定。病期診断もここで。",
                      probs: [0, 0, 0, 0, 3, 97],
                    },
                  ],
                  note: "CA19-9は補助。特異的ではないので診断の決め手には使わない。ビリルビン分画や肝酵素は「閉塞性だ」と分かったあとでは追加の情報が少ない。",
                },
              },
              {
                review: "draft",
                sources: [],
                who: "19歳 女性",
                vignette: "健診で黄疸を指摘。自覚症状なし。",
                faceColor: "#EFD35E",
                answer: 1,
                results: {
                  bil: { text: "T-Bil 3.1（直接 2.3）直接優位", abnormal: true },
                  ast: { text: "AST 20 / ALT 16", abnormal: false },
                  alp: { text: "ALP・γ-GTP 正常", abnormal: false },
                  us: { text: "胆管拡張なし", abnormal: false },
                  hem: { text: "網赤血球 正常", abnormal: false },
                  ca: { text: "CA19-9 正常", abnormal: false },
                  ct: { text: "異常なし", abnormal: false },
                },
                explanation: "直接優位なのに胆道系酵素も胆管も正常。体質性黄疸（Dubin-Johnson症候群では肝が黒色に、Rotor症候群では黒色化しない）。",
                flow: {
                  prior: [35, 20, 15, 15, 10, 5],
                  priorWhy: "若くて無症状。体質性黄疸が有力だが、直接型か間接型かでまったく違う。",
                  steps: [
                    { test: "bil", finding: "直接優位", why: "Gilbertと溶血を否定。直接型なので閉塞や肝障害を除外する必要がある。", probs: [1, 45, 1, 20, 20, 13] },
                    { test: "alp", finding: "ALP・γ-GTP正常", why: "胆汁うっ滞がない。閉塞性の可能性が下がる。", probs: [0, 70, 0, 20, 6, 4] },
                    { test: "ast", finding: "AST・ALT正常", why: "肝細胞障害も否定。", probs: [0, 92, 0, 3, 3, 2] },
                    {
                      test: "us",
                      finding: "胆管拡張なし",
                      why: "念のため閉塞を画像でも否定。直接型の体質性黄疸（Dubin-JohnsonまたはRotor）。",
                      probs: [0, 98, 0, 1, 0.5, 0.5],
                    },
                  ],
                  note: "Dubin-Johnson症候群は肝が黒色になり、尿中コプロポルフィリンの分画で見分ける。どちらも治療不要。",
                },
              },
            ],
          },
        },
        {
          id: "portal", no: 2, type: "PathoSim",
          title: "門脈の渋滞マップ", stampLabel: "門脈",
          how: "門脈圧を上げて、血液がどこへあふれ出すかを見よう。そのあと5つの治療ミッションに挑戦。",
          // TODO(review) 一次予防はβ遮断薬とEVLの両方を正解にしている。他のミッションも複数正解にすべきか（ROADMAP）
          data: {
            slider: {
              label: "肝静脈圧較差（HVPG）",
              unit: "mmHg",
              min: 3,
              max: 22,
              step: 1,
              initial: 5,
              gauge: ["正常", "5〜 門脈圧亢進", "10〜 静脈瘤", "12〜 破裂"],
              bonus: { at: 14, coins: 10 },
            },
            svg: `<svg viewBox="0 0 360 380" aria-label="門脈と側副路の模式図">
 <rect x="236" y="8" width="26" height="120" rx="12" fill="#FFD9C9" stroke="#1C1537" stroke-width="3"/><text x="249" y="146" text-anchor="middle" font-size="11" font-weight="800" fill="var(--ink)">食道</text>
 <path d="M30 70 C30 30 110 14 190 20 C230 24 232 44 226 70 C218 104 170 120 120 122 C70 124 30 110 30 70Z" fill="var(--liver)" stroke="#1C1537" stroke-width="4"/>
 <text x="96" y="74" font-family="Dela Gothic One" font-size="16" fill="#fff" id="jam">肝臓</text>
 <ellipse id="spleen" cx="306" cy="226" rx="30" ry="42" fill="#B05A8A" stroke="#1C1537" stroke-width="4"/><text x="306" y="286" text-anchor="middle" font-size="11" font-weight="800" fill="var(--ink)">脾臓</text>
 <ellipse cx="318" cy="320" rx="18" ry="30" fill="#E8B3A0" stroke="#1C1537" stroke-width="3"/><text x="318" y="366" text-anchor="middle" font-size="11" font-weight="800" fill="var(--ink)">左腎</text>
 <circle cx="70" cy="300" r="10" fill="#FFB38A" stroke="#1C1537" stroke-width="3"/><text x="70" y="330" text-anchor="middle" font-size="11" font-weight="800" fill="var(--ink)">臍</text>
 <rect x="180" y="346" width="44" height="26" rx="10" fill="#FFD9C9" stroke="#1C1537" stroke-width="3"/><text x="202" y="364" text-anchor="middle" font-size="11" font-weight="800" fill="#1C1537">直腸</text>
 <!-- main portal system -->
 <path d="M276 226 C230 232 190 236 160 240" stroke="#3D5AFE" stroke-width="16" fill="none" stroke-linecap="round"/>
 <path d="M160 340 L160 240 L140 118" stroke="#3D5AFE" stroke-width="18" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
 <path id="mainFlow" d="M276 226 C230 232 190 236 160 240 L140 118" stroke="#fff" stroke-width="4" fill="none" class="flowing" stroke-linecap="round"/>
 <path d="M160 340 L160 240" stroke="#fff" stroke-width="4" fill="none" class="flowing mf2" stroke-linecap="round"/>
 <text x="170" y="300" font-size="11" font-weight="800" fill="var(--ink)">上腸間膜静脈</text><text x="196" y="224" font-size="11" font-weight="800" fill="var(--ink)">脾静脈</text><text x="104" y="190" font-size="11" font-weight="800" fill="var(--ink)">門脈</text>
 <!-- collaterals -->
 <g class="cvl" id="cv-eso" opacity="0"><path d="M170 238 C200 200 240 170 249 110 L249 30" stroke="#8E6BFF" stroke-width="7" fill="none"/><path d="M170 238 C200 200 240 170 249 110 L249 30" stroke="#fff" stroke-width="2.5" fill="none" class="flowing"/>
   <g id="varix"><circle cx="249" cy="46" r="7" fill="#8E6BFF" stroke="#1C1537" stroke-width="2"/><circle cx="249" cy="72" r="8" fill="#8E6BFF" stroke="#1C1537" stroke-width="2"/><circle cx="249" cy="98" r="7" fill="#8E6BFF" stroke="#1C1537" stroke-width="2"/></g><text x="270" y="60" font-size="11" font-weight="800" fill="var(--ink)">食道静脈瘤</text></g>
 <g class="cvl" id="cv-umb" opacity="0"><path d="M136 124 C110 170 84 240 72 292" stroke="#8E6BFF" stroke-width="6" fill="none"/><path d="M136 124 C110 170 84 240 72 292" stroke="#fff" stroke-width="2.5" fill="none" class="flowing"/>
   <g stroke="#8E6BFF" stroke-width="4" stroke-linecap="round"><path d="M70 300 L40 286"/><path d="M70 300 L36 312"/><path d="M70 300 L56 340"/><path d="M70 300 L96 336"/><path d="M70 300 L104 292"/></g><text x="8" y="270" font-size="11" font-weight="800" fill="var(--ink)">メドゥーサの頭</text></g>
 <g class="cvl" id="cv-rec" opacity="0"><path d="M160 336 C170 350 180 356 186 358" stroke="#8E6BFF" stroke-width="6" fill="none"/><circle cx="190" cy="372" r="6" fill="#8E6BFF" stroke="#1C1537" stroke-width="2"/><circle cx="212" cy="374" r="6" fill="#8E6BFF" stroke="#1C1537" stroke-width="2"/><text x="232" y="378" font-size="11" font-weight="800" fill="var(--ink)">直腸静脈瘤</text></g>
 <g class="cvl" id="cv-gr" opacity="0"><path d="M296 256 C300 280 306 292 312 294" stroke="#8E6BFF" stroke-width="6" fill="none"/><path d="M296 256 C300 280 306 292 312 294" stroke="#fff" stroke-width="2.5" fill="none" class="flowing"/><text x="228" y="274" font-size="11" font-weight="800" fill="var(--ink)">胃腎シャント</text><circle cx="262" cy="190" r="10" fill="#8E6BFF" stroke="#1C1537" stroke-width="2"/><text x="190" y="176" font-size="11" font-weight="800" fill="var(--ink)">胃静脈瘤</text></g>
 <g id="ascites" opacity="0"><path d="M20 250 q10 -16 20 0 q-10 14 -20 0Z M40 346 q10 -16 20 0 q-10 14 -20 0Z M110 360 q10 -16 20 0 q-10 14 -20 0Z" fill="#6CC9FF" stroke="#1C1537" stroke-width="2"/><text x="112" y="346" font-size="11" font-weight="800" fill="var(--ink)">腹水</text></g>
</svg>`,
            thresholds: [
              { at: 3, text: "門脈圧は正常。血液はすいすい肝臓へ。" },
              { at: 6, text: "<b>門脈圧亢進症</b>。肝臓の入口が混み始め、脾臓がふくらんでくる。" },
              { at: 10, show: ["cv-eso"], text: "<b>臨床的に有意な門脈圧亢進（10mmHg以上）</b>。行き場のない血液が側副路へ。食道静脈瘤ができはじめる。" },
              { at: 12, show: ["cv-umb", "cv-rec", "ascites"], text: "<b>12mmHg以上</b>で静脈瘤破裂のリスク。腹水もたまる。胃腎シャントを通れば胃静脈瘤にも。" },
              { at: 14, show: ["cv-gr"], text: "<b>12mmHg以上</b>で静脈瘤破裂のリスク。腹水もたまる。胃腎シャントを通れば胃静脈瘤にも。" },
            ],
            missions: [
              {
                review: "draft",
                sources: [],
                text: "吐血して救急搬送。内視鏡で食道静脈瘤からの出血を確認。まず止血したい。",
                answer: 1,
                explanation: "食道静脈瘤出血の内視鏡的止血はEVLが第一。血管作動薬と抗菌薬の併用、輸血は控えめに。",
              },
              {
                review: "draft",
                sources: [],
                text: "胃穹窿部の孤立性胃静脈瘤。CTで太い胃腎シャントが見える。",
                answer: 2,
                explanation: "胃腎シャントからバルーンで逆行性に硬化剤を入れるのがB-RTO。日本で発展した治療。",
              },
              {
                review: "draft",
                sources: [],
                text: "利尿薬が効かない難治性腹水。穿刺をくり返している。",
                answer: 3,
                explanation: "肝内に門脈と肝静脈の短絡を作って門脈圧を下げるのがTIPS。肝性脳症の悪化に注意。",
              },
              {
                review: "draft",
                sources: [],
                text: "出血歴のない中等度以上の食道静脈瘤。出血を予防したい（内服で）。",
                answer: 0,
                alt: [1],
                altNote: "内服ならβ遮断薬",
                explanation: "一次予防では非選択的β遮断薬（プロプラノロールなど）で門脈圧を下げる。EVLでもよい。",
              },
              {
                review: "draft",
                sources: [],
                text: "脾機能亢進で血小板が3万台。これから処置を控えている。",
                answer: 4,
                explanation: "脾動脈の一部を塞栓して脾臓の働きを弱め、血小板を増やすのがPSE。",
              },
            ],
            tools: ["非選択的β遮断薬", "内視鏡的静脈瘤結紮術（EVL）", "バルーン下逆行性経静脈的塞栓術（B-RTO）", "経頸静脈的肝内門脈大循環短絡術（TIPS）", "部分的脾動脈塞栓術（PSE）"],
          },
        },
        {
          id: "hbv", no: 3, type: "DecodePuzzle",
          title: "HBVマーカー解読パズル", stampLabel: "HBV",
          how: "ランプの点き方から、この人のB型肝炎の状態を解読しよう。6問中5問正解でスタンプ。「ランプを点けろ」モードもあるよ。",
          // TODO(review) 試作からの転記。「既往感染でHBc抗体を低力価と表示」の簡略化を含む
          cheatSheet: {
            review: "draft", sources: [],
            title: "HBVマーカーの読み方",
            html: `<table><tr><th>HBs抗原</th><td>いま感染している</td></tr><tr><th>HBs抗体</th><td>免疫がある（治癒またはワクチン）</td></tr><tr><th>IgM-HBc抗体</th><td>急性感染（高力価）</td></tr><tr><th>HBc抗体</th><td>感染したことがある。高力価なら持続感染、低力価なら既往。ワクチンではできない</td></tr><tr><th>HBe抗原</th><td>ウイルスの増殖が盛ん</td></tr><tr><th>HBe抗体</th><td>増殖がおさまった（セロコンバージョン）</td></tr></table>
 <h4>パターン</h4><table><tr><th>急性B型肝炎</th><td>HBs抗原＋、IgM-HBc抗体＋</td></tr><tr><th>キャリア</th><td>HBs抗原＋、HBc抗体高力価、IgM-HBc−</td></tr><tr><th>既往感染</th><td>HBs抗原−、HBs抗体＋、HBc抗体＋</td></tr><tr><th>ワクチン後</th><td>HBs抗体のみ＋</td></tr></table>`,
          },
          // TODO(review) 既往感染で HBe抗体陽性、HBc抗体を「低力価」と表示する簡略化（ROADMAP）
          data: {
            modeLabels: ["解読モード", "ランプを点けろ"],
            markers: ["HBs抗原", "HBs抗体", "IgM-HBc抗体", "HBc抗体（高力価）", "HBe抗原", "HBe抗体"],
            states: [
              {
                review: "draft",
                sources: [],
                name: "急性B型肝炎",
                pattern: [1, 0, 1, 1, 1, 0],
                explanation: "HBs抗原＋IgM-HBc抗体（高力価）が急性感染の決め手。成人の急性感染の多くは治癒する。",
              },
              {
                review: "draft",
                sources: [],
                name: "HBVキャリア（HBe抗原陽性）",
                pattern: [1, 0, 0, 1, 1, 0],
                explanation: "HBs抗原が持続陽性でIgM-HBcは陰性。HBe抗原陽性はウイルス増殖が盛んな時期。",
              },
              {
                review: "draft",
                sources: [],
                name: "非活動性キャリア（HBe抗体陽性）",
                pattern: [1, 0, 0, 1, 0, 1],
                explanation: "HBe抗原が消えてHBe抗体が出た（セロコンバージョン）。ウイルス量は低めで落ち着いた状態が多い。",
              },
              {
                review: "draft",
                sources: [],
                name: "既往感染（治癒）",
                pattern: [0, 1, 0, 1, 0, 1],
                labelOverride: { "3": "HBc抗体（低力価）" },
                explanation: "HBs抗原陰性でHBs抗体とHBc抗体が陽性（HBc抗体は低力価）。免疫抑制や化学療法で再活性化（de novo肝炎）に注意。",
              },
              {
                review: "draft",
                sources: [],
                name: "ワクチン接種後",
                pattern: [0, 1, 0, 0, 0, 0],
                explanation: "HBs抗体だけ陽性。ワクチンにはHBs抗原しか含まれないので、HBc抗体はできない。",
              },
              {
                review: "draft",
                sources: [],
                name: "未感染・未接種",
                pattern: [0, 0, 0, 0, 0, 0],
                explanation: "すべて陰性。医療者ならワクチン接種の対象。",
              },
            ],
            reverse: {
              review: "draft",
              sources: [],
              markers: ["HBs抗原", "HBs抗体", "HBc抗体"],
              targets: [
                { name: "ワクチン接種後", pattern: [0, 1, 0] },
                { name: "既往感染（治癒）", pattern: [0, 1, 1] },
                { name: "現在感染している", pattern: [1, 0, 1] },
                { name: "未感染・未接種", pattern: [0, 0, 0] },
              ],
              lesson: "ポイントは「HBs抗原＝いま感染」「HBs抗体＝免疫あり」「HBc抗体＝感染したことがある（ワクチンではできない）」。",
            },
            roundSize: 6,
            passScore: 5,
          },
        },
        {
          id: "hcc", no: 4, type: "AlgorithmBoard",
          title: "肝細胞癌 治療すごろく", stampLabel: "肝癌すごろく",
          how: "患者カードを見て分かれ道を選び、ゴールで治療を決めよう。まちがえるとコマが戻る。4人ゴールでスタンプ。",
          // TODO(review) 2021年版の骨格。2025年版（第6版）に合わせるか要判断（ROADMAP 要レビュー一覧）
          cheatSheet: {
            review: "draft", sources: ["肝癌診療ガイドライン 2021年版"],
            title: "肝細胞癌 治療アルゴリズム（2021年版の骨格）",
            html: `<table><tr><th>Child-Pugh C</th><td>ミラノ基準内なら肝移植、外なら緩和ケア</td></tr><tr><th>肝外転移あり</th><td>薬物療法</td></tr><tr><th>脈管侵襲あり</th><td>肝切除、塞栓、薬物療法（動注を含む）</td></tr><tr><th>1個</th><td>肝切除、焼灼</td></tr><tr><th>2〜3個・3cm以内</th><td>肝切除、焼灼</td></tr><tr><th>2〜3個・3cm超</th><td>肝切除、塞栓</td></tr><tr><th>4個以上</th><td>塞栓、薬物療法（動注を含む）</td></tr></table><p>確認する順番：肝予備能 → 肝外転移 → 脈管侵襲 → 腫瘍数 → 腫瘍径。</p><p style="color:var(--sub)">2025年版（第6版）でオプション治療・粒子線・Child-Pugh Bの肝移植などが加わり改訂。</p>`,
          },
          // TODO(review) 肝癌診療ガイドライン2021年版の骨格。2025年版（第6版）に合わせるか要判断（ROADMAP）
          data: {
            stampAt: 4,
            nodes: [
              {
                id: "cp",
                label: "肝予備能",
                question: "肝予備能は？",
                options: [
                  { value: "AB", label: "Child-Pugh A / B" },
                  { value: "C", label: "Child-Pugh C" },
                ],
              },
              {
                id: "milan",
                label: "ミラノ基準",
                question: "ミラノ基準内？",
                options: [
                  { value: "1", label: "内" },
                  { value: "0", label: "外" },
                ],
              },
              {
                id: "meta",
                label: "肝外転移",
                question: "肝外転移は？",
                options: [
                  { value: "1", label: "あり" },
                  { value: "0", label: "なし" },
                ],
              },
              {
                id: "vasc",
                label: "脈管侵襲",
                question: "脈管侵襲は？",
                options: [
                  { value: "1", label: "あり" },
                  { value: "0", label: "なし" },
                ],
              },
              {
                id: "num",
                label: "腫瘍数",
                question: "腫瘍数は？",
                options: [
                  { value: "1", label: "1個" },
                  { value: "23", label: "2〜3個" },
                  { value: "4", label: "4個以上" },
                ],
              },
              {
                id: "size",
                label: "腫瘍径",
                question: "腫瘍径は？（2〜3個のとき）",
                options: [
                  { value: "le3", label: "3cm以内" },
                  { value: "gt3", label: "3cm超" },
                ],
              },
            ],
            goalLabel: "治療",
            treatments: ["肝切除", "ラジオ波焼灼（RFA）", "肝動脈化学塞栓療法（TACE）", "薬物療法", "肝移植", "緩和ケア"],
            patients: [
              {
                review: "draft",
                sources: [],
                card: { 年齢: "64", "Child-Pugh": "A", 腫瘍: "1個・2.5cm", 脈管侵襲: "なし", 肝外転移: "なし" },
                path: ["cp", "meta", "vasc", "num", "goal"],
                answers: { cp: "AB", meta: "0", vasc: "0", num: "1" },
                treatments: [0, 1],
                explanation: "単発なら切除または焼灼。3cm以内なら焼灼も有力。",
              },
              {
                review: "draft",
                sources: [],
                card: { 年齢: "70", "Child-Pugh": "A", 腫瘍: "3個・最大2cm", 脈管侵襲: "なし", 肝外転移: "なし" },
                path: ["cp", "meta", "vasc", "num", "size", "goal"],
                answers: { cp: "AB", meta: "0", vasc: "0", num: "23", size: "le3" },
                treatments: [0, 1],
                explanation: "2〜3個で3cm以内なら切除または焼灼。",
              },
              {
                review: "draft",
                sources: [],
                card: { 年齢: "68", "Child-Pugh": "B", 腫瘍: "2個・最大4.5cm", 脈管侵襲: "なし", 肝外転移: "なし" },
                path: ["cp", "meta", "vasc", "num", "size", "goal"],
                answers: { cp: "AB", meta: "0", vasc: "0", num: "23", size: "gt3" },
                treatments: [0, 2],
                explanation: "2〜3個で3cm超なら切除または塞栓（TACE）。",
              },
              {
                review: "draft",
                sources: [],
                card: { 年齢: "73", "Child-Pugh": "A", 腫瘍: "6個・最大3cm", 脈管侵襲: "なし", 肝外転移: "なし" },
                path: ["cp", "meta", "vasc", "num", "goal"],
                answers: { cp: "AB", meta: "0", vasc: "0", num: "4" },
                treatments: [2, 3],
                explanation: "4個以上は塞栓（TACE）や薬物療法（動注を含む）。",
              },
              {
                review: "draft",
                sources: [],
                card: { 年齢: "66", "Child-Pugh": "A", 腫瘍: "2個・最大5cm", 脈管侵襲: "なし", 肝外転移: "肺転移あり" },
                path: ["cp", "meta", "goal"],
                answers: { cp: "AB", meta: "1" },
                treatments: [3],
                explanation: "肝外転移があれば全身の薬物療法（免疫チェックポイント阻害薬を含む併用療法など）。",
              },
              {
                review: "draft",
                sources: [],
                card: { 年齢: "58", "Child-Pugh": "C", 腫瘍: "1個・3cm（ミラノ基準内）", 脈管侵襲: "なし", 肝外転移: "なし" },
                path: ["cp", "milan", "goal"],
                answers: { cp: "C", milan: "1" },
                treatments: [4],
                explanation: "肝予備能が悪いChild-Pugh Cでも、ミラノ基準内なら肝移植で癌と肝硬変を同時に治せる。",
              },
              {
                review: "draft",
                sources: [],
                card: { 年齢: "71", "Child-Pugh": "A", 腫瘍: "1個・7cm", 脈管侵襲: "門脈腫瘍栓あり", 肝外転移: "なし" },
                path: ["cp", "meta", "vasc", "goal"],
                answers: { cp: "AB", meta: "0", vasc: "1" },
                treatments: [0, 2, 3],
                explanation: "脈管侵襲があれば、肝切除・塞栓・薬物療法（動注を含む）から選ぶ。",
              },
            ],
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
          id: "er", no: 5, type: "EmergencySim",
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
          // TODO(review) ドレナージのタイミングを1択にしている（実際は幅がある）。TG18原文と未照合（ROADMAP）
          data: {
            condition: "急性胆管炎",
            gradeQuestion: "重症度は？（TG18）",
            stampAt: 3,
            gradeLabels: ["軽症 Grade I", "中等症 Grade II", "重症 Grade III"],
            orders: [
              { name: "血液培養", kind: "core" },
              { name: "抗菌薬の投与", kind: "core" },
              { name: "絶食・輸液", kind: "core" },
              { name: "呼吸循環管理（昇圧薬など）", kind: "severe" },
              { name: "緊急開腹で胆嚢摘出", kind: "wrong" },
              { name: "ステロイドパルス", kind: "wrong" },
              { name: "帰宅して外来フォロー", kind: "wrong" },
            ],
            timingLabel: "胆道ドレナージのタイミング",
            timings: ["抗菌薬に反応しなければ実施", "早期（24時間以内）に実施", "緊急で実施（全身管理と並行）"],
            patients: [
              {
                review: "draft",
                sources: [],
                who: "45歳 女性",
                complaint: "発熱、黄疸、右季肋部痛。エコーで総胆管結石と胆管拡張。",
                labs: "WBC 11,000、T-Bil 3.1、Alb 3.9、Plt 22万、Cr 0.8、PT-INR 1.0",
                vitals: { BP: "128/78", HR: 96, SpO2: 98, T: 38.2, 意識: "清明" },
                vitalsAfter: { BP: "128/78", HR: 80, SpO2: 98, T: 37.2, 意識: "清明" },
                grade: 0,
                requiredOrders: ["血液培養", "抗菌薬の投与", "絶食・輸液"],
                timing: 0,
                explanation: `Charcotの三徴そろい、胆管炎と診断。中等症の項目（WBC>12,000または<4,000、39℃以上、75歳以上、T-Bil 5以上、低アルブミン）に1つも当てはまらず、臓器障害もない → 軽症（Grade I）。`,
              },
              {
                review: "draft",
                sources: [],
                who: "78歳 男性",
                complaint: "悪寒戦慄、黄疸。エコーで総胆管拡張。",
                labs: "WBC 15,800、T-Bil 4.2、Alb 3.4、Plt 18万、Cr 1.1、PT-INR 1.1",
                vitals: { BP: "118/70", HR: 108, SpO2: 96, T: 39.4, 意識: "清明" },
                vitalsAfter: { BP: "118/70", HR: 90, SpO2: 96, T: 38.4, 意識: "清明" },
                grade: 1,
                requiredOrders: ["血液培養", "抗菌薬の投与", "絶食・輸液"],
                timing: 1,
                explanation: "75歳以上、39℃以上、WBC>12,000の3項目 → 中等症（Grade II）。臓器障害はない。早期の胆道ドレナージを。",
              },
              {
                review: "draft",
                sources: [],
                who: "70歳 女性",
                complaint: "発熱と黄疸のあと、意識がもうろう。ノルアドレナリンを始めないと血圧が保てない。",
                labs: "WBC 3,200、T-Bil 5.6、Plt 8万、Cr 2.4、PT-INR 1.7",
                vitals: { BP: "78/46", HR: 128, SpO2: 91, T: 38.9, 意識: "JCS 10" },
                vitalsAfter: { BP: "104/62", HR: 98, SpO2: 95, T: 37.8, 意識: "JCS 1" },
                grade: 2,
                requiredOrders: ["血液培養", "抗菌薬の投与", "絶食・輸液", "呼吸循環管理（昇圧薬など）"],
                timing: 2,
                explanation: "ショック＋意識障害でReynoldsの五徴。循環障害・意識障害・腎障害・凝固障害・血小板減少 → 重症（Grade III）。全身管理をしながら緊急ドレナージ。",
              },
            ],
            penaltyMinutes: 30,
            // モニターが警告する範囲。演出用のイメージ値（臨床のアラーム設定の基準ではない）
            normalRanges: { SBP: [90, 160], HR: [50, 100], SpO2: [94, 100], T: [36, 37.9] },
          },
        },
      ],
    },
    {
      id: "w-pan", label: "膵ウィング", color: "sun", headline: "数えて、見きわめる",
      exhibits: [
        {
          id: "panc", no: 6, type: "ScoreAttack",
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
          // 予後因子の閾値は厚労省2008年基準で確認済み。TODO(review) 値の自動生成範囲が現実的か、造影CT Gradeの配点は未照合（ROADMAP）
          data: {
            modeLabels: ["予後因子タイムアタック", "造影CT Grade"],
            scoreName: "予後因子",
            instructions: "陽性の予後因子をタップ → 重症度を判定",
            timeLimitSec: 45,
            stampAt: 2,
            items: [
              {
                name: "BE",
                positive: { gen: { min: -8, max: -3.5, digits: 1 }, display: "{v} mEq/L" },
                negative: { gen: { min: -1.5, max: 1.5, digits: 1 }, display: "{v} mEq/L" },
              },
              {
                name: "PaO₂（room air）",
                positive: { gen: { min: 48, max: 59, digits: 0 }, display: "{v} mmHg" },
                negative: { gen: { min: 72, max: 95, digits: 0 }, display: "{v} mmHg" },
              },
              {
                name: "BUN",
                positive: { gen: { min: 42, max: 70, digits: 0 }, display: "{v} mg/dL" },
                negative: { gen: { min: 10, max: 28, digits: 0 }, display: "{v} mg/dL" },
              },
              {
                name: "LDH（上限222）",
                positive: { gen: { min: 470, max: 900, digits: 0 }, display: "{v} U/L" },
                negative: { gen: { min: 200, max: 400, digits: 0 }, display: "{v} U/L" },
              },
              {
                name: "血小板",
                positive: { gen: { min: 5, max: 9.8, digits: 1 }, display: "{v}万/μL" },
                negative: { gen: { min: 14, max: 28, digits: 1 }, display: "{v}万/μL" },
              },
              {
                name: "総Ca",
                positive: { gen: { min: 6.4, max: 7.4, digits: 1 }, display: "{v} mg/dL" },
                negative: { gen: { min: 8.4, max: 9.6, digits: 1 }, display: "{v} mg/dL" },
              },
              {
                name: "CRP",
                positive: { gen: { min: 15.5, max: 28, digits: 1 }, display: "{v} mg/dL" },
                negative: { gen: { min: 1, max: 12, digits: 1 }, display: "{v} mg/dL" },
              },
              {
                name: "SIRS項目",
                compound: "SIRS",
                positive: { gen: { min: 3, max: 4, digits: 0 }, display: "体温{t}℃ 脈拍{hr} 呼吸{rr} WBC{wbc}" },
                negative: { gen: { min: 0, max: 2, digits: 0 }, display: "体温{t}℃ 脈拍{hr} 呼吸{rr} WBC{wbc}" },
              },
              {
                name: "年齢",
                positive: { gen: { min: 70, max: 88, digits: 0 }, display: "{v}歳" },
                negative: { gen: { min: 34, max: 68, digits: 0 }, display: "{v}歳" },
              },
            ],
            positiveRate: 0.34,
            severeAt: 3,
            explanation: "予後因子は9項目で各1点、3点以上なら重症。アミラーゼ・リパーゼの高さは重症度に入らないのがポイント。",
            missQuestion: { q: "急性膵炎（厚労省2008）で「重症」と判定する予後因子の点数は？", opts: ["1点以上", "2点以上", "3点以上"], ans: "3点以上" },
            imageMode: {
              review: "draft",
              sources: ["急性膵炎重症度判定基準（厚生労働省 2008）"],
              kind: "PancCT",
              prompt: "模式図（冠状断イメージ）から2つのスコアを読もう",
              extent: { label: "① 炎症の膵外進展度", options: ["前腎傍腔（0点）", "結腸間膜根部（1点）", "腎下極以遠（2点）"] },
              poor: { label: "② 膵の造影不良域", options: ["1区域に限局（0点）", "2区域にかかる（1点）", "2区域全体以上（2点）"] },
              explanation: "合計1点以下がGrade 1、2点がGrade 2、3点以上がGrade 3。<b>Grade 2以上は、予後因子が何点でも重症</b>。",
              missQuestion: {
                q: "造影CT Grade（膵外進展度＋造影不良域の合計）で「重症」とするのは？",
                opts: ["合計1点以上（Grade 1以上）", "合計2点以上（Grade 2以上）", "合計4点（Grade 3）のみ"],
                ans: "合計2点以上（Grade 2以上）",
              },
            },
          },
        },
      ],
    },
    {
      id: "w-vs", label: "対決の間", color: "tomato", labelText: "light", headline: "似たもの同士、白黒つける",
      exhibits: [
        {
          id: "vs", no: 7, type: "VersusQuiz",
          title: "ヒントはどっちの味方？", stampLabel: "対決",
          how: "ヒントがどちらの病気のものか左右で答えよう。連続正解でコンボ。6問中5問以上でスタンプ。",
          data: {
            matches: [
              {
                review: "draft",
                sources: [],
                id: "pbcpsc",
                title: "PBC vs PSC",
                a: { name: "PBC", color: "pink", traits: ["中年女性", "小さな肝内胆管", "AMA陽性"] },
                b: { name: "PSC", color: "#8FB2FF", traits: ["若年男性", "太い胆管が数珠状", "潰瘍性大腸炎"] },
                clues: [
                  { text: "AMA陽性", side: "a" },
                  { text: "胆管造影で数珠状", side: "b" },
                  { text: "潰瘍性大腸炎を合併", side: "b" },
                  { text: "UDCAが第一選択", side: "a" },
                  { text: "胆管癌に注意", side: "b" },
                  { text: "皮膚のかゆみから始まる", side: "a" },
                ],
              },
              {
                review: "draft",
                sources: [],
                id: "cholecyst",
                title: "胆嚢炎 vs 胆管炎",
                a: { name: "急性胆嚢炎", color: "bile", traits: ["胆嚢頸部の結石", "胆嚢壁の肥厚", "早期の胆嚢摘出"] },
                b: { name: "急性胆管炎", color: "mint", traits: ["総胆管結石", "Charcotの三徴", "胆道ドレナージ"] },
                clues: [
                  { text: "Murphy徴候", side: "a" },
                  { text: "Charcotの三徴", side: "b" },
                  { text: "胆嚢の腫大と壁肥厚", side: "a" },
                  { text: "内視鏡的胆道ドレナージ", side: "b" },
                  { text: "Reynoldsの五徴", side: "b" },
                  { text: "腹腔鏡下胆嚢摘出術", side: "a" },
                ],
              },
              {
                review: "draft",
                sources: [],
                id: "aip",
                title: "自己免疫性膵炎 vs 膵癌",
                a: { name: "自己免疫性膵炎", color: "sun", traits: ["IgG4高値", "膵のびまん性腫大", "ステロイドが効く"] },
                b: { name: "膵癌", color: "#FFB38A", traits: ["CA19-9高値", "主膵管の途絶", "予後不良"] },
                clues: [
                  { text: "ソーセージ様の膵腫大", side: "a" },
                  { text: "主膵管の途絶と上流の拡張", side: "b" },
                  { text: "IgG4高値", side: "a" },
                  { text: "ステロイドでよくなる", side: "a" },
                  { text: "乏血性の腫瘤と上流膵管の拡張", side: "b" },
                  { text: "CA19-9高値", side: "b" },
                ],
              },
              {
                review: "draft",
                sources: [],
                id: "hepab",
                title: "A型肝炎 vs B型肝炎",
                a: { name: "A型肝炎", color: "#FFE27A", traits: ["経口感染", "慢性化しない", "IgM-HA抗体"] },
                b: { name: "B型肝炎", color: "#C8B6FF", traits: ["血液・体液感染", "キャリア化あり", "HBs抗原"] },
                clues: [
                  { text: "生ガキなど貝類の生食", side: "a" },
                  { text: "母子感染", side: "b" },
                  { text: "慢性化・肝癌につながりうる", side: "b" },
                  { text: "IgM-HA抗体", side: "a" },
                  { text: "核酸アナログで治療", side: "b" },
                  { text: "慢性化しない", side: "a" },
                ],
              },
            ],
            passScore: 5,
          },
        },
      ],
    },
    {
      id: "w-marker", label: "マーカーの間", color: "#FFB38A", headline: "この数値、だれのもの？",
      exhibits: [
        {
          id: "memory", no: 8, type: "MemoryMatch",
          title: "マーカー神経衰弱", stampLabel: "マーカー",
          how: "マーカーや抗体（黄色）と、それが目印になる病気をペアでめくろう。20手以内ならボーナス。",
          data: {
            pairs: [
              { review: "draft", sources: [], marker: "AFP", disease: "肝細胞癌" },
              { review: "draft", sources: [], marker: "CA19-9", disease: "膵癌" },
              { review: "draft", sources: [], marker: "AMA", disease: "PBC" },
              { review: "draft", sources: [], marker: "IgG4", disease: "自己免疫性膵炎" },
              { review: "draft", sources: [], marker: "HBs抗原", disease: "B型肝炎" },
              { review: "draft", sources: [], marker: "抗平滑筋抗体", disease: "自己免疫性肝炎" },
              { review: "draft", sources: [], marker: "IgM-HA抗体", disease: "急性A型肝炎" },
              { review: "draft", sources: [], marker: "HCV-RNA", disease: "C型肝炎" },
            ],
            bonusMoves: 20,
          },
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
