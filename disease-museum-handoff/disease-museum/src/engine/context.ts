// 展示モジュールがエンジンに触る唯一の窓口
import type { Hall, ReviewItem } from "./schema";
import type { SaveState } from "./storage";
import type { beep, yay, ding, boo } from "./sound";

export interface Ctx {
  hall: Hall;
  st: SaveState;
  save(): void;
  /** 通算カウンタを進めて新しい値を返す（スタンプ条件などに使う） */
  prog(key: string, inc?: number): number;
  /** 正解のごほうび。コインと同額の XP、押した要素の上に「+n」 */
  award(n: number, el?: Element | null): void;
  addXp(n: number): void;
  /** まちがえた問題を収蔵庫へ（同じ id は重複しない） */
  miss(item: ReviewItem): void;
  stamp(exhibitId: string): void;
  /** トップバーや館内図のショートカットなど、状態の表示を更新する */
  refresh(): void;
  onRefresh(fn: () => void): void;
  toast(t: string): void;
  confetti(n: number): void;
  sound: { beep: typeof beep; yay: typeof yay; ding: typeof ding; boo: typeof boo };
  /** 正解・不正解の解説カード */
  feedback(el: Element, ok: boolean, title: string, bodyHtml: string): void;
  cheat: {
    /** 1ラウンドの始まりに呼ぶ */
    reset(exhibitId: string): void;
    /** 一度もカンペを開かずに正解したら「ノーカンペ +5」 */
    rewardIfUnpeeked(exhibitId: string, el?: Element | null): void;
  };
}
