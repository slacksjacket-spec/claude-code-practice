// npm run build:single -- --hall=kantansui
// ホール1つを外部ファイルを参照しない1枚のHTMLにまとめる（Claude の artifact 用）。
// 出力：dist-single/<hall>.html（Google Fonts の link だけは外部のまま）
import { build } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { existsSync, mkdirSync, renameSync, rmSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const arg = process.argv.find((a) => a.startsWith("--hall="));
const hall = arg?.slice("--hall=".length) ?? process.env.npm_config_hall;
if (!hall) {
  console.error("使い方: npm run build:single -- --hall=<hall id>");
  process.exit(1);
}
const entry = resolve(root, "halls", hall, "index.html");
if (!existsSync(entry)) {
  console.error(`ホールが見つからない: halls/${hall}/index.html`);
  process.exit(1);
}

const tmp = resolve(root, "dist-single", `.tmp-${hall}`);
await build({
  root,
  configFile: false,
  logLevel: "warn",
  plugins: [viteSingleFile()],
  define: { __SINGLE__: "true" },
  build: { outDir: tmp, emptyOutDir: true, rollupOptions: { input: entry } },
});

const out = resolve(root, "dist-single", `${hall}.html`);
mkdirSync(resolve(root, "dist-single"), { recursive: true });
renameSync(resolve(tmp, "halls", hall, "index.html"), out);
rmSync(tmp, { recursive: true, force: true });

// 外部参照が Google Fonts 以外に残っていないか確かめる
const html = readFileSync(out, "utf8");
const external = [...html.matchAll(/(?:src|href)=["'](https?:\/\/[^"']+|(?!data:|#)[^"']+\.(?:js|css|png|svg|woff2?))["']/g)]
  .map((m) => m[1])
  .filter((u) => !/^https:\/\/fonts\.(googleapis|gstatic)\.com/.test(u));
if (external.length) {
  console.error("✗ 外部ファイルへの参照が残っている:", external);
  process.exit(1);
}
// zod（データ検証用）がブラウザ側に紛れ込んでいないか。schema ファイルから値を import すると入ってしまう
if (/ZodError|\$ZodType/.test(html)) {
  console.error("✗ zod がバンドルに入っている。展示モジュールは schema から型だけを import すること（定数は *.consts.ts へ）");
  process.exit(1);
}
console.log(`✓ dist-single/${hall}.html（${(statSync(out).size / 1024).toFixed(1)} KB）`);
