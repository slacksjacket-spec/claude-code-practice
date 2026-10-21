// ショックの4分類（共通ゲーム grid）。TODO(review) 分類と最初の対応
import type { GridData } from "../../../engine/games/grid.schema";

const M = { review: "draft" as const, sources: [] as string[] };

export const shockContent: GridData = {
  rowLabels: ["ショック"],
  colLabels: ["循環血液量減少性", "心原性", "閉塞性", "血液分布異常性"],
  cells: [
    { id: "hypo", row: 0, col: 0, label: "減少性" },
    { id: "cardio", row: 0, col: 1, label: "心原性" },
    { id: "obst", row: 0, col: 2, label: "閉塞性" },
    { id: "dist", row: 0, col: 3, label: "分布異常" },
  ],
  question: "どのショック？",
  treatQuestion: "最初の一手は？",
  treatments: ["止血と輸液・輸血", "原因の治療（再灌流）と強心薬", "胸腔の脱気", "心嚢穿刺", "アドレナリン筋注", "抗菌薬・輸液・ノルアドレナリン"],
  stampAt: 5,
  cases: [
    { ...M, id: "bleed", who: "30歳 男性（交通外傷）", signs: ["皮膚が冷たく湿っている", "頸静脈は虚脱", "骨盤骨折"], cell: "hypo", treatment: 0,
      explanation: "出血性ショック。骨盤の固定、輸血、塞栓や手術で止血。" },
    { ...M, id: "mi", who: "70歳 男性", signs: ["胸痛", "心電図でST上昇", "肺にラ音", "頸静脈怒張"], cell: "cardio", treatment: 1,
      explanation: "心筋梗塞による心原性ショック。PCI、強心薬、補助循環。" },
    { ...M, id: "tension", who: "25歳 男性（胸部外傷）", signs: ["片側の呼吸音が消失", "頸静脈怒張", "気管が反対側へ偏位"], cell: "obst", treatment: 2,
      explanation: "緊張性気胸。X線を待たずに脱気（針・胸腔ドレーン）。" },
    { ...M, id: "tamponade", who: "60歳 男性（刺創）", signs: ["頸静脈怒張", "心音が遠い", "低血圧（Beckの三徴）", "奇脈"], cell: "obst", treatment: 3,
      explanation: "心タンポナーデ。エコーで心嚢液を確認し、穿刺。" },
    { ...M, id: "ana", who: "35歳 女性", signs: ["抗菌薬の点滴直後", "全身のじんましん", "喘鳴", "皮膚は温かい"], cell: "dist", treatment: 4,
      explanation: "アナフィラキシーショック。アドレナリン筋注。" },
    { ...M, id: "sepsis", who: "80歳 女性", signs: ["発熱", "尿の混濁", "皮膚は温かい（初期）", "乳酸上昇"], cell: "dist", treatment: 5,
      explanation: "敗血症性ショック。" },
    { ...M, id: "pe", who: "55歳 女性（術後）", signs: ["突然の呼吸困難", "頸静脈怒張", "SpO₂低下", "下肢のむくみ"], cell: "obst", treatment: 1,
      explanation: "肺塞栓症による閉塞性ショック。抗凝固、重症なら血栓溶解（再灌流）。" },
  ],
};
