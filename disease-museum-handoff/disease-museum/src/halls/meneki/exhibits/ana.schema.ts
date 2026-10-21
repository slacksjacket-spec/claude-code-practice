// 抗核抗体の染色型（ana）のデータの形。絵は染色型から自動で描く
import { z } from "zod";
import { Meta } from "../../../engine/schema";
import { PATTERN_IDS } from "./ana.consts";

export const AnaData = z.object({
  stampAt: z.number().int().positive(),
  cases: z.array(Meta.extend({
    id: z.string(),
    story: z.string(),
    pattern: z.enum(PATTERN_IDS as [string, ...string[]]),
    followUp: z.object({ question: z.string(), options: z.array(z.string()).min(2), answer: z.number().int().nonnegative() }),
    explanation: z.string(),
  })).min(3),
}).superRefine((d, ctx) => {
  d.cases.forEach((c, i) => { if (c.followUp.answer >= c.followUp.options.length) ctx.addIssue({ code: "custom", message: "followUp.answer が範囲外", path: ["cases", i] }); });
});
export type AnaData = z.infer<typeof AnaData>;
