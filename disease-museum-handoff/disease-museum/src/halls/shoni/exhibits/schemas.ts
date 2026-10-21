// このホール専用のゲームのデータの形（npm run check が検証に使う）
import { GrowthData } from "./growth.schema";
import { FeverData } from "./fever.schema";

export const CUSTOM_SCHEMAS = { growth: GrowthData, feverChart: FeverData };
