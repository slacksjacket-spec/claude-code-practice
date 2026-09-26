// 食中毒の犯人さがしのデータの形
import { z } from "zod";
import { Meta } from "../../../engine/schema";

export const FoodTimelineData = z.object({
  organisms: z.array(Meta.extend({
    id: z.string(),
    name: z.string(),
    windowH: z.tuple([z.number().positive(), z.number().positive()]),  // 潜伏期（時間）
    note: z.string(),
  })).min(2),
  stampAt: z.number().int().positive(),
  cases: z.array(Meta.extend({
    id: z.string(),
    story: z.string(),
    onset: z.string(),                                // "月曜 15:00"
    meals: z.array(z.object({ label: z.string(), hoursBefore: z.number().positive() })).min(2),
    culprit: z.number().int().nonnegative(),          // meals の添字
    organism: z.string(),                             // organisms の id
    options: z.array(z.string()).min(2).max(4),       // 選択肢に出す organisms の id
    explanation: z.string(),
  })).min(1),
}).superRefine((d, ctx) => {
  const byId = new Map(d.organisms.map((o) => [o.id, o]));
  d.cases.forEach((c, i) => {
    const o = byId.get(c.organism), m = c.meals[c.culprit];
    if (!o) { ctx.addIssue({ code: "custom", message: `organisms にない ${c.organism}`, path: ["cases", i] }); return; }
    if (!m) { ctx.addIssue({ code: "custom", message: "culprit が meals の範囲外", path: ["cases", i] }); return; }
    if (m.hoursBefore < o.windowH[0] || m.hoursBefore > o.windowH[1]) ctx.addIssue({ code: "custom", message: `犯人の食事（${m.hoursBefore}時間前）が ${o.name} の潜伏期に入っていない`, path: ["cases", i] });
    if (!c.options.includes(c.organism)) ctx.addIssue({ code: "custom", message: "options に正解がない", path: ["cases", i] });
    for (const x of c.options) if (!byId.has(x)) ctx.addIssue({ code: "custom", message: `organisms にない ${x}`, path: ["cases", i] });
  });
});
export type FoodTimelineData = z.infer<typeof FoodTimelineData>;
