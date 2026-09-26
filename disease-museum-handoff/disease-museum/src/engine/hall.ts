// ホールのページをデータから組み立てる：トップバー → 入口 → 館内図 → ウィング（＋ガチャ）→ 収蔵庫 → フッター
import "./styles.css";
import type { Exhibit, Hall, ReviewItem, Wing } from "./schema";
import type { Ctx, HallHooks } from "./context";
import { $, $$, color, esc } from "./dom";
import { load, save as saveState } from "./storage";
import { beep, boo, ding, isSoundOn, toggleSound, yay } from "./sound";
import { confetti, mountConfetti } from "./confetti";
import { mountToast, toast } from "./toast";
import { coinFx, rankOf, XP_STAMP } from "./economy";
import { createCheat, dialogHTML as peekDialogHTML } from "./cheatsheet";
import { dialogHTML as cardDialogHTML, mountStampCard, stampList } from "./stamps";
import { mountReview, sectionHTML as reviewHTML } from "./review";
import { exhibitHTML as gachaHTML, mountGacha } from "./gacha";
import { MODULES } from "./exhibits";
import type { CustomModules } from "./exhibits/types";

const pad2 = (n: number) => String(n).padStart(2, "0");

/** データ中の review: "draft" の数（フッターの「未レビュー」注記に使う） */
function countDrafts(x: unknown): number {
  if (!x || typeof x !== "object") return 0;
  if (Array.isArray(x)) return x.reduce((a: number, v) => a + countDrafts(v), 0);
  const o = x as Record<string, unknown>;
  return (o.review === "draft" ? 1 : 0) + Object.values(o).reduce((a: number, v) => a + countDrafts(v), 0);
}

/* ================= markup ================= */

function topbarHTML(total: number) {
  return `<div class="topbar"><div class="wrap">
  <button class="rankPill" id="rankPill" aria-label="ランクとスタンプ"><span id="rankSub">${rankOf(0)}</span><b id="rankXp">XP 0</b></button>
  <div style="display:flex;gap:6px;align-items:center">
    <span class="coinPill" id="coinPill"><i class="coin"></i><span id="coins">0</span></span>
    <button class="snd" id="snd" aria-label="効果音の切り替え">♪</button>
    <button class="stampPill" id="stampPill" aria-label="スタンプカードを開く"><span class="dots" id="dots"></span><span id="stampCount">0/${total}</span></button>
  </div>
</div></div>`;
}

function entranceHTML(h: Hall) {
  const parts = h.headingParts ?? [...h.title.replace(/ホール$/, "")];
  return `<header class="entrance"><div class="wrap">
  <h1>${parts.map((p) => `<span>${esc(p)}</span>`).join("")}<br>ホール</h1>
  <p class="sub">${esc(h.catch)}</p>
  <div class="ticket" id="ticket">
    <div class="main"><small>DISEASE MUSEUM　NO.${pad2(h.no)}${h.version ? "　" + esc(h.version) : ""}</small><b>${esc(h.title)} 入館券</b><small>${esc(h.ticketNote)}</small></div>
    <button class="stub" id="tear"><span class="disp" style="font-size:18px">もぎる</span></button>
  </div>
</div></header>`;
}

function mapHTML(h: Hall) {
  const m = h.map;
  return `<section class="mapWrap" id="map"><div class="wrap">
  <div class="sectionTitle"><span class="no">館内図</span><h2>どの臓器から見る？</h2></div>
  <div class="pop map" style="padding:10px">
    <svg viewBox="${esc(m.viewBox)}" role="img" aria-label="${esc(m.ariaLabel)}">
      ${m.organs.map((o) => `<g class="organ" tabindex="0" role="button" aria-label="${esc(o.label)}" data-go="${esc(o.go)}">${o.svg}</g>`).join("\n      ")}
    </svg>
    <p class="mapHint">${esc(m.hint)}</p>
    <div class="guide" id="guide"></div>
  </div>
</div></section>`;
}

