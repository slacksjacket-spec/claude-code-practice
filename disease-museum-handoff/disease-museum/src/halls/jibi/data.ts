// 耳鼻咽喉ホール（NO.16）。医学内容はすべて未レビュー（review: "draft"）。
import type { Hall } from "../../engine/schema";
import { audioContent } from "./content/audio";
import { otitisContent } from "./content/otitis";
import { facialContent } from "./content/facial";
import { vertigoContent } from "./content/vertigo";
import { versusContent } from "./content/versus";
import { orderContent } from "./content/order";
import { memoryContent } from "./content/memory";
import { scenarioContent } from "./content/scenario";

const D = { review: "draft" as const, sources: [] as string[] };

export const hall: Hall = {
  id: "jibi", no: 16, title: "耳鼻咽喉ホール",
  catch: "聞こえ、まわり、においと声。頭の中の小さな通り道をたどろう。展示をクリアしてスタンプを8つ集めよう。",
  ticketNote: "○と×と［］で、聞こえが見える。まちがいは収蔵庫へ",
  map: {
    viewBox: "0 0 600 400", ariaLabel: "耳鼻咽喉ホールの館内図", hint: "タップすると、その展示室へ移動します",
    organs: [
      { go: "w-ear", label: "耳のウィングへ",
        svg: `<path d="M110 60 C170 40 220 90 200 150 C190 180 160 180 160 210 C160 236 130 240 120 220" fill="#F6D9BE" stroke="#1C1537" stroke-width="4"/>
        <path d="M140 90 C170 80 186 110 170 140" stroke="#1C1537" stroke-width="3" fill="none"/>
        <circle class="eye" cx="130" cy="120" r="5" fill="#1C1537"/><circle class="eye" cx="150" cy="118" r="5" fill="#1C1537"/><path d="M134 138 Q142 144 150 138" stroke="#1C1537" stroke-width="3" fill="none"/>
        <text x="150" y="262" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">耳</text>` },
      { go: "w-balance", label: "めまいのウィングへ",
        svg: `${[0, 1, 2].map((i) => `<ellipse cx="320" cy="120" rx="${60 - i * 4}" ry="${26 + i * 4}" transform="rotate(${i * 60} 320 120)" fill="none" stroke="var(--mint)" stroke-width="7"/>`).join("")}<circle cx="320" cy="120" r="10" fill="var(--sun)" stroke="#1C1537" stroke-width="3"/>
        <text x="320" y="210" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">めまい</text>` },
      { go: "w-throat", label: "鼻とのどのウィングへ",
        svg: `<path d="M480 60 C460 100 450 140 470 160 C480 170 500 170 510 160" fill="#F6D9BE" stroke="#1C1537" stroke-width="4"/><path d="M490 180 V260" stroke="var(--pink)" stroke-width="16" stroke-linecap="round"/>
        <text x="495" y="290" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">鼻とのど</text>` },
      { go: "w-er", label: "耳鼻咽喉ERへ",
        svg: `<circle cx="300" cy="320" r="40" fill="var(--tomato)" stroke="#1C1537" stroke-width="4"/>
        <text x="300" y="333" text-anchor="middle" font-family="Dela Gothic One" font-size="30" fill="#fff">ER</text>
        <text x="300" y="384" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">耳鼻咽喉ER</text>` },
    ],
  },
  wings: [
    { id: "w-ear", label: "耳", color: "sun", headline: "聞こえを見える形に",
      exhibits: [
        { id: "audiogram", no: 1, type: "Custom", kind: "audiogram", title: "オージオグラムを読め", stampLabel: "聴力",
          how: "純音聴力検査のグラフから難聴の型を判定し、原因を答えよう。両方正解を通算4人でスタンプ。",
          cheatSheet: { ...D, title: "オージオグラムの読み方",
            html: `<table><tr><th>伝音難聴</th><td>骨導は正常、気導だけ悪い（気骨導差あり）</td></tr><tr><th>感音難聴</th><td>気導も骨導も同じように悪い</td></tr><tr><th>混合難聴</th><td>骨導も悪く、さらに気骨導差もある</td></tr></table><p>Weber試験は伝音なら患側、感音なら健側に響く。Rinne試験は伝音で陰性。</p>` },
          data: audioContent },
        { id: "otitis", no: 2, type: "Custom", kind: "grid", title: "中耳炎のマス", stampLabel: "中耳炎",
          how: "鼓膜の様子と痛みから中耳炎の種類を選び、対応を決めよう。両方正解を通算4人でスタンプ。", data: otitisContent },
        { id: "facial", no: 3, type: "Custom", kind: "tapMap", title: "顔面神経のどこ？", stampLabel: "顔面神経",
          how: "涙・音の響き・味覚の残り方から、顔面神経の障害の場所をタップしよう。通算4回正解でスタンプ。", data: facialContent },
      ] },
    { id: "w-balance", label: "めまい", color: "mint", headline: "回る？ふらつく？",
      exhibits: [
        { id: "vertigo", no: 4, type: "DiagnosisLab", title: "めまいラボ", stampLabel: "めまい",
          how: "めまいの患者が次々やってくる。予算内で検査を選んで診断しよう。中枢性を見逃すな。4人正解でスタンプ。", data: vertigoContent },
        { id: "versus", no: 5, type: "VersusQuiz", title: "ヒントはどっちの味方？", stampLabel: "対決",
          how: "ヒントがどちらの病気のものか左右で答えよう。6問中5問以上でスタンプ。", data: versusContent },
      ] },
    { id: "w-throat", label: "鼻とのど", color: "pink", headline: "通り道と腫瘍",
      exhibits: [
        { id: "order", no: 6, type: "Custom", kind: "order", title: "順番に並べよ", stampLabel: "順番",
          how: "音の伝わり方、聴覚の神経路、飲み込みの流れ。正しい順にタップしよう。ノーミスを通算3問でスタンプ。", data: orderContent },
        { id: "memory", no: 7, type: "MemoryMatch", title: "耳鼻咽喉 神経衰弱", stampLabel: "耳鼻の病気",
          how: "病気と、その手がかりのカードをペアにしよう。全部そろえるとスタンプ。", data: memoryContent },
      ] },
    { id: "w-er", label: "耳鼻咽喉ER", color: "tomato", labelText: "light", headline: "気道と出血",
      exhibits: [
        { id: "er", no: 8, type: "Custom", kind: "scenario", title: "耳鼻咽喉ER", stampLabel: "ER",
          how: "鼻出血、急性喉頭蓋炎、魚の骨。次の一手を選ぼう。ミス1回までならクリア、通算2シナリオでスタンプ。", data: scenarioContent },
      ] },
  ],
  gacha: {
    wing: "w-ear", title: "耳と鼻とのどガチャ", machineLabel: "耳鼻のどの部品", intro: "小さくて精密な部品たち。",
    cost: 30, dupRefund: 10, pityAfterDups: 4,
    // TODO(review) 解説文
    items: [
      { ...D, id: "tm", name: "鼓膜", rarity: 1, weight: 22, color: "#F3EEDF", text: "厚さ0.1 mmの膜。光錐が見えれば元気。" },
      { ...D, id: "malleus", name: "ツチ骨", rarity: 2, weight: 14, color: "#F3D3B8", text: "鼓膜にくっついている耳小骨。" },
      { ...D, id: "incus", name: "キヌタ骨", rarity: 2, weight: 14, color: "#E8C8A8", text: "ツチ骨とアブミ骨をつなぐ。" },
      { ...D, id: "vc", name: "声帯", rarity: 1, weight: 12, color: "#FF7AB6", text: "1秒に数百回ふるえる。反回神経が動かす。" },
      { ...D, id: "cochlea", name: "蝸牛", rarity: 2, weight: 10, color: "#FFC933", text: "2回転半のかたつむり。根元が高い音、先端が低い音。" },
      { ...D, id: "scc", name: "三半規管", rarity: 3, weight: 8, color: "#22C1A0", text: "回転を感じる3つの輪。" },
      { ...D, id: "otolith", name: "耳石", rarity: 3, weight: 7, color: "#FFFFFF", text: "炭酸カルシウムの小さな粒。はがれるとBPPV。" },
      { ...D, id: "epiglottis", name: "喉頭蓋", rarity: 3, weight: 7, color: "#C8453B", text: "飲み込むときに気管にふたをする。" },
      { ...D, id: "stapes", name: "アブミ骨", rarity: 4, weight: 6, color: "#FFE08A", text: "人体でいちばん小さな骨。固まると耳硬化症。" },
    ],
  },
  stampOrder: ["audiogram", "otitis", "facial", "vertigo", "versus", "order", "memory", "er"],
};
