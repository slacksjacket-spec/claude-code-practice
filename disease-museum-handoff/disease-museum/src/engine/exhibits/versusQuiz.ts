// 3.7 VS対決：中央のヒントが左右どちらの病気のものか答える。連続正解でコンボ
import "./versusQuiz.css";
import type { ExhibitModule } from "./types";
import { $, $$, color, esc, shuffle } from "../dom";

export const VersusQuiz: ExhibitModule<"VersusQuiz"> = {
  mount(root, ex, ctx) {
    const d = ex.data;
    let m = d.matches[0], qi = 0, okN = 0, combo = 0, order = shuffle(m.clues);
    root.innerHTML = `<div class="vsTabs seg">${d.matches.map((x, i) => `<button data-i="${i}" aria-pressed="${i === 0}">${esc(x.title)}</button>`).join("")}</div>
    <div class="arena"></div><div class="combo"></div><div class="clue">スタートを押してね</div><div class="pick"></div><div class="vsScore"></div>`;
    const arena = $(".arena", root), comboEl = $(".combo", root), clue = $(".clue", root), pickEl = $(".pick", root), score = $(".vsScore", root);
    $$<HTMLButtonElement>(".vsTabs button", root).forEach((b) => (b.onclick = () => {
      m = d.matches[+b.dataset.i!];
      $$(".vsTabs button", root).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      setup();
    }));
    const fighter = (f: typeof m.a, side: string) => `<div class="fighter" data-side="${side}" style="background:${color(f.color)}"><h4>${esc(f.name)}</h4><ul>${f.traits.map((k) => `<li>${esc(k)}</li>`).join("")}</ul></div>`;

    function setup() {
      arena.innerHTML = fighter(m.a, "a") + `<div class="vsMark">VS</div>` + fighter(m.b, "b");
      qi = 0; okN = 0; combo = 0; comboEl.textContent = ""; order = shuffle(m.clues);
      clue.className = "clue"; clue.textContent = "スタートを押してね";
      pickEl.innerHTML = `<button class="btn start">スタート</button>`;
      score.textContent = "";
      $(".start", pickEl).onclick = next;
    }
    function next() {
      if (qi >= order.length) {
        clue.className = "clue ok"; clue.innerHTML = `${okN} / ${order.length} 正解！`;
        pickEl.innerHTML = `<button class="btn alt again">もう一回</button>`;
        $(".again", pickEl).onclick = setup;
        if (okN >= d.passScore) ctx.stamp(ex.id); else ctx.toast(`${d.passScore}問以上正解でスタンプ`);
        return;
      }
      const c = order[qi];
      clue.className = "clue card-pop"; clue.textContent = c.text;
      pickEl.innerHTML = `<button class="btn" style="background:${color(m.a.color)}" data-s="a">← ${esc(m.a.name)}</button><button class="btn" style="background:${color(m.b.color)}" data-s="b">${esc(m.b.name)} →</button>`;
      $$<HTMLButtonElement>("button", pickEl).forEach((b) => (b.onclick = () => {
        const right = b.dataset.s === c.side, win = c.side === "a" ? m.a : m.b;
        clue.className = "clue " + (right ? "ok" : "ng");
        if (right) {
          okN++; combo++;
          ctx.sound.beep(700 + combo * 90, 0.1, "square", 0.05);
          ctx.award(5 + Math.min(combo, 5) * 2, b); // SPEC 3.7
          $(`.fighter[data-side="${c.side}"]`, arena).animate([{ transform: "scale(1)" }, { transform: "scale(1.08) rotate(-3deg)" }, { transform: "scale(1)" }], { duration: 300 });
          comboEl.textContent = combo >= 2 ? `${combo} COMBO!` : "";
        } else {
          combo = 0; comboEl.textContent = ""; ctx.sound.boo();
          clue.innerHTML = `${esc(c.text)}<br><span style="font-size:.6em">→ ${esc(win.name)}</span>`;
          ctx.miss({ id: `${ex.id}-${m.id}-${c.text}`, src: `${ex.title}：${m.title}`, q: `「${c.text}」はどっち？`, opts: [m.a.name, m.b.name], ans: win.name });
        }
        $$<HTMLButtonElement>("button", pickEl).forEach((x) => (x.disabled = true));
        qi++;
        score.textContent = `${qi} / ${order.length}　正解 ${okN}`;
        setTimeout(next, right ? 650 : 1300);
      }));
    }
    setup();
  },
};
