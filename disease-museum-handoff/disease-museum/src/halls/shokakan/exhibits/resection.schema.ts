// 切除範囲をなぞるのデータの形
import { z } from "zod";
import { Meta } from "../../../engine/schema";
import { SEGMENTS } from "./resection.consts";
export { SEGMENTS };


export const ResectionData = z.object({
  labels: z.record(z.enum(SEGMENTS), z.string()),              // 区間の名前
  procedures: z.array(z.object({ name: z.string(), segments: z.array(z.enum(SEGMENTS)).min(1), note: z.string().optional() })).min(2),
  stampAt: z.number().int().positive(),
  cases: z.array(Meta.extend({
    id: z.string(),
    lesion: z.array(z.enum(SEGMENTS)).min(1),                   // 病変のある区間（図に描く）
    kind: z.enum(["tumor", "inflammation", "stricture"]),
    card: z.record(z.string(), z.string()),
    answer: z.string(),                                         // procedures の name
    explanation: z.string(),
  })).min(1),
}).superRefine((d, ctx) => {
  for (const s of SEGMENTS) if (!d.labels[s]) ctx.addIssue({ code: "custom", message: `labels に ${s} がない`, path: ["labels"] });
  const key = (a: readonly string[]) => [...a].sort().join(",");
  const keys = d.procedures.map((p) => key(p.segments));
  keys.forEach((k, i) => { if (keys.indexOf(k) !== i) ctx.addIssue({ code: "custom", message: "同じ範囲の術式が2つある", path: ["procedures", i] }); });
  d.cases.forEach((c, i) => {
    const p = d.procedures.find((x) => x.name === c.answer);
    if (!p) { ctx.addIssue({ code: "custom", message: `procedures にない術式 ${c.answer}`, path: ["cases", i] }); return; }
    if (c.kind !== "inflammation" && !c.lesion.every((s) => p.segments.includes(s))) ctx.addIssue({ code: "custom", message: "病変が切除範囲に入っていない", path: ["cases", i] });
  });
});
export type ResectionData = z.infer<typeof ResectionData>;
