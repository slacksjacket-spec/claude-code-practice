// 肝胆膵ホール固有の演出（型の共通処理でまかなえない分）。値はすべて試作の portal() から。
import type { HallHooks } from "../../engine/context";

const cl = (x: number) => Math.max(0, Math.min(1, x));

export const hooks: HallHooks = {
  // 門脈の渋滞マップ：脾臓がふくらむ、側副路がうっすら現れはじめる、静脈瘤がふくらむ、血流が遅くなる
  portal(fig, p) {
    const $ = (id: string) => fig.querySelector(`#${id}`);
    const k = cl((p - 5) / 10);
    $("spleen")?.setAttribute("rx", String(30 + k * 12));
    $("spleen")?.setAttribute("ry", String(42 + k * 16));
    // thresholds の show（完全に表示）より手前で、うっすら見せる
    if (p >= 8 && p < 10) $("cv-eso")?.setAttribute("opacity", ".35");
    if (p >= 10 && p < 12) $("cv-umb")?.setAttribute("opacity", ".4");
    if (p >= 11 && p < 14) $("cv-gr")?.setAttribute("opacity", ".4");
    $("varix")?.setAttribute("transform", p >= 12 ? "translate(249 72) scale(1.35) translate(-249 -72)" : "");
    fig.querySelectorAll(".flowing").forEach((el) => el.classList.toggle("slow", p >= 10 && (el.id === "mainFlow" || el.classList.contains("mf2"))));
    const jam = $("jam");
    if (jam) jam.textContent = p >= 10 ? "大渋滞！" : p > 5 ? "混雑中" : "肝臓";
  },
};
