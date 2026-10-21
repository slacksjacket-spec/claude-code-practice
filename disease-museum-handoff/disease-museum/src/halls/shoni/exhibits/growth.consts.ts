// 成長曲線の帯（模式。実在の成長曲線の値ではない）。TODO(review) 形が典型に見えるか
export const AGES = [2, 4, 6, 8, 10, 12, 14, 16, 18];
export const H_MEAN = [87, 102, 115, 127, 138, 150, 163, 169, 171];
export const H_SD = [3.3, 4, 4.8, 5.3, 5.8, 7.5, 7, 5.8, 5.8];
export const W_MEAN = [12, 16, 20.5, 26, 33, 41, 52, 59, 62];
export const W_SD = [1.3, 2, 2.8, 4, 6, 8, 9, 9, 9];
/** 年齢での値を線形補間 */
export function at(arr: number[], age: number) {
  if (age <= AGES[0]) return arr[0];
  for (let i = 1; i < AGES.length; i++) if (age <= AGES[i]) { const f = (age - AGES[i - 1]) / (AGES[i] - AGES[i - 1]); return arr[i - 1] + f * (arr[i] - arr[i - 1]); }
  return arr[arr.length - 1];
}
