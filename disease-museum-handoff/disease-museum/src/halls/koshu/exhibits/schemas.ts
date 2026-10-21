// このホール専用のゲームのデータの形（npm run check が検証に使う）
import { CutoffData } from "./cutoff.schema";
import { EpiData } from "./epi.schema";

export const CUSTOM_SCHEMAS = { cutoff: CutoffData, epiCalc: EpiData };
