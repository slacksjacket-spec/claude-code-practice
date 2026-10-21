// 輸血バッグ（transfusion）のデータの形。正解のバッグはルールから計算する（transfusion.consts.ts）
import { z } from "zod";
import { Meta } from "../../../engine/schema";

export const TransfusionData = z.object({
  stampAt: z.number().int().positive(),
  cases: z.array(Meta.extend({
    id: z.string(),
    story: z.string(),
    recipient: z.enum(["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+", "unknown"]),
    product: z.enum(["rbc", "ffp"]),
    explanation: z.string(),
  })).min(3),
});
export type TransfusionData = z.infer<typeof TransfusionData>;
