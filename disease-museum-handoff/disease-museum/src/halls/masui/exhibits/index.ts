// このホール専用のゲーム（type: "Custom" の kind → モジュール）。共通ゲームは登録しなくても使える
import type { CustomModules } from "../../../engine/exhibits/types";
import { fluidSpace } from "./fluid";
import { infusionCalc } from "./calc";
import { mallampati } from "./airway";
import { capnogram } from "./capno";

export const custom: CustomModules = { fluidSpace, infusionCalc, mallampati, capnogram };
