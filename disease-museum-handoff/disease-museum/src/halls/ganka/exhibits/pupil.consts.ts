// 瞳孔の大きさ（mm）を、病態と状況から決める。模式。TODO(review) 各病態の反応
export type Side = "R" | "L";
export type Pattern = "normal" | "cn3" | "horner" | "adie" | "rapd" | "argyll" | "physio";
export type State = "bright" | "dark" | "lightR" | "lightL" | "near";
export const STATE_LABEL: Record<State, string> = { bright: "明るい部屋", dark: "暗い部屋", lightR: "右眼に光", lightL: "左眼に光", near: "近くを見る" };
export const STATES = Object.keys(STATE_LABEL) as State[];

const N: Record<State, number> = { bright: 3, dark: 6, lightR: 2.5, lightL: 2.5, near: 2.5 };
/** [右眼, 左眼] の瞳孔径 */
export function pupils(p: Pattern, side: Side, s: State): [number, number] {
  const both = (v: number): [number, number] => [v, v];
  const set = (x: number, other: number): [number, number] => (side === "R" ? [x, other] : [other, x]);
  switch (p) {
    case "normal": return both(N[s]);
    case "cn3": return set(7, N[s]);                                    // 患側は散大して動かない
    case "horner": return set({ bright: 2.5, dark: 4, lightR: 2.2, lightL: 2.2, near: 2.2 }[s], N[s]); // 暗いところで差が開く
    case "adie": return set({ bright: 5, dark: 6.3, lightR: 4.8, lightL: 4.8, near: 3.2 }[s], N[s]);   // 光にほぼ反応せず、近見でゆっくり縮む
    case "rapd": {                                                       // 患側に光を当てると両眼とも縮みが弱い
      const affected = side === "R" ? "lightR" : "lightL";
      return both(s === affected ? 4.6 : N[s]);
    }
    case "argyll": return both({ bright: 2, dark: 2.4, lightR: 2, lightL: 2, near: 1.5 }[s]);          // 縮瞳、対光反射なし、輻輳反射あり
    case "physio": return set(N[s] + 0.6, N[s]);                         // 明暗で差が変わらない
  }
}
export const ptosis = (p: Pattern) => (p === "cn3" ? 0.8 : p === "horner" ? 0.25 : 0);
