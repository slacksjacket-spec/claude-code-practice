// 12誘導読影のデータの形
import { z } from "zod";
import { Meta } from "../../../engine/schema";
import { PATTERN_IDS } from "../ecg/ids";
import { PatternInfo } from "./ecgDojo.schema";

export const TwelveData = z.object({
  stampAt: z.number().int().positive(),
  territories: z.array(z.string()).min(2),               // ST上昇モードの答えの選択肢（部位・責任血管）
  stCases: z.array(Meta.extend({ pattern: z.enum(PATTERN_IDS), territory: z.string(), explanation: z.string() })).min(1),
  patterns: z.array(PatternInfo).min(4),                  // 所見当てモード
}).superRefine((d, ctx) => {
  d.stCases.forEach((c, i) => { if (!d.territories.includes(c.territory)) ctx.addIssue({ code: "custom", message: "territories にない答え", path: ["stCases", i] }); });
});
export type TwelveData = z.infer<typeof TwelveData>;
