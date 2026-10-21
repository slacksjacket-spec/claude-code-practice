// 共通ゲームのデータの形（npm run check が使う。ブラウザには読み込まない）
import { RevealData } from "./reveal.schema";
import { ClueRaceData } from "./clueRace.schema";
import { DepthData } from "./depth.schema";
import { GridData } from "./grid.schema";
import { OrderData } from "./order.schema";
import { TapMapData } from "./tapMap.schema";
import { ScenarioData } from "./scenario.schema";
import { AbgData } from "./abg.schema";
import { MicroscopeData } from "./microscope.schema";
import { AxisData } from "./axis.schema";

export const SHARED_SCHEMAS = { reveal: RevealData, clueRace: ClueRaceData, depth: DepthData, grid: GridData, order: OrderData, tapMap: TapMapData, scenario: ScenarioData, abg: AbgData, microscope: MicroscopeData, axis: AxisData };
