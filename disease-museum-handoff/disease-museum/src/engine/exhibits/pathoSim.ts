// 3.2 病態シミュレーター：スライダーで図が変わる（前半）＋ 治療ミッション（後半、複数正解あり）
import "./pathoSim.css";
import type { ExhibitModule } from "./types";
import { missOpts } from "./types";
import { $, $$, esc, shuffle } from "../dom";

const MISSION_COINS = 15; // SPEC 3.2

export const PathoSim: ExhibitModule<"PathoSim"> = {
  mount(root, ex, ctx) {
    const d = ex.data, s = d.slider, sid = `${ex.id}-slider`;
    root.innerHTML = `<div class="two">
      <div class="portalFig">${d.svg}</div>
      <div>
        <label for="${sid}" style="font-weight:800">${esc(s.label)}</label>
        <div class="readout"><span class="val">${s.initial}</span><small style="font-size:16px"> ${esc(s.unit)}</small></div>
        <input type="range" id="${sid}" min="${s.min}" max="${s.max}" step="${s.step}" value="${s.initial}">
        ${s.gauge ? `<div class="gauge">${s.gauge.map((g) => `<span>${esc(g)}</span>`).join("")}</div>` : ""}
        <div class="bubble note"></div>
      </div>
    </div>
    <div class="mission"></div>`;

    const fig = $(".portalFig", root), input = $<HTMLInputElement>("input", root);
    const ids = [...new Set(d.thresholds.flatMap((t) => t.show ?? []))];
    const bonusKey = `${ex.id}.bonus`;
    function update() {
      const v = +input.value;
      $(".val", root).textContent = String(v);
      for (const id of ids) {
        const at = d.thresholds.find((t) => t.show?.includes(id))!.at;
        fig.querySelector(`#${CSS.escape(id)}`)?.setAttribute("opacity", v >= at ? "1" : "0");
      }
      ctx.hooks[ex.id]?.(fig, v);
      const th = [...d.thresholds].reverse().find((t) => v >= t.at) ?? d.thresholds[0];
      $(".note", root).innerHTML = th.text; // 太字などを含むので html
      if (s.bonus && v >= s.bonus.at && !ctx.st.prog[bonusKey]) {
        ctx.st.prog[bonusKey] = 1; ctx.save();
        ctx.award(s.bonus.coins, input);
      }
    }
    input.oninput = update;
    update();

    // ミッション
    const doneKey = `${ex.id}.done`, M = d.missions;
    const doneList = () => (Array.isArray(ctx.st.prog[doneKey]) ? (ctx.st.prog[doneKey] as number[]) : (ctx.st.prog[doneKey] = []) as number[]);
    const order = shuffle(M.map((_, i) => i));
    let mi = 0;
    function mission() {
      const idx = order[mi % M.length], m = M[idx], box = $(".mission", root);
      box.innerHTML = `<b>ミッション ${(mi % M.length) + 1} / ${M.length}</b><div style="font-weight:800;font-size:14px;margin-top:4px">${esc(m.text)}</div>
  <div class="opts tools">${d.tools.map((t, i) => `<button class="opt" data-i="${i}">${esc(t)}</button>`).join("")}</div><div class="fbBox"></div>
  <div class="mdots">${M.map((_, i) => `<i class="${doneList().includes(i) ? "on" : ""}"></i>`).join("")}</div>`;
      $$<HTMLButtonElement>(".tools .opt", box).forEach((b) => (b.onclick = () => {
        const acc = [m.answer, ...(m.alt ?? [])], i = +b.dataset.i!, ok = acc.includes(i);
        $$<HTMLButtonElement>(".tools .opt", box).forEach((x) => { x.disabled = true; if (acc.includes(+x.dataset.i!)) x.classList.add("right"); });
        if (ok) {
          ctx.sound.ding(); ctx.award(MISSION_COINS, b);
          const dl = doneList();
          if (!dl.includes(idx)) { dl.push(idx); ctx.save(); }
          if (dl.length >= M.length) ctx.stamp(ex.id);
        } else {
          b.classList.add("wrong"); ctx.sound.boo();
          ctx.miss({ id: `${ex.id}-${idx}`, src: ex.title, q: m.text, opts: missOpts(d.tools[m.answer], d.tools, shuffle), ans: d.tools[m.answer] });
        }
        const title = ok ? (i !== m.answer && m.altNote ? `ミッション成功！（${esc(m.altNote)}）` : "ミッション成功！") : `正解は「${esc(d.tools[m.answer])}」`;
        const fb = $(".fbBox", box);
        ctx.feedback(fb, ok, title, `${esc(m.explanation)}<div style="margin-top:8px"><button class="btn next">次のミッション</button></div>`);
        $(".next", fb).onclick = () => { mi++; mission(); };
      }));
    }
    mission();
  },
};
