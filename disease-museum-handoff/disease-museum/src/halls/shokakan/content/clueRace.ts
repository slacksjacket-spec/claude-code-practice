// 早押し問診（急性腹症）。症例はすべて架空。
// TODO(review) 各疾患の典型像として書いた。カードの順番（どこで決め手が出るか）がゲームの難しさを決めるので、遊んで調整する
import type { ClueRaceData } from "../exhibits/clueRace.schema";

const M = { review: "draft" as const, sources: [] as string[] };
const opts = (ans: string, ...others: string[]) => [ans, ...others];

export const clueRaceContent: ClueRaceData = {
  regionLabels: { RUQ: "右季肋部", EPI: "心窩部", LUQ: "左季肋部", RL: "右側腹部", UMB: "臍部", LL: "左側腹部", RLQ: "右下腹部", HYPO: "下腹部", LLQ: "左下腹部" },
  stampAt: 4,
  stampMaxCards: 3,
  cases: [
    { ...M, id: "appendicitis", answer: "急性虫垂炎", options: opts("急性虫垂炎", "大腸憩室炎", "尿管結石", "急性膵炎", "消化管穿孔"),
      clues: [
        { kind: "text", label: "患者", text: "22歳 男性。昨夜からの腹痛。" },
        { kind: "pain", label: "痛む場所", regions: ["EPI", "RLQ"], text: "はじめはみぞおち、いまは右下腹部。" },
        { kind: "text", label: "随伴症状", text: "食欲がなく、吐き気。37.8℃。" },
        { kind: "text", label: "身体所見", text: "McBurney点の圧痛、反跳痛あり。" },
        { kind: "text", label: "画像", text: "CTで虫垂の腫大と糞石。" },
      ],
      explanation: "心窩部から右下腹部へ移る痛み、食欲不振、McBurney点の圧痛。急性虫垂炎の典型。" },
    { ...M, id: "sma", answer: "上腸間膜動脈閉塞症", options: opts("上腸間膜動脈閉塞症", "急性膵炎", "絞扼性腸閉塞", "消化管穿孔", "虚血性大腸炎"),
      clues: [
        { kind: "text", label: "患者", text: "78歳 女性。心房細動があり、抗凝固薬は自己中断。" },
        { kind: "pain", label: "痛む場所", regions: ["UMB"], text: "突然の、のたうち回るような臍のまわりの痛み。" },
        { kind: "text", label: "身体所見", text: "痛がり方の割に、おなかはやわらかく圧痛もはっきりしない。" },
        { kind: "text", label: "血液検査", text: "乳酸が高く、代謝性アシドーシス。" },
        { kind: "text", label: "画像", text: "造影CTで上腸間膜動脈の途中から先が造影されない。" },
      ],
      explanation: "心房細動からの塞栓。激痛なのに腹部所見が乏しいのが特徴で、見逃すと腸が壊死する。" },
    { ...M, id: "perforation", answer: "消化管穿孔", options: opts("消化管穿孔", "急性膵炎", "急性胆嚢炎", "上腸間膜動脈閉塞症", "急性虫垂炎"),
      clues: [
        { kind: "text", label: "患者", text: "45歳 男性。腰痛でNSAIDsを飲み続けていた。" },
        { kind: "pain", label: "痛む場所", regions: ["EPI"], text: "突然、みぞおちに刺されたような痛み。" },
        { kind: "text", label: "身体所見", text: "おなか全体が板のように硬い（板状硬）。" },
        { kind: "text", label: "画像", text: "立位の胸部X線で、横隔膜の下に三日月形のガス。" },
        { kind: "text", label: "既往", text: "以前に十二指腸潰瘍を指摘されている。" },
      ],
      explanation: "NSAIDsと潰瘍歴、突然の心窩部痛、板状硬、遊離ガス。十二指腸潰瘍の穿孔。" },
    { ...M, id: "strangulation", answer: "絞扼性腸閉塞", options: opts("絞扼性腸閉塞", "上腸間膜動脈閉塞症", "大腸憩室炎", "急性膵炎", "消化管穿孔"),
      clues: [
        { kind: "text", label: "患者", text: "68歳 女性。20年前に子宮の手術。" },
        { kind: "text", label: "経過", text: "嘔吐があり、便もガスも出ない。" },
        { kind: "pain", label: "痛む場所", regions: ["UMB"], text: "波のある痛みが、途中から持続する激しい痛みに変わった。" },
        { kind: "text", label: "身体所見", text: "反跳痛、筋性防御。38℃。" },
        { kind: "text", label: "画像", text: "CTで閉じたループ（closed loop）の腸管と、腸管壁の造影不良。" },
      ],
      explanation: "開腹歴＋腸閉塞で、痛みが持続性に変わり腹膜刺激症状。血流が途絶えた絞扼性腸閉塞で、緊急手術。" },
    { ...M, id: "diverticulitis", answer: "大腸憩室炎", options: opts("大腸憩室炎", "急性虫垂炎", "虚血性大腸炎", "尿管結石", "絞扼性腸閉塞"),
      clues: [
        { kind: "text", label: "患者", text: "70歳 男性。便秘がち。" },
        { kind: "pain", label: "痛む場所", regions: ["LLQ"], text: "数日前から左下腹部が痛い。" },
        { kind: "text", label: "随伴症状", text: "38℃の発熱。血便はない。" },
        { kind: "text", label: "身体所見", text: "左下腹部に限った圧痛。" },
        { kind: "text", label: "画像", text: "CTでS状結腸に憩室が多数あり、周りの脂肪が炎症で濃くなっている。" },
      ],
      explanation: "高齢者の左下腹部痛と発熱、S状結腸の憩室の周りの炎症。大腸憩室炎。（若い人では右側の憩室炎も多い）" },
    { ...M, id: "ureter", answer: "尿管結石", options: opts("尿管結石", "急性虫垂炎", "大腸憩室炎", "上腸間膜動脈閉塞症", "急性膵炎"),
      clues: [
        { kind: "text", label: "患者", text: "40歳 男性。夜中に目が覚めるほどの痛み。" },
        { kind: "pain", label: "痛む場所", regions: ["LL"], text: "左の脇腹から、下腹部・陰部のほうへひびく。" },
        { kind: "text", label: "様子", text: "じっとしていられず、転げまわっている。" },
        { kind: "text", label: "尿検査", text: "顕微鏡的血尿。" },
        { kind: "text", label: "身体所見", text: "左の肋骨脊柱角の叩打痛。おなかはやわらかい。" },
      ],
      explanation: "脇腹から下へひびく疝痛、じっとしていられない、血尿、叩打痛。尿管結石。腹膜炎なら逆にじっと動かない。" },
    { ...M, id: "ischemicColitis", answer: "虚血性大腸炎", options: opts("虚血性大腸炎", "大腸憩室炎", "上腸間膜動脈閉塞症", "急性虫垂炎", "尿管結石"),
      clues: [
        { kind: "text", label: "患者", text: "72歳 女性。便秘があり、いきんだあと。" },
        { kind: "pain", label: "痛む場所", regions: ["LL"], text: "急に左の脇腹から下腹部が痛くなった。" },
        { kind: "text", label: "経過", text: "しばらくして下痢と、鮮やかな血便。" },
        { kind: "text", label: "身体所見", text: "左側腹部の圧痛。腹膜刺激症状はない。" },
        { kind: "text", label: "内視鏡", text: "下行結腸に縦に走る潰瘍と、粘膜のむくみ。直腸はきれい。" },
      ],
      explanation: "便秘の高齢女性の急な左腹痛→下痢→血便。下行結腸〜S状結腸に多い虚血性大腸炎。多くは保存的に治る。" },
  ],
};
