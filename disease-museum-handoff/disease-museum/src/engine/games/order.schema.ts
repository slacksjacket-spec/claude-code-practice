// 並べ替え（order）のデータの形
import { z } from "zod";
import { Meta } from "../schema";

export const OrderData = z.object({
  stampAt: z.number().int().positive(),              // 通算この問題数をノーミスで並べるとスタンプ
  cases: z.array(Meta.extend({
    id: z.string(),
    prompt: z.string(),                              // 「早い順に並べよう」など
    ends: z.tuple([z.string(), z.string()]).optional(), // 並びの両端の言葉（["早い", "遅い"]）
    items: z.array(z.string()).min(3).max(8),        // 正しい順
    explanation: z.string(),
  })).min(2),
}).superRefine((d, ctx) => {
  d.cases.forEach((c, i) => { if (new Set(c.items).size !== c.items.length) ctx.addIssue({ code: "custom", message: "items が重複", path: ["cases", i] }); });
});
export type OrderData = z.infer<typeof OrderData>;
