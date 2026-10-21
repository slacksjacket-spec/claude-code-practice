// 肺音ミキサー。音は合成した模式。TODO(review) 音の名前（日本呼吸器学会の分類）と典型疾患
import type { LungSoundsData } from "../exhibits/lungSounds.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const lungSoundsContent: LungSoundsData = {
  names: {
    normal: "正常な肺胞呼吸音",
    wheeze: "笛声音（wheezes）",
    rhonchi: "いびき音（rhonchi）",
    fine: "捻髪音（fine crackles）",
    coarse: "水泡音（coarse crackles）",
    stridor: "stridor（吸気性喘鳴）",
    rub: "胸膜摩擦音",
  },
  stampAt: 4,
  cases: [
    { ...M, id: "asthma", profile: "wheeze", story: "25歳 女性。夜中の咳と息苦しさ。",
      disease: { options: ["気管支喘息の発作", "特発性肺線維症", "肺水腫", "胸膜炎"], answer: 0 },
      explanation: "呼気に聴こえる高い連続性の音。細くなった気道を空気が通る音。" },
    { ...M, id: "copd", profile: "rhonchi", story: "75歳 男性。喫煙者。痰がからむ。",
      disease: { options: ["COPD（痰の貯留）", "気胸", "間質性肺炎", "上気道異物"], answer: 0 },
      explanation: "低い連続性の音。太い気道の痰。咳をすると変わることがある。" },
    { ...M, id: "ipf", profile: "fine", story: "68歳 男性。乾いた咳。指先が太鼓のばちのよう。",
      disease: { options: ["間質性肺炎（特発性肺線維症）", "気管支喘息", "クループ", "肺水腫"], answer: 0 },
      explanation: "吸気の後半に聴こえる細かい断続性の音（ベルクロ・ラ音、髪をこすったような音）。両側の背側の肺底部。" },
    { ...M, id: "edema", profile: "coarse", story: "80歳 女性。起座呼吸。泡のような痰。",
      disease: { options: ["心原性肺水腫", "特発性肺線維症", "気管支喘息", "気胸"], answer: 0 },
      explanation: "吸気の早いうちから聴こえる粗い断続性の音。気道の中の水分。肺炎でも聴こえる。" },
    { ...M, id: "croup", profile: "stridor", story: "2歳 男児。犬が吠えるような咳と声のかすれ。",
      disease: { options: ["クループ（喉頭気管気管支炎）", "気管支喘息", "間質性肺炎", "胸膜炎"], answer: 0 },
      explanation: "吸気に聴こえる高い喘鳴。上気道（喉頭・気管）が狭い。急性喉頭蓋炎や気道異物も考える。" },
    { ...M, id: "pleurisy", profile: "rub", story: "40歳 男性。息を吸うと胸が痛む。",
      disease: { options: ["胸膜炎", "気管支喘息", "COPD", "クループ"], answer: 0 },
      explanation: "炎症で荒れた胸膜どうしがこすれる、ギュッギュッという音。吸気・呼気の両方で聴こえる。" },
    { ...M, id: "normal", profile: "normal", story: "20歳 男性。健診。",
      disease: { options: ["異常なし", "気管支喘息", "間質性肺炎", "胸膜炎"], answer: 0 },
      explanation: "吸気ではっきり、呼気ではかすかに聴こえる柔らかい音。付加音はない。" },
  ],
};
