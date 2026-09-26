// このホール専用のゲーム（type: "Custom" の kind → モジュール）
import type { CustomModules } from "../../../engine/exhibits/types";
import { ecgDojo } from "./ecgDojo";
import { calipers } from "./calipers";
import { twelve } from "./twelve";
import { axisDarts } from "./axisDarts";
import { heartSounds } from "./heartSounds";
import { codeBlue } from "./codeBlue";
import { hfProfile } from "./hfProfile";

export const custom: CustomModules = { ecgDojo, calipers, twelve, axisDarts, heartSounds, codeBlue, hfProfile };
