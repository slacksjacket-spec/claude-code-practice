// 3.1 診断ラボ：予算内で検査を選び、診断を選ぶ。回答後に「理想の流れ」と確率バー（イメージ値）。
import "./diagnosisLab.css";
import type { ExhibitModule } from "./types";
import { missOpts } from "./types";
import type { ExhibitOf } from "../schema";
import { $, $$, esc, shuffle } from "../dom";

type Data = ExhibitOf<"DiagnosisLab">["data"];
type Case = Data["cases"][number];

const BASE = 20, PER_BUDGET = 3; // 正解で 20＋残り予算×3（SPEC 3.1）

const norm = (a: number[]) => { const s = a.reduce((x, y) => x + y, 0) || 1; return a.map((v) => (v / s) * 100); };

function flowHTML(d: Data, c: Case, done: Set<string>) {
  const f = c.flow, test = (id: string) => d.tests.find((t) => t.id === id)!;
  const cost = f.steps.reduce((a, s) => a + test(s.test).cost, 0), mine = [...done];
  const useful = new Set(f.steps.map((s) => s.test));
  return `<div class="flowBox"><b class="disp" style="font-size:16px">理想の流れ（検査コスト ${cost}）</b>
  <div class="flowNav"><button class="btn alt" data-d="-1" aria-label="前のステップ">◀</button><span class="flowPos"></span><button class="btn" data-d="1" aria-label="次のステップ">▶</button></div>
  <div class="flowStep"></div><div class="bars">${d.diagnoses.map((x, j) => `<div class="barRow"><span>${esc(x.short)}</span><div class="barT"><i data-j="${j}" class="${j === c.answer ? "ans" : ""}"></i></div><em data-j="${j}"></em></div>`).join("")}</div>
  <p class="small" style="margin:8px 0 0">${esc(f.note)}</p>
  <p class="small" style="margin:6px 0 0;color:var(--sub)">あなたの検査：${mine.length ? mine.map((t) => `${esc(test(t).name)}${useful.has(t) ? "" : "（今回は決め手にならず）"}`).join("、") : "なし"}${mine.length ? `　コスト ${mine.reduce((a, t) => a + test(t).cost, 0)}` : ""}</p>
  <p class="small" style="margin:4px 0 0;color:var(--sub)">確率はイメージです。</p></div>`;
}

function flowBind(box: HTMLElement, d: Data, c: Case, beep: (f: number, d: number, t: OscillatorType, v: number) => void) {
  const f = c.flow, n = f.steps.length, short = d.diagnoses.map((x) => x.short);
  let k = 0;
  const show = () => {
    const p = norm(k === 0 ? f.prior : f.steps[k - 1].probs);
    $(".flowPos", box).textContent = k === 0 ? "問診" : `${k} / ${n}`;
    let html: string;
    if (k === 0) html = `<div class="fs card-pop"><span class="tagk">問診</span> ${esc(f.priorWhy)}</div>`;
    else {
      const s = f.steps[k - 1], t = d.tests.find((x) => x.id === s.test)!, prev = norm(k === 1 ? f.prior : f.steps[k - 2].probs);
      const up = p.map((v, j) => [v - prev[j], j]).filter((x) => x[0] > 4).map((x) => short[x[1]]);
      const down = p.map((v, j) => [prev[j] - v, j]).filter((x) => x[0] >= 3 && p[x[1]] <= 2).map((x) => short[x[1]]);
      html = `<div class="fs card-pop"><span class="tagk">${k}</span> <b>${esc(t.name)}</b>（${t.cost}）→ <b>${esc(s.finding)}</b><br>${esc(s.why)}${down.length ? `<br><span class="dn">否定：${esc(down.join("、"))}</span>` : ""}${up.length ? `<br><span class="upp">上昇：${esc(up.join("、"))}</span>` : ""}</div>`;
    }
    $(".flowStep", box).innerHTML = html;
    $$<HTMLElement>(".barT i", box).forEach((i) => (i.style.width = p[+i.dataset.j!].toFixed(1) + "%"));
    $$<HTMLElement>("em", box).forEach((e) => (e.textContent = Math.round(p[+e.dataset.j!]) + "%"));
    $<HTMLButtonElement>('[data-d="-1"]', box).disabled = k === 0;
    $<HTMLButtonElement>('[data-d="1"]', box).disabled = k === n;
  };
  $$<HTMLButtonElement>(".flowNav button", box).forEach((b) => (b.onclick = () => {
    k = Math.max(0, Math.min(n, k + +b.dataset.d!));
    beep(500 + k * 80, 0.06, "triangle", 0.05);
    show();
  }));
  show();
}

