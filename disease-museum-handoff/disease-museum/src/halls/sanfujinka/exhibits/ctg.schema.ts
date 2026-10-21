// CTG読み（ctg）のデータの形。波形はパラメータから合成する（ctg.consts.ts）
import { z } from "zod";
import { Meta } from "../../../engine/schema";
import { DECEL_IDS } from "./ctg.consts";

export const CtgData = z.object({
  stampAt: z.number().int().positive(),
  cases: z.array(Meta.extend({
    id: z.string(),
    story: z.string(),
    baseline: z.number().int().min(60).max(200),
    variability: z.enum(["absent", "minimal", "moderate", "marked"]),
    accel: z.boolean(),
    decel: z.enum(DECEL_IDS as [string, ...string[]]),
    sinusoidal: z.boolean().optional(),
    followUp: z.object({ question: z.string(), options: z.array(z.string()).min(2), answer: z.number().int().nonnegative() }),
    explanation: z.string(),
  })).min(4),
}).superRefine((d, ctx) => {
  d.cases.forEach((c, i) => {
    if (c.followUp.answer >= c.followUp.options.length) ctx.addIssue({ code: "custom", message: "followUp.answer が範囲外", path: ["cases", i] });
    if (c.sinusoidal && c.decel !== "none") ctx.addIssue({ code: "custom", message: "サイナソイダルは一過性徐脈なしで作る", path: ["cases", i] });
  });
});
export type CtgData = z.infer<typeof CtgData>;
