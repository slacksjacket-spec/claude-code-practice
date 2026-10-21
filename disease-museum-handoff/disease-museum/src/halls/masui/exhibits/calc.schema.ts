// 輸液ポンプ計算（infusionCalc）のデータの形。答えは calc.consts.ts で計算する
import { z } from "zod";
import { Meta } from "../../../engine/schema";

export const CalcData = z.object({
  stampAt: z.number().int().positive(),
  cases: z.array(Meta.extend({
    id: z.string(),
    story: z.string(),
    question: z.string(),
    kind: z.enum(["maint", "daily", "drops", "freeWater", "naLimit"]),
    weight: z.number().positive().optional(),
    mlh: z.number().positive().optional(),
    set: z.union([z.literal(20), z.literal(60)]).optional(),
    na: z.number().optional(),
    tbwRatio: z.number().min(0.4).max(0.7).optional(),
    explanation: z.string(),
  })).min(4),
}).superRefine((d, ctx) => {
  const need: Record<string, string[]> = { maint: ["weight"], daily: ["weight"], drops: ["mlh", "set"], freeWater: ["weight", "na", "tbwRatio"], naLimit: ["na"] };
  d.cases.forEach((c, i) => need[c.kind].forEach((k) => { if ((c as Record<string, unknown>)[k] === undefined) ctx.addIssue({ code: "custom", message: `${c.kind} には ${k} が必要`, path: ["cases", i] }); }));
});
export type CalcData = z.infer<typeof CalcData>;
