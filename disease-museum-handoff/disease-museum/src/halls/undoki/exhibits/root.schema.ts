// 神経根レベル（root）のデータの形。所見は ROOTS から出す
import { z } from "zod";
import { Meta } from "../../../engine/schema";
import { ROOT_IDS } from "./root.consts";

export const RootData = z.object({
  stampAt: z.number().int().positive(),
  cases: z.array(Meta.extend({
    id: z.string(),
    story: z.string(),
    root: z.enum(ROOT_IDS as [string, ...string[]]),
    show: z.array(z.enum(["motor", "reflex", "sensory"])).min(1).optional(), // 見せる所見（既定は全部）
    followUp: z.object({ question: z.string(), options: z.array(z.string()).min(2), answer: z.number().int().nonnegative() }),
    explanation: z.string(),
  })).min(4),
}).superRefine((d, ctx) => {
  d.cases.forEach((c, i) => { if (c.followUp.answer >= c.followUp.options.length) ctx.addIssue({ code: "custom", message: "followUp.answer が範囲外", path: ["cases", i] }); });
});
export type RootData = z.infer<typeof RootData>;
