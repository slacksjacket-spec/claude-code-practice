// このホール専用のゲーム（type: "Custom" の kind → モジュール）。共通ゲームは登録しなくても使える
import type { CustomModules } from "../../../engine/exhibits/types";
import { audiogram } from "./audio";

export const custom: CustomModules = { audiogram };
