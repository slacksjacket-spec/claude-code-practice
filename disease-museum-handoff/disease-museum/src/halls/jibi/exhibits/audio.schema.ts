// オージオグラム（audiogram）のデータの形。answer は値から判定した型と一致すること
import { z } from "zod";
import { Meta } from "../../../engine/schema";
import { hlType } from "./audio.consts";

const dB = z.number().min(-10).max(120);
export const AudioData = z.object({
  stampAt: z.number().int().positive(),
  cases: z.array(Meta.extend({
    id: z.string(),
    story: z.string(),
    ear: z.enum(["R", "L"]),
    air: z.array(dB).length(7),     // 125〜8000 Hz
    bone: z.array(dB).length(5),    // 250〜4000 Hz
    answer: z.enum(["normal", "conductive", "sensorineural", "mixed"]),
    followUp: z.object({ question: z.string(), options: z.array(z.string()).min(2), answer: z.number().int().nonnegative() }),
    explanation: z.string(),
  })).min(4),
}).superRefine((d, ctx) => {
  d.cases.forEach((c, i) => {
    const t = hlType(c.air, c.bone);
    if (t !== c.answer) ctx.addIssue({ code: "custom", message: `値から判定すると ${t}`, path: ["cases", i] });
    if (c.followUp.answer >= c.followUp.options.length) ctx.addIssue({ code: "custom", message: "followUp.answer が範囲外", path: ["cases", i] });
  });
});
export type AudioData = z.infer<typeof AudioData>;
