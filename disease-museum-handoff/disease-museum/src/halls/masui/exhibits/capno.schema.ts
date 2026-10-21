// カプノグラム（capnogram）のデータの形
import { z } from "zod";
import { Meta } from "../../../engine/schema";

export const CapnoData = z.object({
  stampAt: z.number().int().positive(),
  cases: z.array(Meta.extend({
    id: z.string(),
    story: z.string(),
    pattern: z.enum(["normal", "esophageal", "bronchospasm", "rebreathing", "mh", "hypovent", "hypervent", "disconnect", "rosc", "cleft"]),
    options: z.array(z.string()).min(3),
    answer: z.number().int().nonnegative(),
    followUp: z.object({ question: z.string(), options: z.array(z.string()).min(2), answer: z.number().int().nonnegative() }),
    explanation: z.string(),
  })).min(4),
}).superRefine((d, ctx) => {
  d.cases.forEach((c, i) => {
    if (c.answer >= c.options.length) ctx.addIssue({ code: "custom", message: "answer が範囲外", path: ["cases", i] });
    if (c.followUp.answer >= c.followUp.options.length) ctx.addIssue({ code: "custom", message: "followUp.answer が範囲外", path: ["cases", i] });
  });
});
export type CapnoData = z.infer<typeof CapnoData>;
