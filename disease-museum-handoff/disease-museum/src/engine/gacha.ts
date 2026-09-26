// ガチャ（ごほうび）。1回 cost コイン、最初の1回は無料、ダブりは dupRefund 返却、
// ダブりが pityAfterDups 回続いたら次は未入手から確定（天井）。
import type { Ctx } from "./context";
import type { GachaSpec } from "./schema";
import { $, esc, inkOn, replay } from "./dom";
import { XP_GACHA_COMPLETE, XP_GACHA_NEW } from "./economy";

const stars = (n: number) => "★".repeat(n);

export function howText(g: GachaSpec) {
  return `展示で稼いだコインで回そう。1回${g.cost}コイン（最初の1回は無料）。ダブりは${g.dupRefund}コイン返却、${g.pityAfterDups}回続けてダブったら次は新種確定。${g.items.length}種そろえると図鑑コンプリート。`;
}

export function exhibitHTML(g: GachaSpec) {
  const dome = g.domeColors ?? [0, 1, 2, 3, 4].map((i) => g.items[i % g.items.length].color);
  const balls: [number, number][] = [[72, 112], [110, 130], [146, 110], [92, 78], [134, 72]];
  return `<article class="pop exhibit" id="ex-gacha">
    <span class="plaque">ごほうび</span>
    <h3>${esc(g.title)}</h3>
    <p class="how">${esc(howText(g))}</p>
    <div class="gacha">
      <div>
        <svg class="machine" id="machine" viewBox="0 0 220 300" aria-label="ガチャマシン">
          <g class="dome"><circle cx="110" cy="96" r="84" fill="#DDF4FF" stroke="#1C1537" stroke-width="4"/>
            ${balls.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="16" fill="${dome[i]}" stroke="#1C1537" stroke-width="3"/>`).join("")}
            <path d="M60 50 Q80 30 110 28" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round"/></g>
          <rect x="30" y="170" width="160" height="116" rx="18" fill="var(--tomato)" stroke="#1C1537" stroke-width="4"/>
          <text x="110" y="200" text-anchor="middle" font-family="Dela Gothic One" font-size="16" fill="#fff">${esc(g.machineLabel)}</text>
          <g class="knob" id="knob"><circle cx="110" cy="236" r="26" fill="var(--sun)" stroke="#1C1537" stroke-width="4"/><rect x="104" y="214" width="12" height="44" rx="6" fill="#fff" stroke="#1C1537" stroke-width="3"/></g>
          <rect x="140" y="258" width="38" height="22" rx="6" fill="#1C1537"/>
          <circle id="capsule" cx="159" cy="268" r="0" fill="var(--sun)" stroke="#1C1537" stroke-width="3"/>
        </svg>
        <div style="text-align:center;margin-top:8px"><button class="btn" id="spin">回す</button></div><p id="pity" style="text-align:center;margin:6px 0 0;font-size:13px;font-weight:800;color:var(--sub)"></p>
      </div>
      <div>
        <div class="prize" id="prize"><span class="rar">？？？</span><h4>なにが出るかな</h4><p style="margin:0;font-size:14px">${esc(g.intro)}</p></div>
        <div class="coll" id="coll"></div>
      </div>
    </div>
  </article>`;
}

/** 1回ぶんの抽選（天井つき）。シミュレーションからも使う */
export function draw(g: GachaSpec, got: Record<string, unknown>, dry: number, rnd = Math.random) {
  const rest = g.items.filter((s) => !got[s.id]);
  if (rest.length && dry >= g.pityAfterDups) return rest[Math.floor(rnd() * rest.length)];
  let r = rnd() * g.items.reduce((a, s) => a + s.weight, 0);
  for (const s of g.items) if ((r -= s.weight) < 0) return s;
  return g.items[0];
}

export function mountGacha(ctx: Ctx) {
  const g = ctx.hall.gacha, st = ctx.st;
  function renderColl() {
    $("#coll").innerHTML = g.items.map((s) => {
      const got = !!st.gacha[s.id];
      return `<span class="${got ? "got" : ""}" style="background:${got ? s.color : ""};color:${got ? inkOn(s.color) : "#1C1537"}" title="${got ? esc(s.name) : "未入手"}">${got ? stars(s.rarity) : "?"}</span>`;
    }).join("");
    const left = g.items.filter((s) => !st.gacha[s.id]).length;
    $("#spin").textContent = st.free ? "無料で回す" : `回す（${g.cost}コイン）`;
    $("#pity").textContent = left ? `あと${g.pityAfterDups + 1 - st.dry}回以内に新種確定` : "図鑑コンプリート済み";
  }
  let spinning = false;
  $("#spin").onclick = () => {
    if (spinning) return;
    if (!st.free && st.coins < g.cost) { ctx.sound.boo(); ctx.toast("コインが足りない。展示で稼ごう！"); return; }
    if (st.free) st.free = 0; else st.coins -= g.cost;
    ctx.save(); ctx.refresh();
    spinning = true;
    const m = $("#machine"), kn = $("#knob"), cap = $("#capsule");
    kn.style.transform = "rotate(360deg)";
    m.classList.add("shake");
    ctx.sound.beep(300, 0.5, "sawtooth", 0.03, 900);
    const pk = draw(g, st.gacha, st.dry);
    setTimeout(() => { cap.setAttribute("fill", pk.color); cap.setAttribute("r", "14"); ctx.sound.beep(1200, 0.08, "triangle", 0.07); }, 600);
    setTimeout(() => {
      const isNew = !st.gacha[pk.id];
      st.gacha[pk.id] = 1;
      if (isNew) { ctx.addXp(XP_GACHA_NEW); st.dry = 0; } else { st.dry += 1; st.coins += g.dupRefund; }
      ctx.save();
      const prize = $("#prize");
      prize.innerHTML = `<span class="rar">${stars(pk.rarity)}${isNew ? "　NEW!" : `　ダブり（${g.dupRefund}コイン返却）`}</span><h4>${esc(pk.name)}</h4><p style="margin:0;font-size:14px">${esc(pk.text)}</p>`;
      replay(prize, "card-pop");
      if (pk.rarity >= 3) { ctx.sound.yay(); ctx.confetti(40); } else ctx.sound.beep(880, 0.12, "square", 0.05);
      renderColl(); ctx.refresh();
      m.classList.remove("shake");
      kn.style.transition = "none"; kn.style.transform = "rotate(0)"; void kn.offsetWidth; kn.style.transition = "";
      cap.setAttribute("r", "0");
      spinning = false;
      if (isNew && g.items.every((s) => st.gacha[s.id])) {
        ctx.toast(`図鑑コンプリート！XP+${XP_GACHA_COMPLETE}`);
        ctx.addXp(XP_GACHA_COMPLETE);
        ctx.confetti(150);
      }
    }, 1100);
  };
  renderColl();
}

