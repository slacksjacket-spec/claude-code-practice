// このホール専用のゲームのデータの形（npm run check が検証に使う）
import { FluidData } from "./fluid.schema";
import { CalcData } from "./calc.schema";
import { AirwayData } from "./airway.schema";
import { CapnoData } from "./capno.schema";

export const CUSTOM_SCHEMAS = { fluidSpace: FluidData, infusionCalc: CalcData, mallampati: AirwayData, capnogram: CapnoData };
