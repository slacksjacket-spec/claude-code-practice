// npm run shots [-- --hall=kantansui]
// 単一HTMLをビルドし、390×844 と 1280×900 で全展示のスクリーンショットを撮る。
// reference/<hall>_hall*.html（試作）があれば同じ展示を並べて撮る。shots/index.html で見比べられる。
// 失敗にするもの：ページのJSエラー、390px幅での横はみ出し。
import { chromium, type Browser, type BrowserContextOptions, type Page } from "playwright";
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve, relative } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const outRoot = resolve(root, "shots");
const arg = process.argv.find((a) => a.startsWith("--hall="))?.slice(7);
const halls = arg ? [arg] : readdirSync(resolve(root, "halls")).filter((d) => existsSync(resolve(root, "halls", d, "index.html")));

const VIEWPORTS = [
  { name: "390", width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  { name: "1280", width: 1280, height: 900, isMobile: false, hasTouch: false, deviceScaleFactor: 1 },
] as const;

const problems: string[] = [];
const sheet: { hall: string; vp: string; label: string; mine?: string; ref?: string }[] = [];

async function launch(): Promise<Browser> {
  const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
  const opts = { proxy: proxy ? { server: proxy, bypass: "localhost,127.0.0.1" } : undefined };
  try {
    return await chromium.launch(opts);
  } catch {
    // 入っている Chromium と playwright の版が合わないとき
    return await chromium.launch({ ...opts, executablePath: "/opt/pw-browsers/chromium" });
  }
}

// Google Fonts は Node 側で取りに行く（Node はプロキシの CA を信頼している。ブラウザの TLS 検証は切らない）
async function newContext(browser: Browser, opts: BrowserContextOptions) {
  const ctx = await browser.newContext(opts);
  await ctx.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//, async (route) => {
    try { await route.fulfill({ response: await route.fetch() }); } catch { await route.abort(); }
  });
  return ctx;
}

async function settle(page: Page) {
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
}

/** 390px 幅で右にはみ出している要素（横スクロールの原因）を探す */
// ブラウザ内で動かすので文字列で渡す（tsx が関数に __name を差し込むのを避ける）
const OVERFLOW_CHECK = `(() => {
  const W = document.documentElement.clientWidth, bad = [];
  const scrollsX = (el) => {
    for (; el; el = el.parentElement) {
      const o = getComputedStyle(el).overflowX;
      if (el !== document.documentElement && el !== document.body && ["auto", "scroll", "hidden", "clip"].includes(o)) return true;
    }
    return false;
  };
  for (const el of document.body.querySelectorAll("*")) {
    if (el.closest("dialog:not([open]), canvas, .toast")) continue;
    const r = el.getBoundingClientRect();
    if (r.width && r.right > W + 1 && !scrollsX(el.parentElement)) {
      const cls = typeof el.className === "string" && el.className ? "." + el.className.trim().split(/\\s+/).join(".") : "";
      bad.push(el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + cls + " right=" + Math.round(r.right));
    }
  }
  return { W, scrollW: document.documentElement.scrollWidth, bad: bad.slice(0, 10) };
})()`;

/** 390px 幅で右にはみ出している要素（横スクロールの原因）を探す */
const overflowCheck = (page: Page) => page.evaluate(OVERFLOW_CHECK) as Promise<{ W: number; scrollW: number; bad: string[] }>;

// 展示だけを撮るときは、固定のトップバーが上にかぶらないよう隠す
const HIDE_TOPBAR = ".topbar{visibility:hidden!important}";

async function shootExhibits(page: Page, dir: string, idPrefix = "ex-") {
  const style = await page.addStyleTag({ content: HIDE_TOPBAR });
  const ids = await page.$$eval(`article.exhibit[id^="${idPrefix}"]`, (els) => els.map((e) => e.id));
  for (const id of ids) {
    const el = page.locator(`#${id}`);
    await el.scrollIntoViewIfNeeded();
    await el.screenshot({ path: resolve(dir, `${id}.png`), animations: "disabled" });
  }
  await style.evaluate((n) => (n as ChildNode).remove());
  return ids;
}

const browser = await launch();
rmSync(outRoot, { recursive: true, force: true });

