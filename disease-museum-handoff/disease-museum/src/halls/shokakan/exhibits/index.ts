// このホール専用のゲーム（type: "Custom" の kind → モジュール）
import type { CustomModules } from "../../../engine/exhibits/types";
import { reveal } from "./reveal";
import { endoscopy } from "./endoscopy";
import { depth } from "./depth";
import { resection } from "./resection";
import { foodTimeline } from "./foodTimeline";
import { clueRace } from "./clueRace";

export const custom: CustomModules = { reveal, endoscopy, depth, resection, foodTimeline, clueRace };