function exhibitHTML(ex: Exhibit) {
  return `<article class="pop exhibit" data-ex="${esc(ex.id)}" id="ex-${esc(ex.id)}">
    <span class="plaque">展示 ${pad2(ex.no)}</span><div class="stampMark">済</div>
    <h3>${esc(ex.title)}</h3>
    <p class="how">${esc(ex.how)}</p>
    ${ex.cheatSheet ? `<button class="peek" data-k="${esc(ex.id)}">カンペを見る</button>` : ""}
    <div class="exRoot" id="root-${esc(ex.id)}"></div>
  </article>`;
}

function wingHTML(w: Wing, extra = "") {
  const side = w.side ?? `展示 ${w.exhibits.length}点`;
  const fg = w.labelText === "light" ? "#fff" : "#1C1537";
  return `<section class="wing" id="${esc(w.id)}"><div class="wrap">
  <div class="wingHead"><div><span class="wingLabel" style="background:${color(w.color)};color:${fg}">${esc(w.label)}</span><h2>${esc(w.headline)}</h2></div><p>${esc(side)}</p></div>
  ${w.exhibits.map(exhibitHTML).join("\n")}
  ${extra}
</div></section>`;
}

function footerHTML(h: Hall) {
  const draft = countDrafts(h) > 0;
  const lead = `病気博物館 ${esc(h.title)}${h.version ? " " + esc(h.version) : ""}。${draft ? "展示内容は未レビューです。" : ""}`;
  return `<footer><div class="wrap">
  <button class="btn" id="openCard">スタンプカードを見る</button>
  <p>${lead}${h.footerNote ? `<br>${esc(h.footerNote)}` : ""}</p>
  ${__SINGLE__ ? "" : `<p><a href="../../" style="color:inherit">← 館の入口へ</a></p>`}
</div></footer>`;
}

/* ================= mount ================= */

