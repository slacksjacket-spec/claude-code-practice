// 影絵当て（造影シルエット早押し）のデータの形
import { z } from "zod";
import { Meta } from "../../../engine/schema";

export const RevealData = z.object({
  levels: z.array(z.number().nonnegative()).min(2),  // 段階ごとのぼかし（px）。最後は 0（くっきり）
  roundSize: z.number().int().positive(),            // 1周の枚数
  stampAt: z.number().int().positive(),              // 通算この枚数を一発正解でスタンプ
  items: z.array(Meta.extend({
    id: z.string(),
    answer: z.string(),
    caption: z.string(),                             // "食道造影" など、画像の種類
    svg: z.string(),                                 // 模式図（実際の画像は使わない）
    explanation: z.string(),
  })).min(4),
  distractors: z.array(z.string()).default([]),      // 選択肢にだけ出す病名
}).superRefine((d, ctx) => {
  if (d.levels.at(-1) !== 0) ctx.addIssue({ code: "custom", message: "levels の最後は 0", path: ["levels"] });
  if (d.roundSize > d.items.length) ctx.addIssue({ code: "custom", message: "roundSize が items より多い", path: ["roundSize"] });
  const a = d.items.map((i) => i.answer);
  if (new Set(a).size !== a.length) ctx.addIssue({ code: "custom", message: "answer が重複", path: ["items"] });
});
export type RevealData = z.infer<typeof RevealData>;
