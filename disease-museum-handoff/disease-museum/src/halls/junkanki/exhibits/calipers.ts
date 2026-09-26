// キャリパー計測：心電図の上で2本のキャリパーを動かして間隔を測り、正常かどうかを判定する
import "../ecg/ecg.css";
import "./calipers.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { CalipersData } from "./calipers.schema";
import { morph, sinusRhythm } from "../ecg/synth";
import { stripSVG, MM_PER_S } from "../ecg/render";
import { $, $$, esc, pick, shuffle } from "../../../engine/dom";

const MEASURE_COINS = 10, JUDGE_COINS = 10, SECONDS = 5, X0 = 8; // 描画の左の余白（mm）

export const calipers: CustomModule<CalipersData> = {
  mount(root, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`;

    function render() {
      const task = pick(d.tasks), value = pick(task.values), seed = Math.floor(Math.random() * 1e9);
      // 測る値に合わせて心電図を作る
      const rate = task.kind === "hr" ? value : task.kind === "qt" ? 60 : 72;
      const m = morph(task.kind === "qrs" ? { qrs: value, ...(value >= 0.12 ? { r2: 0.15, s: -0.4 } : {}) } : task.kind === "qt" ? { qt: value, tW: value > 0.46 ? 0.07 : 0.055 } : {});
      const pr = task.kind === "pr" ? value : 0.16;
      const rhythm = sinusRhythm(m, rate, seed, SECONDS + 1, pr);
      const truth = task.kind === "hr" ? 60 / rate : value; // 測る長さ（秒）
      const first = rhythm.beats.find((b) => b.t0 > 0.5)!;
      let a = first.t0 - 0.35, b = first.t0 + 0.2, active: "a" | "b" = "a", measured = false;

      root.innerHTML = `<div class="finding" style="border:3px solid var(--line);border-radius:14px;background:var(--bg);padding:10px 12px;font-weight:800">${esc(task.prompt)}</div>
        <div class="ecgBox calBox" style="margin-top:8px">${stripSVG(rhythm, SECONDS, { label: "II", h: 36, base: 22, extra: `<g class="cal ca" data-k="a"><line y1="0" y2="36"/><circle cy="3" r="2.2"/></g><g class="cal cb" data-k="b"><line y1="0" y2="36"/><circle cy="3" r="2.2"/></g>` })}</div>
        <p class="ecgHint">青い線をドラッグ、または下のボタンで動かす。小さいマス1つ＝0.04秒。</p>
        <div class="calRead"><span class="big delta"></span><span class="sub"></span></div>
        <div class="nudge"><button data-k="a" aria-pressed="true">左の線</button><button data-k="b" aria-pressed="false">右の線</button><button data-d="-0.04" aria-label="左へ大きく">◀◀</button><button data-d="-0.01" aria-label="左へ">◀</button><button data-d="0.01" aria-label="右へ">▶</button><button data-d="0.04" aria-label="右へ大きく">▶▶</button></div>
        <div class="row" style="margin-top:10px"><button class="btn go">この長さで決定</button></div>
        <div class="step2"></div>`;
      const svg = $<SVGSVGElement>(".calBox svg", root);
      const X = (t: number) => X0 + t * MM_PER_S;
      const draw = () => {
        for (const [k, t] of [["a", a], ["b", b]] as const) {
          const g = $(`.c${k}`, root);
          g.setAttribute("transform", `translate(${X(t)} 0)`);
          g.classList.toggle("sel", active === k);
        }
        const dt = Math.abs(b - a);
        $(".delta", root).textContent = `${dt.toFixed(2)} 秒`;
        $(".calRead .sub", root).textContent = `（小さいマス ${(dt / 0.04).toFixed(1)} 個）${task.kind === "hr" && dt > 0.2 ? `　心拍数 ≒ 60 ÷ ${dt.toFixed(2)} ＝ ${Math.round(60 / dt)}/分` : ""}`;
        $$(".nudge button[data-k]", root).forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.k === active)));
      };
      const toT = (clientX: number) => {
        const pt = svg.createSVGPoint(); pt.x = clientX; pt.y = 0;
        const p = pt.matrixTransform(svg.getScreenCTM()!.inverse());
        return Math.max(0, Math.min(SECONDS, (p.x - X0) / MM_PER_S));
      };
      let dragging: "a" | "b" | null = null;
      svg.addEventListener("pointerdown", (e) => {
        if (measured) return;
        const t = toT(e.clientX);
        dragging = Math.abs(t - a) <= Math.abs(t - b) ? "a" : "b";
        active = dragging;
        if (dragging === "a") a = t; else b = t;
        svg.setPointerCapture(e.pointerId); draw(); e.preventDefault();
      });
      svg.addEventListener("pointermove", (e) => { if (!dragging || measured) return; const t = toT(e.clientX); if (dragging === "a") a = t; else b = t; draw(); });
      svg.addEventListener("pointerup", () => (dragging = null));
      $$<HTMLButtonElement>(".nudge button", root).forEach((btn) => (btn.onclick = () => {
        if (measured) return;
        if (btn.dataset.k) active = btn.dataset.k as "a" | "b";
        else { const dd = +btn.dataset.d!; if (active === "a") a = Math.max(0, a + dd); else b = Math.min(SECONDS, b + dd); ctx.sound.beep(600, 0.03, "triangle", 0.03); }
        draw();
      }));
      draw();

      const go = $<HTMLButtonElement>(".go", root);
      go.onclick = () => {
        if (measured) return;
        measured = true; go.disabled = true;
        const dt = Math.abs(b - a), measureOk = Math.abs(dt - truth) <= task.tolerance;
        if (measureOk) { ctx.sound.ding(); ctx.award(MEASURE_COINS, go); } else ctx.sound.boo();
        const shown = task.kind === "hr" ? `RR ${truth.toFixed(2)}秒（心拍数 ${Math.round(value)}/分）` : `${truth.toFixed(2)}秒`;
        const cat = task.categories.find((c) => (c.min === undefined || value >= c.min) && (c.max === undefined || value < c.max))!;
        const box = $(".step2", root);
        box.innerHTML = `<p class="small" style="font-weight:800;margin:8px 0 0">${measureOk ? "計測OK！" : "ずれている。"}あなたの計測 ${dt.toFixed(2)}秒 ／ 正しくは ${shown}</p>
          <div class="stepLabel">判定は？</div><div class="opts">${shuffle(task.categories).map((c) => `<button class="opt" data-l="${esc(c.label)}">${esc(c.label)}</button>`).join("")}</div><div class="fbBox"></div>`;
        $$<HTMLButtonElement>(".opt", box).forEach((o) => (o.onclick = () => {
          const ok = o.dataset.l === cat.label;
          $$<HTMLButtonElement>(".opt", box).forEach((x) => { x.disabled = true; if (x.dataset.l === cat.label) x.classList.add("right"); });
          if (ok) { ctx.sound.ding(); ctx.award(JUDGE_COINS, o); } else { o.classList.add("wrong"); ctx.sound.boo(); }
          if (!ok) ctx.miss({ id: `${ex.id}-${task.kind}-${value}`, src: ex.title, q: `${task.prompt.split("（")[0]}：${shown}。判定は？`, opts: task.categories.slice(0, 4).map((c) => c.label), ans: cat.label });
          if (ok && measureOk && ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id);
          const fb = $(".fbBox", box);
          ctx.feedback(fb, ok && measureOk, ok && measureOk ? "計測も判定も正解！" : ok ? "判定は正解！" : `正解は「${esc(cat.label)}」`, `${esc(task.explanation)}<div style="margin-top:8px"><button class="btn next">次の心電図</button></div>`);
          $(".next", fb).onclick = render;
        }));
      };
    }
    render();
  },
};
