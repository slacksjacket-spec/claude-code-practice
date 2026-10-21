// 瞳孔ラボ（pupil）のデータの形。瞳孔の大きさは pattern と side から計算する
import { z } from "zod";
import { Meta } from "../../../engine/schema";

export const PupilData = z.object({
  stampAt: z.number().int().positive(),
  cases: z.array(Meta.extend({
    id: z.string(),
    story: z.string(),
    pattern: z.enum(["normal", "cn3", "horner", "adie", "rapd", "argyll", "physio"]),
    side: z.enum(["R", "L"]),
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
export type PupilData = z.infer<typeof PupilData>;
