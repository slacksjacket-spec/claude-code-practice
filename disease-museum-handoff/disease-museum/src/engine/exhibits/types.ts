import type { Ctx } from "../context";
import type { Exhibit, ExhibitType } from "../schema";

/** 展示の型1つ = 1モジュール。root（展示カードの本文）に描画し、ctx 経由で共通機能を使う */
export interface ExhibitModule<T extends ExhibitType = ExhibitType> {
  mount(root: HTMLElement, ex: Extract<Exhibit, { type: T }>, ctx: Ctx): void;
}
