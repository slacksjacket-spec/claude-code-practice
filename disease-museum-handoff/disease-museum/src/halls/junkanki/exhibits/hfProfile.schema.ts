// 心不全の4分類（Nohria-Stevenson）のデータの形
import { z } from "zod";
import { Meta } from "../../../engine/schema";

const Q = z.enum(["A", "B", "L", "C"]);
export const HfProfileData = z.object({
  quadrants: z.record(Q, z.object({ label: z.string(), sub: z.string() })),
  treatments: z.array(z.string()).min(2),
  stampAt: z.number().int().positive(),
  cases: z.array(Meta.extend({
    id: z.string(), who: z.string(),
    signs: z.array(z.string()).min(2),                     // 所見カード
    profile: Q,
    treatment: z.number().int().nonnegative(),
    explanation: z.string(),
  })).min(4),
}).superRefine((d, ctx) => {
  d.cases.forEach((c, i) => { if (c.treatment >= d.treatments.length) ctx.addIssue({ code: "custom", message: "treatments の範囲外", path: ["cases", i] }); });
});
export type HfProfileData = z.infer<typeof HfProfileData>;
