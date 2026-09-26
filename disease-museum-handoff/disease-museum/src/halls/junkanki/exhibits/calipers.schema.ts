// キャリパー計測のデータの形
import { z } from "zod";
import { Meta } from "../../../engine/schema";

const Kind = z.enum(["hr", "pr", "qrs", "qt"]);
export const CalipersData = z.object({
  stampAt: z.number().int().positive(),                  // 通算この回数、計測と判定の両方が正解でスタンプ
  tasks: z.array(Meta.extend({
    kind: Kind,
    prompt: z.string(),                                  // 「PR間隔を測ろう（P波の始まり → QRSの始まり）」
    tolerance: z.number().positive(),                    // 計測の許容誤差（秒）
    values: z.array(z.number().positive()).min(2),       // 出題する真の値（hr は心拍数/分、ほかは秒）
    categories: z.array(z.object({ label: z.string(), min: z.number().optional(), max: z.number().optional() })).min(2), // 判定（hr は心拍数、ほかは秒で min 以上 max 未満）
    explanation: z.string(),
  })).min(1),
}).superRefine((d, ctx) => {
  d.tasks.forEach((t, i) => {
    for (const v of t.values) {
      const n = t.categories.filter((c) => (c.min === undefined || v >= c.min) && (c.max === undefined || v < c.max)).length;
      if (n !== 1) ctx.addIssue({ code: "custom", message: `値 ${v} に当てはまる判定が ${n} 個`, path: ["tasks", i] });
    }
  });
});
export type CalipersData = z.infer<typeof CalipersData>;
