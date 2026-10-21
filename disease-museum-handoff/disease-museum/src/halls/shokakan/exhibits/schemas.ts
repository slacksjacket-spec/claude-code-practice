// このホール専用のゲームのデータの形（npm run check が検証に使う。zod を使うのでブラウザには読み込まない）
import { EndoscopyData } from "./endoscopy.schema";
import { ResectionData } from "./resection.schema";
import { FoodTimelineData } from "./foodTimeline.schema";

export const CUSTOM_SCHEMAS = {
  endoscopy: EndoscopyData,
  resection: ResectionData,
  foodTimeline: FoodTimelineData,
};
