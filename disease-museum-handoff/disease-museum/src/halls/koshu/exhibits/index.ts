// このホール専用のゲーム（type: "Custom" の kind → モジュール）。共通ゲームは登録しなくても使える
import type { CustomModules } from "../../../engine/exhibits/types";
import { cutoff } from "./cutoff";
import { epiCalc } from "./epi";

export const custom: CustomModules = { cutoff, epiCalc };
