// 保存。localStorage が使えない・壊れている・空でも必ず既定値で動く。
// 音のオンオフは保存しない（SPEC 2「保存」）。
import type { ReviewItem } from "./schema";

export interface SaveState {
  coins: number;
  xp: number;
  stamps: Record<string, 1>;          // exhibit.id → 1
  gacha: Record<string, 1>;           // 景品 id → 1
  dry: number;                        // ガチャで続いたダブりの回数（天井用）
  free: 0 | 1;                        // 最初の1回は無料
  review: ReviewItem[];               // 収蔵庫
  prog: Record<string, unknown>;      // 展示ごとの通算カウンタなど
}

export const defaultState = (): SaveState => ({ coins: 0, xp: 0, stamps: {}, gacha: {}, dry: 0, free: 1, review: [], prog: {} });

const num = (v: unknown, d: number) => (typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : d);
const obj = (v: unknown) => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {});

/** 保存データを読む。形が崩れていても落ちずに、読める分だけ読む。 */
export function load(key: string): SaveState {
  const st = defaultState();
  let raw: unknown = null;
  try {
    const s = localStorage.getItem(key);
    if (s) raw = JSON.parse(s);
  } catch {
    return st;
  }
  const r = obj(raw);
  st.coins = num(r.coins, 0);
  st.xp = num(r.xp, 0);
  st.dry = num(r.dry, 0);
  st.free = r.free === 0 ? 0 : 1;
  st.stamps = obj(r.stamps) as SaveState["stamps"];
  st.gacha = obj(r.gacha) as SaveState["gacha"];
  st.prog = obj(r.prog);
  if (Array.isArray(r.review)) {
    st.review = r.review.filter((x): x is ReviewItem => {
      const o = obj(x);
      return typeof o.id === "string" && typeof o.q === "string" && typeof o.ans === "string" && Array.isArray(o.opts);
    });
  }
  return st;
}

export function save(key: string, st: SaveState) {
  try {
    localStorage.setItem(key, JSON.stringify(st));
  } catch {
    /* 容量超過・プライベートモードなど。保存できなくても遊べる */
  }
}

export function clear(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* noop */
  }
}
