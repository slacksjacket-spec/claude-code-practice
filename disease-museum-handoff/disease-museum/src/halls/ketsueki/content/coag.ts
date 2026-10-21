// 凝固カスケード（共通ゲーム tapMap）。模式図。TODO(review) 各病態とPT・APTTの対応
import type { TapMapData } from "../../../engine/games/tapMap.schema";

const M = { review: "draft" as const, sources: [] as string[] };
const box = (x: number, y: number, w: number, t: string) => `<rect x="${x}" y="${y}" width="${w}" height="26" rx="8" fill="#fff" stroke="#1C1537" stroke-width="2"/><text x="${x + w / 2}" y="${y + 18}" text-anchor="middle" font-size="12" font-weight="800" fill="#1C1537">${t}</text>`;
const svg = `<rect width="340" height="320" fill="#FFF6F2"/>
  <text x="80" y="22" text-anchor="middle" font-size="12" font-weight="800" fill="#3D5AFE">内因系（APTT）</text>
  <text x="262" y="22" text-anchor="middle" font-size="12" font-weight="800" fill="#FF5A36">外因系（PT）</text>
  ${box(30, 34, 100, "XII")}${box(30, 78, 100, "XI")}${box(30, 122, 100, "IX（＋VIII）")}
  ${box(212, 78, 100, "VII（組織因子）")}
  ${box(110, 180, 120, "X（＋V）")}${box(110, 224, 120, "II（プロトロンビン）")}${box(110, 268, 120, "フィブリノゲン")}
  <path d="M80 60 V78 M80 104 V122 M80 148 L150 180 M262 104 L190 180 M170 206 V224 M170 250 V268" stroke="#1C1537" stroke-width="2" fill="none"/>
  <text x="244" y="196" font-size="11" font-weight="800" fill="#7A5A50">共通系</text><text x="244" y="211" font-size="10" font-weight="800" fill="#7A5A50">PT・APTT 両方</text>
  <circle cx="290" cy="270" r="22" fill="#F3E4FF" stroke="#1C1537" stroke-width="2"/><text x="290" y="266" text-anchor="middle" font-size="10" font-weight="800">血小板</text><text x="290" y="279" text-anchor="middle" font-size="9">vWF</text>`;

export const coagContent: TapMapData = {
  question: "障害されているのはどこ？",
  stampAt: 4,
  figures: {
    cascade: { viewBox: "0 0 340 320", ariaLabel: "凝固カスケードの模式図", svg, note: "模式図。実際の体内では組織因子とVIIが始まり。",
      regions: [
        { id: "intrinsic", label: "内因系（VIII・IX・XI・XII）", shape: `<rect x="26" y="30" width="108" height="122" rx="10"/>` },
        { id: "extrinsic", label: "外因系（VII）", shape: `<rect x="208" y="74" width="108" height="34" rx="10"/>` },
        { id: "common", label: "共通系（X・V・II・フィブリノゲン）", shape: `<rect x="106" y="176" width="128" height="122" rx="10"/>` },
        { id: "platelet", label: "血小板・vWF", shape: `<circle cx="290" cy="270" r="26"/>` },
      ] },
  },
  cases: [
    { ...M, id: "hemoA", figure: "cascade", prompt: "5歳 男児。膝の関節内出血をくり返す。母方のおじも同じ。", signs: ["PT 正常", "APTT 延長", "血小板 正常"], answer: ["intrinsic"],
      followUp: { question: "足りない因子は？（血友病A）", options: ["第VIII因子", "第VII因子", "第XIII因子", "フィブリノゲン"], answer: 0 },
      explanation: "X連鎖潜性の血友病A（第VIII因子）。Bは第IX因子。関節内・筋肉内の出血。" },
    { ...M, id: "warfarin", figure: "cascade", prompt: "ワルファリンを飲み始めて2日目。いちばん先に下がる因子の場所は？", signs: ["PT 延長", "APTT ほぼ正常"], answer: ["extrinsic"],
      followUp: { question: "その理由は？", options: ["第VII因子の半減期がいちばん短い", "第VII因子だけがビタミンK依存", "ワルファリンは第VII因子だけを壊す", "肝臓が第VII因子しか作らない"], answer: 0 },
      explanation: "ビタミンK依存因子（II・VII・IX・X）のうち第VII因子の半減期が最短なので、まずPTが延びる。ワルファリンはPT-INRで管理。" },
    { ...M, id: "vwd", figure: "cascade", prompt: "20歳 女性。鼻血が止まりにくく、月経が多い。", signs: ["血小板数 正常", "出血時間 延長", "APTT 軽く延長"], answer: ["platelet"],
      followUp: { question: "診断は？", options: ["von Willebrand病", "血友病A", "ITP", "ビタミンK欠乏"], answer: 0 },
      explanation: "vWFは血小板を傷にくっつけ、第VIII因子を運ぶ。粘膜の出血。デスモプレシンで放出を促す。" },
    { ...M, id: "vitk", figure: "cascade", prompt: "生後1か月。母乳だけで育った。頭蓋内出血。", signs: ["PT 延長", "APTT 延長", "血小板 正常"], answer: ["common"],
      followUp: { question: "予防は？", options: ["ビタミンK₂シロップの内服", "第VIII因子の補充", "血小板輸血", "ヘパリン"], answer: 0 },
      explanation: "母乳はビタミンKが少ない。II・VII・IX・Xがすべて下がるのでPTもAPTTも延びる。共通系の第X・II因子が両方の検査に関わる。" },
    { ...M, id: "itp", figure: "cascade", prompt: "6歳 女児。かぜの2週後に点状出血。", signs: ["血小板 1万", "PT・APTT 正常", "骨髄の巨核球は増加"], answer: ["platelet"],
      followUp: { question: "小児のこの病気の経過は？", options: ["多くは自然に治る", "必ず脾摘が必要", "白血病に移行する", "一生続く"], answer: 0 },
      explanation: "免疫性血小板減少症（ITP）。小児の急性型は多くが自然に治る。成人はピロリ菌の除菌が効くことも。" },
    { ...M, id: "heparin", figure: "cascade", prompt: "未分画ヘパリンの効き具合を見る検査（APTT）が反映する場所は？", signs: ["アンチトロンビンを介して Xa とトロンビンを阻害"], answer: ["intrinsic", "common"],
      followUp: { question: "ヘパリンを中和する薬は？", options: ["プロタミン", "ビタミンK", "イダルシズマブ", "新鮮凍結血漿"], answer: 0 },
      explanation: "APTTは内因系と共通系をみる。ヘパリンの中和はプロタミン。ダビガトランの中和はイダルシズマブ。" },
  ],
};
