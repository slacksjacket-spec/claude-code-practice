// 電気軸ダーツのデータの形
import { z } from "zod";
import { Meta } from "../../../engine/schema";

export const AxisDartsData = z.object({
  range: z.tuple([z.number(), z.number()]),              // 出題する軸の範囲（度）
  bands: z.array(z.object({ within: z.number().positive(), coins: z.number().int().nonnegative(), label: z.string() })).min(1), // 誤差ごとの得点（小さい順）
  stampWithin: z.number().positive(),                    // この誤差以内を…
  stampAt: z.number().int().positive(),                  // …通算この回数でスタンプ
  classes: z.array(Meta.extend({ label: z.string(), from: z.number(), to: z.number(), note: z.string() })).min(2), // 軸の分類（from 以上 to 未満、-180〜180）
}).superRefine((d, ctx) => {
  for (let a = -180; a < 180; a += 1) {
    const n = d.classes.filter((c) => a >= c.from && a < c.to).length;
    if (n !== 1) { ctx.addIssue({ code: "custom", message: `${a}°に当てはまる分類が ${n} 個`, path: ["classes"] }); break; }
  }
});
export type AxisDartsData = z.infer<typeof AxisDartsData>;
