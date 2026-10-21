// 運動器ホール（NO.17）。医学内容はすべて未レビュー（review: "draft"）。
import type { Hall } from "../../engine/schema";
import { rootContent } from "./content/root";
import { nerveContent } from "./content/nerve";
import { backContent } from "./content/back";
import { versusContent } from "./content/versus";
import { fractureContent } from "./content/fracture";
import { orderContent } from "./content/order";
import { memoryContent } from "./content/memory";
import { scenarioContent } from "./content/scenario";

const D = { review: "draft" as const, sources: [] as string[] };

export const hall: Hall = {
  id: "undoki", no: 17, title: "運動器ホール",
  catch: "骨と関節と神経。どこが痛み、どこがしびれるかで場所を当てよう。展示をクリアしてスタンプを8つ集めよう。",
  ticketNote: "しびれの地図で、神経の場所がわかる。まちがいは収蔵庫へ",
  map: {
    viewBox: "0 0 600 400", ariaLabel: "運動器ホールの館内図", hint: "タップすると、その展示室へ移動します",
    organs: [
      { go: "w-nerve", label: "神経と脊椎のウィングへ",
        svg: `${[60, 100, 140, 180].map((y) => `<rect x="110" y="${y}" width="60" height="32" rx="6" fill="#F3EEDF" stroke="#1C1537" stroke-width="3"/>`).join("")}<path d="M170 116 C200 116 210 140 240 140" stroke="var(--sun)" stroke-width="5" fill="none"/><path d="M170 156 C200 156 210 180 240 190" stroke="var(--sun)" stroke-width="5" fill="none"/>
        <circle class="eye" cx="128" cy="116" r="4" fill="#1C1537"/><circle class="eye" cx="152" cy="116" r="4" fill="#1C1537"/><path d="M134 126 Q140 130 146 126" stroke="#1C1537" stroke-width="2" fill="none"/>
        <text x="150" y="240" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">神経と脊椎</text>` },
      { go: "w-bone", label: "骨と関節のウィングへ",
        svg: `<path d="M360 70 C340 50 320 80 340 90 L420 170 C410 190 440 200 446 180 C466 186 470 156 450 150 L370 70 C380 50 350 40 360 70Z" fill="#F3EEDF" stroke="#1C1537" stroke-width="4"/>
        <circle class="eye" cx="388" cy="114" r="5" fill="#1C1537"/><circle class="eye" cx="404" cy="128" r="5" fill="#1C1537"/>
        <text x="400" y="240" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">骨と関節</text>` },
      { go: "w-er", label: "運動器ERへ",
        svg: `<circle cx="300" cy="320" r="40" fill="var(--tomato)" stroke="#1C1537" stroke-width="4"/>
        <text x="300" y="333" text-anchor="middle" font-family="Dela Gothic One" font-size="30" fill="#fff">ER</text>
        <text x="300" y="384" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">運動器ER</text>` },
    ],
  },
  wings: [
    { id: "w-nerve", label: "神経と脊椎", color: "sun", headline: "しびれの地図",
      exhibits: [
        { id: "root", no: 1, type: "Custom", kind: "root", title: "神経根レベル", stampLabel: "神経根",
          how: "筋力低下・反射・感覚の低下（図の色）から、障害された神経根を当て、続けて質問に答えよう。両方正解を通算4人でスタンプ。", data: rootContent },
        { id: "nerve", no: 2, type: "Custom", kind: "tapMap", title: "末梢神経はどこで傷んだ？", stampLabel: "末梢神経",
          how: "症状から、末梢神経が傷んだ場所をタップしよう。通算4回正解でスタンプ。",
          cheatSheet: { ...D, title: "手の3つの麻痺",
            html: `<table><tr><th>橈骨神経</th><td>下垂手。手の甲の親指側のしびれ</td></tr><tr><th>正中神経</th><td>猿手（母指球の萎縮）、祝祷肢位。親指〜薬指の親指側</td></tr><tr><th>尺骨神経</th><td>鷲手、Froment徴候。小指と薬指の小指側</td></tr></table>` },
          data: nerveContent },
        { id: "back", no: 3, type: "DiagnosisLab", title: "腰痛ラボ", stampLabel: "腰痛",
          how: "腰痛の患者が次々やってくる。危険なサインを見逃さず、予算内で検査を選んで診断しよう。4人正解でスタンプ。", data: backContent },
        { id: "versus", no: 4, type: "VersusQuiz", title: "ヒントはどっちの味方？", stampLabel: "対決",
          how: "ヒントがどちらの病気のものか左右で答えよう。6問中5問以上でスタンプ。", data: versusContent },
      ] },
    { id: "w-bone", label: "骨と関節", color: "mint", headline: "折れる、治る、育つ",
      exhibits: [
        { id: "fracture", no: 5, type: "Custom", kind: "reveal", title: "骨折の影絵当て", stampLabel: "骨折",
          how: "ぼやけたX線の模式図が少しずつくっきりする。わかった瞬間に骨折の名前を答えよう。一発正解を通算4枚でスタンプ。", data: fractureContent },
        { id: "order", no: 6, type: "Custom", kind: "order", title: "順番に並べよ", stampLabel: "順番",
          how: "骨折の治り方、子どもの股関節の病気の年齢、五十肩の経過。正しい順にタップしよう。ノーミスを通算3問でスタンプ。", data: orderContent },
        { id: "memory", no: 7, type: "MemoryMatch", title: "骨と関節 神経衰弱", stampLabel: "骨の病気",
          how: "病気と、その特徴のカードをペアにしよう。全部そろえるとスタンプ。", data: memoryContent },
      ] },
    { id: "w-er", label: "運動器ER", color: "tomato", labelText: "light", headline: "手足を守る時間",
      exhibits: [
        { id: "er", no: 8, type: "Custom", kind: "scenario", title: "運動器ER", stampLabel: "ER",
          how: "コンパートメント症候群、開放骨折、化膿性股関節炎。次の一手を選ぼう。ミス1回までならクリア、通算2シナリオでスタンプ。", data: scenarioContent },
      ] },
  ],
  gacha: {
    wing: "w-bone", title: "骨ガチャ", machineLabel: "骨", intro: "206本の骨の中から、だれが出るかな？",
    cost: 30, dupRefund: 10, pityAfterDups: 4,
    // TODO(review) 解説文
    items: [
      { ...D, id: "femur", name: "大腿骨", rarity: 1, weight: 22, color: "#F3EEDF", text: "いちばん長い骨。頸部骨折は寝たきりの入口。" },
      { ...D, id: "clavicle", name: "鎖骨", rarity: 2, weight: 14, color: "#E8E4D8", text: "いちばん先に骨化が始まる骨。" },
      { ...D, id: "radius", name: "橈骨", rarity: 2, weight: 14, color: "#F7EED8", text: "遠位端骨折は骨粗鬆症のサイン。" },
      { ...D, id: "vertebra", name: "腰椎", rarity: 1, weight: 12, color: "#FFF1D6", text: "体重を支える5つの椎骨。" },
      { ...D, id: "patella", name: "膝蓋骨", rarity: 2, weight: 10, color: "#FFE08A", text: "体でいちばん大きな種子骨。" },
      { ...D, id: "scaphoid", name: "舟状骨", rarity: 3, weight: 8, color: "#9EC8FF", text: "折れても見逃されやすく、偽関節や壊死に。嗅ぎたばこ窩の圧痛。" },
      { ...D, id: "talus", name: "距骨", rarity: 3, weight: 7, color: "#C8A27A", text: "筋肉が1つもつかない不思議な骨。" },
      { ...D, id: "dens", name: "歯突起（軸椎）", rarity: 3, weight: 7, color: "#FF7AB6", text: "首を回す軸。関節リウマチで亜脱臼。" },
      { ...D, id: "hyoid", name: "舌骨", rarity: 4, weight: 6, color: "#22C1A0", text: "ほかの骨とつながらない、ひとりぼっちの骨。" },
    ],
  },
  stampOrder: ["root", "nerve", "back", "versus", "fracture", "order", "memory", "er"],
};
