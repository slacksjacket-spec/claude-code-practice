// 内視鏡ラン：内視鏡を進めると病変が次々に現れる。そのたびに、どうするかを即決する
import "./endoscopy.css";
import type { CustomModule } from "../../../engine/exhibits/types";
import type { EndoscopyData } from "./endoscopy.schema";
import type { Look } from "./endoscopy.consts";
import { $, $$, esc, shuffle } from "../../../engine/dom";

const COINS = 10, CLEAR_BONUS = 20;

/** 内視鏡の視野の模式図（まるい視野、奥が暗い管腔） */
function view(look: Look | null) {
  const L: Record<Look, string> = {
    linearErosion: `<path d="M150 70 L128 150 M166 78 L150 160 M134 66 L108 140" stroke="#F4F4F4" stroke-width="7" stroke-linecap="round" opacity=".9"/><path d="M150 70 L128 150 M166 78 L150 160" stroke="#E0463A" stroke-width="2" stroke-linecap="round"/>`,
    varixRed: `<path d="M60 150 C80 120 70 90 92 60" stroke="#5B6FD8" stroke-width="18" fill="none" stroke-linecap="round"/><path d="M150 160 C140 120 160 90 146 56" stroke="#5B6FD8" stroke-width="16" fill="none" stroke-linecap="round"/><g fill="#E23B3B"><circle cx="78" cy="118" r="4"/><circle cx="86" cy="90" r="3"/><circle cx="150" cy="120" r="4"/></g>`,
    tear: `<path d="M120 50 C126 90 118 130 124 170" stroke="#9E1C1C" stroke-width="10" stroke-linecap="round" fill="none"/><path d="M124 170 C130 180 136 196 128 206" stroke="#C0201C" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="126" cy="206" r="6" fill="#C0201C"/>`,
    spurting: `<ellipse cx="120" cy="140" rx="36" ry="26" fill="#F2EDE2"/><path d="M120 140 C110 110 96 90 80 80 M120 140 C126 108 136 92 152 84 M120 140 C118 110 120 90 118 70" stroke="#D11B1B" stroke-width="7" stroke-linecap="round" fill="none"/><circle cx="120" cy="140" r="8" fill="#B51010"/>`,
    ulcerVessel: `<ellipse cx="120" cy="140" rx="38" ry="26" fill="#F2EDE2"/><circle cx="122" cy="138" r="9" fill="#9B1B30" stroke="#5E0F1D" stroke-width="3"/>`,
    ulcerClean: `<ellipse cx="120" cy="140" rx="38" ry="26" fill="#F7F4EC"/><ellipse cx="120" cy="140" rx="46" ry="33" fill="none" stroke="#E8A49A" stroke-width="6"/>`,
    polyps: `<g fill="#F3B3A4" stroke="#C97C6F" stroke-width="2"><circle cx="80" cy="96" r="10"/><circle cx="150" cy="80" r="8"/><circle cx="160" cy="140" r="11"/><circle cx="96" cy="160" r="9"/><circle cx="126" cy="110" r="7"/></g>`,
    depressed: `<path d="M92 128 C100 110 146 108 154 128 C158 150 132 164 112 160 C96 156 88 142 92 128Z" fill="#E86A5E" stroke="#B8443A" stroke-width="2"/>`,
    earlyCa: `<path d="M86 124 C96 100 152 100 160 124 C164 152 134 168 110 164 C92 160 82 144 86 124Z" fill="#E86A5E" stroke="#B8443A" stroke-width="3"/><path d="M104 122 L142 146 M140 118 L108 150" stroke="#B8443A" stroke-width="2"/>`,
    advancedCa: `<path d="M60 150 C60 90 180 86 184 146 C186 196 64 204 60 150Z" fill="#D8A48C" stroke="#8C4A3A" stroke-width="5"/><path d="M84 148 C88 118 158 116 160 146 C160 172 88 176 84 148Z" fill="#6B4A3A"/>`,
    smt: `<ellipse cx="120" cy="136" rx="52" ry="40" fill="#EFA394"/><ellipse cx="116" cy="124" rx="30" ry="18" fill="#F7C0B4" opacity=".7"/><circle cx="124" cy="136" r="6" fill="#B8443A"/>`,
  };
  return `<svg class="scopeView" viewBox="0 0 240 240" aria-label="内視鏡の視野の模式図">
    <defs><radialGradient id="lumen" cx="50%" cy="46%" r="60%"><stop offset="0" stop-color="#2A0F0F"/><stop offset=".35" stop-color="#8E3B35"/><stop offset="1" stop-color="#F0A596"/></radialGradient></defs>
    <circle cx="120" cy="120" r="118" fill="url(#lumen)"/>
    <path d="M30 120 C60 100 80 104 120 100 M40 170 C80 150 110 150 150 146" stroke="#E08A7E" stroke-width="3" fill="none" opacity=".6"/>
    ${look ? L[look] : ""}
  </svg>`;
}

