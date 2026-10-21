// カットオフ：病気の人と健康な人の検査値の分布を見ながら、カットオフをスライダーで動かす。
// 2×2表と4つの指標がその場で変わる。目標（例：感度95%以上で特異度を最大に）を満たせば正解（20）→ 質問（10）
import "./koshu.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { CutoffData } from "./cutoff.schema";
import { best, density, METRIC_LABEL, table, type Metric } from "./cutoff.consts";
import { $, $$, esc, shuffle } from "../../../engine/dom";

const C1 = 20, C2 = 10, W = 340, H = 150, L = 10, R = 330, T = 10, B = 128, TOL = 0.03;
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
const x = (v: number) => L + (v / 100) * (R - L);

function curves(c: CutoffData["cases"][number]) {
  const d = c.dist, mx = Math.max(density(d.mu1, d.mu1, d.s1), density(d.mu0, d.mu0, d.s0));
  const path = (mu: number, s: number) => Array.from({ length: 101 }, (_, i) => `${x(i).toFixed(1)},${(B - (density(i, mu, s) / mx) * (B - T)).toFixed(1)}`).join(" ");
  return `<svg class="dist" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(c.testName)}の値の分布">
    <polyline points="${x(0)},${B} ${path(d.mu0, d.s0)} ${x(100)},${B}" fill="#22C1A0" fill-opacity=".25" stroke="#22C1A0" stroke-width="2.5"/>
    <polyline points="${x(0)},${B} ${path(d.mu1, d.s1)} ${x(100)},${B}" fill="#FF5A36" fill-opacity=".25" stroke="#FF5A36" stroke-width="2.5"/>
    <line x1="${L}" x2="${R}" y1="${B}" y2="${B}" stroke="currentColor"/>
    <line class="cl" x1="${x(50)}" x2="${x(50)}" y1="${T - 4}" y2="${B + 4}" stroke="#3D5AFE" stroke-width="3"/>
    <text x="${x(d.mu0)}" y="${H - 6}" font-size="10" text-anchor="middle">病気なし</text><text x="${x(d.mu1)}" y="${H - 6}" font-size="10" text-anchor="middle" style="fill:#C0381A">病気あり</text>
    <text x="${R}" y="${T + 8}" font-size="9" text-anchor="end">形だけ示す（高さは人数ではない）。青線より右が陽性</text>
  </svg>`;
}

export const cutoff: CustomModule<CutoffData> = {
  mount(root, ex, ctx) {
    const d = ex.data, okKey = `${ex.id}.ok`;
    let q = shuffle(d.cases), qi = 0;
    function render() {
      const c = q[qi % q.length], need = c.need as Metric, mx = c.maximize as Metric, opt = best(c.dist, need, c.min, mx)!;
      let stage = 0;
      ctx.cheat.reset(ex.id);
      root.innerHTML = `<div class="finding" style="border:3px solid var(--line);border-radius:14px;background:var(--bg);padding:10px 12px;font-weight:800">${esc(c.story)}<div class="small" style="margin-top:4px">有病率 ${pct(c.dist.prev)}（1万人あたり ${Math.round(c.dist.prev * 10000)}人）</div></div>
        <div class="goalCard">目標：${METRIC_LABEL[need]}を ${Math.round(c.min * 100)}%以上に保ったまま、${METRIC_LABEL[mx]}をできるだけ高く</div>
        ${curves(c)}
        <div class="cut"><input type="range" min="0" max="100" step="0.5" value="50" aria-label="カットオフ"></div>
        <table class="tbl2"><tr><th></th><th>病気あり</th><th>病気なし</th></tr>
          <tr><th>陽性</th><td class="tp"><small>真陽性</small><span data-k="tp"></span></td><td class="fp"><small>偽陽性</small><span data-k="fp"></span></td></tr>
          <tr><th>陰性</th><td class="fn"><small>偽陰性</small><span data-k="fn"></span></td><td class="tn"><small>真陰性</small><span data-k="tn"></span></td></tr></table>
        <div class="metrics">${(["sens", "spec", "ppv", "npv"] as Metric[]).map((m) => `<div class="${m === need ? "goal" : m === mx ? "max" : ""}">${METRIC_LABEL[m]}<b data-m="${m}"></b></div>`).join("")}</div>
        <div class="row" style="justify-content:center;margin-top:8px"><button class="btn go">このカットオフで決定</button></div>
        <div class="step2"></div>`;
      const range = $("input", root) as HTMLInputElement;
      const show = () => {
        const v = +range.value, t = table(c.dist, v);
        $(".cl", root).setAttribute("x1", String(x(v))); $(".cl", root).setAttribute("x2", String(x(v)));
        (["tp", "fp", "fn", "tn"] as const).forEach((k) => ($(`[data-k="${k}"]`, root).textContent = Math.round(t[k]).toLocaleString()));
        (["sens", "spec", "ppv", "npv"] as Metric[]).forEach((m) => ($(`[data-m="${m}"]`, root).textContent = pct(t[m])));
      };
      range.oninput = show; show();
      $(".go", root).onclick = () => {
        if (stage) return;
        stage = 1; range.disabled = true; $(".go", root).setAttribute("disabled", "");
        const t = table(c.dist, +range.value), ok1 = t[need] >= c.min && t[mx] >= opt.v - TOL;
        if (ok1) { ctx.sound.ding(); ctx.award(C1, $(".metrics", root)); } else ctx.sound.boo();
        const why = t[need] < c.min ? `${METRIC_LABEL[need]}が目標に届いていない` : `${METRIC_LABEL[mx]}がもっと上げられる`;
        const f = c.followUp, box = $(".step2", root);
        box.innerHTML = `<p class="small" style="font-weight:800;margin:8px 0 0">${ok1 ? "目標達成！" : `おしい（${why}）。`}いちばんよいカットオフは ${opt.c} 付近（${METRIC_LABEL[mx]} ${pct(opt.v)}）</p>
          <div class="stepLabel">② ${esc(f.question)}</div><div class="opts">${f.options.map((o, i) => `<button class="opt" data-i="${i}">${esc(o)}</button>`).join("")}</div><div class="fbBox"></div>`;
        $$<HTMLButtonElement>(".opt", box).forEach((o) => (o.onclick = () => {
          const ok = +o.dataset.i! === f.answer;
          $$<HTMLButtonElement>(".opt", box).forEach((y) => { y.disabled = true; if (+y.dataset.i! === f.answer) y.classList.add("right"); });
          if (ok) { ctx.sound.ding(); ctx.award(C2, o); ctx.cheat.rewardIfUnpeeked(ex.id, o); } else { o.classList.add("wrong"); ctx.sound.boo(); }
          if (!ok) ctx.miss({ id: `${ex.id}-${c.id}`, src: ex.title, q: `${c.story}${f.question}`, opts: shuffle([f.options[f.answer], ...shuffle(f.options.filter((_, i) => i !== f.answer)).slice(0, 2)]), ans: f.options[f.answer] });
          if (ok && ok1 && ctx.prog(okKey) >= d.stampAt) ctx.stamp(ex.id);
          ctx.feedback($(".fbBox", box), ok && ok1, ok && ok1 ? "両方正解！" : ok ? "②は正解！" : `正解は「${esc(f.options[f.answer])}」`, `${esc(c.explanation)}<div style="margin-top:8px"><button class="btn next">次の検査</button></div>`);
          $(".next", box).onclick = () => { qi++; if (qi % q.length === 0) q = shuffle(d.cases); render(); };
        }));
      };
    }
    render();
  },
};
