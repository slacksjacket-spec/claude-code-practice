// 熱型表（ホール専用 feverChart）。経過は架空。TODO(review)
import type { FeverData } from "../exhibits/fever.schema";

const M = { review: "draft" as const, sources: [] as string[] };
const DX = ["突発性発疹", "麻疹", "風疹", "川崎病", "伝染性紅斑"];

export const feverContent: FeverData = {
  stampAt: 4,
  cases: [
    { ...M, id: "es", who: "10か月 男児", temps: [39.5, 39.8, 39.6, 36.8, 36.7], rashFrom: 4, rash: "体幹の小さな紅斑", signs: ["高熱のわりに機嫌がよい", "初めての発熱"],
      options: DX, answer: 0,
      followUp: { question: "原因ウイルスは？", options: ["HHV-6・HHV-7", "パルボウイルスB19", "EBウイルス", "コクサッキーA16"], answer: 0 },
      explanation: "3日ほどの高熱が下がってから発疹。熱性けいれんを起こすことがある。" },
    { ...M, id: "measles", who: "1歳6か月 女児", temps: [38.5, 38.6, 38.4, 37.6, 39.6, 40.0, 39.5, 38.5, 37.2], rashFrom: 5, rash: "耳の後ろから全身へ。くっついて広がる", signs: ["ワクチン未接種", "咳・鼻水・目やに", "頬の粘膜に白い斑点"],
      options: DX, answer: 1,
      followUp: { question: "注意する合併症は？", options: ["肺炎・脳炎", "冠動脈瘤", "関節炎", "腸重積"], answer: 0 },
      explanation: "カタル期→いったん下がって→発疹とともに再び高熱（二峰性）。Koplik斑。" },
    { ...M, id: "kawasaki", who: "2歳 男児", temps: [39.0, 39.5, 39.8, 39.6, 39.7, 39.5], rashFrom: 3, rash: "いろいろな形の紅斑", signs: ["両目が赤い（目やにはない）", "いちご舌・唇が赤い", "手足が硬くむくむ", "BCG接種部位が赤い"],
      options: DX, answer: 3,
      followUp: { question: "治療は？", options: ["免疫グロブリン大量療法とアスピリン", "抗菌薬", "経過観察", "抗ウイルス薬"], answer: 0 },
      explanation: "解熱しない高熱と特徴的な症状。冠動脈瘤を防ぐため早く治療。" },
    { ...M, id: "fifth", who: "6歳 女児", temps: [37.2, 37.0, 36.9, 36.8, 36.8, 36.7], rashFrom: 3, rash: "両頬が平手打ちのように赤い、腕にレース状の紅斑", signs: ["1週間前に軽いかぜ症状"],
      options: DX, answer: 4,
      followUp: { question: "妊婦が感染すると？", options: ["胎児水腫", "先天性風疹症候群", "新生児ヘルペス", "胎児の白内障"], answer: 0 },
      explanation: "伝染性紅斑（パルボウイルスB19）。発疹が出たころには、うつす力はほとんどない。" },
    { ...M, id: "rubella", who: "5歳 男児", temps: [37.8, 38.0, 37.4, 36.9, 36.8], rashFrom: 1, rash: "細かい淡い紅斑が全身に。3日で消えた", signs: ["耳の後ろのリンパ節が腫れる"],
      options: DX, answer: 2,
      followUp: { question: "社会的に最も問題になるのは？", options: ["妊婦にうつると先天性風疹症候群", "冠動脈瘤", "亜急性硬化性全脳炎", "胎児水腫"], answer: 0 },
      explanation: "風疹は軽い（三日はしか）。妊娠20週ころまでの感染で白内障・難聴・心奇形。" },
    { ...M, id: "scarlet", who: "5歳 女児", temps: [39.0, 39.3, 38.6, 37.5, 37.0], rashFrom: 2, rash: "細かく赤いざらざらした発疹。口のまわりだけ白い", signs: ["のどの痛み", "いちご舌"],
      options: ["猩紅熱（A群溶連菌）", "麻疹", "川崎病", "突発性発疹", "手足口病"], answer: 0,
      followUp: { question: "治療は？", options: ["ペニシリン系を10日間", "抗ウイルス薬", "免疫グロブリン", "治療は不要"], answer: 0 },
      explanation: "A群溶連菌の毒素による発疹。回復期に手足の皮がむける。リウマチ熱や腎炎の予防に抗菌薬を飲みきる。" },
  ],
};