export const endoscopy: CustomModule<EndoscopyData> = {
  mount(root, ex, ctx) {
    const d = ex.data;
    let run: EndoscopyData["lesions"] = [], i = 0, okN = 0, marks: ("ok" | "ng")[] = [];

    function start() {
      // 食道 → 胃 → 十二指腸の順に並べ直す（内視鏡は奥へ進むので）
      run = shuffle(d.lesions).slice(0, d.runLength).sort((a, b) => d.segments.indexOf(a.segment) - d.segments.indexOf(b.segment));
      i = 0; okN = 0; marks = [];
      travel();
    }
    const dots = () => `<div class="scopeDots">${run.map((_, k) => `<i class="${marks[k] ?? (k === i ? "cur" : "")}"></i>`).join("")}</div>`;
    const track = (seg: string | null) => `<div class="scopeTrack">${d.segments.map((s) => `<span class="${s === seg ? "here" : ""}">${esc(s)}</span>`).join("")}</div>`;

    // 次の病変まで進む
    function travel() {
      const l = run[i];
      root.innerHTML = `${track(i === 0 ? null : run[i - 1].segment)}${view(null)}${dots()}
        <div class="row" style="justify-content:center;margin-top:6px"><button class="btn go">${i === 0 ? "内視鏡を入れる" : "すすめる"}</button></div>`;
      $(".go", root).onclick = () => { ctx.sound.beep(300, 0.25, "sawtooth", 0.03, 700); lesion(l); };
    }

    function lesion(l: EndoscopyData["lesions"][number]) {
      root.innerHTML = `${track(l.segment)}${view(l.look)}${dots()}
        <div class="finding"><span class="tagk">${esc(l.segment)}</span> ${esc(l.finding)}</div>
        <div class="stepLabel">どうする？</div>
        <div class="opts">${d.actions.map((a, k) => `<button class="opt" data-k="${k}">${esc(a)}</button>`).join("")}</div><div class="fbBox"></div>`;
      $(".scopeView", root).classList.add("rush");
      const acc = [l.answer, ...(l.alt ?? [])];
      $$<HTMLButtonElement>(".opt", root).forEach((b) => (b.onclick = () => {
        const k = +b.dataset.k!, ok = acc.includes(k);
        $$<HTMLButtonElement>(".opt", root).forEach((x) => { x.disabled = true; if (acc.includes(+x.dataset.k!)) x.classList.add("right"); });
        marks[i] = ok ? "ok" : "ng";
        if (ok) { okN++; ctx.sound.ding(); ctx.award(COINS, b); }
        else {
          b.classList.add("wrong"); ctx.sound.boo();
          const ans = d.actions[l.answer];
          ctx.miss({ id: `${ex.id}-${l.id}`, src: ex.title, q: `${l.segment}：${l.finding} どうする？`, opts: shuffle([ans, ...shuffle(d.actions.filter((_, j) => !acc.includes(j))).slice(0, 2)]), ans });
        }
        $$(".scopeDots i", root).forEach((dot, k) => (dot.className = marks[k] ?? ""));
        const last = i === run.length - 1, fb = $(".fbBox", root);
        ctx.feedback(fb, ok, ok ? "その判断でOK！" : `正解は「${acc.map((a) => esc(d.actions[a])).join("」「")}」`,
          `${esc(l.explanation)}<div style="margin-top:8px"><button class="btn next">${last ? "検査を終える" : "すすめる"}</button></div>`);
        $(".next", fb).onclick = () => { i++; if (last) finish(); else travel(); };
      }));
    }

    function finish() {
      const clear = okN >= d.passScore;
      root.innerHTML = `${track(null)}${dots()}<div class="feedback card-pop"><b class="t">${okN} / ${run.length} 正しい判断</b>${clear ? `検査クリア！ボーナス +${CLEAR_BONUS}` : `${d.passScore}つ以上でクリア。もう一回！`}<div style="margin-top:8px"><button class="btn again">もう一度検査する</button></div></div>`;
      if (clear) { ctx.award(CLEAR_BONUS, $(".again", root)); ctx.sound.yay(); ctx.stamp(ex.id); }
      $(".again", root).onclick = start;
    }
    start();
  },
};
