// このホール専用のゲームのデータの形（npm run check が検証に使う。zod を使うのでブラウザには読み込まない）
import { RevealData } from "./reveal.schema";
import { EndoscopyData } from "./endoscopy.schema";
import { DepthData } from "./depth.schema";
import { ResectionData } from "./resection.schema";
import { FoodTimelineData } from "./foodTimeline.schema";
import { ClueRaceData } from "./clueRace.schema";

export const CUSTOM_SCHEMAS = {
  reveal: RevealData,
  endoscopy: EndoscopyData,
  depth: DepthData,
  resection: ResectionData,
  foodTimeline: FoodTimelineData,
  clueRace: ClueRaceData,
};
