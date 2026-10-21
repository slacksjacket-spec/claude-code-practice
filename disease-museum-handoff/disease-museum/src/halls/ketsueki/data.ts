// 血液ホール（NO.07）。医学内容はすべて未レビュー（review: "draft"）。
import type { Hall } from "../../engine/schema";
import { smearContent } from "./content/smear";
import { anemiaContent } from "./content/anemia";
import { pancytoContent } from "./content/pancyto";
import { memoryContent } from "./content/memory";
import { coagContent } from "./content/coag";
import { transfusionContent } from "./content/transfusion";
import { versusContent } from "./content/versus";
import { scenarioContent } from "./content/scenario";

const D = { review: "draft" as const, sources: [] as string[] };

export const hall: Hall = {
  id: "ketsueki", no: 7, title: "血液ホール",
  catch: "一滴の血を、顕微鏡と数字で読む。展示をクリアしてスタンプを8つ集めよう。",
  ticketNote: "血球の形に、病気のサインがある。まちがいは収蔵庫へ",
  map: {
    viewBox: "0 0 600 400", ariaLabel: "血液ホールの館内図", hint: "タップすると、その展示室へ移動します",
    organs: [
      { go: "w-smear", label: "血液を見るウィングへ",
        svg: `<circle cx="130" cy="140" r="70" fill="#E88A80" stroke="#1C1537" stroke-width="4"/><circle cx="130" cy="140" r="30" fill="#F6C2BA"/>
        <circle class="eye" cx="108" cy="128" r="7" fill="#1C1537"/><circle class="eye" cx="152" cy="128" r="7" fill="#1C1537"/><path d="M118 152 Q130 162 142 152" stroke="#1C1537" stroke-width="4" fill="none"/>
        <circle cx="94" cy="150" r="7" fill="var(--pink)" opacity=".8"/><circle cx="166" cy="150" r="7" fill="var(--pink)" opacity=".8"/>
        <text x="130" y="240" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">血液を見る</text>` },
      { go: "w-marrow", label: "骨髄と腫瘍のウィングへ",
        svg: `<path d="M260 90 C240 70 230 100 250 110 L330 190 C320 210 350 220 356 200 C376 206 380 176 360 170 L280 90 C290 70 260 60 260 90Z" fill="#F3EEDF" stroke="#1C1537" stroke-width="4"/>
        <circle cx="305" cy="140" r="9" fill="#C8453B"/><circle cx="290" cy="125" r="5" fill="#9C7CC4"/>
        <text x="300" y="250" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">骨髄と腫瘍</text>` },
      { go: "w-coag", label: "止血と輸血のウィングへ",
        svg: `<rect x="440" y="70" width="90" height="120" rx="20" fill="#C8453B" stroke="#1C1537" stroke-width="4"/><rect x="474" y="54" width="22" height="18" rx="4" fill="#fff" stroke="#1C1537" stroke-width="4"/>
        <rect x="452" y="92" width="66" height="34" rx="6" fill="#fff" stroke="#1C1537" stroke-width="3"/><text x="485" y="116" text-anchor="middle" font-family="Dela Gothic One" font-size="18" fill="#1C1537">O＋</text>
        <text x="485" y="224" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">止血と輸血</text>` },
      { go: "w-er", label: "血液ERへ",
        svg: `<circle cx="300" cy="320" r="40" fill="var(--tomato)" stroke="#1C1537" stroke-width="4"/>
        <text x="300" y="333" text-anchor="middle" font-family="Dela Gothic One" font-size="30" fill="#fff">ER</text>
        <text x="300" y="384" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">血液ER</text>` },
    ],
  },
  wings: [
    { id: "w-smear", label: "血液を見る", color: "tomato", labelText: "light", headline: "形と大きさが語る",
      exhibits: [
        { id: "smear", no: 1, type: "Custom", kind: "microscope", title: "末梢血スメアで探せ", stampLabel: "スメア",
          how: "塗抹標本の視野から、手がかりになる血球を全部タップで見つけ、診断を答えよう。両方正解を通算4回でスタンプ。", data: smearContent },
        { id: "anemia", no: 2, type: "Custom", kind: "grid", title: "貧血の4マス", stampLabel: "貧血",
          how: "MCVと網赤血球から貧血のマスを選び、治療を決めよう。両方正解を通算4人でスタンプ。",
          cheatSheet: { ...D, title: "貧血の分け方",
            html: `<table><tr><th>小球性（MCV 80未満）</th><td>鉄欠乏、慢性炎症、サラセミア、鉄芽球性</td></tr><tr><th>正球性</th><td>溶血、出血、再生不良性、腎性</td></tr><tr><th>大球性（MCV 100超）</th><td>B₁₂・葉酸欠乏、MDS、肝障害</td></tr></table><p>網赤血球が増えていれば、骨髄は頑張っている（溶血・出血）。</p>` },
          data: anemiaContent },
      ] },
    { id: "w-marrow", label: "骨髄と腫瘍", color: "pink", headline: "血の工場をのぞく",
      exhibits: [
        { id: "pancyto", no: 3, type: "DiagnosisLab", title: "汎血球減少ラボ", stampLabel: "汎血球減少",
          how: "3系統とも少ない患者が次々やってくる。予算内で検査を選んで診断しよう。4人正解でスタンプ。", data: pancytoContent },
        { id: "memory", no: 4, type: "MemoryMatch", title: "染色体と血液腫瘍 神経衰弱", stampLabel: "染色体",
          how: "遺伝子・染色体の異常と、血液腫瘍のカードをペアにしよう。全部そろえるとスタンプ。", data: memoryContent },
      ] },
    { id: "w-coag", label: "止血と輸血", color: "sun", headline: "止める、入れる",
      exhibits: [
        { id: "coag", no: 5, type: "Custom", kind: "tapMap", title: "凝固カスケードのどこ？", stampLabel: "凝固",
          how: "PT・APTT・血小板の結果から、障害されている場所をカスケードの図でタップしよう。通算4回正解でスタンプ。", data: coagContent },
        { id: "transfusion", no: 6, type: "Custom", kind: "transfusion", title: "輸血バッグを選べ", stampLabel: "輸血",
          how: "受血者の血液型と製剤（赤血球・血漿）を見て、入れても溶血しないバッグを全部選ぼう（実際は原則同型）。全部正しく選べたら1回、通算4回でスタンプ。",
          cheatSheet: { ...D, title: "ABOの向き",
            html: `<table><tr><th>赤血球</th><td>ドナーの赤血球の抗原が、受血者の抗体に当たらない（O型は誰にでも）</td></tr><tr><th>血漿</th><td>ドナーの血漿の抗体が、受血者の赤血球に当たらない（AB型は誰にでも）</td></tr><tr><th>Rh</th><td>Rh陰性の人の赤血球はRh陰性から</td></tr></table>` },
          data: transfusionContent },
        { id: "versus", no: 7, type: "VersusQuiz", title: "ヒントはどっちの味方？", stampLabel: "対決",
          how: "ヒントがどちらの病気のものか左右で答えよう。6問中5問以上でスタンプ。", data: versusContent },
      ] },
    { id: "w-er", label: "血液ER", color: "cobalt", labelText: "light", headline: "一刻を争う血液の急変",
      exhibits: [
        { id: "er", no: 8, type: "Custom", kind: "scenario", title: "血液ER", stampLabel: "ER",
          how: "発熱性好中球減少症、輸血中の急変、腫瘍崩壊症候群。次の一手を選ぼう。ミス1回までならクリア、通算2シナリオでスタンプ。", data: scenarioContent },
      ] },
  ],
  gacha: {
    wing: "w-smear", title: "血球ガチャ", machineLabel: "血球", intro: "骨髄で生まれ、血管を旅する仲間たち。",
    cost: 30, dupRefund: 10, pityAfterDups: 4,
    // TODO(review) 解説文
    items: [
      { ...D, id: "rbc", name: "赤血球", rarity: 1, weight: 22, color: "#E88A80", text: "核のない円盤。寿命は約120日。" },
      { ...D, id: "neut", name: "好中球", rarity: 2, weight: 14, color: "#F4E4EE", text: "細菌と戦う最前線。核が分かれている。" },
      { ...D, id: "lymph", name: "リンパ球", rarity: 2, weight: 14, color: "#C8D8F4", text: "T細胞・B細胞・NK細胞。" },
      { ...D, id: "plt", name: "血小板", rarity: 1, weight: 12, color: "#9C7CC4", text: "巨核球のかけら。寿命は約10日。" },
      { ...D, id: "mono", name: "単球", rarity: 2, weight: 10, color: "#D8D0E8", text: "組織に入るとマクロファージになる。" },
      { ...D, id: "eos", name: "好酸球", rarity: 3, weight: 8, color: "#FF9A7A", text: "赤い顆粒。寄生虫とアレルギー。" },
      { ...D, id: "retic", name: "網赤血球", rarity: 3, weight: 7, color: "#F6C2BA", text: "生まれたての赤血球。骨髄の元気さの目印。" },
      { ...D, id: "baso", name: "好塩基球", rarity: 3, weight: 7, color: "#5B3F8C", text: "いちばん少ない白血球。増えたらCMLを考える。" },
      { ...D, id: "mega", name: "巨核球", rarity: 4, weight: 6, color: "#B8A0E0", text: "骨髄の巨人。ちぎれて血小板になる。" },
    ],
  },
  stampOrder: ["smear", "anemia", "pancyto", "memory", "coag", "transfusion", "versus", "er"],
};
