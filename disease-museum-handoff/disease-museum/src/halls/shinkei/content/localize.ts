// 局在診断（共通ゲーム tapMap）。図は模式。TODO(review) 各症候と部位の対応
import type { TapMapData } from "../../../engine/games/tapMap.schema";

const M = { review: "draft" as const, sources: [] as string[] };

const brain = `<rect width="320" height="240" fill="#FFF8F0"/>
  <path d="M38 128 C30 64 90 26 160 28 C230 30 282 70 280 140 C278 166 250 172 230 166 C200 176 120 180 84 166 C60 158 40 150 38 128Z" fill="#F7D3D0" stroke="#1C1537" stroke-width="3"/>
  <ellipse cx="236" cy="184" rx="38" ry="20" fill="#E8B8C8" stroke="#1C1537" stroke-width="3"/>
  <rect x="176" y="158" width="26" height="70" rx="10" fill="#E8C8B0" stroke="#1C1537" stroke-width="3"/>
  <path d="M150 30 C148 60 146 90 142 116" stroke="#B85A50" stroke-width="2" fill="none"/>
  <path d="M70 142 C110 120 170 112 210 116" stroke="#B85A50" stroke-width="2" fill="none"/>
  <text x="16" y="110" font-size="10" font-weight="800" fill="#7A5A50">前</text><text x="296" y="110" font-size="10" font-weight="800" fill="#7A5A50">後</text>`;
const cord = `<rect width="320" height="240" fill="#FFF8F0"/>
  <ellipse cx="160" cy="120" rx="140" ry="100" fill="#FFFDF6" stroke="#1C1537" stroke-width="3"/>
  <path d="M160 70 C140 90 130 60 108 52 C96 70 118 96 130 110 C112 130 92 150 98 186 C120 182 140 160 160 150 C180 160 200 182 222 186 C228 150 208 130 190 110 C202 96 224 70 212 52 C190 60 180 90 160 70Z" fill="#E8D6EE" stroke="#8A70A8" stroke-width="2"/>
  <line x1="160" y1="22" x2="160" y2="70" stroke="#8A70A8" stroke-width="2"/>
  <text x="160" y="16" text-anchor="middle" font-size="10" font-weight="800" fill="#7A5A50">背側</text><text x="160" y="236" text-anchor="middle" font-size="10" font-weight="800" fill="#7A5A50">腹側</text>`;

