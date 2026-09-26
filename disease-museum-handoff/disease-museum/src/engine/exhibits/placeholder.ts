// Phase 0 の仮置き。展示の枠（札・スタンプ・カンペ）だけを先に並べる。Phase 1 で各型に置き換えて消す。
import type { ExhibitModule } from "./types";
import { esc } from "../dom";

export const Placeholder: ExhibitModule<"Placeholder"> = {
  mount(root, ex) {
    root.innerHTML = `<div class="placeholder"><span class="tagk">${esc(ex.plannedType)}</span>この展示は Phase 1 で移植します。</div>`;
  },
};
