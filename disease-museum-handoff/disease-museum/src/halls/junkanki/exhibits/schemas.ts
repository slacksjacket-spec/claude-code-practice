// このホール専用のゲームのデータの形（npm run check が検証に使う）
import { EcgDojoData } from "./ecgDojo.schema";
import { CalipersData } from "./calipers.schema";
import { TwelveData } from "./twelve.schema";
import { AxisDartsData } from "./axisDarts.schema";
import { HeartSoundsData } from "./heartSounds.schema";
import { CodeBlueData } from "./codeBlue.schema";
import { HfProfileData } from "./hfProfile.schema";

export const CUSTOM_SCHEMAS = {
  ecgDojo: EcgDojoData, calipers: CalipersData, twelve: TwelveData, axisDarts: AxisDartsData,
  heartSounds: HeartSoundsData, codeBlue: CodeBlueData, hfProfile: HfProfileData,
};
