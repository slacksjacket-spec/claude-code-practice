// 腎・泌尿器ホール（NO.05）。医学内容はすべて未レビュー（review: "draft"）。
import type { Hall } from "../../engine/schema";
import { sedimentContent } from "./content/sediment";
import { glomerularContent } from "./content/glomerular";
import { nephronContent } from "./content/nephron";
import { hyponatremiaContent } from "./content/hyponatremia";
import { abgContent } from "./content/abg";
import { akiContent } from "./content/aki";
import { versusContent } from "./content/versus";
import { scenarioContent } from "./content/scenario";

const D = { review: "draft" as const, sources: [] as string[] };

export const hall: Hall = {
  id: "jinzo", no: 5, title: "腎・泌尿器ホール",
  catch: "尿を見て、ネフロンをたどって、塩と水をあやつる。展示をクリアしてスタンプを8つ集めよう。",
  ticketNote: "顕微鏡の中から、手がかりを探そう。まちがいは収蔵庫へ",
  map: {
    viewBox: "0 0 600 400", ariaLabel: "腎・泌尿器ホールの館内図", hint: "タップすると、その展示室へ移動します",
    organs: [
      { go: "w-urine", label: "尿を見るウィングへ",
        svg: `<rect x="60" y="230" width="90" height="120" rx="12" fill="#FFF1B8" stroke="#1C1537" stroke-width="4"/><path d="M60 270 L150 270" stroke="#E0C060" stroke-width="40" opacity=".5"/>
        <circle cx="140" cy="120" r="44" fill="#F3EEDF" stroke="#1C1537" stroke-width="8"/><rect x="134" y="160" width="12" height="40" fill="#1C1537"/>
        <text x="105" y="380" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">尿を見る</text>` },
      { go: "w-nephron", label: "ネフロンと電解質のウィングへ",
        svg: `<path d="M260 90 C210 90 196 170 230 210 C252 236 262 220 270 200 C278 176 300 176 300 150 C300 120 290 90 260 90Z" fill="var(--liver)" stroke="#1C1537" stroke-width="4"/>
        <path d="M340 90 C390 90 404 170 370 210 C348 236 338 220 330 200 C322 176 300 176 300 150 C300 120 310 90 340 90Z" fill="var(--liver)" stroke="#1C1537" stroke-width="4"/>
        <circle class="eye" cx="246" cy="146" r="6" fill="#fff"/><circle class="eye" cx="354" cy="146" r="6" fill="#fff"/>
        <path d="M240 166 Q248 174 256 166" stroke="#1C1537" stroke-width="3" fill="none"/><path d="M344 166 Q352 174 360 166" stroke="#1C1537" stroke-width="3" fill="none"/>
        <circle cx="232" cy="164" r="6" fill="var(--pink)" opacity=".7"/><circle cx="368" cy="164" r="6" fill="var(--pink)" opacity=".7"/>
        <path d="M270 210 C276 260 290 290 300 310 C310 290 324 260 330 210" stroke="#F2B3A6" stroke-width="8" fill="none"/>
        <ellipse cx="300" cy="330" rx="34" ry="24" fill="var(--sun)" stroke="#1C1537" stroke-width="4"/>
        <text x="300" y="380" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">腎臓（ネフロンと電解質）</text>` },
      { go: "w-aki", label: "腎不全と泌尿器のウィングへ",
        svg: `<rect x="440" y="70" width="110" height="80" rx="16" fill="var(--mint)" stroke="#1C1537" stroke-width="4"/>
        <text x="495" y="118" text-anchor="middle" font-family="Dela Gothic One" font-size="20" fill="#1C1537">AKI</text>
        <text x="495" y="176" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">腎不全と泌尿器</text>` },
      { go: "w-er", label: "腎・泌尿器ERへ",
        svg: `<circle cx="495" cy="280" r="40" fill="var(--tomato)" stroke="#1C1537" stroke-width="4"/>
        <text x="495" y="293" text-anchor="middle" font-family="Dela Gothic One" font-size="30" fill="#fff">ER</text>
        <text x="495" y="344" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">腎・泌尿器ER</text>` },
    ],
  },
  wings: [
    { id: "w-urine", label: "尿を見る", color: "sun", headline: "一滴に、手がかり",
      exhibits: [
        { id: "sediment", no: 1, type: "Custom", kind: "microscope", title: "尿沈渣で探せ", stampLabel: "尿沈渣",
          how: "顕微鏡の視野から、円柱や結晶を全部タップで見つけ、何を意味するか答えよう。見つけ方と判断の両方が正解を通算4回でスタンプ。", data: sedimentContent },
        { id: "glom", no: 2, type: "DiagnosisLab", title: "糸球体ラボ", stampLabel: "糸球体",
          how: "むくみや血尿の患者が次々やってくる。予算内で検査を選んで、糸球体の病気を診断しよう。4人正解でスタンプ。",
          cheatSheet: { ...D, title: "ネフローゼと腎炎",
            html: `<table><tr><th>ネフローゼ症候群</th><td>尿蛋白3.5 g/日以上＋低アルブミン（3.0 g/dL以下）。むくみ、脂質異常</td></tr><tr><th>腎炎</th><td>血尿（変形赤血球・赤血球円柱）、高血圧、腎機能低下</td></tr></table><h4>補体が下がる腎炎</h4><p>溶連菌感染後急性糸球体腎炎、ループス腎炎、膜性増殖性糸球体腎炎</p>` },
          data: glomerularContent },
      ] },
    { id: "w-nephron", label: "ネフロンと電解質", color: "mint", headline: "塩と水と酸をあやつる",
      exhibits: [
        { id: "nephron", no: 3, type: "Custom", kind: "tapMap", title: "ネフロンのどこ？", stampLabel: "ネフロン",
          how: "利尿薬が働く場所や、遺伝性の尿細管の病気の場所を、ネフロンの図でタップしよう。通算4回正解でスタンプ。", data: nephronContent },
        { id: "na", no: 4, type: "AlgorithmBoard", title: "低ナトリウム血症すごろく", stampLabel: "低Na",
          how: "浸透圧 → 体液量 → 尿Na の順に分かれ道を進んで、原因と対応を決めよう。まちがえるとコマが戻る。4人ゴールでスタンプ。",
          cheatSheet: { ...D, title: "低Na血症の考え方",
            html: `<ol><li>血漿浸透圧が正常〜高ければ、見かけの低Na（高血糖など）</li><li>低張性なら、体液量（減少・正常・増加）を見る</li><li>尿Naが低ければ腎はNaを保持（腎外からの喪失、心不全など）、高ければ腎からの喪失やSIADH</li></ol><p>急な補正は浸透圧性脱髄症候群の危険。</p>` },
          data: hyponatremiaContent },
        { id: "abg", no: 5, type: "Custom", kind: "abg", title: "血液ガス道場・腎編", stampLabel: "酸塩基",
          how: "pH → 一次性の障害 → 代償 → アニオンギャップ → 原因、の順に読もう。全部正解を通算3回でスタンプ。", data: abgContent },
      ] },
    { id: "w-aki", label: "腎不全と泌尿器", color: "cobalt", labelText: "light", headline: "どこで止まった？",
      exhibits: [
        { id: "aki", no: 6, type: "Custom", kind: "grid", title: "急性腎障害の3分類", stampLabel: "AKI",
          how: "所見から、腎前性・腎性・腎後性のどれかを選び、最初の対応を決めよう。両方正解を通算4人でスタンプ。", data: akiContent },
        { id: "versus", no: 7, type: "VersusQuiz", title: "ヒントはどっちの味方？", stampLabel: "対決",
          how: "ヒントがどちらの病気のものか左右で答えよう。6問中5問以上でスタンプ。", data: versusContent },
      ] },
    { id: "w-er", label: "腎・泌尿器ER", color: "tomato", labelText: "light", headline: "止まった流れを動かす",
      exhibits: [
        { id: "er", no: 8, type: "Custom", kind: "scenario", title: "腎・泌尿器ER", stampLabel: "ER",
          how: "高K血症、閉塞性腎盂腎炎、急性尿閉。次の一手を選ぼう。ミス1回までならクリア、通算2シナリオでスタンプ。", data: scenarioContent },
      ] },
  ],
  gacha: {
    wing: "w-urine", title: "円柱と結晶ガチャ", machineLabel: "円柱と結晶", intro: "尿の中には、腎臓からの手紙がまぎれている。",
    cost: 30, dupRefund: 10, pityAfterDups: 4,
    // TODO(review) 解説文
    items: [
      { ...D, id: "hyaline", name: "硝子円柱", rarity: 1, weight: 22, color: "#F7F5FB", text: "健康な人や脱水でも見られる、透明な円柱。" },
      { ...D, id: "granular", name: "顆粒円柱", rarity: 2, weight: 14, color: "#C9A27A", text: "壊れた細胞の顆粒を含む。泥のような茶色なら急性尿細管壊死。" },
      { ...D, id: "rbcCast", name: "赤血球円柱", rarity: 2, weight: 14, color: "#E58C7C", text: "糸球体腎炎のしるし。" },
      { ...D, id: "oxalate", name: "シュウ酸Ca結晶", rarity: 1, weight: 12, color: "#F2F6FA", text: "封筒形。尿路結石で最も多い成分。" },
      { ...D, id: "wbcCast", name: "白血球円柱", rarity: 2, weight: 10, color: "#D8D2E6", text: "腎盂腎炎や間質性腎炎。" },
      { ...D, id: "waxy", name: "ろう様円柱", rarity: 3, weight: 8, color: "#F5E6A8", text: "ろうのように光る。長く尿細管にとどまった円柱で、慢性腎不全。" },
      { ...D, id: "fatty", name: "脂肪円柱", rarity: 3, weight: 7, color: "#FFF8C8", text: "偏光で十字（マルタ十字）に見える。ネフローゼ症候群。" },
      { ...D, id: "cystine", name: "シスチン結晶", rarity: 3, weight: 7, color: "#EEF4F8", text: "六角形。シスチン尿症。" },
      { ...D, id: "struvite", name: "リン酸マグネシウムアンモニウム結晶", rarity: 4, weight: 6, color: "#B9E2F2", text: "棺のふた形。ウレアーゼ産生菌（プロテウス）の感染で、サンゴ状結石をつくる。" },
    ],
  },
  stampOrder: ["sediment", "glom", "nephron", "na", "abg", "aki", "versus", "er"],
};
