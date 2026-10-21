// カプノグラム（呼気CO₂の波形）の合成。模式。TODO(review) 各パターンの形
export type Capno = "normal" | "esophageal" | "bronchospasm" | "rebreathing" | "mh" | "hypovent" | "hypervent" | "disconnect" | "rosc" | "cleft";
const SEC = 24, HZ = 25;
/** 1回の呼吸（0〜1の位相）の形。plateau=CO₂の高さ、slope=上り坂の角度（shark fin） */
function breath(ph: number, plateau: number, base: number, shark = false, cleft = false) {
  const exp = 0.55; // 吐く時間の割合
  if (ph < exp) {
    const x = ph / exp;
    if (shark) return base + (plateau - base) * Math.min(1, Math.pow(x, 0.55));
    let y = x < 0.12 ? base + (plateau - base) * (x / 0.12) : plateau + (x - 0.12) * 4;
    if (cleft && x > 0.5 && x < 0.65) y -= 10 * Math.sin(((x - 0.5) / 0.15) * Math.PI);
    return y;
  }
  const x = (ph - exp) / (1 - exp);
  return x < 0.08 ? plateau + 2 - (plateau + 2 - base) * (x / 0.08) : base;
}
export function synthCapno(p: Capno): number[] {
  const out: number[] = [];
  const rr = p === "hypovent" ? 8 : p === "hypervent" ? 24 : p === "rosc" ? 10 : 12;
  for (let i = 0; i < SEC * HZ; i++) {
    const t = i / HZ, ph = (t * rr / 60) % 1, n = Math.floor((t * rr) / 60);
    let v = 0;
    switch (p) {
      case "normal": v = breath(ph, 36, 0); break;
      case "esophageal": v = n < 3 ? breath(ph, 14 / (n + 1), 0) : 0; break;
      case "bronchospasm": v = breath(ph, 40, 0, true); break;
      case "rebreathing": v = breath(ph, 42, 9); break;
      case "mh": v = breath(ph, 38 + t * 1.6, 0); break;
      case "hypovent": v = breath(ph, 58, 0); break;
      case "hypervent": v = breath(ph, 24, 0); break;
      case "disconnect": v = t < 12 ? breath(ph, 36, 0) : 0; break;
      case "rosc": v = t < 12 ? breath((t * 100 / 60) % 1, 13, 0) : breath(ph, 44, 0); break;
      case "cleft": v = breath(ph, 36, 0, false, true); break;
    }
    out.push(Math.max(0, v + (Math.random() - 0.5) * 0.6));
  }
  return out;
}
export const CAPNO_HZ = HZ;
