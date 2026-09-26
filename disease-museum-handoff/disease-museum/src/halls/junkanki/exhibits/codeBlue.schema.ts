// コードブルーのデータの形
import { z } from "zod";
import { Meta } from "../../../engine/schema";
import { RHYTHM_IDS } from "../ecg/ids";

export const CodeBlueData = z.object({
  maxMistakes: z.number().int().nonnegative(),           // この数までのミスならシナリオクリア
  stampAt: z.number().int().positive(),                  // 通算この数のシナリオクリアでスタンプ
  scenarios: z.array(Meta.extend({
    id: z.string(),
    title: z.string(),
    patient: z.string(),
    steps: z.array(z.object({
      rhythm: z.enum(RHYTHM_IDS).optional(),             // モニターに映す調律（なし＝まだ付けていない）
      vitals: z.string(),
      situation: z.string(),
      options: z.array(z.string()).min(2).max(5),
      answer: z.number().int().nonnegative(),
      explanation: z.string(),
    })).min(2),
  })).min(1),
}).superRefine((d, ctx) => {
  d.scenarios.forEach((s, i) => s.steps.forEach((st, j) => { if (st.answer >= st.options.length) ctx.addIssue({ code: "custom", message: "answer が options の範囲外", path: ["scenarios", i, "steps", j] }); }));
});
export type CodeBlueData = z.infer<typeof CodeBlueData>;
