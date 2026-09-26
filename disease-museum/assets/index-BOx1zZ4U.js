import{k as d,r as o,m as r,e as l,$ as e,n as p}from"./economy-CFKDFCG_.js";const m=[{id:"junkanki",no:1,title:"循環器ホール",catch:"波を読んで、音を聴いて、止まった心臓を動かす。",stamps:8},{id:"shokakan",no:2,title:"消化管ホール",catch:"のぞいて、見つけて、切って、ときどき早押し。",stamps:8},{id:"kantansui",no:3,title:"肝胆膵ホール",catch:"診断して、治療して、ときどきガチャを回す。",stamps:8}],v=[],b=a=>String(a).padStart(2,"0");function t(){const a=d();document.body.innerHTML=`<div class="topbar"><div class="wrap">
  <span class="rankPill"><span>${o(a.xp)}</span><b>XP ${a.xp}</b></span>
  <span class="coinPill"><i class="coin"></i><span>${a.coins}</span></span>
</div></div>
<header class="entrance"><div class="wrap">
  <h1><span>病</span><span>気</span><br>博物館</h1>
  <p class="sub">臓器ごとのホールをめぐって、国試で問われる判断を遊んで覚える。コインとランクは館全体で共通。</p>
</div></header>
<section class="mapWrap"><div class="wrap">
  <div class="sectionTitle"><span class="no">ホール</span><h2>どこから入る？</h2></div>
  <div class="halls">
    ${[...m].sort((s,i)=>s.no-i.no).map(s=>{const i=r(s.id),n=Object.keys(i.stamps).length;return`<a class="hallCard" href="halls/${l(s.id)}/">
      <div class="main"><small>NO.${b(s.no)}</small><b>${l(s.title)}</b><small>${l(s.catch)}</small>
        <div class="dots" aria-label="スタンプ ${n}/${s.stamps}">${Array.from({length:s.stamps},($,c)=>`<i class="${c<n?"on":""}"></i>`).join("")}</div></div>
      <div class="stub">入館<br>する</div></a>`}).join("")}
    ${v.map(s=>`<div class="hallCard soon" aria-disabled="true"><div class="main"><small>COMING SOON</small><b>${l(s.title)}</b><small>準備中</small></div><div class="stub">準備中</div></div>`).join("")}
  </div>
</div></section>
<footer><div class="wrap">
  <button class="btn alt" id="resetAll">館全体のデータを消す</button>
  <p>病気博物館 試作版。展示内容は未レビューです。</p>
</div></footer>`,e("#resetAll").onclick=()=>{confirm("すべてのホールのスタンプ・収蔵庫・図鑑と、コイン・XPを消しますか？")&&(p(),t())}}t();
