// 成長曲線（growth）のデータの形。身長（と体重）の点を年齢つきで渡す
import { z } from "zod";
import { Meta } from "../../../engine/schema";

const Pt = z.tuple([z.number().min(2).max(18), z.number().positive()]);
export const GrowthData = z.object({
  stampAt: z.number().int().positive(),
  cases: z.array(Meta.extend({
    id: z.string(),
    who: z.string(),
    story: z.string(),
    height: z.array(Pt).min(3),
    weight: z.array(Pt).optional(),
    question: z.string(),
    options: z.array(z.string()).min(2),
    answer: z.number().int().nonnegative(),
    followUp: z.object({ question: z.string(), options: z.array(z.string()).min(2), answer: z.number().int().nonnegative() }),
    explanation: z.string(),
  })).min(3),
}).superRefine((d, ctx) => {
  d.cases.forEach((c, i) => {
    if (c.answer >= c.options.length) ctx.addIssue({ code: "custom", message: "answer が範囲外", path: ["cases", i] });
    if (c.followUp.answer >= c.followUp.options.length) ctx.addIssue({ code: "custom", message: "followUp.answer が範囲外", path: ["cases", i] });
  });
});
export type GrowthData = z.infer<typeof GrowthData>;
