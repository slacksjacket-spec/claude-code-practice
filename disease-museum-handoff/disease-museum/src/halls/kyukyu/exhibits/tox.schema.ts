// トキシドローム（toxidrome）のデータの形
import { z } from "zod";
import { Meta } from "../../../engine/schema";
import { TOX_IDS } from "./tox.consts";

export const ToxData = z.object({
  stampAt: z.number().int().positive(),
  cases: z.array(Meta.extend({
    id: z.string(),
    story: z.string(),
    vitals: z.object({ HR: z.number(), BP: z.string(), RR: z.number(), T: z.number() }),
    pupils: z.enum(["miosis", "mydriasis", "normal"]),
    skin: z.enum(["dry", "wet", "normal"]),
    bowel: z.enum(["up", "down", "normal"]),
    mental: z.string(),
    answer: z.enum(TOX_IDS as [string, ...string[]]),
    followUp: z.object({ question: z.string(), options: z.array(z.string()).min(2), answer: z.number().int().nonnegative() }),
    explanation: z.string(),
  })).min(4),
}).superRefine((d, ctx) => {
  d.cases.forEach((c, i) => { if (c.followUp.answer >= c.followUp.options.length) ctx.addIssue({ code: "custom", message: "followUp.answer が範囲外", path: ["cases", i] }); });
});
export type ToxData = z.infer<typeof ToxData>;
