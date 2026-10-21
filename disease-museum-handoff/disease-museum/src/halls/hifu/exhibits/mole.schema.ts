// ほくろのABCDE（mole）のデータの形。絵は lesion のパラメータから描き、ABCDE の正解もそこから決める
import { z } from "zod";
import { Meta } from "../../../engine/schema";

export const MoleData = z.object({
  stampAt: z.number().int().positive(),
  cases: z.array(Meta.extend({
    id: z.string(),
    story: z.string(),                              // E（変化）は話の中で伝える
    lesion: z.object({
      asym: z.boolean(),                            // A：左右非対称
      border: z.boolean(),                          // B：境界が不整・にじむ
      colors: z.number().int().min(1).max(3),       // C：色の数（2以上で陽性）
      size: z.number().positive().max(14),          // D：直径（mm、6超で陽性）
      evolving: z.boolean(),                        // E：変化している
    }),
    question: z.string(),
    options: z.array(z.string()).min(2),
    answer: z.number().int().nonnegative(),
    explanation: z.string(),
  })).min(4),
}).superRefine((d, ctx) => {
  d.cases.forEach((c, i) => { if (c.answer >= c.options.length) ctx.addIssue({ code: "custom", message: "answer が範囲外", path: ["cases", i] }); });
});
export type MoleData = z.infer<typeof MoleData>;
