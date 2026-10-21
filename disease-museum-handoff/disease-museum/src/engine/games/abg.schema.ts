// 血液ガス道場（abg）のデータの形。答え（アシデミアか、一次性の障害、代償、AG）は値から計算する
import { z } from "zod";
import { Meta } from "../schema";
import { PRIMARY, primaryOf } from "./abg.consts";

export const AbgData = z.object({
  stampAt: z.number().int().positive(),                 // 通算この数の症例を全部正解でスタンプ
  cases: z.array(Meta.extend({
    id: z.string(),
    story: z.string(),
    gas: z.object({ pH: z.number(), PaCO2: z.number(), HCO3: z.number(), PaO2: z.number().optional(), Na: z.number().optional(), Cl: z.number().optional() }),
    primary: z.enum(PRIMARY),                           // 値から計算した答えと一致するか検証する
    chronic: z.boolean().optional(),                    // 呼吸性のとき、慢性の代償で考える
    cause: z.object({ options: z.array(z.string()).min(2).max(5), answer: z.number().int().nonnegative() }),
    explanation: z.string(),
  })).min(3),
}).superRefine((d, ctx) => {
  d.cases.forEach((c, i) => {
    if (primaryOf(c.gas) !== c.primary) ctx.addIssue({ code: "custom", message: `値から読むと ${primaryOf(c.gas)}（データは ${c.primary}）`, path: ["cases", i] });
    if (c.cause.answer >= c.cause.options.length) ctx.addIssue({ code: "custom", message: "cause.answer が範囲外", path: ["cases", i] });
    const hco3 = 24 * 10 ** (c.gas.pH - 7.4) * (c.gas.PaCO2 / 40); // Henderson-Hasselbalch で値の整合性をざっと確かめる
    if (Math.abs(hco3 - c.gas.HCO3) > 3) ctx.addIssue({ code: "custom", message: `pH・PaCO₂ から計算した HCO₃⁻ は ${hco3.toFixed(1)}（データは ${c.gas.HCO3}）`, path: ["cases", i] });
  });
});
export type AbgData = z.infer<typeof AbgData>;
