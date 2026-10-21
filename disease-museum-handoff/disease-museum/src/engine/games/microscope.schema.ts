// 顕微鏡で探せ（microscope）のデータの形
import { z } from "zod";
import { Meta } from "../schema";

export const MicroscopeData = z.object({
  title: z.string(),                                       // 視野の名前（「尿沈渣（強拡大）」など）
  background: z.string().optional(),                       // 視野の背景色
  sprites: z.record(z.string(), z.object({ label: z.string(), svg: z.string() })), // (0,0) を中心に半径12くらいで描いた絵
  stampAt: z.number().int().positive(),
  cases: z.array(Meta.extend({
    id: z.string(),
    story: z.string(),
    crowd: z.array(z.object({ sprite: z.string(), n: z.number().int().positive() })), // 背景にまぎれる物
    target: z.object({ sprite: z.string(), n: z.number().int().positive().max(6) }),  // 探す物
    question: z.string(),
    options: z.array(z.string()).min(2).max(5),
    answer: z.number().int().nonnegative(),
    explanation: z.string(),
  })).min(3),
}).superRefine((d, ctx) => {
  d.cases.forEach((c, i) => {
    for (const s of [...c.crowd.map((x) => x.sprite), c.target.sprite]) if (!d.sprites[s]) ctx.addIssue({ code: "custom", message: `sprites にない ${s}`, path: ["cases", i] });
    if (c.crowd.some((x) => x.sprite === c.target.sprite)) ctx.addIssue({ code: "custom", message: "探す物が背景にも入っている", path: ["cases", i] });
    if (c.answer >= c.options.length) ctx.addIssue({ code: "custom", message: "answer が範囲外", path: ["cases", i] });
  });
});
export type MicroscopeData = z.infer<typeof MicroscopeData>;
