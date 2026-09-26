// 内視鏡ランのデータの形
import { z } from "zod";
import { Meta } from "../../../engine/schema";
import { LOOKS } from "./endoscopy.consts";
export { LOOKS };


export const EndoscopyData = z.object({
  segments: z.array(z.string()).min(1),              // 内視鏡が進む順（"食道" → "胃" → "十二指腸"）
  actions: z.array(z.string()).min(2),
  runLength: z.number().int().positive(),            // 1回の検査で出会う病変の数
  passScore: z.number().int().positive(),            // この数以上正解でその回をクリア（スタンプ）
  lesions: z.array(Meta.extend({
    id: z.string(),
    segment: z.string(),
    look: z.enum(LOOKS),                             // 内視鏡像の描き方
    finding: z.string(),
    answer: z.number().int().nonnegative(),
    alt: z.array(z.number().int()).optional(),
    explanation: z.string(),
  })).min(1),
}).superRefine((d, ctx) => {
  d.lesions.forEach((l, i) => {
    if (!d.segments.includes(l.segment)) ctx.addIssue({ code: "custom", message: `segments にない場所 ${l.segment}`, path: ["lesions", i] });
    for (const a of [l.answer, ...(l.alt ?? [])]) if (a >= d.actions.length) ctx.addIssue({ code: "custom", message: "actions の範囲外", path: ["lesions", i] });
  });
  if (d.runLength > d.lesions.length) ctx.addIssue({ code: "custom", message: "runLength が lesions より多い", path: ["runLength"] });
  if (d.passScore > d.runLength) ctx.addIssue({ code: "custom", message: "passScore が runLength より多い", path: ["passScore"] });
});
export type EndoscopyData = z.infer<typeof EndoscopyData>;
