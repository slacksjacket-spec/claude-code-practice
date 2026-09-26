// 館全体の入口：ホール一覧と、館全体で共有しているランク・XP・コイン
import "../engine/styles.css";
import "./museum.css";
import { $, esc } from "../engine/dom";
import { rankOf } from "../engine/economy";
import { clearAll, loadHall, loadMuseum } from "../engine/storage";
import { HALLS, PLANNED } from "../halls/registry";

const pad2 = (n: number) => String(n).padStart(2, "0");

function render() {
  const m = loadMuseum();
  document.body.innerHTML = `<div class="topbar"><div class="wrap">
  <span class="rankPill"><span>${rankOf(m.xp)}</span><b>XP ${m.xp}</b></span>
  <span class="coinPill"><i class="coin"></i><span>${m.coins}</span></span>
</div></div>
<header class="entrance"><div class="wrap">
  <h1><span>病</span><span>気</span><br>博物館</h1>
  <p class="sub">臓器ごとのホールをめぐって、国試で問われる判断を遊んで覚える。コインとランクは館全体で共通。</p>
</div></header>
<section class="mapWrap"><div class="wrap">
  <div class="sectionTitle"><span class="no">ホール</span><h2>どこから入る？</h2></div>
  <div class="halls">
    ${[...HALLS].sort((a, b) => a.no - b.no).map((h) => {
      const st = loadHall(h.id), got = Object.keys(st.stamps).length;
      return `<a class="hallCard" href="halls/${esc(h.id)}/">
      <div class="main"><small>NO.${pad2(h.no)}</small><b>${esc(h.title)}</b><small>${esc(h.catch)}</small>
        <div class="dots" aria-label="スタンプ ${got}/${h.stamps}">${Array.from({ length: h.stamps }, (_, i) => `<i class="${i < got ? "on" : ""}"></i>`).join("")}</div></div>
      <div class="stub">入館<br>する</div></a>`;
    }).join("")}
    ${PLANNED.map((p) => `<div class="hallCard soon" aria-disabled="true"><div class="main"><small>COMING SOON</small><b>${esc(p.title)}</b><small>準備中</small></div><div class="stub">準備中</div></div>`).join("")}
  </div>
</div></section>
<footer><div class="wrap">
  <button class="btn alt" id="resetAll">館全体のデータを消す</button>
  <p>病気博物館 試作版。展示内容は未レビューです。</p>
</div></footer>`;
  $("#resetAll").onclick = () => {
    if (!confirm("すべてのホールのスタンプ・収蔵庫・図鑑と、コイン・XPを消しますか？")) return;
    clearAll();
    render();
  };
}
render();
