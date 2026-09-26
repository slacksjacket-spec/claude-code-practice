// 3.3 解読パズル：ランプの組み合わせから状態を当てる（解読）＋ お題に合わせてランプを点ける（逆）
import "./decodePuzzle.css";
import type { ExhibitModule } from "./types";
import { missOpts } from "./types";
import type { ExhibitOf } from "../schema";
import { $, $$, esc, pick, shuffle } from "../dom";

const READ_COINS = 12, MAKE_COINS = 10; // SPEC 3.3
type State = ExhibitOf<"DecodePuzzle">["data"]["states"][number];

export const DecodePuzzle: ExhibitModule<"DecodePuzzle"> = {
  mount(root, ex, ctx) {
    const d = ex.data, names = d.states.map((s) => s.name);
    const [readLabel, makeLabel] = d.modeLabels ?? ["解読モード", "逆モード"];
    const label = (i: number, s: State) => s.labelOverride?.[String(i)] ?? d.markers[i];
    let mode: "read" | "make" = "read", q: State[] = [], qi = 0, okN = 0;

    root.innerHTML = `${d.reverse ? `<div class="seg modeTabs"><button aria-pressed="true" data-m="read">${esc(readLabel)}</button><button aria-pressed="false" data-m="make">${esc(makeLabel)}</button></div>` : ""}<div class="body"></div>`;
    const body = $(".body", root);
    $$<HTMLButtonElement>(".modeTabs button", root).forEach((b) => (b.onclick = () => {
      mode = b.dataset.m as "read" | "make";
      $$(".modeTabs button", root).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      render();
    }));

    function render() {
      if (mode === "read") {
        if (qi === 0 && !q.length) { q = shuffle(d.states).slice(0, d.roundSize); okN = 0; }
        if (qi >= q.length) {
          const pass = okN >= d.passScore;
          body.innerHTML = `<div class="feedback card-pop"><b class="t">${okN} / ${q.length} 正解</b>${pass ? "解読マスター！" : `${d.passScore}問以上でスタンプ。もう一回！`}<div style="margin-top:8px"><button class="btn again">もう一回</button></div></div>`;
          if (pass) ctx.stamp(ex.id);
          $(".again", body).onclick = () => { qi = 0; q = []; render(); };
          return;
        }
        const c = q[qi];
        ctx.cheat.reset(ex.id);
        body.innerHTML = `<div class="hud"><span class="tagk">Q${qi + 1} / ${q.length}</span><span class="small" style="font-weight:800">正解 ${okN}</span></div>
    <div class="lamps">${c.pattern.map((v, i) => `<div class="lamp ${v ? "on" : "off"}">${esc(label(i, c))}<span class="bulb">${v ? "＋" : "−"}</span></div>`).join("")}</div>
    <div class="stepLabel">${esc(d.question ?? "この人は？")}</div><div class="opts">${shuffle(names).map((n) => `<button class="opt" data-n="${esc(n)}">${esc(n)}</button>`).join("")}</div><div class="fbBox"></div>`;
        $$<HTMLButtonElement>(".opt", body).forEach((b) => (b.onclick = () => {
          const ok = b.dataset.n === c.name;
          $$<HTMLButtonElement>(".opt", body).forEach((x) => { x.disabled = true; if (x.dataset.n === c.name) x.classList.add("right"); });
          if (ok) { okN++; ctx.sound.ding(); ctx.award(READ_COINS, b); ctx.cheat.rewardIfUnpeeked(ex.id, b); }
          else {
            b.classList.add("wrong"); ctx.sound.boo();
            const pos = c.pattern.map((v, i) => (v ? label(i, c) : null)).filter(Boolean).join("、") || "すべて陰性";
            ctx.miss({ id: `${ex.id}-${c.name}`, src: ex.title, q: `陽性：${pos}。この状態は？`, opts: missOpts(c.name, names, shuffle), ans: c.name });
          }
          const fb = $(".fbBox", body);
          ctx.feedback(fb, ok, ok ? "解読成功！" : `正解は「${esc(c.name)}」`, `${esc(c.explanation)}<div style="margin-top:8px"><button class="btn next">次へ</button></div>`);
          $(".next", fb).onclick = () => { qi++; render(); };
        }));
      } else {
        const r = d.reverse!, t = pick(r.targets), s = r.markers.map(() => 0);
        body.innerHTML = `<div class="bubble" style="font-weight:800">お題：「<span class="disp">${esc(t.name)}</span>」の人のランプを点けよう</div>
    <div class="lamps" style="margin-top:10px">${r.markers.map((m, i) => `<button class="lamp off" data-i="${i}">${esc(m)}<span class="bulb">−</span></button>`).join("")}</div>
    <div class="row" style="margin-top:10px"><button class="btn go">これで決定</button></div><div class="fbBox"></div>`;
        $$<HTMLButtonElement>("button.lamp", body).forEach((b) => (b.onclick = () => {
          const i = +b.dataset.i!;
          s[i] ^= 1;
          b.className = "lamp " + (s[i] ? "on" : "off");
          $(".bulb", b).textContent = s[i] ? "＋" : "−";
          ctx.sound.beep(s[i] ? 880 : 440, 0.05, "triangle", 0.05);
        }));
        const go = $<HTMLButtonElement>(".go", body);
        go.onclick = () => {
          const ok = s.every((v, i) => v === t.pattern[i]);
          if (ok) { ctx.sound.ding(); ctx.award(MAKE_COINS, go); } else ctx.sound.boo();
          const fb = $(".fbBox", body);
          ctx.feedback(fb, ok, ok ? "点灯成功！" : "おしい！", `正解：${r.markers.map((m, i) => `${esc(m)}${t.pattern[i] ? "＋" : "−"}`).join("　")}<br>${esc(r.lesson)}<div style="margin-top:8px"><button class="btn next">次のお題</button></div>`);
          $(".next", fb).onclick = render;
        };
      }
    }
    render();
  },
};
