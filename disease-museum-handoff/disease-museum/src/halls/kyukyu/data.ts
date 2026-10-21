// 救急・中毒ホール（NO.18）。医学内容はすべて未レビュー（review: "draft"）。
import type { Hall } from "../../engine/schema";
import { toxContent } from "./content/tox";
import { memoryContent } from "./content/memory";
import { fastContent } from "./content/fast";
import { shockContent } from "./content/shock";
import { versusContent } from "./content/versus";
import { triageContent } from "./content/triage";
import { orderContent } from "./content/order";
import { scenarioContent } from "./content/scenario";

const D = { review: "draft" as const, sources: [] as string[] };

export const hall: Hall = {
  id: "kyukyu", no: 18, title: "救急・中毒ホール",
  catch: "命を救う順番がある。見て、決めて、すぐ動こう。展示をクリアしてスタンプを8つ集めよう。",
  ticketNote: "A・B・C・D・E。まちがいは収蔵庫へ",
  map: {
    viewBox: "0 0 600 400", ariaLabel: "救急・中毒ホールの館内図", hint: "タップすると、その展示室へ移動します",
    organs: [
      { go: "w-tox", label: "中毒のウィングへ",
        svg: `<path d="M100 60 H160 V90 C190 110 200 150 190 190 C180 220 80 220 70 190 C60 150 70 110 100 90Z" fill="var(--mint)" stroke="#1C1537" stroke-width="4"/>
        <rect x="96" y="44" width="68" height="20" rx="6" fill="#fff" stroke="#1C1537" stroke-width="4"/>
        <circle class="eye" cx="112" cy="150" r="6" fill="#1C1537"/><circle class="eye" cx="148" cy="150" r="6" fill="#1C1537"/><path d="M118 176 Q130 168 142 176" stroke="#1C1537" stroke-width="4" fill="none"/>
        <text x="130" y="246" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">中毒</text>` },
      { go: "w-trauma", label: "外傷とショックのウィングへ",
        svg: `<rect x="280" y="60" width="120" height="120" rx="24" fill="#fff" stroke="#1C1537" stroke-width="4"/><path d="M340 80 V160 M300 120 H380" stroke="var(--tomato)" stroke-width="20"/>
        <text x="340" y="220" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">外傷とショック</text>` },
      { go: "w-mass", label: "災害と蘇生のウィングへ",
        svg: `${[["#FF5A5A", 460], ["#FFD84A", 495], ["#4CCB7A", 530], ["#2A2440", 565]].map(([c, x]) => `<rect x="${x}" y="80" width="28" height="56" rx="6" fill="${c}" stroke="#1C1537" stroke-width="3"/>`).join("")}
        <text x="512" y="170" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">災害と蘇生</text>` },
      { go: "w-er", label: "救急ERへ",
        svg: `<circle cx="300" cy="310" r="40" fill="var(--tomato)" stroke="#1C1537" stroke-width="4"/>
        <text x="300" y="323" text-anchor="middle" font-family="Dela Gothic One" font-size="30" fill="#fff">ER</text>
        <text x="300" y="374" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">救急ER</text>` },
    ],
  },
  wings: [
    { id: "w-tox", label: "中毒", color: "mint", headline: "瞳孔と汗が語る",
      exhibits: [
        { id: "tox", no: 1, type: "Custom", kind: "toxidrome", title: "トキシドロームを見抜け", stampLabel: "中毒",
          how: "顔（瞳孔・皮膚）とバイタルから中毒の症候群を当て、解毒薬や対応を答えよう。両方正解を通算4人でスタンプ。",
          cheatSheet: { ...D, title: "5つのトキシドローム",
            html: `<table><tr><th>抗コリン</th><td>散瞳・皮膚乾燥・高体温・頻脈・腸音低下・尿閉・せん妄</td></tr><tr><th>コリン作動性</th><td>縮瞳・発汗・流涎・下痢・徐脈・気道分泌</td></tr><tr><th>交感神経刺激</th><td>散瞳・発汗・頻脈・高血圧・高体温・興奮</td></tr><tr><th>オピオイド</th><td>縮瞳・呼吸抑制・意識障害</td></tr><tr><th>鎮静催眠</th><td>瞳孔はふつう、意識障害、バイタルは比較的保たれる</td></tr></table>` },
          data: toxContent },
        { id: "memory", no: 2, type: "MemoryMatch", title: "中毒と解毒薬 神経衰弱", stampLabel: "解毒薬",
          how: "中毒の原因と、その解毒薬のカードをペアにしよう。全部そろえるとスタンプ。", data: memoryContent },
      ] },
    { id: "w-trauma", label: "外傷とショック", color: "tomato", labelText: "light", headline: "出血を探し、止める",
      exhibits: [
        { id: "fast", no: 3, type: "Custom", kind: "tapMap", title: "FASTで探せ", stampLabel: "FAST",
          how: "外傷の患者で、どこにエコーを当てれば液体（出血）が見つかるかをタップしよう。通算4回正解でスタンプ。", data: fastContent },
        { id: "shock", no: 4, type: "Custom", kind: "grid", title: "ショックの4分類", stampLabel: "ショック",
          how: "所見からショックの種類を選び、最初の一手を決めよう。両方正解を通算5人でスタンプ。", data: shockContent },
        { id: "versus", no: 5, type: "VersusQuiz", title: "ヒントはどっちの味方？", stampLabel: "対決",
          how: "ヒントがどちらの病気のものか左右で答えよう。6問中5問以上でスタンプ。", data: versusContent },
      ] },
    { id: "w-mass", label: "災害と蘇生", color: "sun", headline: "限られた手で、多くを救う",
      exhibits: [
        { id: "triage", no: 6, type: "Custom", kind: "triage", title: "トリアージタッグを付けろ", stampLabel: "トリアージ",
          how: "多数傷病者の現場。1人ずつSTART法で色を付けよう。6人中5人以上で合格、通算2回合格でスタンプ。",
          cheatSheet: { ...D, title: "START法",
            html: `<ol><li>歩ける → 緑</li><li>気道を確保しても呼吸がない → 黒</li><li>呼吸数が30回/分を超える → 赤</li><li>橈骨動脈が触れない、または毛細血管再充満時間が2秒を超える → 赤</li><li>簡単な指示に従えない → 赤</li><li>それ以外 → 黄</li></ol>` },
          data: triageContent },
        { id: "order", no: 7, type: "Custom", kind: "order", title: "順番に並べよ", stampLabel: "手順",
          how: "一次救命処置、外傷の初期診療、化学物質の除染。正しい順にタップしよう。ノーミスを通算3問でスタンプ。", data: orderContent },
      ] },
    { id: "w-er", label: "救急ER", color: "cobalt", labelText: "light", headline: "決断の連続",
      exhibits: [
        { id: "er", no: 8, type: "Custom", kind: "scenario", title: "救急ER", stampLabel: "ER",
          how: "多発外傷、熱中症、アセトアミノフェン中毒。次の一手を選ぼう。ミス1回までならクリア、通算2シナリオでスタンプ。", data: scenarioContent },
      ] },
  ],
  gacha: {
    wing: "w-mass", title: "救急カートガチャ", machineLabel: "救急カート", intro: "命をつなぐ道具たち。",
    cost: 30, dupRefund: 10, pityAfterDups: 4,
    // TODO(review) 解説文
    items: [
      { ...D, id: "aed", name: "AED", rarity: 1, weight: 22, color: "#4CCB7A", text: "心室細動を止める。音声どおりに使えば誰でも。" },
      { ...D, id: "adrenaline", name: "アドレナリン", rarity: 2, weight: 14, color: "#FF5A36", text: "心停止とアナフィラキシーの主役。" },
      { ...D, id: "bvm", name: "バッグバルブマスク", rarity: 2, weight: 14, color: "#9EC8FF", text: "EC法でしっかり密着させる。" },
      { ...D, id: "collar", name: "頸椎カラー", rarity: 1, weight: 12, color: "#FFD84A", text: "頸椎損傷が否定できるまで外さない。" },
      { ...D, id: "tourniquet", name: "ターニケット", rarity: 2, weight: 10, color: "#2A2440", text: "手足の大出血を止める。巻いた時刻を書く。" },
      { ...D, id: "laryngo", name: "喉頭鏡", rarity: 3, weight: 8, color: "#C8C8D8", text: "声門を見て気管挿管。" },
      { ...D, id: "drain", name: "胸腔ドレーン", rarity: 3, weight: 7, color: "#FF7AB6", text: "気胸と血胸に。第4〜5肋間、中腋窩線あたりから。" },
      { ...D, id: "naloxone", name: "ナロキソン", rarity: 3, weight: 7, color: "#22C1A0", text: "オピオイドの呼吸抑制をひっくり返す。" },
      { ...D, id: "ecmo", name: "ECMO", rarity: 4, weight: 6, color: "#C8453B", text: "心臓と肺の代わり。最後の砦。" },
    ],
  },
  stampOrder: ["tox", "memory", "fast", "shock", "versus", "triage", "order", "er"],
};
