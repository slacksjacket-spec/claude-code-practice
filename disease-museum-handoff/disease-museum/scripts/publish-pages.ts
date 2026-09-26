// npm run publish:pages
// 静的サイトをビルドし、リポジトリ直下の disease-museum/ にコピーする（GitHub Pages は main ブランチ直下から公開されている）。
// 公開URL：https://slacksjacket-spec.github.io/claude-code-practice/disease-museum/
// コピーしたあと、変更をコミットして main に入れると公開される。
import { execSync } from "node:child_process";
import { cpSync, existsSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const target = resolve(root, "../../disease-museum");
if (!existsSync(resolve(root, "../../.git"))) {
  console.error("✗ リポジトリの直下が見つからない（disease-museum-handoff/disease-museum から実行する）");
  process.exit(1);
}
execSync("npm run build", { cwd: root, stdio: "inherit" });
rmSync(target, { recursive: true, force: true });
cpSync(resolve(root, "dist"), target, { recursive: true });
writeFileSync(resolve(target, "README.md"), "# 病気博物館（ビルド結果）\n\nこのフォルダは `disease-museum-handoff/disease-museum` の `npm run publish:pages` が作ったもの。直接編集しない。\n");
console.log(`✓ ${target} にコピーした。コミットして main に入れると公開される`);
