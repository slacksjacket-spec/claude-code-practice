// 2×2表の計算（ホール専用 epiCalc）。数字は架空
import type { EpiData } from "../exhibits/epi.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const epiContent: EpiData = {
  stampAt: 5,
  cases: [
    { ...M, id: "rr", story: "喫煙者と非喫煙者を10年追いかけた（コホート研究）。", design: "cohort", table: [60, 940, 10, 990], ask: "rr", explanation: "6%÷1%＝6。喫煙者は6倍なりやすい。" },
    { ...M, id: "or", story: "病気の人（症例）と病気でない人（対照）に、過去の曝露を尋ねた（症例対照研究）。", design: "casecontrol", table: [80, 40, 20, 60], ask: "or", explanation: "症例対照研究では発症率が計算できないので、オッズ比で相対危険を近似する（まれな病気で近くなる）。" },
    { ...M, id: "nnt", story: "新しい薬と偽薬で、脳卒中が起きるかを比べた（ランダム化比較試験）。", design: "rct", table: [20, 980, 40, 960], ask: "nnt", explanation: "4%−2%＝2%。1÷0.02＝50人に使うと、1人の脳卒中を防げる。" },
    { ...M, id: "ard", story: "ワクチンを打った群と打たない群で、発症を比べた（ランダム化比較試験）。", design: "rct", table: [30, 970, 50, 950], ask: "ard", explanation: "5%−3%＝2%。ワクチンで減らせた発症の割合。" },
    { ...M, id: "sens", story: "新しい迅速検査を、確定診断（ゴールドスタンダード）と比べた。", design: "test", table: [90, 50, 10, 850], ask: "sens", explanation: "病気の100人のうち90人が陽性。" },
    { ...M, id: "ppv", story: "同じ迅速検査で、陽性だった人のうち本当に病気だった割合は？", design: "test", table: [90, 50, 10, 850], ask: "ppv", explanation: "陽性140人のうち90人。" },
    { ...M, id: "spec", story: "同じ迅速検査で、病気でない人を正しく陰性にできた割合は？", design: "test", table: [90, 50, 10, 850], ask: "spec", explanation: "病気でない900人のうち850人。" },
    { ...M, id: "or2", story: "肥満の有無と糖尿病の発症を5年追いかけた（コホート研究）。オッズ比を求める。", design: "cohort", table: [50, 150, 20, 380], ask: "or", explanation: "(50×380)÷(150×20)≒6.33。発症がまれでないので、相対危険（4.75）とずれる。" },
  ],
};