const face = (color: string) => `<svg viewBox="0 0 78 78" width="78" height="78"><circle cx="39" cy="39" r="34" fill="${esc(color)}" stroke="#1C1537" stroke-width="3"/><ellipse cx="28" cy="34" rx="7" ry="5" fill="#F7EA88" stroke="#1C1537" stroke-width="2"/><ellipse cx="50" cy="34" rx="7" ry="5" fill="#F7EA88" stroke="#1C1537" stroke-width="2"/><circle cx="28" cy="35" r="2.6" fill="#1C1537"/><circle cx="50" cy="35" r="2.6" fill="#1C1537"/><path d="M30 54 Q39 50 48 54" stroke="#1C1537" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`;

export const DiagnosisLab: ExhibitModule<"DiagnosisLab"> = {
  mount(root, ex, ctx) {
    const d = ex.data, dxNames = d.diagnoses.map((x) => x.name);
    let q = shuffle(d.cases), i = 0;

    function render() {
      const c = q[i];
      let budget = d.budget, answered = false;
      const done = new Set<string>();
      root.innerHTML = `<div class="hud"><span class="tagk">患者 ${i + 1} / ${q.length}</span><span class="small" style="font-weight:800">予算</span><span class="budget"></span></div>
  <div class="patient">${face(c.faceColor ?? "#F2D36B")}
  <div><b class="disp" style="font-size:18px">${esc(c.who)}</b><div style="font-size:14px;font-weight:800">${esc(c.vignette)}</div></div></div>
  <div class="tests">${d.tests.map((t) => `<button class="test" data-t="${esc(t.id)}">${esc(t.name)}<span class="cost">${t.cost}</span></button>`).join("")}</div>
  <div class="slip"><span style="opacity:.6">検査をタップするとここに結果が出ます</span></div>
  <div class="stepLabel">診断は？</div>
  <div class="opts dx">${d.diagnoses.map((x, j) => `<button class="opt" data-i="${j}">${esc(x.name)}</button>`).join("")}</div>
  <div class="fbBox"></div>`;
      const bud = () => ($(".budget", root).innerHTML = Array.from({ length: d.budget }, (_, j) => `<i class="${j >= budget ? "used" : ""}"></i>`).join(""));
      bud();
      $$<HTMLButtonElement>(".test", root).forEach((b) => (b.onclick = () => {
        const id = b.dataset.t!;
        if (answered || done.has(id)) return;
        const t = d.tests.find((x) => x.id === id)!;
        if (t.cost > budget) { ctx.sound.boo(); ctx.toast("予算が足りない！"); return; }
        budget -= t.cost; done.add(id); b.classList.add("done"); bud();
        ctx.sound.beep(700, 0.06, "triangle", 0.05);
        const slip = $(".slip", root);
        if (done.size === 1) slip.innerHTML = "";
        const r = c.results[id];
        slip.insertAdjacentHTML("beforeend", `<div class="${r.abnormal ? "ab" : ""}">${esc(t.name)}：${esc(r.text)}</div>`);
      }));
      $$<HTMLButtonElement>(".dx .opt", root).forEach((b) => (b.onclick = () => {
        if (answered) return;
        answered = true;
        const ok = +b.dataset.i! === c.answer;
        $$<HTMLButtonElement>(".dx .opt", root).forEach((x) => { x.disabled = true; if (+x.dataset.i! === c.answer) x.classList.add("right"); });
        if (!ok) {
          b.classList.add("wrong"); ctx.sound.boo();
          ctx.miss({ id: `${ex.id}-${c.answer}`, src: ex.title, q: `${c.who}：${c.vignette}`, opts: missOpts(dxNames[c.answer], dxNames, shuffle), ans: dxNames[c.answer] });
        } else {
          ctx.sound.ding(); ctx.award(BASE + budget * PER_BUDGET, b);
          if (ctx.prog(`${ex.id}.ok`) >= d.stampAt) ctx.stamp(ex.id);
        }
        const fbBox = $(".fbBox", root);
        ctx.feedback(fbBox, ok, ok ? `正解！ 残り予算ボーナス +${budget * PER_BUDGET}` : `正解は「${esc(dxNames[c.answer])}」`,
          `${esc(c.explanation)}${flowHTML(d, c, done)}<div style="margin-top:10px"><button class="btn next">${i < q.length - 1 ? "次の患者" : "もう一巡"}</button></div>`);
        flowBind($(".flowBox", fbBox), d, c, ctx.sound.beep);
        $(".next", fbBox).onclick = () => {
          i++;
          if (i >= q.length) { q = shuffle(d.cases); i = 0; }
          render();
          root.closest("article")?.scrollIntoView({ behavior: "smooth" });
        };
      }));
    }
    render();
  },
};
