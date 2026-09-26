// 早押し問診のデータの形
import { z } from "zod";
import { Meta } from "../../../engine/schema";
import { REGIONS } from "./clueRace.consts";
export { REGIONS };

// 腹部9区分（見る人の左が患者の右）
const Region = z.enum(REGIONS);

export const ClueRaceData = z.object({
  regionLabels: z.record(Region, z.string()),
  stampAt: z.number().int().positive(),                  // 通算この症例数を…
  stampMaxCards: z.number().int().positive(),            // …この枚数以内で正解するとスタンプ
  cases: z.array(Meta.extend({
    id: z.string(),
    answer: z.string(),
    options: z.array(z.string()).min(3).max(6),
    clues: z.array(z.union([
      z.object({ kind: z.literal("pain"), label: z.string(), regions: z.array(Region).min(1), text: z.string() }), // regions は痛みの移り変わりの順
      z.object({ kind: z.literal("text"), label: z.string(), text: z.string() }),
    ])).min(3),
    explanation: z.string(),
  })).min(1),
}).superRefine((d, ctx) => {
  for (const r of REGIONS) if (!d.regionLabels[r]) ctx.addIssue({ code: "custom", message: `regionLabels に ${r} がない`, path: ["regionLabels"] });
  d.cases.forEach((c, i) => { if (!c.options.includes(c.answer)) ctx.addIssue({ code: "custom", message: "options に answer がない", path: ["cases", i] }); });
});
export type ClueRaceData = z.infer<typeof ClueRaceData>;
