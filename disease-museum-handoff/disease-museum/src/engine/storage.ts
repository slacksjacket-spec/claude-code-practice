// 保存。localStorage が使えない・壊れている・空でも必ず既定値で動く。
// ・館全体（diseaseMuseum.museum.v3）：コイン・XP（ランクは XP から決まる）
// ・ホールごと（diseaseMuseum.hall.<id>.v3）：スタンプ・ガチャ図鑑・天井・収蔵庫・進み具合
// 音のオンオフは保存しない（SPEC 2「保存」）。試作の diseaseMuseum.hall03.v2 は引き継がない（Phase 1 で決定）。
import type { ReviewItem } from "./schema";

export interface MuseumState { coins: number; xp: number }
export interface HallState {
  stamps: Record<string, 1>;          // exhibit.id → 1
  gacha: Record<string, 1>;           // 景品 id → 1
  dry: number;                        // ガチャで続いたダブりの回数（天井用）
  free: 0 | 1;                        // 最初の1回は無料
  review: ReviewItem[];               // 収蔵庫
  prog: Record<string, unknown>;      // 展示ごとの通算カウンタなど
}
export type SaveState = MuseumState & HallState;

export const MUSEUM_KEY = "diseaseMuseum.museum.v3";
export const hallKey = (hallId: string) => `diseaseMuseum.hall.${hallId}.v3`;

const num = (v: unknown, d: number) => (typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : d);
const obj = (v: unknown) => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {});

function read(key: string): Record<string, unknown> {
  try {
    const s = localStorage.getItem(key);
    return s ? obj(JSON.parse(s)) : {};
  } catch {
    return {};
  }
}
function write(key: string, v: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {
    /* 容量超過・プライベートモードなど。保存できなくても遊べる */
  }
}
function remove(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* noop */
  }
}

export function loadMuseum(): MuseumState {
  const r = read(MUSEUM_KEY);
  return { coins: num(r.coins, 0), xp: num(r.xp, 0) };
}

export function loadHall(hallId: string): HallState {
  const r = read(hallKey(hallId));
  return {
    stamps: obj(r.stamps) as HallState["stamps"],
    gacha: obj(r.gacha) as HallState["gacha"],
    dry: num(r.dry, 0),
    free: r.free === 0 ? 0 : 1,
    prog: obj(r.prog),
    review: Array.isArray(r.review)
      ? r.review.filter((x): x is ReviewItem => {
          const o = obj(x);
          return typeof o.id === "string" && typeof o.q === "string" && typeof o.ans === "string" && Array.isArray(o.opts);
        })
      : [],
  };
}

/** ホールのページで使う、館全体＋そのホールの状態 */
export const load = (hallId: string): SaveState => ({ ...loadMuseum(), ...loadHall(hallId) });

export function save(hallId: string, st: SaveState) {
  const { coins, xp, ...hall } = st;
  write(MUSEUM_KEY, { coins, xp });
  write(hallKey(hallId), hall);
}

/** このホールの記録だけ消す（コイン・XP は館全体のものなので残す） */
export const clearHall = (hallId: string) => remove(hallKey(hallId));

/** 館全体の記録をすべて消す */
export function clearAll() {
  try {
    Object.keys(localStorage).filter((k) => k.startsWith("diseaseMuseum.")).forEach(remove);
  } catch {
    /* noop */
  }
}
