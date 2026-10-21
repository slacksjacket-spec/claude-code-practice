// ホルモン軸（axis）のデータの形。視床下部→下垂体→標的臓器の各ホルモンを ↑・→・↓ で予想し、障害の場所（原因）を答える
import { z } from "zod";
import { Meta } from "../schema";

export const Dir = z.enum(["up", "nl", "down"]);
export const AxisData = z.object({
  axes: z.record(z.string(), z.object({
    title: z.string(),                                        // 例：視床下部-下垂体-副腎皮質系
    levels: z.array(z.object({ id: z.string(), organ: z.string(), hormone: z.string() })).min(2).max(4), // 上から
  })),
  stampAt: z.number().int().positive(),                       // 矢印も原因も正解を通算この回数でスタンプ
  cases: z.array(Meta.extend({
    id: z.string(),
    axis: z.string(),
    who: z.string(),
    story: z.string(),
    given: z.record(z.string(), Dir),                         // 最初から見えている検査値（answer と一致すること）
    answer: z.record(z.string(), Dir),                        // 全レベルの正解
    question: z.string().optional(),                          // 既定「原因は？」
    options: z.array(z.string()).min(2),
    correct: z.number().int().nonnegative(),
    explanation: z.string(),
  })).min(2),
}).superRefine((d, ctx) => {
  d.cases.forEach((c, i) => {
    const ax = d.axes[c.axis];
    if (!ax) { ctx.addIssue({ code: "custom", message: `axes にない ${c.axis}`, path: ["cases", i] }); return; }
    const ids = ax.levels.map((l) => l.id);
    ids.forEach((id) => { if (!c.answer[id]) ctx.addIssue({ code: "custom", message: `answer に ${id} がない`, path: ["cases", i] }); });
    Object.keys(c.answer).forEach((id) => { if (!ids.includes(id)) ctx.addIssue({ code: "custom", message: `levels にない ${id}`, path: ["cases", i] }); });
    Object.entries(c.given).forEach(([id, v]) => { if (c.answer[id] !== v) ctx.addIssue({ code: "custom", message: `given の ${id} が answer と違う`, path: ["cases", i] }); });
    if (Object.keys(c.given).length >= ids.length) ctx.addIssue({ code: "custom", message: "全部 given だと予想するものがない", path: ["cases", i] });
    if (c.correct >= c.options.length) ctx.addIssue({ code: "custom", message: "correct が範囲外", path: ["cases", i] });
  });
});
export type AxisData = z.infer<typeof AxisData>;
