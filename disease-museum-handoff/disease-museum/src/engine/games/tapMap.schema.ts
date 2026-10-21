// 部位タップ（tapMap）のデータの形
import { z } from "zod";
import { Meta } from "../schema";

const Figure = z.object({
  viewBox: z.string(),
  ariaLabel: z.string(),
  svg: z.string(),                                     // 背景の絵（タップできない）
  regions: z.array(z.object({
    id: z.string(),
    label: z.string(),
    shape: z.string(),                                 // SVG の要素（<path d="…"/> や <circle …/>）。class="shape" はエンジンが付ける
  })).min(2),
  note: z.string().optional(),                         // 図の下の一言（「見る人の左が患者の右」など）
});

export const TapMapData = z.object({
  figures: z.record(z.string(), Figure),
  question: z.string().optional(),                     // 既定「どこ？」
  stampAt: z.number().int().positive(),
  cases: z.array(Meta.extend({
    id: z.string(),
    figure: z.string(),
    prompt: z.string(),
    signs: z.array(z.string()).optional(),
    answer: z.array(z.string()).min(1),                // 2つ以上なら、全部選んでから決定
    followUp: z.object({ question: z.string(), options: z.array(z.string()).min(2).max(6), answer: z.number().int().nonnegative() }).optional(),
    explanation: z.string(),
  })).min(2),
}).superRefine((d, ctx) => {
  d.cases.forEach((c, i) => {
    const f = d.figures[c.figure];
    if (!f) { ctx.addIssue({ code: "custom", message: `figures にない ${c.figure}`, path: ["cases", i] }); return; }
    for (const a of c.answer) if (!f.regions.some((r) => r.id === a)) ctx.addIssue({ code: "custom", message: `領域 ${a} がない`, path: ["cases", i] });
    if (c.followUp && c.followUp.answer >= c.followUp.options.length) ctx.addIssue({ code: "custom", message: "followUp.answer が範囲外", path: ["cases", i] });
  });
});
export type TapMapData = z.infer<typeof TapMapData>;
