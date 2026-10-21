// 皮膚ホール（NO.14）。医学内容はすべて未レビュー（review: "draft"）。
import type { Hall } from "../../engine/schema";
import { eruptionContent } from "./content/eruption";
import { moleContent } from "./content/mole";
import { blisterContent } from "./content/blister";
import { burnContent } from "./content/burn";
import { ninesContent } from "./content/nines";
import { memoryContent } from "./content/memory";
import { versusContent } from "./content/versus";
import { scenarioContent } from "./content/scenario";

const D = { review: "draft" as const, sources: [] as string[] };

export const hall: Hall = {
  id: "hifu", no: 14, title: "皮膚ホール",
  catch: "皮膚は、外から見える内臓。形と色と深さを読もう。展示をクリアしてスタンプを8つ集めよう。",
  ticketNote: "その発疹、なんて呼ぶ？ まちがいは収蔵庫へ",
  map: {
    viewBox: "0 0 600 400", ariaLabel: "皮膚ホールの館内図", hint: "タップすると、その展示室へ移動します",
    organs: [
      { go: "w-look", label: "皮疹を見るウィングへ",
        svg: `<rect x="40" y="70" width="200" height="40" fill="#F3D3B8" stroke="#1C1537" stroke-width="4"/><rect x="40" y="110" width="200" height="70" fill="#F7C6C0" stroke="#1C1537" stroke-width="4"/>
        <path d="M100 70 Q130 30 160 70Z" fill="#E6F6FC" stroke="#1C1537" stroke-width="3"/><circle cx="200" cy="64" r="10" fill="#8A5A3A"/>
        <circle class="eye" cx="120" cy="140" r="6" fill="#1C1537"/><circle class="eye" cx="160" cy="140" r="6" fill="#1C1537"/><path d="M128 158 Q140 166 152 158" stroke="#1C1537" stroke-width="4" fill="none"/>
        <text x="140" y="214" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">皮疹を見る</text>` },
      { go: "w-burn", label: "熱傷のウィングへ",
        svg: `<path d="M400 190 C350 190 340 140 370 110 C370 140 390 140 390 120 C390 90 410 70 420 50 C430 90 470 100 460 150 C456 176 440 190 400 190Z" fill="var(--tomato)" stroke="#1C1537" stroke-width="4"/><path d="M402 186 C380 186 376 160 392 146 C396 160 410 160 410 150 C420 160 426 186 402 186Z" fill="var(--sun)"/>
        <text x="410" y="226" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">熱傷</text>` },
      { go: "w-body", label: "皮膚と全身のウィングへ",
        svg: `<circle cx="160" cy="290" r="30" fill="#F6D9BE" stroke="#1C1537" stroke-width="4"/><rect x="134" y="320" width="52" height="50" rx="12" fill="var(--mint)" stroke="#1C1537" stroke-width="4"/>
        ${[[150, 284], [170, 296], [158, 302]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="var(--pink)"/>`).join("")}
        <text x="160" y="392" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">皮膚と全身</text>` },
      { go: "w-er", label: "皮膚ERへ",
        svg: `<circle cx="420" cy="320" r="40" fill="var(--tomato)" stroke="#1C1537" stroke-width="4"/>
        <text x="420" y="333" text-anchor="middle" font-family="Dela Gothic One" font-size="30" fill="#fff">ER</text>
        <text x="420" y="384" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">皮膚ER</text>` },
    ],
  },
  wings: [
    { id: "w-look", label: "皮疹を見る", color: "pink", headline: "形・色・深さ",
      exhibits: [
        { id: "eruption", no: 1, type: "Custom", kind: "reveal", title: "原発疹の影絵当て", stampLabel: "原発疹",
          how: "ぼやけた断面と表面の模式図が少しずつくっきりする。わかった瞬間に原発疹の名前を答えよう。一発正解を通算4枚でスタンプ。", data: eruptionContent },
        { id: "mole", no: 2, type: "Custom", kind: "mole", title: "ほくろのABCDE", stampLabel: "ABCDE",
          how: "色素斑の絵を見て、メラノーマを疑うサイン（A非対称・B境界・C色むら・D 6 mm超・E変化）を全部選び、対応を答えよう。両方正解を通算4回でスタンプ。", data: moleContent },
        { id: "blister", no: 3, type: "Custom", kind: "grid", title: "水疱症の4マス", stampLabel: "水疱症",
          how: "水疱がどこで裂けるか、原因は何かで4マスに分け、治療を選ぼう。両方正解を通算4人でスタンプ。", data: blisterContent },
      ] },
    { id: "w-burn", label: "熱傷", color: "tomato", labelText: "light", headline: "深さと広さ",
      exhibits: [
        { id: "burn", no: 4, type: "Custom", kind: "depth", title: "熱傷の深さ", stampLabel: "熱傷深度",
          how: "見た目と痛みから、熱傷がどの層まで届いたかをタップし、治療を選ぼう。両方正解を通算4人でスタンプ。", data: burnContent },
        { id: "nines", no: 5, type: "Custom", kind: "tapMap", title: "9の法則", stampLabel: "9の法則",
          how: "やけどした場所を全部選び、面積を計算しよう。両方正解を通算4人でスタンプ。", data: ninesContent },
      ] },
    { id: "w-body", label: "皮膚と全身", color: "mint", headline: "皮膚は内臓の窓",
      exhibits: [
        { id: "memory", no: 6, type: "MemoryMatch", title: "デルマドローム 神経衰弱", stampLabel: "デルマドローム",
          how: "皮膚の所見と、その裏にある内臓の病気のカードをペアにしよう。全部そろえるとスタンプ。", data: memoryContent },
        { id: "versus", no: 7, type: "VersusQuiz", title: "ヒントはどっちの味方？", stampLabel: "対決",
          how: "ヒントがどちらの病気のものか左右で答えよう。6問中5問以上でスタンプ。", data: versusContent },
      ] },
    { id: "w-er", label: "皮膚ER", color: "cobalt", labelText: "light", headline: "皮膚の急変は全身の急変",
      exhibits: [
        { id: "er", no: 8, type: "Custom", kind: "scenario", title: "皮膚ER", stampLabel: "ER",
          how: "重症薬疹、壊死性筋膜炎、広範囲熱傷。次の一手を選ぼう。ミス1回までならクリア、通算2シナリオでスタンプ。", data: scenarioContent },
      ] },
  ],
  gacha: {
    wing: "w-look", title: "皮膚の住人ガチャ", machineLabel: "皮膚の住人", intro: "たった数ミリの中に、こんなにたくさん。",
    cost: 30, dupRefund: 10, pityAfterDups: 4,
    // TODO(review) 解説文
    items: [
      { ...D, id: "kc", name: "角化細胞", rarity: 1, weight: 22, color: "#F3D3B8", text: "表皮の主役。約4週で生まれ変わる。" },
      { ...D, id: "mel", name: "メラノサイト", rarity: 2, weight: 14, color: "#6B3E22", text: "メラニンを作って配る。メラノーマの起源。" },
      { ...D, id: "lc", name: "Langerhans細胞", rarity: 2, weight: 14, color: "#9EC8FF", text: "表皮の見張り番。抗原を運ぶ。" },
      { ...D, id: "fib", name: "線維芽細胞", rarity: 1, weight: 12, color: "#F7C6C0", text: "真皮のコラーゲンを作る。" },
      { ...D, id: "mast", name: "肥満細胞", rarity: 2, weight: 10, color: "#FF7AB6", text: "ヒスタミンの袋。じんましんの主役。" },
      { ...D, id: "eccrine", name: "エクリン汗腺", rarity: 3, weight: 8, color: "#B9E2F2", text: "体温を下げる汗。手のひらに多い。" },
      { ...D, id: "seb", name: "皮脂腺", rarity: 3, weight: 7, color: "#FFE08A", text: "毛包に開く。にきびの舞台。" },
      { ...D, id: "merkel", name: "Merkel細胞", rarity: 3, weight: 7, color: "#C8A27A", text: "触覚を感じる。まれな悪性腫瘍の起源。" },
      { ...D, id: "stem", name: "毛包幹細胞", rarity: 4, weight: 6, color: "#22C1A0", text: "バルジ領域に住む、毛と皮膚の再生の源。" },
    ],
  },
  stampOrder: ["eruption", "mole", "blister", "burn", "nines", "memory", "versus", "er"],
};
