// 麻酔・輸液ホール（NO.19）。医学内容はすべて未レビュー（review: "draft"）。
import type { Hall } from "../../engine/schema";
import { fluidContent } from "./content/fluid";
import { calcContent } from "./content/calc";
import { airwayContent } from "./content/airway";
import { capnoContent } from "./content/capno";
import { asaContent } from "./content/asa";
import { memoryContent } from "./content/memory";
import { versusContent } from "./content/versus";
import { scenarioContent } from "./content/scenario";

const D = { review: "draft" as const, sources: [] as string[] };

export const hall: Hall = {
  id: "masui", no: 19, title: "麻酔・輸液ホール",
  catch: "水と塩を計算し、気道を守り、波形で見張る。展示をクリアしてスタンプを8つ集めよう。",
  ticketNote: "その1リットル、どこへ行く？ まちがいは収蔵庫へ",
  map: {
    viewBox: "0 0 600 400", ariaLabel: "麻酔・輸液ホールの館内図", hint: "タップすると、その展示室へ移動します",
    organs: [
      { go: "w-fluid", label: "輸液のウィングへ",
        svg: `<path d="M90 60 H170 V190 C170 214 90 214 90 190Z" fill="#fff" stroke="#1C1537" stroke-width="4"/><path d="M90 110 H170 V190 C170 214 90 214 90 190Z" fill="#7ACFF0"/>
        <rect x="118" y="40" width="24" height="22" rx="4" fill="#fff" stroke="#1C1537" stroke-width="4"/><path d="M130 214 V250" stroke="#1C1537" stroke-width="4"/>
        <circle class="eye" cx="116" cy="140" r="6" fill="#1C1537"/><circle class="eye" cx="144" cy="140" r="6" fill="#1C1537"/><path d="M120 160 Q130 168 140 160" stroke="#1C1537" stroke-width="4" fill="none"/>
        <text x="130" y="276" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">輸液</text>` },
      { go: "w-airway", label: "気道と麻酔のウィングへ",
        svg: `<rect x="270" y="60" width="140" height="80" rx="12" fill="#0B0F14" stroke="#1C1537" stroke-width="4"/>
        <path d="M280 120 L295 120 L298 84 L330 80 L334 120 L350 120 L353 84 L385 80 L389 120 L400 120" stroke="#FFD84A" stroke-width="4" fill="none"/>
        <text x="340" y="176" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">気道と麻酔</text>` },
      { go: "w-drug", label: "麻酔の薬のウィングへ",
        svg: `<rect x="470" y="80" width="90" height="34" rx="17" fill="var(--sun)" stroke="#1C1537" stroke-width="4"/><path d="M560 97 H585" stroke="#1C1537" stroke-width="4"/><path d="M470 97 H450" stroke="#1C1537" stroke-width="6"/>
        <text x="515" y="160" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">麻酔の薬</text>` },
      { go: "w-er", label: "麻酔ERへ",
        svg: `<circle cx="430" cy="300" r="40" fill="var(--tomato)" stroke="#1C1537" stroke-width="4"/>
        <text x="430" y="313" text-anchor="middle" font-family="Dela Gothic One" font-size="30" fill="#fff">ER</text>
        <text x="430" y="364" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">麻酔ER</text>` },
    ],
  },
  wings: [
    { id: "w-fluid", label: "輸液", color: "cobalt", labelText: "light", headline: "その1リットル、どこへ行く？",
      exhibits: [
        { id: "fluid", no: 1, type: "Custom", kind: "fluidSpace", title: "輸液のゆくえ", stampLabel: "体液区画",
          how: "輸液1,000 mLのうち、血管内に残る量をスライダーで予想しよう。血管内・間質・細胞内に分かれる様子が見られる。両方正解を通算4回でスタンプ。",
          cheatSheet: { ...D, title: "体液の区画（体重60 kgの目安）",
            html: `<table><tr><th>体液全体</th><td>体重の60%（約36 L）</td></tr><tr><th>細胞内液</th><td>体液の2/3</td></tr><tr><th>細胞外液</th><td>体液の1/3。そのうち間質3/4、血管内1/4</td></tr></table><p>等張液は細胞外液に、自由水は体液全体に広がる。</p>` },
          data: fluidContent },
        { id: "calc", no: 2, type: "Custom", kind: "infusionCalc", title: "輸液ポンプ計算", stampLabel: "輸液計算",
          how: "体重や指示から、維持輸液量・滴下数・補正の上限を計算しよう。通算4問正解でスタンプ。", data: calcContent },
      ] },
    { id: "w-airway", label: "気道と麻酔", color: "sun", headline: "守って、見張る",
      exhibits: [
        { id: "airway", no: 3, type: "Custom", kind: "mallampati", title: "Mallampatiを判定せよ", stampLabel: "気道評価",
          how: "口の中の見え方からMallampati分類を当て、気道の評価や準備を答えよう。両方正解を通算4人でスタンプ。", data: airwayContent },
        { id: "capno", no: 4, type: "Custom", kind: "capnogram", title: "カプノグラムを読め", stampLabel: "カプノグラム",
          how: "麻酔中の呼気CO₂の波形から何が起きているかを当て、対応を答えよう。両方正解を通算4回でスタンプ。波形は合成した模式。", data: capnoContent },
        { id: "asa", no: 5, type: "Custom", kind: "grid", title: "ASA-PS分類", stampLabel: "ASA",
          how: "術前の患者の状態をASA-PSで分けよう。通算4人正解でスタンプ。", data: asaContent },
      ] },
    { id: "w-drug", label: "麻酔の薬", color: "mint", headline: "眠らせ、止め、もどす",
      exhibits: [
        { id: "memory", no: 6, type: "MemoryMatch", title: "麻酔の薬 神経衰弱", stampLabel: "麻酔薬",
          how: "薬と、その特徴・拮抗薬のカードをペアにしよう。全部そろえるとスタンプ。", data: memoryContent },
        { id: "versus", no: 7, type: "VersusQuiz", title: "ヒントはどっちの味方？", stampLabel: "対決",
          how: "ヒントがどちらのものか左右で答えよう。6問中5問以上でスタンプ。", data: versusContent },
      ] },
    { id: "w-er", label: "麻酔ER", color: "tomato", labelText: "light", headline: "手術室の急変",
      exhibits: [
        { id: "er", no: 8, type: "Custom", kind: "scenario", title: "麻酔ER", stampLabel: "ER",
          how: "悪性高熱症、局所麻酔薬中毒、挿管も換気もできない。次の一手を選ぼう。ミス1回までならクリア、通算2シナリオでスタンプ。", data: scenarioContent },
      ] },
  ],
  gacha: {
    wing: "w-airway", title: "手術室の道具ガチャ", machineLabel: "手術室の道具", intro: "麻酔科医の相棒たち。",
    cost: 30, dupRefund: 10, pityAfterDups: 4,
    // TODO(review) 解説文
    items: [
      { ...D, id: "spo2", name: "パルスオキシメータ", rarity: 1, weight: 22, color: "#FF5A36", text: "赤と赤外の光で酸素飽和度を測る。" },
      { ...D, id: "ett", name: "気管チューブ", rarity: 2, weight: 14, color: "#9EC8FF", text: "カフで気道を密閉する。深さは門歯で成人男性約22 cm。" },
      { ...D, id: "lma", name: "ラリンジアルマスク", rarity: 2, weight: 14, color: "#22C1A0", text: "声門の上にかぶせる。挿管困難の救世主。" },
      { ...D, id: "machine", name: "麻酔器", rarity: 1, weight: 12, color: "#C8C8D8", text: "酸素・空気・麻酔ガスを混ぜて送る。始業点検が大事。" },
      { ...D, id: "capno", name: "カプノメータ", rarity: 2, weight: 10, color: "#FFD84A", text: "呼気のCO₂。挿管の確認と換気の見張り。" },
      { ...D, id: "video", name: "ビデオ喉頭鏡", rarity: 3, weight: 8, color: "#3D5AFE", text: "カメラで声門を見る。" },
      { ...D, id: "epi", name: "硬膜外カテーテル", rarity: 3, weight: 7, color: "#FFF1D6", text: "術後の痛みを止め続ける細い管。" },
      { ...D, id: "bis", name: "BISモニター", rarity: 3, weight: 7, color: "#FF7AB6", text: "脳波から麻酔の深さを数字にする。" },
      { ...D, id: "dantrolene", name: "ダントロレン", rarity: 4, weight: 6, color: "#F7A64A", text: "悪性高熱症のたったひとつの特効薬。すぐ出せる場所に。" },
    ],
  },
  stampOrder: ["fluid", "calc", "airway", "capno", "asa", "memory", "versus", "er"],
};
