// ほくろのABCDE：色素斑の絵を見て、メラノーマを疑うサイン（ABCDE）を全部選び（15）、対応を答える（10）
import "./mole.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { MoleData } from "./mole.schema";
import { $, $$, esc, shuffle } from "../../../engine/dom";

const PICK_COINS = 15, Q_COINS = 10, PX = 12; // 1 mm = 12 px
const KEYS = [["A", "非対称"], ["B", "境界が不整"], ["C", "色むら"], ["D", "6 mm超"], ["E", "変化"]] as const;
type L = MoleData["cases"][number]["lesion"];
const truth = (l: L) => ({ A: l.asym, B: l.border, C: l.colors >= 2, D: l.size > 6, E: l.evolving });

function blob(r0: number, l: L, cx: number, cy: number, k = 1) {
  const ph = Math.random() * 6, pts: string[] = [];
  for (let i = 0; i < 72; i++) {
    const t = (i / 72) * Math.PI * 2;
    let r = r0 * k;
    if (l.asym) r *= 1 + 0.28 * Math.cos(t + ph) + 0.12 * Math.sin(2 * t + ph);
    if (l.border) r *= 1 + 0.09 * Math.sin(9 * t + ph) + 0.05 * Math.sin(17 * t);
    pts.push(`${(cx + r * Math.cos(t)).toFixed(1)},${(cy + r * Math.sin(t)).toFixed(1)}`);
  }
  return pts.join(" ");
}
function figure(l: L) {
  const r = (l.size * PX) / 2, cx = 170, cy = 105;
  const cols = ["#6B3E22", "#2A1810", "#5A4A8A"];
  const layers = [`<polygon points="${blob(r, l, cx, cy)}" fill="${cols[0]}" ${l.border ? `stroke="${cols[0]}" stroke-width="3" stroke-opacity=".35"` : ""}/>`];
  if (l.colors >= 2) layers.push(`<polygon points="${blob(r, l, cx + r * 0.2, cy - r * 0.1, 0.5)}" fill="${cols[1]}"/>`);
  if (l.colors >= 3) layers.push(`<polygon points="${blob(r, l, cx - r * 0.3, cy + r * 0.25, 0.3)}" fill="${cols[2]}" opacity=".85"/>`);
  const ruler = Array.from({ length: 11 }, (_, i) => `<line x1="${50 + i * PX}" x2="${50 + i * PX}" y1="196" y2="${i % 5 ? 204 : 210}" stroke="#1C1537" stroke-width="1.5"/>`).join("");
  return `<svg class="moleFig" viewBox="0 0 340 230" role="img" aria-label="色素斑の模式図、直径およそ${l.size} mm">
    <circle cx="60" cy="40" r="2" fill="#C89A80"/><circle cx="280" cy="170" r="2" fill="#C89A80"/><circle cx="300" cy="60" r="1.6" fill="#C89A80"/>
    ${layers.join("")}
    <rect x="44" y="190" width="${10 * PX + 12}" height="26" rx="4" fill="#FFF8E0" stroke="#1C1537" stroke-width="2"/>${ruler}
    <text x="${50 + 10 * PX + 12}" y="208" font-size="11" font-weight="800" fill="#1C1537">10 mm</text>
  </svg>`;
}

export const mole: CustomModule<MoleData> = {
  mount(root, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`;
    let q = shuffle(d.cases), qi = 0;
    function render() {
      const c = q[qi % q.length], t = truth(c.lesion), sel = new Set<string>();
      let stage = 0;
      ctx.cheat.reset(ex.id);
      root.innerHTML = `<div class="finding" style="border:3px solid var(--line);border-radius:14px;background:var(--bg);padding:10px 12px;font-weight:800">${esc(c.story)}</div>
        ${figure(c.lesion)}
        <div class="stepLabel">① 当てはまるサインを全部選ぶ（なければ何も選ばずに決定）</div>
        <div class="abcde">${KEYS.map(([k, n]) => `<button data-k="${k}" aria-pressed="false"><b>${k}</b>${n}</button>`).join("")}</div>
        <div class="row" style="justify-content:center;margin-top:8px"><button class="btn go">決定</button></div>
        <div class="step2"></div>`;
      $$<HTMLButtonElement>(".abcde button", root).forEach((b) => (b.onclick = () => {
        if (stage) return;
        const k = b.dataset.k!;
        sel.has(k) ? sel.delete(k) : sel.add(k);
        b.setAttribute("aria-pressed", String(sel.has(k)));
        ctx.sound.beep(sel.has(k) ? 700 : 450, 0.05, "triangle", 0.04);
      }));
      $(".go", root).onclick = () => {
        if (stage) return;
        stage = 1;
        $(".go", root).setAttribute("disabled", "");
        let miss = 0;
        $$<HTMLButtonElement>(".abcde button", root).forEach((b) => {
          const k = b.dataset.k! as keyof typeof t, s = sel.has(k);
          b.disabled = true;
          if (t[k] && s) b.classList.add("right"); else if (s) { b.classList.add("wrong"); miss++; } else if (t[k]) { b.classList.add("missed"); miss++; }
        });
        const pickOk = miss === 0;
        if (pickOk) { ctx.sound.ding(); ctx.award(PICK_COINS, $(".moleFig", root)); } else ctx.sound.boo();
        const box = $(".step2", root);
        box.innerHTML = `<div class="stepLabel">② ${esc(c.question)}</div><div class="opts">${c.options.map((o, i) => `<button class="opt" data-i="${i}">${esc(o)}</button>`).join("")}</div><div class="fbBox"></div>`;
        $$<HTMLButtonElement>(".opt", box).forEach((o) => (o.onclick = () => {
          const ok = +o.dataset.i! === c.answer;
          $$<HTMLButtonElement>(".opt", box).forEach((x) => { x.disabled = true; if (+x.dataset.i! === c.answer) x.classList.add("right"); });
          if (ok) { ctx.sound.ding(); ctx.award(Q_COINS, o); ctx.cheat.rewardIfUnpeeked(ex.id, o); } else { o.classList.add("wrong"); ctx.sound.boo(); }
          if (!ok || !pickOk) ctx.miss({ id: `${ex.id}-${c.id}`, src: ex.title, q: `${c.story}${c.question}`, opts: shuffle([c.options[c.answer], ...shuffle(c.options.filter((_, i) => i !== c.answer)).slice(0, 2)]), ans: c.options[c.answer] });
          if (ok && pickOk && ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id);
          const on = KEYS.filter(([k]) => t[k]).map(([k]) => k).join("・") || "なし";
          ctx.feedback($(".fbBox", box), ok && pickOk, ok && pickOk ? "観察も判断も正解！" : ok ? "判断は正解！（サインは点線と赤を確認）" : `正解は「${esc(c.options[c.answer])}」`, `当てはまるサイン：${on}。${esc(c.explanation)}<div style="margin-top:8px"><button class="btn next">次へ</button></div>`);
          $(".next", box).onclick = () => { qi++; if (qi % q.length === 0) q = shuffle(d.cases); render(); };
        }));
      };
    }
    render();
  },
};
