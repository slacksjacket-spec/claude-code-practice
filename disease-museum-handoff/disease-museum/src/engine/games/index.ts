// 共通ゲーム：どのホールからも type: "Custom", kind: "<名前>" で使えるゲーム。
// ホール専用のゲーム（src/halls/<hall>/exhibits/）を別のホールでも使うようになったら、ここへ格上げする。
import type { CustomModules } from "../exhibits/types";
import { reveal } from "./reveal";
import { clueRace } from "./clueRace";
import { depth } from "./depth";
import { grid } from "./grid";
import { order } from "./order";
import { tapMap } from "./tapMap";
import { scenario } from "./scenario";

export const SHARED_GAMES: CustomModules = { reveal, clueRace, depth, grid, order, tapMap, scenario };
