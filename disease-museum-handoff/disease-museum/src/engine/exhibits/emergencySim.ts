// 3.5 ER：モニターと経過時間つきで、重症度判定（STEP 1）→ 指示とタイミング（STEP 2）。まちがえるたび時間が進む
import "./emergencySim.css";
import type { ExhibitModule } from "./types";
import type { ExhibitOf } from "../schema";
import { $, $$, esc, shuffle } from "../dom";

const GRADE_COINS = 15, ORDER_COINS = 30; // SPEC 3.5
const GRADE_MIN = 10, ORDER_MIN = 20;     // 正解で進む時間（試作の値）
type Vitals = ExhibitOf<"EmergencySim">["data"]["patients"][number]["vitals"];

type Ranges = ExhibitOf<"EmergencySim">["data"]["normalRanges"];

/** 生体情報モニター。波形はいつも緑で、基準の外の値だけ赤く点滅する（実際のモニターのアラーム表示に近づける）。心電図の速さは HR に合わせる */
function monitor(v: Vitals, r: Ranges) {
  const out = (x: number, [lo, hi]: [number, number]) => x < lo || x > hi;
  const sbp = parseInt(v.BP, 10);
  const al = { BP: out(sbp, r.SBP), HR: out(v.HR, r.HR), SpO2: out(v.SpO2, r.SpO2), T: out(v.T, r.T), 意識: v.意識 !== "清明" };
  const cell = (label: string, val: string | number, bad: boolean) => `<span class="${bad ? "alarm" : ""}">${label}</span><b class="${bad ? "alarm" : ""}">${esc(val)}</b>`;
  const beat = (1.6 * 75) / Math.max(30, v.HR); // 試作の波形は 1.6 秒で2拍（およそ HR 75）
  return `<div class="monitor"><svg viewBox="0 0 200 46" preserveAspectRatio="none"><path class="ecg" style="animation-duration:${beat.toFixed(2)}s" d="M0 26 L40 26 L48 26 L54 8 L60 42 L66 26 L110 26 L118 26 L124 8 L130 42 L136 26 L200 26"/></svg>
 <div class="vitals">${cell("BP", v.BP, al.BP)}${cell("HR", v.HR, al.HR)}${cell("SpO₂", v.SpO2, al.SpO2)}${cell("体温", v.T, al.T)}${cell("意識", v.意識, al.意識)}</div></div>`;
}

