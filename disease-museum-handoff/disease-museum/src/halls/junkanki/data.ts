// 循環器ホール（NO.01）。Phase 3。心電図は合成（ecg/）で、毎回ちがう波形が出る。医学内容はすべて未レビュー（review: "draft"）。
import type { Hall } from "../../engine/schema";
import { RHYTHMS, PATTERNS } from "./content/ecgInfo";
import { calipersContent } from "./content/calipers";
import { twelveContent } from "./content/twelve";
import { axisDartsContent } from "./content/axisDarts";
import { heartSoundsContent } from "./content/heartSounds";
import { codeBlueContent } from "./content/codeBlue";
import { chestLabContent } from "./content/chestLab";
import { hfProfileContent } from "./content/hfProfile";

const D = { review: "draft" as const };

export const hall: Hall = {
  id: "junkanki",
  no: 1,
  title: "循環器ホール",
  catch: "波を読んで、音を聴いて、止まった心臓を動かす。展示をクリアしてスタンプを8つ集めよう。",
  ticketNote: "心電図は毎回ちがう波形が出る。まちがいは収蔵庫へ",
  footerNote: "心電図・心音はすべて合成した模式です（実在の患者の記録ではありません）。",

  map: {
    viewBox: "0 0 600 400",
    ariaLabel: "循環器ホールの館内図",
    hint: "タップすると、その展示室へ移動します",
    organs: [
      {
        go: "w-ecg", label: "心電図ウィングへ",
        svg: `<rect x="30" y="50" width="190" height="120" rx="18" fill="#0B1A14" stroke="#1C1537" stroke-width="4"/>
        <path d="M44 120 L80 120 L88 112 L96 120 L106 120 L112 76 L120 146 L126 120 L150 120 L162 104 L174 120 L206 120" fill="none" stroke="#5CFF9D" stroke-width="4" stroke-linejoin="round"/>
        <circle class="eye" cx="96" cy="90" r="4" fill="#5CFF9D"/><circle class="eye" cx="150" cy="90" r="4" fill="#5CFF9D"/>
        <text x="125" y="200" text-anchor="middle" font-family="Dela Gothic One" font-size="18" fill="var(--ink)">心電図</text>`,
      },
      {
        go: "w-sound", label: "弁と音のウィングへ",
        svg: `<path d="M302 150 C300 92 364 76 392 112" fill="none" stroke="var(--pink)" stroke-width="24" stroke-linecap="round"/>
        <path d="M300 352 C214 300 170 244 190 184 C206 136 268 130 300 176 C332 130 394 136 410 184 C430 244 386 300 300 352Z" fill="var(--tomato)" stroke="#1C1537" stroke-width="4"/>
        <ellipse cx="270" cy="228" rx="15" ry="17" fill="#fff" stroke="#1C1537" stroke-width="3"/><circle class="eye" cx="273" cy="232" r="7" fill="#1C1537"/>
        <ellipse cx="330" cy="228" rx="15" ry="17" fill="#fff" stroke="#1C1537" stroke-width="3"/><circle class="eye" cx="333" cy="232" r="7" fill="#1C1537"/>
        <path d="M282 270 Q300 286 318 270" stroke="#1C1537" stroke-width="4" fill="none" stroke-linecap="round"/>
        <ellipse cx="246" cy="262" rx="12" ry="7" fill="var(--pink)" opacity=".85"/><ellipse cx="354" cy="262" rx="12" ry="7" fill="var(--pink)" opacity=".85"/>
        <text x="300" y="386" text-anchor="middle" font-family="Dela Gothic One" font-size="17" fill="var(--ink)">心臓（弁と音）</text>`,
      },
      {
        go: "w-er", label: "循環器ERへ",
        svg: `<circle cx="512" cy="112" r="50" fill="var(--cobalt)" stroke="#1C1537" stroke-width="4"/>
        <text x="512" y="127" text-anchor="middle" font-family="Dela Gothic One" font-size="38" fill="#fff">ER</text>
        <text x="512" y="186" text-anchor="middle" font-family="Dela Gothic One" font-size="15" fill="var(--ink)">循環器ER</text>`,
      },
    ],
  },

  wings: [
    {
      id: "w-ecg", label: "心電図ウィング", color: "mint", headline: "波を読む",
      exhibits: [
        { id: "dojo", no: 1, type: "Custom", kind: "ecgDojo", title: "心電図道場", stampLabel: "道場",
          how: "心電図を読んで調律を当てよう。初級・中級・上級と、12誘導も混ざる模擬検定（制限時間つき）。中級以上を8問中7問でクリアか、模擬検定に合格でスタンプ。",
          cheatSheet: { ...D, sources: [], title: "心電図を読む順番",
            html: `<ol><li>心拍数（300÷RRの大きいマスの数）</li><li>リズムは規則的か（RR間隔）</li><li>P波はあるか、QRSと1対1か（PR間隔は0.12〜0.20秒）</li><li>QRS幅（0.12秒以上なら幅広い）</li><li>電気軸</li><li>ST・T・QT</li></ol><p>幅の狭い頻拍＝上室性、幅の広い頻拍＝まず心室頻拍と考える。</p>` },
          data: {
            rhythms: RHYTHMS, patterns: PATTERNS.filter((p) => p.id !== "normal"),
            levels: [
              { id: "l1", label: "初級", rhythms: ["sinus", "sinusTachy", "sinusBrady", "af", "pvc", "pac", "vf", "asystole"] },
              { id: "l2", label: "中級", rhythms: ["afl", "psvt", "vt", "av1", "wenckebach", "mobitz2", "av3", "sinusArrest", "paced", "wpw", "af", "pvc"] },
              { id: "l3", label: "上級", rhythms: ["av2to1", "junctional", "aivr", "bigeminy", "tdp", "afCavb", "aberrant", "bradyTachy", "mobitz2", "afl"] },
            ],
            roundSize: 8, passScore: 7, stampFromLevel: 1,
            exam: { rhythms: 7, patterns: 3, timeSec: 480, pass: 8 },
          } },
        { id: "calipers", no: 2, type: "Custom", kind: "calipers", title: "キャリパー計測", stampLabel: "計測",
          how: "2本の線を動かして間隔を測り、正常かどうかを判定しよう。計測と判定の両方が正解を通算4回でスタンプ。",
          data: calipersContent },
        { id: "twelve", no: 3, type: "Custom", kind: "twelve", title: "12誘導読影", stampLabel: "12誘導",
          how: "STが上がっている誘導をタップして、梗塞の部位と責任血管を当てよう。「所見当て」モードもある。通算5回の正解でスタンプ。",
          // TODO(review)
          cheatSheet: { ...D, sources: [], title: "ST上昇の誘導と部位",
            html: `<table><tr><th>V1〜V4</th><td>前壁中隔（左前下行枝）</td></tr><tr><th>V1〜V6、I、aVL</th><td>広範前壁（左前下行枝の近位部）</td></tr><tr><th>II、III、aVF</th><td>下壁（多くは右冠動脈）</td></tr><tr><th>I、aVL、V5、V6</th><td>側壁（左回旋枝）</td></tr><tr><th>V1〜V3のST低下＋高いR</th><td>後壁（V7〜V9で確認）</td></tr></table><p>冠動脈の支配に合わない広範なST上昇で鏡像変化がなければ、心膜炎を考える。</p>` },
          data: twelveContent },
        { id: "axis", no: 4, type: "Custom", kind: "axisDarts", title: "電気軸ダーツ", stampLabel: "電気軸",
          how: "6つの肢誘導を見て、六軸図のどこに電気軸があるかをタップで投げよう。近いほど高得点。30°以内を通算3回でスタンプ。",
          // TODO(review)
          cheatSheet: { ...D, sources: [], title: "電気軸の見かた",
            html: `<table><tr><th>I 上向き・aVF 上向き</th><td>0〜+90°（正常）</td></tr><tr><th>I 上向き・aVF 下向き</th><td>IIが上向きなら −30〜0°（正常）、下向きなら左軸偏位</td></tr><tr><th>I 下向き・aVF 上向き</th><td>右軸偏位</td></tr><tr><th>I 下向き・aVF 下向き</th><td>北西軸</td></tr></table><p>QRSの上下がほぼ同じ誘導に直角な方向が軸。六軸図：I 0°、II +60°、III +120°、aVF +90°、aVL −30°、aVR −150°。</p>` },
          data: axisDartsContent },
      ],
    },
    {
      id: "w-sound", label: "弁と音のウィング", color: "pink", headline: "音を聴く",
      exhibits: [
        { id: "sounds", no: 5, type: "Custom", kind: "heartSounds", title: "心音オーケストラ", stampLabel: "心音",
          how: "合成した心音と雑音を聴いて（心音図も見て）病気を当て、いちばんよく聴こえる場所をタップしよう。両方正解を通算4回でスタンプ。",
          data: heartSoundsContent },
      ],
    },
    {
      id: "w-er", label: "循環器ER", color: "cobalt", labelText: "light", headline: "胸が痛い、息が苦しい",
      exhibits: [
        { id: "codeblue", no: 6, type: "Custom", kind: "codeBlue", title: "コードブルー", stampLabel: "蘇生",
          how: "モニターの波形を見て、心停止や不安定な不整脈に次の一手を打とう。ミス1回までならシナリオクリア。通算2シナリオでスタンプ。",
          // TODO(review) JRC蘇生ガイドライン2020
          cheatSheet: { ...D, sources: ["JRC蘇生ガイドライン2020"], title: "心停止アルゴリズム（要点）",
            html: `<table><tr><th>ショック適応</th><td>心室細動、無脈性心室頻拍 → ショック → すぐCPR 2分 → リズムチェック。2回目のショック後からアドレナリン1mg（3〜5分ごと）、3回目のショック後にアミオダロン300mg。</td></tr><tr><th>ショック非適応</th><td>心静止、無脈性電気活動 → CPR、できるだけ早くアドレナリン。治せる原因（4H4T）を探す。</td></tr></table><h4>脈のある不整脈</h4><p>不安定（低血圧・意識障害・胸痛・心不全）な頻拍 → 同期下カルディオバージョン。不安定な徐脈 → アトロピン → 経皮ペーシング・昇圧薬。</p>` },
          data: codeBlueContent },
        { id: "chest", no: 7, type: "DiagnosisLab", title: "胸痛ラボ", stampLabel: "胸痛",
          how: "胸が痛い患者が次々やってくる。予算内で検査を選んで、見逃してはいけない胸痛を診断しよう。4人正解でスタンプ。",
          data: chestLabContent },
        { id: "hf", no: 8, type: "Custom", kind: "hfProfile", title: "心不全の4分類", stampLabel: "心不全",
          how: "所見から、うっ血（wet/dry）と低灌流（cold/warm）を見きわめてマスをタップし、治療を選ぼう。両方正解を通算4人でスタンプ。",
          // TODO(review)
          cheatSheet: { ...D, sources: ["急性・慢性心不全診療ガイドライン"], title: "Nohria-Stevenson分類",
            html: `<table><tr><th>うっ血の所見</th><td>起座呼吸、頸静脈怒張、浮腫、湿性ラ音、体重増加</td></tr><tr><th>低灌流の所見</th><td>四肢冷感、脈圧の低下、傾眠、乏尿、低血圧</td></tr></table><table><tr><th>A warm & dry</th><td>代償されている</td></tr><tr><th>B warm & wet</th><td>利尿薬・血管拡張薬</td></tr><tr><th>L cold & dry</th><td>輸液を慎重に</td></tr><tr><th>C cold & wet</th><td>強心薬（補助循環）＋うっ血の治療</td></tr></table>` },
          data: hfProfileContent },
      ],
    },
  ],

  gacha: {
    wing: "w-sound",
    title: "心電図の名脇役ガチャ",
    machineLabel: "名脇役",
    intro: "心電図には、ひと目でわかる有名な「波」がたくさんある。",
    cost: 30,
    dupRefund: 10,
    pityAfterDups: 4,
    // 重みは肝胆膵と同じ（コンプまで平均約20回）。TODO(review) 解説文
    items: [
      { ...D, sources: [], id: "u", name: "U波", rarity: 1, weight: 22, color: "#FFD95A", text: "T波のあとの小さな波。低カリウム血症で目立つ。" },
      { ...D, sources: [], id: "tent", name: "テント状T波", rarity: 2, weight: 14, color: "#FF9E80", text: "高くとがった左右対称のT波。高カリウム血症の最初のサイン。" },
      { ...D, sources: [], id: "delta", name: "デルタ波", rarity: 2, weight: 14, color: "#8BD450", text: "QRSの立ち上がりのなだらかな部分。WPW症候群の副伝導路による早期興奮。" },
      { ...D, sources: [], id: "f", name: "f波", rarity: 1, weight: 12, color: "#BFE8FF", text: "心房細動の基線の細かい揺れ。P波のかわり。" },
      { ...D, sources: [], id: "F", name: "F波（鋸歯状波）", rarity: 2, weight: 10, color: "#FF7AB6", text: "心房粗動のノコギリの歯。II・III・aVFで見やすい。" },
      { ...D, sources: [], id: "osborn", name: "Osborn波（J波）", rarity: 3, weight: 8, color: "#6CC9FF", text: "QRSの終わりのこぶ。低体温で出る。" },
      { ...D, sources: [], id: "coved", name: "coved型ST上昇", rarity: 3, weight: 7, color: "#C8453B", text: "V1・V2の弓なりのST上昇と陰性T。Brugada症候群。" },
      { ...D, sources: [], id: "s1q3t3", name: "SIQIIITIII", rarity: 3, weight: 7, color: "#F4F4F4", text: "IのS波、IIIのQ波と陰性T。急性肺塞栓で有名だが、出る頻度は高くない。" },
      { ...D, sources: [], id: "epsilon", name: "イプシロン波", rarity: 4, weight: 6, color: "#3D5AFE", text: "V1〜V3のQRSのすぐあとの小さなノッチ。不整脈原性右室心筋症。" },
    ],
  },

  stampOrder: ["dojo", "calipers", "twelve", "axis", "sounds", "codeblue", "chest", "hf"],
};
