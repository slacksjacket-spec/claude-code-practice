// 切除範囲をなぞる。
// TODO(review) 術式ごとの切除範囲は教科書的な模式（リンパ節郭清の範囲や腸管の切離線は実際には腫瘍の位置で変わる）。区間の割り当てを確認
import type { ResectionData } from "../exhibits/resection.schema";

const M = { review: "draft" as const, sources: ["大腸癌治療ガイドライン"] };

export const resectionContent: ResectionData = {
  labels: {
    ileum: "回腸末端", cecum: "盲腸", asc: "上行結腸", transR: "横行結腸（右）", transM: "横行結腸（中）", transL: "横行結腸（左）",
    desc: "下行結腸", sig: "S状結腸", rs: "直腸S状部", ra: "上部直腸", rb: "下部直腸", anal: "肛門管",
  },
  procedures: [
    { name: "回盲部切除", segments: ["ileum", "cecum"] },
    { name: "右半結腸切除", segments: ["ileum", "cecum", "asc", "transR"] },
    { name: "横行結腸切除", segments: ["transM"] },
    { name: "左半結腸切除", segments: ["transL", "desc"] },
    { name: "S状結腸切除", segments: ["sig"] },
    { name: "高位前方切除", segments: ["rs"] },
    { name: "低位前方切除", segments: ["rs", "ra"] },
    { name: "腹会陰式直腸切断術（Miles手術）", segments: ["rs", "ra", "rb", "anal"], note: "肛門ごと切除するので、永久的な人工肛門になる。" },
    { name: "大腸全摘", segments: ["cecum", "asc", "transR", "transM", "transL", "desc", "sig", "rs", "ra", "rb"], note: "肛門は残して、回腸でつくった袋と肛門をつなぐ（回腸嚢肛門吻合）。" },
  ],
  stampAt: 4,
  cases: [
    { ...M, id: "asc", lesion: ["asc"], kind: "tumor", card: { 病変: "上行結腸癌", 深達度: "進行癌" }, answer: "右半結腸切除",
      explanation: "上行結腸の癌は、回腸末端から横行結腸の右側までを、支配する血管（回結腸動脈・右結腸動脈）ごと切除する。" },
    { ...M, id: "trans", lesion: ["transM"], kind: "tumor", card: { 病変: "横行結腸中央の癌" }, answer: "横行結腸切除",
      explanation: "横行結腸の中央なら、中結腸動脈の領域を中心に横行結腸を切除する。" },
    { ...M, id: "desc", lesion: ["desc"], kind: "tumor", card: { 病変: "下行結腸癌" }, answer: "左半結腸切除",
      explanation: "下行結腸の癌は、横行結腸の左側から下行結腸までを切除する。" },
    { ...M, id: "sig", lesion: ["sig"], kind: "tumor", card: { 病変: "S状結腸癌" }, answer: "S状結腸切除",
      explanation: "S状結腸の癌はS状結腸切除。日本の大腸癌で最も多い部位のひとつ。" },
    { ...M, id: "rs", lesion: ["rs"], kind: "tumor", card: { 病変: "直腸S状部の癌" }, answer: "高位前方切除",
      explanation: "腹膜反転部より上でつなぐのが高位前方切除。" },
    { ...M, id: "ra", lesion: ["ra"], kind: "tumor", card: { 病変: "上部直腸癌", 肛門縁から: "10cm" }, answer: "低位前方切除",
      explanation: "腹膜反転部より下でつなぐのが低位前方切除。肛門は残せる。" },
    { ...M, id: "rb", lesion: ["rb"], kind: "tumor", card: { 病変: "下部直腸癌", 所見: "肛門括約筋に浸潤" }, answer: "腹会陰式直腸切断術（Miles手術）",
      explanation: "括約筋まで浸潤していて肛門を残せないときは、腹と会陰の両方から直腸と肛門を切除し、永久人工肛門をつくる。" },
    { ...M, id: "crohn", lesion: ["ileum"], kind: "stricture", card: { 病変: "Crohn病", 経過: "回腸末端の狭窄で腸閉塞をくり返す" }, answer: "回盲部切除",
      explanation: "Crohn病の手術は、再発をくり返すので切除は必要最小限にする。回腸末端の狭窄なら回盲部切除（狭窄形成術も選択肢）。" },
    { ...M, id: "uc", lesion: ["cecum", "asc", "transR", "transM", "transL", "desc", "sig", "rs", "ra", "rb"], kind: "inflammation", card: { 病変: "潰瘍性大腸炎", 経過: "内科治療が効かない全大腸炎型" }, answer: "大腸全摘",
      explanation: "潰瘍性大腸炎は直腸から連続して大腸全体に広がるので、手術は大腸全摘（直腸まで）。肛門は残して回腸嚢肛門吻合。" },
  ],
};
