// 産科・婦人科ホール（NO.11）。医学内容はすべて未レビュー（review: "draft"）。
import type { Hall } from "../../engine/schema";
import { ctgContent } from "./content/ctg";
import { orderContent } from "./content/order";
import { abortionContent } from "./content/abortion";
import { versusContent } from "./content/versus";
import { pelvisContent } from "./content/pelvis";
import { painContent } from "./content/pain";
import { memoryContent } from "./content/memory";
import { scenarioContent } from "./content/scenario";

const D = { review: "draft" as const, sources: [] as string[] };

export const hall: Hall = {
  id: "sanfujinka", no: 11, title: "産科・婦人科ホール",
  catch: "2つの命を同時に見守る。波形を読み、痛みの正体を探そう。展示をクリアしてスタンプを8つ集めよう。",
  ticketNote: "赤ちゃんの心拍は、何を語る？ まちがいは収蔵庫へ",
  map: {
    viewBox: "0 0 600 400", ariaLabel: "産科・婦人科ホールの館内図", hint: "タップすると、その展示室へ移動します",
    organs: [
      { go: "w-preg", label: "妊娠と分娩のウィングへ",
        svg: `<path d="M110 70 C110 40 210 40 210 70 L204 170 C200 200 120 200 116 170Z" fill="#F7C6C0" stroke="#1C1537" stroke-width="4"/>
        <circle cx="160" cy="120" r="34" fill="#FBE4E0" stroke="#E8A0A0" stroke-width="3"/><circle cx="152" cy="110" r="14" fill="#F6D9BE" stroke="#1C1537" stroke-width="3"/><path d="M146 124 C150 150 176 148 178 126" fill="#F6D9BE" stroke="#1C1537" stroke-width="3"/>
        <circle class="eye" cx="148" cy="108" r="2.5" fill="#1C1537"/><circle class="eye" cx="157" cy="108" r="2.5" fill="#1C1537"/>
        <text x="160" y="226" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">妊娠と分娩</text>` },
      { go: "w-gyn", label: "婦人科のウィングへ",
        svg: `<path d="M330 80 C330 60 400 60 400 80 L396 140 C394 156 336 156 334 140Z" fill="var(--pink)" stroke="#1C1537" stroke-width="4"/>
        <path d="M332 82 C310 70 290 72 276 90 M398 82 C420 70 440 72 454 90" stroke="#1C1537" stroke-width="4" fill="none"/><circle cx="270" cy="104" r="14" fill="#FFE1C8" stroke="#1C1537" stroke-width="3"/><circle cx="460" cy="104" r="14" fill="#FFE1C8" stroke="#1C1537" stroke-width="3"/>
        <circle class="eye" cx="352" cy="100" r="5" fill="#1C1537"/><circle class="eye" cx="378" cy="100" r="5" fill="#1C1537"/><path d="M356 118 Q365 124 374 118" stroke="#1C1537" stroke-width="3" fill="none"/>
        <text x="365" y="196" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">婦人科</text>` },
      { go: "w-er", label: "産婦人科ERへ",
        svg: `<circle cx="300" cy="300" r="40" fill="var(--tomato)" stroke="#1C1537" stroke-width="4"/>
        <text x="300" y="313" text-anchor="middle" font-family="Dela Gothic One" font-size="30" fill="#fff">ER</text>
        <text x="300" y="364" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">産婦人科ER</text>` },
    ],
  },
  wings: [
    { id: "w-preg", label: "妊娠と分娩", color: "pink", headline: "波形と順番を読む",
      exhibits: [
        { id: "ctg", no: 1, type: "Custom", kind: "ctg", title: "CTGを読め", stampLabel: "CTG",
          how: "10分間の胎児心拍数陣痛図を読んで、一過性徐脈の種類を当て、意味や対応を答えよう。両方正解を通算4回でスタンプ。波形は合成した模式。",
          cheatSheet: { ...D, title: "一過性徐脈の見分け方",
            html: `<table><tr><th>早発</th><td>ゆるやかに下がり、最下点が収縮の頂点と同時（児頭圧迫）</td></tr><tr><th>遅発</th><td>ゆるやかに下がり、最下点が収縮の頂点より遅れる（胎盤機能不全）</td></tr><tr><th>変動</th><td>急に下がり急に戻る。形も時刻もばらばら（臍帯圧迫）</td></tr><tr><th>遷延</th><td>2分以上10分未満続く</td></tr></table><p>基線の正常は110〜160 bpm。</p>` },
          data: ctgContent },
        { id: "order", no: 2, type: "Custom", kind: "order", title: "順番に並べよ", stampLabel: "順番",
          how: "回旋、分娩、思春期、卵胞の一生。カードを正しい順にタップしよう。ノーミスを通算3問でスタンプ。", data: orderContent },
        { id: "abortion", no: 3, type: "Custom", kind: "grid", title: "流産の5つのマス", stampLabel: "流産",
          how: "子宮口と子宮の中の様子から流産の種類を選び、対応を決めよう。両方正解を通算4人でスタンプ。", data: abortionContent },
        { id: "versus", no: 4, type: "VersusQuiz", title: "ヒントはどっちの味方？", stampLabel: "対決",
          how: "ヒントがどちらの病気のものか左右で答えよう。6問中5問以上でスタンプ。", data: versusContent },
      ] },
    { id: "w-gyn", label: "婦人科", color: "mint", headline: "痛みと出血の正体",
      exhibits: [
        { id: "pelvis", no: 5, type: "Custom", kind: "tapMap", title: "骨盤の中のどこ？", stampLabel: "骨盤",
          how: "症状から、病気の場所を子宮・卵管・卵巣・ダグラス窩の図でタップしよう。通算4回正解でスタンプ。", data: pelvisContent },
        { id: "pain", no: 6, type: "DiagnosisLab", title: "下腹部痛ラボ", stampLabel: "下腹部痛",
          how: "下腹部痛の女性が次々やってくる。予算内で検査を選んで診断しよう。4人正解でスタンプ。", data: painContent },
        { id: "memory", no: 7, type: "MemoryMatch", title: "マーカー 神経衰弱", stampLabel: "マーカー",
          how: "腫瘍マーカーやホルモンと、婦人科の病気のカードをペアにしよう。全部そろえるとスタンプ。", data: memoryContent },
      ] },
    { id: "w-er", label: "産婦人科ER", color: "tomato", labelText: "light", headline: "母と子を同時に救う",
      exhibits: [
        { id: "er", no: 8, type: "Custom", kind: "scenario", title: "産婦人科ER", stampLabel: "ER",
          how: "弛緩出血、子癇、異所性妊娠の破裂。次の一手を選ぼう。ミス1回までならクリア、通算2シナリオでスタンプ。", data: scenarioContent },
      ] },
  ],
  gacha: {
    wing: "w-preg", title: "いのちの旅ガチャ", machineLabel: "いのち", intro: "ひとつの細胞から、赤ちゃんになるまで。",
    cost: 30, dupRefund: 10, pityAfterDups: 4,
    // TODO(review) 解説文
    items: [
      { ...D, id: "egg", name: "卵子", rarity: 1, weight: 22, color: "#FFE1C8", text: "ヒトでいちばん大きな細胞。生まれる前から数が決まっている。" },
      { ...D, id: "sperm", name: "精子", rarity: 2, weight: 14, color: "#9EC8FF", text: "約3日生きる。受精は卵管膨大部で。" },
      { ...D, id: "zygote", name: "受精卵", rarity: 2, weight: 14, color: "#FFC933", text: "分裂しながら卵管を進む。" },
      { ...D, id: "placenta", name: "胎盤", rarity: 1, weight: 12, color: "#C8453B", text: "母と子の交換所。hCGやhPLを作る。" },
      { ...D, id: "blast", name: "胚盤胞", rarity: 2, weight: 10, color: "#FF7AB6", text: "受精後6〜7日で子宮内膜に着床する。" },
      { ...D, id: "cord", name: "臍帯", rarity: 3, weight: 8, color: "#E8D6EE", text: "動脈2本と静脈1本。" },
      { ...D, id: "amnio", name: "羊水", rarity: 3, weight: 7, color: "#B9E2F2", text: "後半は胎児の尿が主な成分。少なすぎも多すぎも手がかり。" },
      { ...D, id: "vernix", name: "胎脂", rarity: 3, weight: 7, color: "#F3EEDF", text: "赤ちゃんを包む白いクリーム。" },
      { ...D, id: "baby", name: "新生児", rarity: 4, weight: 6, color: "#F6D9BE", text: "おめでとう。Apgarスコアで最初の評価。" },
    ],
  },
  stampOrder: ["ctg", "order", "abortion", "versus", "pelvis", "pain", "memory", "er"],
};