for (const hall of halls) {
  execSync(`npx tsx scripts/build-single.ts --hall=${hall}`, { cwd: root, stdio: "inherit" });
  const url = pathToFileURL(resolve(root, "dist-single", `${hall}.html`)).href;
  const ref = readdirSync(resolve(root, "reference")).find((f) => f.startsWith(`${hall}_hall`) && f.endsWith(".html"));

  for (const vp of VIEWPORTS) {
    const dir = resolve(outRoot, hall, vp.name);
    mkdirSync(dir, { recursive: true });
    const ctx = await newContext(browser, { viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, hasTouch: vp.hasTouch, deviceScaleFactor: vp.deviceScaleFactor, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    page.on("pageerror", (e) => problems.push(`${hall} ${vp.name}: JSエラー ${e.message}`));
    page.on("console", (m) => { if (m.type() === "error" && !/fonts\.g/.test(m.text())) problems.push(`${hall} ${vp.name}: console.error ${m.text()}`); });

    await page.goto(url);
    await settle(page);
    const fontsOk = await page.evaluate(() => document.fonts.check('16px "Dela Gothic One"') && document.fonts.check('500 16px "M PLUS Rounded 1c"'));
    if (!fontsOk) console.warn(`  ⚠ ${hall} ${vp.name}: Google Fonts が読めていない（代替フォントで撮影）`);

    // 1. 何もしていない状態
    await page.screenshot({ path: resolve(dir, "00-top.png") });
    await page.screenshot({ path: resolve(dir, "01-full.png"), fullPage: true });
    const ids = await shootExhibits(page, dir);
    for (const id of ids) sheet.push({ hall, vp: vp.name, label: id, mine: relative(outRoot, resolve(dir, `${id}.png`)) });

    if (vp.name === "390") {
      const o = await overflowCheck(page);
      if (o.scrollW > o.W || o.bad.length) problems.push(`${hall} 390: 横にはみ出し（scrollWidth ${o.scrollW} > ${o.W}）${o.bad.join(" / ")}`);
    }

    // 2. 共通機能をさわる：ガチャ（無料の1回）、カンペ、スタンプカード
    await page.locator("#spin").scrollIntoViewIfNeeded();
    await page.click("#spin");
    await page.waitForTimeout(1400);
    const hide = await page.addStyleTag({ content: HIDE_TOPBAR });
    await page.locator("#ex-gacha").screenshot({ path: resolve(dir, "10-gacha-after-spin.png") });
    await hide.evaluate((n) => (n as ChildNode).remove());
    const peek = page.locator(".peek").first();
    if (await peek.count()) {
      await peek.click();
      await page.waitForTimeout(200);
      await page.screenshot({ path: resolve(dir, "11-cheatsheet.png") });
      await page.click("#peekClose");
    }

    // 3. 遊んだあとの状態（XP・スタンプ・収蔵庫）を入れて読み直す
    const key = await page.evaluate(() => Object.keys(localStorage).find((k) => k.startsWith("diseaseMuseum.")) ?? "");
    await page.evaluate((key) => {
      const st = JSON.parse(localStorage.getItem(key) || "{}");
      Object.assign(st, {
        coins: 85, xp: 430, stamps: { lab: 1, hbv: 1, er: 1 }, gacha: { ...st.gacha, chol: 1, ileus: 1 },
        review: [
          { id: "shot-1", src: "黄疸診断ラボ", q: "（撮影用のダミー）56歳 女性：食後の右季肋部痛、発熱と黄疸。", opts: ["総胆管結石", "急性肝炎", "溶血性貧血"], ans: "総胆管結石" },
          { id: "shot-2", src: "対決の間：PBC vs PSC", q: "（撮影用のダミー）「AMA陽性」はどっち？", opts: ["PBC", "PSC"], ans: "PBC" },
        ],
      });
      localStorage.setItem(key, JSON.stringify(st));
    }, key);
    await page.reload();
    await settle(page);
    await page.evaluate("window.scrollTo(0, 0)");
    await page.waitForTimeout(100);
    await page.screenshot({ path: resolve(dir, "20-top-played.png") });
    await page.locator("#map").screenshot({ path: resolve(dir, "21-map-played.png") });
    await page.locator("#ex-review").screenshot({ path: resolve(dir, "22-review-played.png") });
    await page.click("#stampPill");
    await page.waitForTimeout(200);
    await page.screenshot({ path: resolve(dir, "23-stampcard.png") });
    await ctx.close();

    // 4. ダークモード
    const dark = await newContext(browser, { viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, deviceScaleFactor: vp.deviceScaleFactor, colorScheme: "dark", reducedMotion: "reduce" });
    const dp = await dark.newPage();
    await dp.goto(url);
    await settle(dp);
    await dp.screenshot({ path: resolve(dir, "30-dark-full.png"), fullPage: true });
    await dark.close();

    // 5. 試作（見比べ用）
    if (ref) {
      const rdir = resolve(outRoot, hall, vp.name, "reference");
      mkdirSync(rdir, { recursive: true });
      const rc = await newContext(browser, { viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, hasTouch: vp.hasTouch, deviceScaleFactor: vp.deviceScaleFactor, reducedMotion: "reduce" });
      const rp = await rc.newPage();
      await rp.goto(pathToFileURL(resolve(root, "reference", ref)).href);
      await settle(rp);
      await rp.screenshot({ path: resolve(rdir, "00-top.png") });
      await rp.screenshot({ path: resolve(rdir, "01-full.png"), fullPage: true });
      const rids = await shootExhibits(rp, rdir);
      for (const id of rids) {
        const row = sheet.find((s) => s.hall === hall && s.vp === vp.name && s.label === id);
        const p = relative(outRoot, resolve(rdir, `${id}.png`));
        if (row) row.ref = p; else sheet.push({ hall, vp: vp.name, label: id, ref: p });
      }
      for (const f of ["00-top", "01-full"]) sheet.push({ hall, vp: vp.name, label: f, mine: relative(outRoot, resolve(dir, `${f}.png`)), ref: relative(outRoot, resolve(rdir, `${f}.png`)) });
      await rc.close();
    }
  }
}
await browser.close();

// 見比べ用の一覧
const rows = sheet.map((s) => `<tr><th>${s.hall}<br>${s.vp}<br>${s.label}</th><td>${s.mine ? `<img src="${s.mine}">` : "—"}</td><td>${s.ref ? `<img src="${s.ref}">` : "—"}</td></tr>`).join("\n");
writeFileSync(resolve(outRoot, "index.html"), `<!doctype html><meta charset="utf-8"><title>shots</title>
<style>body{font-family:sans-serif;margin:16px}table{border-collapse:collapse}th,td{border:1px solid #ccc;padding:6px;vertical-align:top}th{text-align:left;font-size:12px;white-space:nowrap}img{max-width:560px;display:block}</style>
<h1>スクリーンショット（左：エンジン／右：試作）</h1><table><tr><th></th><th>エンジン</th><th>試作</th></tr>${rows}</table>`);

console.log(`\n撮影完了：${relative(root, outRoot)}/（一覧：shots/index.html）`);
if (problems.length) {
  console.error("\n✗ 問題が見つかった:");
  for (const p of problems) console.error("  - " + p);
  process.exit(1);
}
console.log("✓ JSエラーなし、390px幅で横はみ出しなし");
