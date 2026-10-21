// 2×2表の計算（epiCalc）のデータの形。研究デザインで計算してよい指標を検証する
import { z } from "zod";
import { Meta } from "../../../engine/schema";
import { ALLOWED, type Ask, type Design } from "./epi.consts";

export const EpiData = z.object({
  stampAt: z.number().int().positive(),
  cases: z.array(Meta.extend({
    id: z.string(),
    story: z.string(),
    design: z.enum(["cohort", "rct", "casecontrol", "test"]),
    table: z.array(z.number().int().positive()).length(4),
    ask: z.enum(["rr", "or", "ard", "nnt", "sens", "spec", "ppv", "npv"]),
    explanation: z.string(),
  })).min(4),
}).superRefine((d, ctx) => {
  d.cases.forEach((c, i) => { if (!ALLOWED[c.design as Design].includes(c.ask as Ask)) ctx.addIssue({ code: "custom", message: `${c.design} では ${c.ask} は計算しない`, path: ["cases", i] }); });
});
export type EpiData = z.infer<typeof EpiData>;
