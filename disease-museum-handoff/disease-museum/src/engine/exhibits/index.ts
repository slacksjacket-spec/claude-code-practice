// 展示の型の登録表。型を実装したらここに足す。
import type { ExhibitType } from "../schema";
import type { ExhibitModule } from "./types";
import { DiagnosisLab } from "./diagnosisLab";
import { PathoSim } from "./pathoSim";
import { DecodePuzzle } from "./decodePuzzle";
import { AlgorithmBoard } from "./algorithmBoard";
import { EmergencySim } from "./emergencySim";
import { ScoreAttack } from "./scoreAttack";
import { VersusQuiz } from "./versusQuiz";
import { MemoryMatch } from "./memoryMatch";

// BodyHotspot（ver.1 の身体所見さがし）は、使うホールができたときに実装する
export const MODULES: { [K in ExhibitType]?: ExhibitModule<K> } = {
  DiagnosisLab, PathoSim, DecodePuzzle, AlgorithmBoard, EmergencySim, ScoreAttack, VersusQuiz, MemoryMatch,
};