export function mountHall(hall: Hall, opts: { hooks?: HallHooks; custom?: CustomModules } = {}) {
  const hooks = opts.hooks ?? {}, custom = opts.custom ?? {};
  document.title = `病気博物館 ${hall.title}`;
  const exhibits = hall.wings.flatMap((w) => w.exhibits);
  const gachaWing = hall.gacha.wing;

  document.body.innerHTML = [
    topbarHTML(hall.stampOrder.length),
    entranceHTML(hall),
    mapHTML(hall),
    ...hall.wings.map((w) => wingHTML(w, w.id === gachaWing ? gachaHTML(hall.gacha) : "")),
    gachaWing ? "" : wingHTML({ id: "w-gacha", label: "ごほうびコーナー", color: "sun", headline: hall.gacha.title, side: "ごほうびコーナー", exhibits: [] }, gachaHTML(hall.gacha)),
    reviewHTML(),
    footerHTML(hall),
    cardDialogHTML(hall.title),
    peekDialogHTML(),
  ].join("\n");
  mountConfetti();
  mountToast();

  /* ---------- context ---------- */
  const st = load(hall.id);
  const listeners: (() => void)[] = [];
  let lastRank = rankOf(st.xp);
  const save = () => saveState(hall.id, st);
  let card: { open(): void };

  const ctx: Ctx = {
    hall, hooks, st, save,
    prog(k, inc = 1) {
      const v = (typeof st.prog[k] === "number" ? (st.prog[k] as number) : 0) + inc;
      st.prog[k] = v;
      save();
      return v;
    },
    award(n, el) {
      st.coins += n; st.xp += n;
      save(); ctx.refresh();
      coinFx(n, el);
    },
    addXp(n) { st.xp += n; save(); ctx.refresh(); },
    miss(item: ReviewItem) {
      if (st.review.some((r) => r.id === item.id)) return;
      st.review.push(item);
      save(); ctx.refresh();
    },
    stamp(k) {
      if (st.stamps[k]) return;
      st.stamps[k] = 1; st.xp += XP_STAMP;
      save(); ctx.refresh();
      yay();
      toast(`ポン！「${stampList(ctx).find((s) => s[0] === k)?.[1] ?? k}」スタンプ　XP+${XP_STAMP}`);
      confetti(70);
      if (hall.stampOrder.every((x) => st.stamps[x])) setTimeout(() => card.open(), 1500);
    },
    refresh() {
      listeners.forEach((f) => f());
      const r = rankOf(st.xp);
      if (r !== lastRank) {
        lastRank = r;
        setTimeout(() => { toast(`昇進！「${r}」になった`); yay(); confetti(90); }, 900);
      }
    },
    onRefresh(fn) { listeners.push(fn); },
    toast, confetti,
    sound: { beep, yay, ding, boo },
    feedback(el, ok, title, body) {
      el.innerHTML = `<div class="feedback card-pop" style="background:${ok ? "color-mix(in srgb,var(--mint) 30%,var(--card))" : "color-mix(in srgb,var(--pink) 30%,var(--card))"}"><b class="t">${title}</b>${body}</div>`;
    },
    cheat: { reset() {}, rewardIfUnpeeked() {} },
  };
  ctx.cheat = createCheat(hall, ctx.award, toast);

  /* ---------- HUD ---------- */
  const S = stampList(ctx);
  ctx.onRefresh(() => {
    $("#coins").textContent = String(st.coins);
    $("#rankSub").textContent = rankOf(st.xp);
    $("#rankXp").textContent = "XP " + st.xp;
    $("#stampCount").textContent = `${S.filter(([k]) => st.stamps[k]).length}/${S.length}`;
    $("#dots").innerHTML = S.map(([k]) => `<i class="${st.stamps[k] ? "on" : ""}"></i>`).join("");
    S.forEach(([k]) => document.querySelector(`[data-ex="${k}"]`)?.classList.toggle("stamped", !!st.stamps[k]));
    $("#guide").innerHTML = S.map(([k, n]) => {
      const ex = exhibits.find((e) => e.id === k)!;
      return `<a href="#ex-${esc(k)}" class="${st.stamps[k] ? "done" : ""}"><small>展示 ${pad2(ex.no)}</small>${esc(n)}</a>`;
    }).join("") + `<a href="#ex-review"><small>収蔵庫</small>要復習 ${st.review.length}</a>`;
  });

  /* ---------- sound toggle, ticket, map ---------- */
  $("#snd").onclick = () => { toggleSound(); $("#snd").textContent = isSoundOn() ? "♪" : "×"; };
  $("#tear").onclick = () => {
    $("#ticket").classList.add("torn");
    beep(900, 0.08, "triangle", 0.08, 300);
    setTimeout(() => { $("#tear").style.visibility = "hidden"; $("#map").scrollIntoView({ behavior: "smooth" }); }, 650);
  };
  $$<SVGGElement>(".organ").forEach((g) => {
    const go = () => { beep(520, 0.1, "triangle", 0.07, 780); document.getElementById(g.dataset.go!)?.scrollIntoView({ behavior: "smooth" }); };
    g.onclick = go;
    g.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } };
  });

  /* ---------- common features ---------- */
  card = mountStampCard(ctx);
  mountReview(ctx);
  mountGacha(ctx);

  /* ---------- exhibits ---------- */
  for (const ex of exhibits) {
    const root = $(`#root-${ex.id}`);
    const mod = (ex.type === "Custom" ? custom[ex.kind] : MODULES[ex.type]) as { mount(r: HTMLElement, e: Exhibit, c: Ctx): void } | undefined;
    if (!mod) {
      root.innerHTML = `<div class="placeholder">展示「${esc(ex.type === "Custom" ? ex.kind : ex.type)}」はまだ実装されていません。</div>`;
      continue;
    }
    try {
      mod.mount(root, ex, ctx);
    } catch (e) {
      console.error(`展示 ${ex.id} の描画に失敗`, e);
      root.innerHTML = `<div class="placeholder">この展示は読み込めませんでした。</div>`;
    }
  }

  ctx.refresh();
  return ctx;
}
