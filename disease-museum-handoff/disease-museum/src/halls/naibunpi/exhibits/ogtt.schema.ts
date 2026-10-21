// 糖負荷曲線（ogtt）のデータの形。answer は値から判定した区分と一致すること
import { z } from "zod";
import { Meta } from "../../../engine/schema";
import { ogttType } from "./ogtt.consts";

export const OgttData = z.object({
  stampAt: z.number().int().positive(),
  cases: z.array(Meta.extend({
    id: z.string(),
    who: z.string(),
    story: z.string(),
    glucose: z.array(z.number().positive()).length(4),         // 0・30・60・120分の血糖（mg/dL）
    insulin: z.array(z.number().nonnegative()).length(4).optional(), // 同じ時点のインスリン（μU/mL）
    hba1c: z.number().optional(),
    answer: z.enum(["normal", "border", "dm"]),
    followUp: z.object({ question: z.string(), options: z.array(z.string()).min(2), correct: z.number().int().nonnegative() }),
    explanation: z.string(),
  })).min(3),
}).superRefine((d, ctx) => {
  d.cases.forEach((c, i) => {
    if (ogttType(c.glucose[0], c.glucose[3]) !== c.answer) ctx.addIssue({ code: "custom", message: `値から判定すると ${ogttType(c.glucose[0], c.glucose[3])}`, path: ["cases", i] });
    if (c.followUp.correct >= c.followUp.options.length) ctx.addIssue({ code: "custom", message: "followUp.correct が範囲外", path: ["cases", i] });
  });
});
export type OgttData = z.infer<typeof OgttData>;
