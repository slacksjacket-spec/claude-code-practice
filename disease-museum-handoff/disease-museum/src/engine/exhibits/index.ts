// 展示の型の登録表。型を実装したらここに足す。
import type { ExhibitType } from "../schema";
import type { ExhibitModule } from "./types";
import { Placeholder } from "./placeholder";

export const MODULES: { [K in ExhibitType]?: ExhibitModule<K> } = {
  Placeholder,
};
