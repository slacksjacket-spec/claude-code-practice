// 内分泌・代謝ホール（NO.06）。医学内容はすべて未レビュー（review: "draft"）。
import type { Hall } from "../../engine/schema";
import { axisContent } from "./content/axis";
import { cushingContent } from "./content/cushing";
import { thyroidContent } from "./content/thyroid";
import { calciumContent } from "./content/calcium";
import { ogttContent } from "./content/ogtt";
import { drugsContent } from "./content/drugs";
import { versusContent } from "./content/versus";
import { scenarioContent } from "./content/scenario";

const D = { review: "draft" as const, sources: [] as string[] };

export const hall: Hall = {
  id: "naibunpi", no: 6, title: "内分泌・代謝ホール",
  catch: "上がる？下がる？ フィードバックを読み解けば、原因が見えてくる。展示をクリアしてスタンプを8つ集めよう。",
  ticketNote: "矢印ひとつで、診断が変わる。まちがいは収蔵庫へ",
  map: {
    viewBox: "0 0 600 400", ariaLabel: "内分泌・代謝ホールの館内図", hint: "タップすると、その展示室へ移動します",
    organs: [
      { go: "w-axis", label: "視床下部・下垂体のウィングへ",
        svg: `<ellipse cx="120" cy="110" rx="80" ry="60" fill="var(--pink)" stroke="#1C1537" stroke-width="4"/>
        <path d="M120 170 L120 200" stroke="#1C1537" stroke-width="6"/><circle cx="120" cy="214" r="18" fill="var(--sun)" stroke="#1C1537" stroke-width="4"/>
        <circle class="eye" cx="96" cy="104" r="7" fill="#1C1537"/><circle class="eye" cx="144" cy="104" r="7" fill="#1C1537"/><path d="M106 128 Q120 140 134 128" stroke="#1C1537" stroke-width="4" fill="none"/>
        <circle cx="82" cy="126" r="8" fill="var(--tomato)" opacity=".5"/><circle cx="158" cy="126" r="8" fill="var(--tomato)" opacity=".5"/>
        <text x="120" y="262" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">視床下部・下垂体</text>` },
      { go: "w-thyroid", label: "甲状腺・副甲状腺のウィングへ",
        svg: `<path d="M300 90 C260 70 230 110 250 160 C262 190 290 180 300 150 C310 180 338 190 350 160 C370 110 340 70 300 90Z" fill="var(--liver)" stroke="#1C1537" stroke-width="4"/>
        <circle cx="262" cy="160" r="7" fill="var(--sun)" stroke="#1C1537" stroke-width="2"/><circle cx="338" cy="160" r="7" fill="var(--sun)" stroke="#1C1537" stroke-width="2"/>
        <circle class="eye" cx="274" cy="118" r="6" fill="#fff"/><circle class="eye" cx="326" cy="118" r="6" fill="#fff"/><path d="M290 140 Q300 148 310 140" stroke="#fff" stroke-width="3" fill="none"/>
        <text x="300" y="214" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">甲状腺・副甲状腺</text>` },
      { go: "w-sugar", label: "糖代謝のウィングへ",
        svg: `<path d="M420 120 C440 90 520 90 560 110 C580 124 560 150 530 146 C500 142 470 160 440 156 C410 152 404 136 420 120Z" fill="var(--sun)" stroke="#1C1537" stroke-width="4"/>
        <circle class="eye" cx="470" cy="122" r="5" fill="#1C1537"/><circle class="eye" cx="500" cy="118" r="5" fill="#1C1537"/><path d="M478 134 Q486 140 494 134" stroke="#1C1537" stroke-width="3" fill="none"/>
        <rect x="450" y="190" width="40" height="40" rx="6" fill="#fff" stroke="#1C1537" stroke-width="4"/><rect x="500" y="200" width="30" height="30" rx="5" fill="#fff" stroke="#1C1537" stroke-width="4"/>
        <text x="490" y="262" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">膵島と糖代謝</text>` },
      { go: "w-er", label: "内分泌ERへ",
        svg: `<circle cx="300" cy="320" r="40" fill="var(--tomato)" stroke="#1C1537" stroke-width="4"/>
        <text x="300" y="333" text-anchor="middle" font-family="Dela Gothic One" font-size="30" fill="#fff">ER</text>
        <text x="300" y="384" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">内分泌ER</text>` },
    ],
  },
  wings: [
    { id: "w-axis", label: "視床下部・下垂体", color: "pink", headline: "上の階と下の階の会話",
      exhibits: [
        { id: "feedback", no: 1, type: "Custom", kind: "axis", title: "フィードバック矢印パズル", stampLabel: "ホルモン軸",
          how: "視床下部→下垂体→標的臓器。検査値をヒントに、残りのホルモンが上がるか下がるかを矢印で予想し、原因を答えよう。両方正解を通算5回でスタンプ。",
          cheatSheet: { ...D, title: "負のフィードバック",
            html: `<p>下の階のホルモンが増えると、上の階は出すのを控える。</p><table><tr><th>原発性（標的臓器）の亢進</th><td>上の階は ↓↓</td></tr><tr><th>原発性の低下</th><td>上の階は ↑↑</td></tr><tr><th>下垂体の亢進</th><td>下は ↑、上（視床下部）は ↓</td></tr><tr><th>下垂体の低下</th><td>下は ↓、上は ↑</td></tr></table>` },
          data: axisContent },
        { id: "cushing", no: 2, type: "AlgorithmBoard", title: "Cushing症候群すごろく", stampLabel: "Cushing",
          how: "デキサメタゾン抑制試験 → ACTH → 大量デキサメタゾン。分かれ道を進んで原因を突き止めよう。4人ゴールでスタンプ。", data: cushingContent },
      ] },
    { id: "w-thyroid", label: "甲状腺・副甲状腺", color: "tomato", labelText: "light", headline: "表のどこに落ちる？",
      exhibits: [
        { id: "thyroid", no: 3, type: "Custom", kind: "grid", title: "甲状腺の9マス", stampLabel: "甲状腺",
          how: "FT4とTSHの組み合わせからマスを選び、対応を決めよう。両方正解を通算4人でスタンプ。", data: thyroidContent },
        { id: "calcium", no: 4, type: "Custom", kind: "grid", title: "カルシウムとPTH", stampLabel: "Ca・PTH",
          how: "CaとPTHの組み合わせから、高Ca・低Caの原因を4マスで見分けよう。通算4人正解でスタンプ。", data: calciumContent },
      ] },
    { id: "w-sugar", label: "糖代謝", color: "sun", headline: "血糖の山を読む",
      exhibits: [
        { id: "ogtt", no: 5, type: "Custom", kind: "ogtt", title: "糖負荷曲線を読め", stampLabel: "OGTT",
          how: "75g糖負荷試験のグラフから、正常型・境界型・糖尿病型を判定し、診断や病態を答えよう。両方正解を通算4回でスタンプ。",
          cheatSheet: { ...D, title: "OGTTの判定（mg/dL）",
            html: `<table><tr><th>糖尿病型</th><td>空腹時 126以上 または 2時間値 200以上</td></tr><tr><th>正常型</th><td>空腹時 110未満 かつ 2時間値 140未満</td></tr><tr><th>境界型</th><td>どちらでもない</td></tr></table><p>血糖とHbA1c（6.5%以上）が同日にともに糖尿病型なら1回で診断。</p>` },
          data: ogttContent },
        { id: "drugs", no: 6, type: "MemoryMatch", title: "糖尿病の薬 神経衰弱", stampLabel: "糖尿病薬",
          how: "薬と、その特徴・副作用のカードをペアにしよう。全部そろえるとスタンプ。", data: drugsContent },
        { id: "versus", no: 7, type: "VersusQuiz", title: "ヒントはどっちの味方？", stampLabel: "対決",
          how: "ヒントがどちらの病気のものか左右で答えよう。6問中5問以上でスタンプ。", data: versusContent },
      ] },
    { id: "w-er", label: "内分泌ER", color: "cobalt", labelText: "light", headline: "ホルモンの嵐をしずめる",
      exhibits: [
        { id: "er", no: 8, type: "Custom", kind: "scenario", title: "内分泌ER", stampLabel: "ER",
          how: "DKA、副腎クリーゼ、低血糖。次の一手を選ぼう。ミス1回までならクリア、通算2シナリオでスタンプ。", data: scenarioContent },
      ] },
  ],
  gacha: {
    wing: "w-axis", title: "ホルモンガチャ", machineLabel: "ホルモン", intro: "血液に乗って届く、小さな手紙たち。",
    cost: 30, dupRefund: 10, pityAfterDups: 4,
    // TODO(review) 解説文
    items: [
      { ...D, id: "insulin", name: "インスリン", rarity: 1, weight: 22, color: "#FFC933", text: "膵β細胞から。血糖を下げる唯一のホルモン。" },
      { ...D, id: "tsh", name: "TSH", rarity: 2, weight: 14, color: "#FF7AB6", text: "甲状腺を働かせる。甲状腺の病気の最初の検査。" },
      { ...D, id: "acth", name: "ACTH", rarity: 2, weight: 14, color: "#C8453B", text: "副腎皮質を刺激。朝に高く夜に低い日内変動。" },
      { ...D, id: "glucagon", name: "グルカゴン", rarity: 1, weight: 12, color: "#8BD450", text: "膵α細胞から。肝臓に糖を出させる。" },
      { ...D, id: "pth", name: "PTH", rarity: 2, weight: 10, color: "#22C1A0", text: "副甲状腺から。Caを上げ、Pを下げる。" },
      { ...D, id: "aldo", name: "アルドステロン", rarity: 3, weight: 8, color: "#3D5AFE", text: "副腎皮質の球状層。Naを保ちKを出す。" },
      { ...D, id: "gh", name: "成長ホルモン", rarity: 3, weight: 7, color: "#FF5A36", text: "多すぎると先端巨大症。IGF-1で評価する。" },
      { ...D, id: "adh", name: "ADH（バソプレシン）", rarity: 3, weight: 7, color: "#9EC8FF", text: "下垂体後葉から。水を体に戻す。足りないと尿崩症。" },
      { ...D, id: "prl", name: "プロラクチン", rarity: 4, weight: 6, color: "#FFE1F0", text: "ドパミンにブレーキをかけられている珍しいホルモン。" },
    ],
  },
  stampOrder: ["feedback", "cushing", "thyroid", "calcium", "ogtt", "drugs", "versus", "er"],
};
