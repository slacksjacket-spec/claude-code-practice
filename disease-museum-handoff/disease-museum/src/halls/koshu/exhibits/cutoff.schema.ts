// カットオフ（cutoff）のデータの形。目標を満たすカットオフがあることを検証する
import { z } from "zod";
import { Meta } from "../../../engine/schema";
import { best } from "./cutoff.consts";

const M4 = z.enum(["sens", "spec", "ppv", "npv"]);
export const CutoffData = z.object({
  stampAt: z.number().int().positive(),
  cases: z.array(Meta.extend({
    id: z.string(),
    story: z.string(),
    testName: z.string(),
    dist: z.object({ mu1: z.number(), s1: z.number().positive(), mu0: z.number(), s0: z.number().positive(), prev: z.number().gt(0).lt(1) }),
    need: M4, min: z.number().gt(0).lt(1), maximize: M4,
    followUp: z.object({ question: z.string(), options: z.array(z.string()).min(2), answer: z.number().int().nonnegative() }),
    explanation: z.string(),
  })).min(3),
}).superRefine((d, ctx) => {
  d.cases.forEach((c, i) => {
    if (!best(c.dist, c.need, c.min, c.maximize)) ctx.addIssue({ code: "custom", message: "目標を満たすカットオフがない", path: ["cases", i] });
    if (c.need === c.maximize) ctx.addIssue({ code: "custom", message: "need と maximize が同じ", path: ["cases", i] });
    if (c.followUp.answer >= c.followUp.options.length) ctx.addIssue({ code: "custom", message: "followUp.answer が範囲外", path: ["cases", i] });
  });
});
export type CutoffData = z.infer<typeof CutoffData>;
