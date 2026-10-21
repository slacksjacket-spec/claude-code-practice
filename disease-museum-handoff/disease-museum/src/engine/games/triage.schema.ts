// トリアージ（triage）のデータの形。色は START 法で計算する（triage.consts.ts）
import { z } from "zod";
import { Meta } from "../schema";

export const TriageData = z.object({
  roundSize: z.number().int().min(3),             // 1回の傷病者の人数
  passScore: z.number().int().positive(),         // 何人正しければ合格か
  stampAt: z.number().int().positive(),           // 合格の通算回数
  patients: z.array(Meta.extend({
    id: z.string(),
    desc: z.string(),                              // 見た様子（数字も含めて書く）
    walks: z.boolean(), breathes: z.boolean(), rr: z.number().int().nonnegative(),
    radial: z.boolean(), crt: z.number().nonnegative(), obeys: z.boolean(),
  })).min(6),
}).superRefine((d, ctx) => {
  if (d.roundSize > d.patients.length) ctx.addIssue({ code: "custom", message: "roundSize が人数より多い", path: ["roundSize"] });
  if (d.passScore > d.roundSize) ctx.addIssue({ code: "custom", message: "passScore が roundSize より多い", path: ["passScore"] });
});
export type TriageData = z.infer<typeof TriageData>;
