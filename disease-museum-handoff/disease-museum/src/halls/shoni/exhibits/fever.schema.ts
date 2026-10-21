// 熱型表（feverChart）のデータの形。1日ごとの最高体温と、発疹が出た日
import { z } from "zod";
import { Meta } from "../../../engine/schema";

export const FeverData = z.object({
  stampAt: z.number().int().positive(),
  cases: z.array(Meta.extend({
    id: z.string(),
    who: z.string(),
    temps: z.array(z.number().min(35).max(42)).min(4).max(12), // 第1病日から
    rashFrom: z.number().int().positive().optional(),           // 発疹が出た病日
    rash: z.string().optional(),                                // 発疹の様子
    signs: z.array(z.string()),
    options: z.array(z.string()).min(3),
    answer: z.number().int().nonnegative(),
    followUp: z.object({ question: z.string(), options: z.array(z.string()).min(2), answer: z.number().int().nonnegative() }),
    explanation: z.string(),
  })).min(3),
}).superRefine((d, ctx) => {
  d.cases.forEach((c, i) => {
    if (c.answer >= c.options.length) ctx.addIssue({ code: "custom", message: "answer が範囲外", path: ["cases", i] });
    if (c.followUp.answer >= c.followUp.options.length) ctx.addIssue({ code: "custom", message: "followUp.answer が範囲外", path: ["cases", i] });
    if (c.rashFrom && c.rashFrom > c.temps.length) ctx.addIssue({ code: "custom", message: "rashFrom が日数より後", path: ["cases", i] });
  });
});
export type FeverData = z.infer<typeof FeverData>;
