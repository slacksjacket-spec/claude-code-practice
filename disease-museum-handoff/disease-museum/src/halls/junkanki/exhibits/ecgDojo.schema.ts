// 心電図道場のデータの形
import { z } from "zod";
import { Meta } from "../../../engine/schema";
import { RHYTHM_IDS, PATTERN_IDS } from "../ecg/ids";

export const Info = Meta.extend({ name: z.string(), clue: z.string(), explanation: z.string() });
export const RhythmInfo = Info.extend({ id: z.enum(RHYTHM_IDS) });
export const PatternInfo = Info.extend({ id: z.enum(PATTERN_IDS) });

export const EcgDojoData = z.object({
  rhythms: z.array(RhythmInfo).min(5),
  patterns: z.array(PatternInfo).min(3),                  // 模擬検定に混ぜる12誘導
  levels: z.array(z.object({ id: z.string(), label: z.string(), rhythms: z.array(z.enum(RHYTHM_IDS)).min(4) })).min(1),
  roundSize: z.number().int().positive(),
  passScore: z.number().int().positive(),
  stampFromLevel: z.number().int().nonnegative(),          // この段位以上のクリアでスタンプ
  exam: z.object({ rhythms: z.number().int().positive(), patterns: z.number().int().nonnegative(), timeSec: z.number().positive(), pass: z.number().int().positive() }),
}).superRefine((d, ctx) => {
  const ids = d.rhythms.map((r) => r.id);
  for (const id of RHYTHM_IDS) if (!ids.includes(id)) ctx.addIssue({ code: "custom", message: `rhythms に ${id} の説明がない`, path: ["rhythms"] });
  d.levels.forEach((l, i) => { if (l.rhythms.length < d.roundSize / 2) ctx.addIssue({ code: "custom", message: "段位の調律が少なすぎる", path: ["levels", i] }); });
  if (d.stampFromLevel >= d.levels.length) ctx.addIssue({ code: "custom", message: "stampFromLevel が範囲外", path: ["stampFromLevel"] });
  if (d.exam.pass > d.exam.rhythms + d.exam.patterns) ctx.addIssue({ code: "custom", message: "exam.pass が問題数より多い", path: ["exam"] });
});
export type EcgDojoData = z.infer<typeof EcgDojoData>;