export const localizeContent: TapMapData = {
  question: "病変はどこ？",
  stampAt: 5,
  figures: {
    brain: { viewBox: "0 0 320 240", ariaLabel: "左の大脳半球を横から見た模式図", svg: brain, note: "左大脳半球を左から見た模式図",
      regions: [
        { id: "frontal", label: "前頭葉", shape: `<path d="M150 30 C90 28 36 70 38 128 L70 142 C96 128 118 120 142 116Z"/>` },
        { id: "parietal", label: "頭頂葉", shape: `<path d="M152 30 C204 30 240 52 254 82 L212 116 C190 114 166 114 144 116Z"/>` },
        { id: "occipital", label: "後頭葉", shape: `<path d="M256 84 C276 104 284 132 278 154 C266 166 248 168 236 162 L214 118Z"/>` },
        { id: "temporal", label: "側頭葉", shape: `<path d="M72 144 C110 122 170 114 210 118 L234 162 C200 174 124 178 86 166 C72 160 66 152 72 144Z"/>` },
        { id: "cerebellum", label: "小脳", shape: `<ellipse cx="240" cy="186" rx="34" ry="16"/>` },
        { id: "brainstem", label: "脳幹", shape: `<rect x="178" y="170" width="22" height="56" rx="9"/>` },
      ] },
    cord: { viewBox: "0 0 320 240", ariaLabel: "脊髄の横断面の模式図", svg: cord, note: "脊髄の横断面。左半分だけに場所を示す",
      regions: [
        { id: "dorsal", label: "後索", shape: `<ellipse cx="141" cy="40" rx="16" ry="16"/>` },
        { id: "cst", label: "外側皮質脊髄路", shape: `<ellipse cx="62" cy="112" rx="24" ry="28"/>` },
        { id: "stt", label: "脊髄視床路", shape: `<ellipse cx="72" cy="176" rx="24" ry="20"/>` },
        { id: "ant", label: "前角", shape: `<ellipse cx="118" cy="168" rx="16" ry="16"/>` },
        { id: "central", label: "中心管のまわり（交叉する線維）", shape: `<circle cx="160" cy="122" r="16"/>` },
      ] },
  },
  cases: [
    { ...M, id: "broca", figure: "brain", prompt: "右片麻痺。言いたいことはわかっているのに、たどたどしくしか話せない。", answer: ["frontal"],
      followUp: { question: "この失語の特徴は？", options: ["話すのが苦手で、理解は比較的よい（運動性失語）", "流暢だが意味が通らず、理解が悪い", "復唱だけができない", "読み書きだけができない"], answer: 0 },
      explanation: "左下前頭回のBroca野。運動野の近くなので右片麻痺を伴いやすい。" },
    { ...M, id: "wernicke", figure: "brain", prompt: "麻痺はない。よくしゃべるが言い間違いだらけで、話しかけても理解できない。", answer: ["temporal"],
      followUp: { question: "この失語は？", options: ["感覚性失語（Wernicke失語）", "運動性失語（Broca失語）", "伝導失語", "全失語"], answer: 0 },
      explanation: "左上側頭回の後ろのWernicke野。流暢だが錯語が多く、理解が悪い。" },
    { ...M, id: "gerstmann", figure: "brain", prompt: "計算ができない、字が書けない、左右がわからない、どの指かわからない。", answer: ["parietal"],
      followUp: { question: "この4つの組み合わせの名前は？", options: ["Gerstmann症候群（左角回）", "Bálint症候群", "Klüver-Bucy症候群", "Wallenberg症候群"], answer: 0 },
      explanation: "優位半球（左）の頭頂葉の角回。右頭頂葉なら左半側空間無視。" },
    { ...M, id: "cerebellum", figure: "brain", prompt: "左手で鼻を触ろうとすると、ふるえて行きすぎる。左に倒れやすい。", answer: ["cerebellum"],
      followUp: { question: "症状は病変と同じ側？反対側？", options: ["同じ側に出る", "反対側に出る", "両側に出る", "決まっていない"], answer: 0 },
      explanation: "小脳半球の障害は同じ側の運動失調（企図振戦、測定障害、反復拮抗運動不能）。" },
    { ...M, id: "wallenberg", figure: "brain", prompt: "めまい、飲み込めない、声がかすれる。左顔面と右半身の温痛覚が低下、左Horner症候群。", answer: ["brainstem"],
      followUp: { question: "詰まった血管は？", options: ["左の椎骨動脈（後下小脳動脈）", "右の中大脳動脈", "前脊髄動脈", "左の前大脳動脈"], answer: 0 },
      explanation: "延髄外側症候群（Wallenberg）。顔は同側、体幹と手足は対側の温痛覚が落ちる（交叉性）。運動麻痺はない。" },
    { ...M, id: "scd", figure: "cord", prompt: "胃全摘後の60歳。足の振動覚と位置覚が低下し、目を閉じるとふらつく。足の腱反射は亢進。", answer: ["dorsal", "cst"],
      followUp: { question: "原因は？", options: ["ビタミンB₁₂欠乏（亜急性連合性脊髄変性症）", "梅毒", "脊髄空洞症", "ALS"], answer: 0 },
      explanation: "後索と側索（皮質脊髄路）が同時に障害される。Romberg徴候陽性。" },
    { ...M, id: "als", figure: "cord", prompt: "手の筋肉がやせ、ぴくつく。足の腱反射は亢進。感覚は正常。", answer: ["ant", "cst"],
      followUp: { question: "ALSで障害されにくいのは？", options: ["感覚・眼球運動・膀胱直腸機能", "舌の筋肉", "呼吸筋", "手の筋肉"], answer: 0 },
      explanation: "上位（皮質脊髄路）と下位（前角）の運動ニューロンがともに障害される。陰性徴候（感覚障害、眼球運動障害、膀胱直腸障害、褥瘡）が有名。" },
    { ...M, id: "syrinx", figure: "cord", prompt: "両肩から腕にかけて、温度と痛みだけがわからない（触覚は保たれる）。", answer: ["central"],
      followUp: { question: "この感覚障害の名前は？", options: ["宙づり型の解離性感覚障害（脊髄空洞症）", "手袋靴下型", "半身の感覚障害", "サドル型"], answer: 0 },
      explanation: "中心管が広がり、前交連で交叉する温痛覚の線維が切れる。Chiari奇形に合併しやすい。" },
    { ...M, id: "asa", figure: "cord", prompt: "大動脈の手術のあと、急に両足が動かず温痛覚もない。振動覚と位置覚は保たれる。", answer: ["ant", "cst", "stt"],
      followUp: { question: "詰まった血管は？", options: ["前脊髄動脈", "後脊髄動脈", "椎骨動脈", "中大脳動脈"], answer: 0 },
      explanation: "前脊髄動脈は脊髄の前2/3を養う。後索は後脊髄動脈なので保たれる。胸腰髄ではAdamkiewicz動脈から血を受ける。" },
  ],
};
