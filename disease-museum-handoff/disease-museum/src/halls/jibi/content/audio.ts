// オージオグラム（ホール専用 audiogram）。値は架空。TODO(review) 各症例の値と解釈
import type { AudioData } from "../exhibits/audio.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const audioContent: AudioData = {
  stampAt: 4,
  cases: [
    { ...M, id: "normal", story: "20歳 男性。健診の聴力検査。", ear: "R", air: [10, 10, 5, 10, 10, 15, 10], bone: [5, 5, 10, 10, 10], answer: "normal",
      followUp: { question: "対応は？", options: ["正常。経過観察", "補聴器を勧める", "ステロイド", "鼓膜切開"], answer: 0 },
      explanation: "気導がすべて25 dB以内なら正常。" },
    { ...M, id: "otoscl", story: "30歳 女性。両耳がだんだん聞こえにくい。妊娠で悪化した。鼓膜は正常。", ear: "R", air: [45, 45, 45, 40, 50, 40, 40], bone: [10, 15, 15, 25, 15], answer: "conductive",
      followUp: { question: "考えるのは？", options: ["耳硬化症（アブミ骨の固着）", "メニエール病", "騒音性難聴", "聴神経腫瘍"], answer: 0 },
      explanation: "骨導は保たれ気導だけが悪い（気骨導差）。2 kHzの骨導がやや落ちるのはCarhartの切痕。アブミ骨手術や補聴器。" },
    { ...M, id: "ome", story: "5歳 男児。かぜのあと、呼んでも返事をしないことが増えた。耳は痛がらない。", ear: "L", air: [35, 35, 30, 30, 25, 30, 30], bone: [5, 5, 5, 5, 5], answer: "conductive",
      followUp: { question: "考えるのは？", options: ["滲出性中耳炎", "突発性難聴", "老人性難聴", "メニエール病"], answer: 0 },
      explanation: "鼓膜の奥に液がたまる。ティンパノグラムは平坦（B型）。長引けば鼓膜チューブ。大人の片側なら上咽頭癌を疑う。" },
    { ...M, id: "ssnhl", story: "45歳 男性。朝起きたら急に右耳が聞こえない。耳鳴りと耳の詰まった感じ。", ear: "R", air: [60, 65, 70, 70, 75, 80, 80], bone: [60, 65, 70, 75, 80], answer: "sensorineural",
      followUp: { question: "治療は？", options: ["できるだけ早くステロイド", "様子を見て1か月後に再検", "鼓膜切開", "耳垢をとる"], answer: 0 },
      explanation: "突発性難聴。原因不明の急な感音難聴。早い治療ほど回復しやすい。" },
    { ...M, id: "noise", story: "50歳 男性。工場で30年働いている。耳鳴り。", ear: "L", air: [10, 10, 15, 20, 30, 65, 30], bone: [10, 15, 20, 30, 60], answer: "sensorineural",
      followUp: { question: "4 kHzだけが深く落ちる形の名前と原因は？", options: ["c⁵-dip。騒音性難聴", "Carhartの切痕。耳硬化症", "低音障害型。メニエール病", "高音漸傾型。老人性難聴"], answer: 0 },
      explanation: "騒音性難聴は4 kHzの谷から始まる。耳栓などの予防が大事。" },
    { ...M, id: "presby", story: "78歳 女性。テレビの音が大きいと言われる。両耳。", ear: "R", air: [20, 20, 25, 35, 50, 65, 80], bone: [20, 25, 35, 50, 65], answer: "sensorineural",
      followUp: { question: "考えるのは？", options: ["老人性難聴", "耳硬化症", "滲出性中耳炎", "外耳道異物"], answer: 0 },
      explanation: "高い音から両側対称に落ちていく。言葉の聞き取り（語音明瞭度）も低下。補聴器。" },
    { ...M, id: "meniere", story: "40歳 女性。回転するめまいが数時間続く発作をくり返す。そのたびに左耳が詰まり、耳鳴り。", ear: "L", air: [50, 50, 45, 30, 20, 20, 20], bone: [45, 40, 25, 20, 15], answer: "sensorineural",
      followUp: { question: "考えるのは？", options: ["メニエール病（内リンパ水腫）", "良性発作性頭位めまい症", "前庭神経炎", "聴神経腫瘍"], answer: 0 },
      explanation: "低い音が落ちる感音難聴と、くり返す回転性めまい。" },
    { ...M, id: "com", story: "60歳 男性。子どものころから右耳の耳だれをくり返す。鼓膜に穴。", ear: "R", air: [60, 60, 60, 65, 70, 75, 80], bone: [30, 30, 35, 40, 50], answer: "mixed",
      followUp: { question: "考えるのは？", options: ["慢性中耳炎（内耳にも影響が及んだ）", "耳硬化症", "騒音性難聴", "突発性難聴"], answer: 0 },
      explanation: "気骨導差があり、骨導も落ちている。鼓室形成術。" },
  ],
};
