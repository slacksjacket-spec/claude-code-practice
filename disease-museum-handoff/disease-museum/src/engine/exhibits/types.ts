import type { Ctx } from "../context";
import type { ExhibitOf, ExhibitType } from "../schema";

/** 展示の型1つ = 1モジュール。root（展示カードの本文）に描画し、ctx 経由で共通機能を使う。
 *  同じ型の展示が1ホールに複数あってもよいように、要素は root の中だけで探す（id を使わない）。 */
export interface ExhibitModule<T extends ExhibitType = ExhibitType> {
  mount(root: HTMLElement, ex: ExhibitOf<T>, ctx: Ctx): void;
}

/** ホール専用のゲーム（type: "Custom"）。D はそのゲームの <kind>.schema.ts から z.infer した型 */
export interface CustomModule<D = unknown> {
  mount(root: HTMLElement, ex: Omit<ExhibitOf<"Custom">, "data"> & { data: D }, ctx: Ctx): void;
}
export type CustomModules = Record<string, CustomModule<any>>; // eslint-disable-line @typescript-eslint/no-explicit-any

/** 選択肢の正解＋ほかから2つ（収蔵庫に送る形） */
export function missOpts(ans: string, all: readonly string[], shuffle: <T>(a: readonly T[]) => T[]) {
  return shuffle([ans, ...shuffle(all.filter((x) => x !== ans)).slice(0, 2)]);
}
