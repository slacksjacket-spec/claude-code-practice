// GCS採点（gcs）のデータの形。反応の様子から E・V・M を付ける
import { z } from "zod";
import { Meta } from "../schema";

export const GcsData = z.object({
  stampAt: z.number().int().positive(),
  cases: z.array(Meta.extend({
    id: z.string(),
    who: z.string(),
    story: z.string(),                                   // 反応の様子（目、言葉、体の動き）
    e: z.number().int().min(1).max(4),
    v: z.number().int().min(1).max(5),
    m: z.number().int().min(1).max(6),
    followUp: z.object({ question: z.string(), options: z.array(z.string()).min(2), answer: z.number().int().nonnegative() }).optional(),
    explanation: z.string(),
  })).min(3),
}).superRefine((d, ctx) => {
  d.cases.forEach((c, i) => { if (c.followUp && c.followUp.answer >= c.followUp.options.length) ctx.addIssue({ code: "custom", message: "followUp.answer が範囲外", path: ["cases", i] }); });
});
export type GcsData = z.infer<typeof GcsData>;
