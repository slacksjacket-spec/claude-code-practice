// 産業保健の3管理（共通ゲーム grid）。TODO(review)
import type { GridData } from "../../../engine/games/grid.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const occupationalContent: GridData = {
  rowLabels: ["管理"],
  colLabels: ["作業環境管理", "作業管理", "健康管理"],
  cells: [
    { id: "env", row: 0, col: 0, label: "作業環境", sub: "職場の環境をよくする" },
    { id: "work", row: 0, col: 1, label: "作業", sub: "働き方を変える" },
    { id: "health", row: 0, col: 2, label: "健康", sub: "働く人の体を見る" },
  ],
  question: "どの管理？",
  stampAt: 5,
  cases: [
    { ...M, id: "lev", who: "有機溶剤を使う工場", signs: ["局所排気装置をつける"], cell: "env", explanation: "有害物を発生源で取り除くのは作業環境管理。" },
    { ...M, id: "meas", who: "粉じん作業場", signs: ["作業環境測定"], cell: "env", explanation: "職場の有害物の濃度を測る。" },
    { ...M, id: "ppe", who: "騒音職場", signs: ["耳栓をつけて作業する", "作業時間を短くする"], cell: "work", explanation: "保護具・作業時間・作業姿勢は作業管理。" },
    { ...M, id: "vdt", who: "事務職", signs: ["パソコン作業の合間に休憩をはさむ"], cell: "work", explanation: "情報機器作業の作業時間の管理。" },
    { ...M, id: "special", who: "鉛を扱う工場", signs: ["特殊健康診断で血中鉛を測る"], cell: "health", explanation: "健康診断とその後の措置は健康管理。" },
    { ...M, id: "stress", who: "50人以上の事業場", signs: ["ストレスチェック", "高ストレス者に医師の面接指導"], cell: "health", explanation: "健康管理（メンタルヘルス）。" },
  ],
};
