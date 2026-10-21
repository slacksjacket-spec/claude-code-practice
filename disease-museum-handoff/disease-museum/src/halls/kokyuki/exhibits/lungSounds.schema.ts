// 肺音ミキサーのデータの形
import { z } from "zod";
import { Meta } from "../../../engine/schema";
import { LUNG } from "./lungSounds.consts";

export const LungSoundsData = z.object({
  names: z.record(z.enum(LUNG), z.string()),           // 音の名前（「笛声音（wheezes）」など）
  stampAt: z.number().int().positive(),
  cases: z.array(Meta.extend({
    id: z.string(), profile: z.enum(LUNG), story: z.string(),
    disease: z.object({ options: z.array(z.string()).min(2).max(5), answer: z.number().int().nonnegative() }),
    explanation: z.string(),
  })).min(4),
}).superRefine((d, ctx) => {
  d.cases.forEach((c, i) => { if (c.disease.answer >= c.disease.options.length) ctx.addIssue({ code: "custom", message: "answer が範囲外", path: ["cases", i] }); });
});
export type LungSoundsData = z.infer<typeof LungSoundsData>;
