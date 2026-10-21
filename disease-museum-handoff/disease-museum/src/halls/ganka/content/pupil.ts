// 瞳孔ラボ（ホール専用 pupil）。瞳孔の動きは模式。TODO(review)
import type { PupilData } from "../exhibits/pupil.schema";

const M = { review: "draft" as const, sources: [] as string[] };
const DX = ["動眼神経麻痺", "Horner症候群", "Adie瞳孔", "相対的瞳孔求心路障害（RAPD）", "Argyll Robertson瞳孔", "生理的瞳孔不同"];

export const pupilContent: PupilData = {
  stampAt: 4,
  cases: [
    { ...M, id: "cn3", story: "55歳 女性。突然の激しい頭痛。右のまぶたが下がり、物が二重に見える。", pattern: "cn3", side: "R", options: DX, answer: 0,
      followUp: { question: "まず疑う原因は？", options: ["内頸動脈-後交通動脈分岐部の動脈瘤", "糖尿病による虚血", "多発性硬化症", "重症筋無力症"], answer: 0 },
      explanation: "散瞳を伴う動眼神経麻痺は、外側を走る瞳孔線維が圧迫されたしるし。動脈瘤を考えて緊急でCTA。糖尿病性は瞳孔が保たれやすい。" },
    { ...M, id: "horner", story: "50歳 男性。喫煙50年。左のまぶたが少し下がり、左の顔に汗をかかない。", pattern: "horner", side: "L", options: DX, answer: 1,
      followUp: { question: "探すべき病気は？", options: ["肺尖部の腫瘍（Pancoast腫瘍）", "下垂体腫瘍", "緑内障", "白内障"], answer: 0 },
      explanation: "交感神経の障害で縮瞳・軽い眼瞼下垂・無汗。暗いところで左右差が大きくなる。肺尖部腫瘍、頸動脈解離、Wallenberg症候群。" },
    { ...M, id: "adie", story: "30歳 女性。鏡を見たら右の瞳が大きいことに気づいた。膝の腱反射がない。", pattern: "adie", side: "R", options: DX, answer: 2,
      followUp: { question: "この瞳孔の特徴は？", options: ["光にはほとんど反応しないが、近くを見るとゆっくり縮む", "光にも近見にも反応しない", "光にだけ反応する", "暗いところで小さくなる"], answer: 0 },
      explanation: "毛様体神経節の障害。若い女性に多く、腱反射の消失を伴えばHolmes-Adie症候群。希釈ピロカルピンで強く縮む。" },
    { ...M, id: "rapd", story: "28歳 女性。数日で右目が見えにくくなり、目を動かすと痛い。", pattern: "rapd", side: "R", options: DX, answer: 3,
      followUp: { question: "考える病気は？", options: ["視神経炎", "白内障", "動眼神経麻痺", "結膜炎"], answer: 0 },
      explanation: "右眼に光を当てたときの縮みが、左眼に当てたときより弱い（swinging flashlight test）。視神経の障害。瞳孔の大きさは左右同じ。" },
    { ...M, id: "argyll", story: "60歳 男性。梅毒の治療歴がない。両方の瞳が小さく形がいびつ。", pattern: "argyll", side: "R", options: DX, answer: 4,
      followUp: { question: "この病気で調べるのは？", options: ["梅毒の検査（神経梅毒）", "甲状腺機能", "血糖だけ", "眼圧だけ"], answer: 0 },
      explanation: "光には反応しないが、近くを見ると縮む（対光-近見反応解離）。神経梅毒（脊髄癆）に特徴的。" },
    { ...M, id: "physio", story: "20歳 男性。健診で左の瞳が少し大きいと言われた。ほかに症状はない。", pattern: "physio", side: "L", options: DX, answer: 5,
      followUp: { question: "対応は？", options: ["明るさで差が変わらず反応も正常なので、経過観察", "すぐに頭部MRI", "ステロイドパルス", "胸部CT"], answer: 0 },
      explanation: "1 mm未満の左右差で、明暗で差が変わらず、反応が正常なら生理的。人口の約2割にある。" },
  ],
};
