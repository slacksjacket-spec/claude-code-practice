// 深達度タップのデータの形
import { z } from "zod";
import { Meta } from "../schema";

export const DepthData = z.object({
  organs: z.record(z.string(), z.object({
    name: z.string(),                                            // "胃"
    layers: z.array(z.object({ id: z.string(), label: z.string() })).min(2), // 内腔側から順に
  })),
  lesionLabel: z.string().optional(),                            // 既定「がん」（熱傷なら「損傷」など）
  topLabel: z.string().optional(),
  hideLesion: z.boolean().optional(),                            // true なら断面に病変を描かない（所見だけで深さを当てる）                               // 図の上の説明。既定「↑ 内腔（粘膜の表面）」
  treatments: z.array(z.string()).min(2),
  stampAt: z.number().int().positive(),                          // 通算この症例数を両方正解でスタンプ
  cases: z.array(Meta.extend({
    id: z.string(),
    organ: z.string(),
    card: z.record(z.string(), z.string()),                      // 組織型・大きさ・潰瘍など
    depth: z.string(),                                           // layers の id
    treatment: z.number().int().nonnegative(),
    explanation: z.string(),
  })).min(1),
}).superRefine((d, ctx) => {
  d.cases.forEach((c, i) => {
    const o = d.organs[c.organ];
    if (!o) { ctx.addIssue({ code: "custom", message: `organs にない臓器 ${c.organ}`, path: ["cases", i] }); return; }
    if (!o.layers.some((l) => l.id === c.depth)) ctx.addIssue({ code: "custom", message: `層 ${c.depth} がない`, path: ["cases", i] });
    if (c.treatment >= d.treatments.length) ctx.addIssue({ code: "custom", message: "treatments の範囲外", path: ["cases", i] });
  });
});
export type DepthData = z.infer<typeof DepthData>;
