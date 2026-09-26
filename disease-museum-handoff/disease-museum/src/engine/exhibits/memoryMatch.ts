// 3.8 神経衰弱：マーカー（黄色）と疾患のペアをめくる
import "./memoryMatch.css";
import type { ExhibitModule } from "./types";
import { $, $$, esc, shuffle } from "../dom";

const PAIR_COINS = 4, BONUS_COINS = 30; // SPEC 3.8

export const MemoryMatch: ExhibitModule<"MemoryMatch"> = {
  mount(root, ex, ctx) {
    const d = ex.data;
    root.innerHTML = `<div class="memo"></div><div class="memoInfo"><span class="moves">0手</span><button class="btn alt reset">並べなおす</button></div>`;
    const memo = $(".memo", root), movesEl = $(".moves", root);
    let flipped: HTMLElement[] = [], moves = 0, matched = 0, lock = false;

    function setup() {
      const cards = shuffle(d.pairs.flatMap((p, i) => [{ t: p.marker, k: i, mk: 1 }, { t: p.disease, k: i, mk: 0 }]));
      moves = 0; matched = 0; flipped = []; lock = false;
      memo.innerHTML = cards.map((c) => `<button class="mc" data-k="${c.k}" aria-label="カード"><div class="in"><div class="f">？</div><div class="b ${c.mk ? "mk" : ""}">${esc(c.t)}</div></div></button>`).join("");
      movesEl.textContent = "0手";
      $$<HTMLButtonElement>(".mc", memo).forEach((b) => (b.onclick = () => {
        if (lock || b.classList.contains("flip") || b.classList.contains("done")) return;
        b.classList.add("flip"); ctx.sound.beep(700, 0.05, "triangle", 0.05);
        flipped.push(b);
        if (flipped.length < 2) return;
        moves++; movesEl.textContent = moves + "手";
        const [a, c] = flipped;
        if (a.dataset.k === c.dataset.k) {
          a.classList.add("done"); c.classList.add("done"); flipped = []; matched++;
          ctx.sound.ding(); ctx.award(PAIR_COINS, c);
          if (matched === d.pairs.length) {
            const bonus = moves <= d.bonusMoves ? BONUS_COINS : 0;
            if (bonus) ctx.award(bonus, movesEl);
            ctx.toast(`${moves}手でクリア！${bonus ? `ボーナス+${bonus}` : ""}`);
            ctx.stamp(ex.id);
          }
        } else {
          lock = true;
          setTimeout(() => { a.classList.remove("flip"); c.classList.remove("flip"); flipped = []; lock = false; }, 800);
        }
      }));
    }
    $(".reset", root).onclick = setup;
    setup();
  },
};
