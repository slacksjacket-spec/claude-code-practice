// 診断基準チェック（criteria）のデータの形。所見のうち基準に入るものを全部選び、そのうえで判断する
import { z } from "zod";
import { Meta } from "../schema";

export const CriteriaData = z.object({
  stampAt: z.number().int().positive(),
  cases: z.array(Meta.extend({
    id: z.string(),
    who: z.string(),
    criteria: z.string(),                                         // 基準の名前（例：川崎病の主要症状）
    items: z.array(z.object({ text: z.string(), counts: z.boolean() })).min(3).max(10),
    question: z.string(),
    options: z.array(z.string()).min(2),
    answer: z.number().int().nonnegative(),
    explanation: z.string(),
  })).min(2),
}).superRefine((d, ctx) => {
  d.cases.forEach((c, i) => {
    if (c.answer >= c.options.length) ctx.addIssue({ code: "custom", message: "answer が範囲外", path: ["cases", i] });
    if (!c.items.some((x) => x.counts)) ctx.addIssue({ code: "custom", message: "基準に入る所見が1つもない", path: ["cases", i] });
  });
});
export type CriteriaData = z.infer<typeof CriteriaData>;
