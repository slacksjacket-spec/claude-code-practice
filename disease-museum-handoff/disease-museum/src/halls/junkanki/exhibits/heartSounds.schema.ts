// 心音オーケストラのデータの形
import { z } from "zod";
import { Meta } from "../../../engine/schema";
import { PROFILES, AREAS } from "./heartSounds.consts";

export const HeartSoundsData = z.object({
  areaLabels: z.record(z.enum(AREAS), z.string()),
  stampAt: z.number().int().positive(),
  cases: z.array(Meta.extend({
    id: z.string(),
    profile: z.enum(PROFILES),                       // 音と心音図の形
    name: z.string(),
    area: z.enum(AREAS),                             // いちばんよく聴こえる場所
    story: z.string(),
    explanation: z.string(),
  })).min(4),
});
export type HeartSoundsData = z.infer<typeof HeartSoundsData>;