export const EmergencySim: ExhibitModule<"EmergencySim"> = {
  mount(root, ex, ctx) {
    const d = ex.data, N = d.patients.length;
    let pi = 0, stage = 0, min = 0, err = 0, sel = new Set<string>(), timing: number | null = null;
    let vitals = d.patients[0].vitals;

    function render() {
      const c = d.patients[pi];
      let h = `<div class="hud"><span class="tagk">患者 ${pi + 1} / ${N}</span><span class="clock${err ? " late" : ""}">経過 ${min}分</span><span class="small" style="font-weight:800">${esc(c.who)}</span></div>${monitor(vitals, d.normalRanges)}<div class="erText">${esc(c.complaint)}<br><span style="color:var(--sub)">${esc(c.labs)}</span></div>`;
      if (stage === 0) {
        h += `<div class="stepLabel">STEP 1　${esc(d.gradeQuestion)}</div><div class="opts grades">${d.gradeLabels.map((g, i) => `<button class="opt" data-g="${i}">${esc(g)}</button>`).join("")}</div><div class="fbBox"></div>`;
        root.innerHTML = h;
        $$<HTMLButtonElement>(".grades .opt", root).forEach((b) => (b.onclick = () => {
          if (+b.dataset.g! === c.grade) { ctx.sound.ding(); ctx.award(GRADE_COINS, b); stage = 1; min += GRADE_MIN; render(); }
          else {
            b.classList.add("wrong"); ctx.sound.boo(); err++; min += d.penaltyMinutes;
            ctx.miss({ id: `${ex.id}-g${c.grade}`, src: ex.title, q: `${c.who}：${c.complaint}${c.labs}。重症度は？`, opts: d.gradeLabels, ans: d.gradeLabels[c.grade] });
            ctx.toast(`判定ミス：${d.penaltyMinutes}分経過`);
            setTimeout(render, 600);
          }
        }));
      } else if (stage === 1) {
        const all = shuffle(d.orders.map((o) => o.name));
        h += `<div class="stepLabel">STEP 2　指示を出す（必要なものをすべて）</div><div class="opts orders">${all.map((o) => `<button class="opt ${sel.has(o) ? "sel" : ""}" data-o="${esc(o)}">${esc(o)}</button>`).join("")}</div>
    <div class="stepLabel">${esc(d.timingLabel)}</div><div class="opts timings">${d.timings.map((t, i) => `<button class="opt ${timing === i ? "sel" : ""}" data-i="${i}">${esc(t)}</button>`).join("")}</div>
    <div class="row" style="margin-top:12px"><button class="btn go">指示！</button></div><div class="fbBox"></div>`;
        root.innerHTML = h;
        $$<HTMLButtonElement>(".orders .opt", root).forEach((b) => (b.onclick = () => {
          const o = b.dataset.o!;
          sel.has(o) ? sel.delete(o) : sel.add(o);
          b.classList.toggle("sel");
          ctx.sound.beep(600, 0.04, "triangle", 0.04);
        }));
        $$<HTMLButtonElement>(".timings .opt", root).forEach((b) => (b.onclick = () => {
          timing = +b.dataset.i!;
          $$(".timings .opt", root).forEach((x) => x.classList.toggle("sel", x === b));
          ctx.sound.beep(600, 0.04, "triangle", 0.04);
        }));
        const go = $<HTMLButtonElement>(".go", root);
        go.onclick = () => {
          const need = new Set(c.requiredOrders);
          const lack = [...need].filter((o) => !sel.has(o)), extra = [...sel].filter((o) => !need.has(o)), tOk = timing === c.timing;
          if (!lack.length && !extra.length && tOk) {
            ctx.sound.yay(); ctx.award(ORDER_COINS, go); ctx.cheat.rewardIfUnpeeked(ex.id, go);
            stage = 2; min += ORDER_MIN; vitals = c.vitalsAfter;
            if (ctx.prog(`${ex.id}.ok`) >= d.stampAt) ctx.stamp(ex.id);
            render();
          } else {
            ctx.sound.boo(); err++; min += d.penaltyMinutes;
            ctx.miss({ id: `${ex.id}-t${c.grade}`, src: ex.title, q: `${d.condition} ${d.gradeLabels[c.grade]}。${d.timingLabel}は？`, opts: d.timings, ans: d.timings[c.timing] });
            const fb = $(".fbBox", root);
            ctx.feedback(fb, false, `容体が悪化…${d.penaltyMinutes}分経過`, `${lack.length ? `足りない指示：${esc(lack.join("、"))}<br>` : ""}${extra.length ? `不要な指示：${esc(extra.join("、"))}<br>` : ""}${tOk ? "" : `${esc(d.timingLabel)}を見直そう。`}<div style="margin-top:8px"><button class="btn retry">指示をやり直す</button></div>`);
            $(".retry", fb).onclick = render;
            $(".clock", root).classList.add("late");
          }
        };
      } else {
        h += `<div class="feedback card-pop" style="background:color-mix(in srgb,var(--mint) 30%,var(--card))"><b class="t">容体安定！（経過 ${min}分）</b>${esc(c.explanation)}<div style="margin-top:8px"><button class="btn next">${pi < N - 1 ? "次の患者" : "最初の患者から"}</button></div></div>`;
        root.innerHTML = h;
        $(".next", root).onclick = () => {
          ctx.cheat.reset(ex.id);
          pi = (pi + 1) % N; stage = 0; min = 0; sel = new Set(); timing = null; err = 0;
          vitals = d.patients[pi].vitals;
          render();
        };
      }
    }
    render();
  },
};
