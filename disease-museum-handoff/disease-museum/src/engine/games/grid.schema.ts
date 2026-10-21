// 分類マス（grid）のデータの形。所見から「どのマスか」を当て、続けて治療・対応を選ぶ（任意）
import { z } from "zod";
import { Meta } from "../schema";

export const GridData = z.object({
  rowLabels: z.array(z.string()).min(1),             // 縦の見出し（上から）
  colLabels: z.array(z.string()).min(1),             // 横の見出し（左から）
  cells: z.array(z.object({ id: z.string(), row: z.number().int().nonnegative(), col: z.number().int().nonnegative(), label: z.string(), sub: z.string().optional() })).min(2),
  question: z.string().optional(),                   // 既定「どのマス？」
  treatQuestion: z.string().optional(),              // 既定「治療は？」
  treatments: z.array(z.string()).min(2).optional(), // なければ①だけ
  stampAt: z.number().int().positive(),              // 通算この人数で（治療があれば両方）正解するとスタンプ
  cases: z.array(Meta.extend({
    id: z.string(),
    who: z.string(),
    signs: z.array(z.string()).min(1),
    cell: z.string(),
    treatment: z.number().int().nonnegative().optional(),
    explanation: z.string(),
  })).min(2),
}).superRefine((d, ctx) => {
  const ids = d.cells.map((c) => c.id);
  d.cells.forEach((c, i) => {
    if (c.row >= d.rowLabels.length || c.col >= d.colLabels.length) ctx.addIssue({ code: "custom", message: "row/col が見出しの範囲外", path: ["cells", i] });
  });
  d.cases.forEach((c, i) => {
    if (!ids.includes(c.cell)) ctx.addIssue({ code: "custom", message: `cells にない ${c.cell}`, path: ["cases", i] });
    if (d.treatments && (c.treatment === undefined || c.treatment >= d.treatments.length)) ctx.addIssue({ code: "custom", message: "treatment がない／範囲外", path: ["cases", i] });
  });
});
export type GridData = z.infer<typeof GridData>;
