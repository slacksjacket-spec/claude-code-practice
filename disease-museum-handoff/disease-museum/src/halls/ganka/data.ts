// 眼ホール（NO.15）。医学内容はすべて未レビュー（review: "draft"）。
import type { Hall } from "../../engine/schema";
import { anatomyContent } from "./content/anatomy";
import { redeyeContent } from "./content/redeye";
import { versusContent } from "./content/versus";
import { fundusContent } from "./content/fundus";
import { pupilContent } from "./content/pupil";
import { visionContent } from "./content/vision";
import { memoryContent } from "./content/memory";
import { scenarioContent } from "./content/scenario";

const D = { review: "draft" as const, sources: [] as string[] };

export const hall: Hall = {
  id: "ganka", no: 15, title: "眼ホール",
  catch: "目は、脳と血管をそのまま見られる窓。のぞきこんで、照らして、確かめよう。展示をクリアしてスタンプを8つ集めよう。",
  ticketNote: "光を当てると、答えが見える。まちがいは収蔵庫へ",
  map: {
    viewBox: "0 0 600 400", ariaLabel: "眼ホールの館内図", hint: "タップすると、その展示室へ移動します",
    organs: [
      { go: "w-front", label: "目の前のほうのウィングへ",
        svg: `<ellipse cx="150" cy="130" rx="100" ry="60" fill="#fff" stroke="#1C1537" stroke-width="4"/><circle cx="150" cy="130" r="42" fill="#6A8AC8"/><circle cx="150" cy="130" r="18" fill="#111"/><circle cx="162" cy="118" r="7" fill="#fff"/>
        <path d="M60 110 Q100 92 110 96" stroke="var(--tomato)" stroke-width="3" fill="none"/><path d="M240 150 Q210 170 196 164" stroke="var(--tomato)" stroke-width="3" fill="none"/>
        <text x="150" y="226" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">目の前のほう</text>` },
      { go: "w-back", label: "眼底と瞳孔のウィングへ",
        svg: `<circle cx="420" cy="130" r="70" fill="#D9622B" stroke="#1C1537" stroke-width="4"/><circle cx="392" cy="130" r="16" fill="#FFE2A8"/><circle cx="440" cy="130" r="8" fill="#A8401C"/>
        <path d="M392 120 C410 90 440 76 480 80 M392 140 C410 170 440 184 480 180" stroke="#9A1A12" stroke-width="4" fill="none"/>
        <text x="420" y="226" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">眼底と瞳孔</text>` },
      { go: "w-sys", label: "全身と目のウィングへ",
        svg: `<circle cx="150" cy="300" r="40" fill="#F6D9BE" stroke="#1C1537" stroke-width="4"/><circle class="eye" cx="136" cy="294" r="6" fill="#1C1537"/><circle class="eye" cx="164" cy="294" r="6" fill="#1C1537"/><path d="M140 316 Q150 322 160 316" stroke="#1C1537" stroke-width="3" fill="none"/>
        <text x="150" y="370" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">全身と目</text>` },
      { go: "w-er", label: "眼科ERへ",
        svg: `<circle cx="420" cy="310" r="40" fill="var(--tomato)" stroke="#1C1537" stroke-width="4"/>
        <text x="420" y="323" text-anchor="middle" font-family="Dela Gothic One" font-size="30" fill="#fff">ER</text>
        <text x="420" y="374" text-anchor="middle" font-family="Dela Gothic One" font-size="14" fill="var(--ink)">眼科ER</text>` },
    ],
  },
  wings: [
    { id: "w-front", label: "目の前のほう", color: "cobalt", labelText: "light", headline: "赤い目とかすむ目",
      exhibits: [
        { id: "anatomy", no: 1, type: "Custom", kind: "tapMap", title: "眼球のどこ？", stampLabel: "眼球",
          how: "症状から、病気の場所を眼球の断面図でタップしよう。通算4回正解でスタンプ。", data: anatomyContent },
        { id: "redeye", no: 2, type: "DiagnosisLab", title: "赤い目ラボ", stampLabel: "赤い目",
          how: "目が赤い患者が次々やってくる。予算内で検査を選んで診断しよう。4人正解でスタンプ。", data: redeyeContent },
        { id: "versus", no: 3, type: "VersusQuiz", title: "ヒントはどっちの味方？", stampLabel: "対決",
          how: "ヒントがどちらの病気のものか左右で答えよう。6問中5問以上でスタンプ。", data: versusContent },
      ] },
    { id: "w-back", label: "眼底と瞳孔", color: "tomato", labelText: "light", headline: "のぞいて、照らす",
      exhibits: [
        { id: "fundus", no: 4, type: "Custom", kind: "reveal", title: "眼底の影絵当て", stampLabel: "眼底",
          how: "ぼやけた眼底の模式図が少しずつくっきりする。わかった瞬間に答えよう。一発正解を通算4枚でスタンプ。", data: fundusContent },
        { id: "pupil", no: 5, type: "Custom", kind: "pupil", title: "瞳孔ラボ", stampLabel: "瞳孔",
          how: "明るさ、光の当て方、近くを見る、を切り替えて両眼の瞳孔を観察し、原因を答えよう。両方正解を通算4人でスタンプ。瞳孔の動きは模式。",
          cheatSheet: { ...D, title: "瞳孔の見分け方",
            html: `<table><tr><th>動眼神経麻痺</th><td>散瞳・眼瞼下垂・外下方への偏位。動脈瘤</td></tr><tr><th>Horner症候群</th><td>縮瞳・軽い眼瞼下垂・無汗。暗所で差が開く</td></tr><tr><th>Adie瞳孔</th><td>散瞳、光に反応せず近見でゆっくり縮む</td></tr><tr><th>RAPD</th><td>大きさは同じ。患側に光を当てると縮みが弱い</td></tr><tr><th>Argyll Robertson</th><td>両側の縮瞳、光に反応せず近見で縮む</td></tr></table>` },
          data: pupilContent },
      ] },
    { id: "w-sys", label: "全身と目", color: "mint", headline: "目に出る全身の病気",
      exhibits: [
        { id: "vision", no: 6, type: "Custom", kind: "grid", title: "視力低下の4マス", stampLabel: "視力低下",
          how: "急にか、ゆっくりか。痛いか、痛くないか。視力低下を4マスに分けよう。通算4人正解でスタンプ。", data: visionContent },
        { id: "memory", no: 7, type: "MemoryMatch", title: "全身の病気と目 神経衰弱", stampLabel: "全身と目",
          how: "全身の病気と、その目の所見のカードをペアにしよう。全部そろえるとスタンプ。", data: memoryContent },
      ] },
    { id: "w-er", label: "眼科ER", color: "sun", headline: "視力は時間で失われる",
      exhibits: [
        { id: "er", no: 8, type: "Custom", kind: "scenario", title: "眼科ER", stampLabel: "ER",
          how: "化学外傷、急性緑内障発作、網膜中心動脈閉塞症。次の一手を選ぼう。ミス1回までならクリア、通算2シナリオでスタンプ。", data: scenarioContent },
      ] },
  ],
  gacha: {
    wing: "w-back", title: "見えるしくみガチャ", machineLabel: "見えるしくみ", intro: "光が脳に届くまでの、たくさんの部品。",
    cost: 30, dupRefund: 10, pityAfterDups: 4,
    // TODO(review) 解説文
    items: [
      { ...D, id: "cornea", name: "角膜", rarity: 1, weight: 22, color: "#B9E2F2", text: "血管のない透明な窓。屈折のいちばんの担い手。" },
      { ...D, id: "lens", name: "水晶体", rarity: 2, weight: 14, color: "#F0E8C0", text: "厚さを変えてピントを合わせる。濁ると白内障。" },
      { ...D, id: "iris", name: "虹彩", rarity: 2, weight: 14, color: "#6A8AC8", text: "瞳孔の大きさを変えるカメラの絞り。" },
      { ...D, id: "rod", name: "杆体細胞", rarity: 1, weight: 12, color: "#9EC8FF", text: "暗いところで働く。足りないと夜盲。" },
      { ...D, id: "cone", name: "錐体細胞", rarity: 2, weight: 10, color: "#FF5A36", text: "色を見分ける。黄斑の中心窩に集まる。" },
      { ...D, id: "rhodo", name: "ロドプシン", rarity: 3, weight: 8, color: "#C8453B", text: "光を受け取る色素。ビタミンAから作られる。" },
      { ...D, id: "vitreous", name: "硝子体", rarity: 3, weight: 7, color: "#E6F6FC", text: "眼球を満たすゼリー。年をとると縮んで飛蚊症。" },
      { ...D, id: "macula", name: "黄斑", rarity: 3, weight: 7, color: "#FFC933", text: "ものを見る中心。ここが傷むと真ん中が見えない。" },
      { ...D, id: "ganglion", name: "網膜神経節細胞", rarity: 4, weight: 6, color: "#22C1A0", text: "軸索が集まって視神経になる。緑内障で減る。" },
    ],
  },
  stampOrder: ["anatomy", "redeye", "versus", "fundus", "pupil", "vision", "memory", "er"],
};
