// 抗菌薬スペクトラム（spectrum）のデータの形。薬ごとに「効く菌」を並べる
import { z } from "zod";
import { Meta } from "../../../engine/schema";

export const SpectrumData = z.object({
  bugs: z.array(z.object({ id: z.string(), label: z.string(), sub: z.string().optional() })).min(4).max(10),
  stampAt: z.number().int().positive(),
  drugs: z.array(Meta.extend({
    id: z.string(),
    name: z.string(),
    klass: z.string(),                // 系統（例：セフェム系 第3世代）
    covers: z.array(z.string()).min(1),
    note: z.string(),                 // 解説
  })).min(4),
}).superRefine((d, ctx) => {
  const ids = d.bugs.map((b) => b.id);
  d.drugs.forEach((x, i) => x.covers.forEach((c) => { if (!ids.includes(c)) ctx.addIssue({ code: "custom", message: `bugs にない ${c}`, path: ["drugs", i] }); }));
});
export type SpectrumData = z.infer<typeof SpectrumData>;
