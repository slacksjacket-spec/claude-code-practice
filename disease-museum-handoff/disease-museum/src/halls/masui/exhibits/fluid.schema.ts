// 輸液のゆくえ（fluidSpace）のデータの形。分かれ方は fluid.consts.ts で計算する
import { z } from "zod";
import { Meta } from "../../../engine/schema";
import { PRODUCT_IDS } from "./fluid.consts";

export const FluidData = z.object({
  stampAt: z.number().int().positive(),
  cases: z.array(Meta.extend({
    id: z.string(),
    story: z.string(),
    product: z.enum(PRODUCT_IDS as [string, ...string[]]),
    followUp: z.object({ question: z.string(), options: z.array(z.string()).min(2), answer: z.number().int().nonnegative() }),
    explanation: z.string(),
  })).min(4),
}).superRefine((d, ctx) => {
  d.cases.forEach((c, i) => { if (c.followUp.answer >= c.followUp.options.length) ctx.addIssue({ code: "custom", message: "followUp.answer が範囲外", path: ["cases", i] }); });
});
export type FluidData = z.infer<typeof FluidData>;
