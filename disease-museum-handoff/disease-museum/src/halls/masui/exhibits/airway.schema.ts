// Mallampati分類（mallampati）のデータの形。口の中の絵は cls から描く
import { z } from "zod";
import { Meta } from "../../../engine/schema";

export const AirwayData = z.object({
  stampAt: z.number().int().positive(),
  cases: z.array(Meta.extend({
    id: z.string(),
    story: z.string(),
    cls: z.number().int().min(1).max(4),
    followUp: z.object({ question: z.string(), options: z.array(z.string()).min(2), answer: z.number().int().nonnegative() }),
    explanation: z.string(),
  })).min(4),
}).superRefine((d, ctx) => {
  d.cases.forEach((c, i) => { if (c.followUp.answer >= c.followUp.options.length) ctx.addIssue({ code: "custom", message: "followUp.answer が範囲外", path: ["cases", i] }); });
});
export type AirwayData = z.infer<typeof AirwayData>;
