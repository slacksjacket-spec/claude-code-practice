// 心電図道場：心電図を読んで調律を当てる。初級・中級・上級と、12誘導も混ざる模擬検定
import "../ecg/ecg.css";
import "./ecgDojo.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { EcgDojoData } from "./ecgDojo.schema";
import { makeRhythm, makeTwelve } from "../ecg/synth";
import { stripSVG, twelveSVG } from "../ecg/render";
import { $, $$, esc, shuffle } from "../../../engine/dom";

const COINS = 10, EXAM_BONUS = 50;
type Q = { kind: "r" | "p"; id: string; seed: number };

export const ecgDojo: CustomModule<EcgDojoData> = {
  mount(root, ex, ctx) {
    const d = ex.data;
    const info = (q: Q) => (q.kind === "r" ? d.rhythms.find((r) => r.id === q.id)! : d.patterns.find((p) => p.id === q.id)!);
    const seed = () => Math.floor(Math.random() * 1e9);
    let mode = 0, timer = 0; // mode：段位の添字、または levels.length（模擬検定）

    root.innerHTML = `<div class="seg modeTabs">${d.levels.map((l, i) => `<button aria-pressed="${i === 0}" data-m="${i}">${esc(l.label)}</button>`).join("")}<button aria-pressed="false" data-m="${d.levels.length}">模擬検定</button></div><div class="body"></div>`;
    const body = $(".body", root);
    $$<HTMLButtonElement>(".modeTabs button", root).forEach((b) => (b.onclick = () => {
      mode = +b.dataset.m!;
      $$(".modeTabs button", root).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      start();
    }));

    function start() {
      clearInterval(timer);
      const exam = mode === d.levels.length;
      let qs: Q[];
      if (exam) {
        qs = shuffle([
          ...shuffle(d.rhythms).slice(0, d.exam.rhythms).map((r) => ({ kind: "r" as const, id: r.id, seed: seed() })),
          ...shuffle(d.patterns).slice(0, d.exam.patterns).map((p) => ({ kind: "p" as const, id: p.id, seed: seed() })),
        ]);
      } else {
        const pool = d.levels[mode].rhythms;
        qs = Array.from({ length: d.roundSize }, (_, i) => ({ kind: "r" as const, id: shuffle(pool)[i % pool.length], seed: seed() }));
        qs = shuffle(qs);
      }
      let qi = 0, ok = 0, left = d.exam.timeSec;
      if (exam) {
        timer = window.setInterval(() => {
          left--;
          const el = root.querySelector<HTMLElement>(".dojoTimer");
          if (!el || !el.isConnected) { clearInterval(timer); return; }
          el.textContent = `残り ${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
          el.classList.toggle("low", left <= 60);
          if (left <= 0) { clearInterval(timer); finish(true); }
        }, 1000);
      }
      const total = qs.length;

      function show() {
        const q = qs[qi], it = info(q);
        // 選択肢：段位の中（模擬検定なら同じ種類の中）から
        const pool = q.kind === "p" ? d.patterns.map((p) => p.name) : (exam ? d.rhythms : d.rhythms.filter((r) => d.levels[mode].rhythms.includes(r.id))).map((r) => r.name);
        const opts = shuffle([it.name, ...shuffle(pool.filter((n) => n !== it.name)).slice(0, 4)]);
        const fig = q.kind === "r" ? stripSVG(makeRhythm(q.id as never, q.seed), 8, { label: "II" }) : twelveSVG(makeTwelve(q.id as never, q.seed), q.seed);
        body.innerHTML = `<div class="dojoTop"><span class="tagk">${exam ? "模擬検定" : esc(d.levels[mode].label)} ${qi + 1} / ${total}</span><span class="small" style="font-weight:800">正解 ${ok}</span>${exam ? `<span class="dojoTimer">残り ${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}</span>` : ""}</div>
          <div class="ecgBox">${fig}</div><p class="ecgHint">${q.kind === "r" ? "II誘導・8秒。横にスクロールできます。" : "12誘導。横にスクロールできます。"}（25mm/秒、10mm/mV）</p>
          <div class="stepLabel">${q.kind === "r" ? "この調律は？" : "この心電図の所見は？"}</div>
          <div class="opts">${opts.map((o) => `<button class="opt" data-a="${esc(o)}">${esc(o)}</button>`).join("")}</div><div class="fbBox"></div>`;
        $$<HTMLButtonElement>(".opt", body).forEach((b) => (b.onclick = () => {
          const right = b.dataset.a === it.name;
          $$<HTMLButtonElement>(".opt", body).forEach((x) => { x.disabled = true; if (x.dataset.a === it.name) x.classList.add("right"); });
          if (right) { ok++; ctx.sound.ding(); ctx.award(COINS, b); }
          else {
            b.classList.add("wrong"); ctx.sound.boo();
            ctx.miss({ id: `${ex.id}-${q.id}`, src: ex.title, q: `心電図：${it.clue} この${q.kind === "r" ? "調律" : "所見"}は？`, opts: shuffle([it.name, ...opts.filter((o) => o !== it.name).slice(0, 2)]), ans: it.name });
          }
          const fb = $(".fbBox", body), last = qi === total - 1;
          ctx.feedback(fb, right, right ? "正解！" : `正解は「${esc(it.name)}」`, `<span class="clueLine">読むポイント：${esc(it.clue)}</span><br>${esc(it.explanation)}<div style="margin-top:8px"><button class="btn next">${last ? "結果を見る" : "次の心電図"}</button></div>`);
          $(".next", fb).onclick = () => { qi++; if (qi >= total) finish(false); else show(); };
        }));
      }

      function finish(timeUp: boolean) {
        clearInterval(timer);
        const need = exam ? d.exam.pass : d.passScore, pass = ok >= need;
        body.innerHTML = `<div class="feedback card-pop"><b class="t">${timeUp ? "時間切れ！ " : ""}${ok} / ${total} 正解</b>${pass ? (exam ? `模擬検定 合格！ボーナス +${EXAM_BONUS}` : "この段位はクリア！") : `${need}問以上でクリア。`}<div style="margin-top:8px"><button class="btn again">もう一度</button></div></div>`;
        if (pass) {
          ctx.sound.yay();
          if (exam) ctx.award(EXAM_BONUS, $(".again", body));
          if (exam || mode >= d.stampFromLevel) ctx.stamp(ex.id);
        }
        $(".again", body).onclick = start;
      }
      show();
    }
    start();
  },
};
