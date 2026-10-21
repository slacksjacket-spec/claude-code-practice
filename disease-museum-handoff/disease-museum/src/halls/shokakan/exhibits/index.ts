// このホール専用のゲーム（type: "Custom" の kind → モジュール）
import type { CustomModules } from "../../../engine/exhibits/types";
import { endoscopy } from "./endoscopy";
import { resection } from "./resection";
import { foodTimeline } from "./foodTimeline";

export const custom: CustomModules = { endoscopy, resection, foodTimeline };
