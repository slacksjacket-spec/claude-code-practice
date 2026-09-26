// カンペ：見たい人だけが開ける基準表。開かずに正解すると「ノーカンペ +5」
import type { Hall } from "./schema";
import { $, $$ } from "./dom";
import { beep } from "./sound";

export const NO_PEEK_BONUS = 5;

export function dialogHTML() {
  return `<dialog id="peekDlg"><div class="peekIn"><div class="peekHead"><b class="disp" id="peekTitle"></b><button class="btn alt" id="peekClose">とじる</button></div><div id="peekBody"></div></div></dialog>`;
}

export function createCheat(hall: Hall, award: (n: number, el?: Element | null) => void, toast: (t: string) => void) {
  const peeked: Record<string, boolean> = {};
  const sheets = Object.fromEntries(hall.wings.flatMap((w) => w.exhibits).filter((e) => e.cheatSheet).map((e) => [e.id, e.cheatSheet!]));
  const dlg = $<HTMLDialogElement>("#peekDlg");

  $$<HTMLButtonElement>(".peek").forEach((b) => (b.onclick = () => {
    const k = b.dataset.k!, s = sheets[k];
    if (!s) return;
    peeked[k] = true;
    $("#peekTitle").textContent = s.title;
    $("#peekBody").innerHTML = s.html;
    dlg.showModal ? dlg.showModal() : dlg.setAttribute("open", "");
    beep(520, 0.06, "triangle", 0.05);
  }));
  $("#peekClose").onclick = () => dlg.close();
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });

  return {
    reset(k: string) { peeked[k] = false; },
    rewardIfUnpeeked(k: string, el?: Element | null) {
      if (!peeked[k]) setTimeout(() => { award(NO_PEEK_BONUS, el); toast(`ノーカンペ +${NO_PEEK_BONUS}`); }, 450);
    },
  };
}
