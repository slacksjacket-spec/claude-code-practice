// 視野と病変（visualField）のデータの形。視野の絵は病変から自動で描く（visualField.consts.ts）
import { z } from "zod";
import { Meta } from "../schema";
import { LESION_IDS } from "./visualField.consts";

const Lesion = z.enum(LESION_IDS as [string, ...string[]]);
export const VisualFieldData = z.object({
  stampAt: z.number().int().positive(),
  cases: z.array(Meta.extend({
    id: z.string(),
    story: z.string(),
    lesion: Lesion,
    followUp: z.object({ question: z.string(), options: z.array(z.string()).min(2), answer: z.number().int().nonnegative() }).optional(),
    explanation: z.string(),
  })).min(3),
}).superRefine((d, ctx) => {
  d.cases.forEach((c, i) => { if (c.followUp && c.followUp.answer >= c.followUp.options.length) ctx.addIssue({ code: "custom", message: "followUp.answer が範囲外", path: ["cases", i] }); });
});
export type VisualFieldData = z.infer<typeof VisualFieldData>;
