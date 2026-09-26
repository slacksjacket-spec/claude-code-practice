// スタンプとスタンプカード（全部そろうと修了証）
import type { Ctx } from "./context";
import { $, esc } from "./dom";
import { rankOf } from "./economy";
import { clear } from "./storage";

export function dialogHTML(hallTitle: string) {
  return `<dialog id="cardDlg"><div class="cert">
  <div class="frame">
    <p class="disp" style="font-size:14px;color:var(--sub)">${esc(hallTitle)}</p>
    <h3 id="certTitle">スタンプカード</h3>
    <p style="margin:0;font-weight:800" id="certRank"></p>
    <div class="stampGrid" id="stampGrid"></div>
    <div id="certBody"></div>
  </div>
  <div style="margin-top:14px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap"><button class="btn alt" id="resetAll">データを消して最初から</button><button class="btn" id="closeDlg">とじる</button></div>
</div></dialog>`;
}

/** スタンプの並び [exhibit.id, stampLabel] */
export const stampList = (ctx: Pick<Ctx, "hall">) => {
  const ex = ctx.hall.wings.flatMap((w) => w.exhibits);
  return ctx.hall.stampOrder.map((id) => [id, ex.find((e) => e.id === id)!.stampLabel] as const);
};

export function mountStampCard(ctx: Ctx, storageKey: string) {
  const dlg = $<HTMLDialogElement>("#cardDlg");
  const S = stampList(ctx);
  function open() {
    const { st } = ctx, all = S.every(([k]) => st.stamps[k]);
    $("#stampGrid").innerHTML = S.map(([k, n]) => `<div class="${st.stamps[k] ? "on" : ""}">${esc(n)}${st.stamps[k] ? "<br>済" : ""}</div>`).join("");
    $("#certTitle").textContent = all ? "修了証" : "スタンプカード";
    $("#certRank").textContent = `${rankOf(st.xp)}　XP ${st.xp}　コイン ${st.coins}`;
    $("#certBody").innerHTML = all
      ? `<p style="margin:0 0 8px;font-weight:800">あなたは${esc(ctx.hall.title)}の全展示を制覇しました。</p><input id="certName" placeholder="名前を書いてね" aria-label="名前"><p class="disp" style="margin:10px 0 0;font-size:13px;color:var(--sub)">病気博物館 館長</p>`
      : `<p style="margin:0;font-weight:800">あと${S.filter(([k]) => !st.stamps[k]).length}個。展示で遊んで集めよう。</p>`;
    dlg.showModal ? dlg.showModal() : dlg.setAttribute("open", "");
    if (all) { ctx.confetti(160); ctx.sound.yay(); }
  }
  for (const id of ["#stampPill", "#rankPill", "#openCard"]) $(id).onclick = open;
  $("#closeDlg").onclick = () => dlg.close();
  $("#resetAll").onclick = () => {
    if (!confirm("コイン・スタンプ・収蔵庫をすべて消しますか？")) return;
    clear(storageKey);
    location.reload();
  };
  return { open };
}
