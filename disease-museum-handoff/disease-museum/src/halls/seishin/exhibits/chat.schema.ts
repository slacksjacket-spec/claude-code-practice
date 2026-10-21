// 問診チャット（chat）のデータの形。患者の言葉に、精神症状の用語をつける
import { z } from "zod";
import { Meta } from "../../../engine/schema";

export const ChatData = z.object({
  terms: z.array(z.string()).min(6),                    // まちがいの選択肢にも使う用語の一覧
  stampAt: z.number().int().positive(),                 // 合格した面接の通算回数
  rounds: z.array(Meta.extend({
    id: z.string(),
    who: z.string(),
    setting: z.string(),
    lines: z.array(z.object({ quote: z.string(), term: z.string(), note: z.string() })).min(3).max(6),
    diagnosis: z.object({ options: z.array(z.string()).min(2), answer: z.number().int().nonnegative(), explanation: z.string() }),
  })).min(3),
}).superRefine((d, ctx) => {
  d.rounds.forEach((r, i) => {
    r.lines.forEach((l, j) => { if (!d.terms.includes(l.term)) ctx.addIssue({ code: "custom", message: `terms にない ${l.term}`, path: ["rounds", i, "lines", j] }); });
    if (r.diagnosis.answer >= r.diagnosis.options.length) ctx.addIssue({ code: "custom", message: "diagnosis.answer が範囲外", path: ["rounds", i] });
  });
});
export type ChatData = z.infer<typeof ChatData>;
