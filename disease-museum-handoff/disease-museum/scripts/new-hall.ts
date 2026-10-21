// npm run new:hall -- --id=kokyuki --no=4 --title=呼吸器ホール --catch="…"
// 新しいホールの骨組み（HTML、data.ts、main.ts、ホール専用ゲームの登録、館の一覧）を作る
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const arg = (k: string) => process.argv.find((a) => a.startsWith(`--${k}=`))?.slice(k.length + 3);
const id = arg("id"), no = Number(arg("no")), title = arg("title"), cat = arg("catch") ?? "";
if (!id || !no || !title) { console.error("使い方: npm run new:hall -- --id=<id> --no=<番号> --title=<名前> --catch=<一文>"); process.exit(1); }
const dir = resolve(root, "src/halls", id);
if (existsSync(dir)) { console.error(`すでにある: src/halls/${id}`); process.exit(1); }

mkdirSync(resolve(root, "halls", id), { recursive: true });
writeFileSync(resolve(root, "halls", id, "index.html"), readFileSync(resolve(root, "halls/kantansui/index.html"), "utf8").replace("肝胆膵ホール", title).replace("/src/halls/kantansui/main.ts", `/src/halls/${id}/main.ts`));
mkdirSync(resolve(dir, "exhibits"), { recursive: true });
mkdirSync(resolve(dir, "content"), { recursive: true });
writeFileSync(resolve(dir, "main.ts"), `import { mountHall } from "../../engine/hall";\nimport { hall } from "./data";\nimport { custom } from "./exhibits";\n\nmountHall(hall, { custom });\n`);
writeFileSync(resolve(dir, "exhibits/index.ts"), `// このホール専用のゲーム（type: "Custom" の kind → モジュール）。共通ゲームは登録しなくても使える\nimport type { CustomModules } from "../../../engine/exhibits/types";\n\nexport const custom: CustomModules = {};\n`);
writeFileSync(resolve(dir, "exhibits/schemas.ts"), `// このホール専用のゲームのデータの形（npm run check が検証に使う）\nexport const CUSTOM_SCHEMAS = {};\n`);
const reg = resolve(root, "src/halls/registry.ts");
writeFileSync(reg, readFileSync(reg, "utf8").replace("export const HALLS: HallEntry[] = [\n", `export const HALLS: HallEntry[] = [\n  { id: "${id}", no: ${no}, title: "${title}", catch: "${cat}", stamps: 8 },\n`));
console.log(`✓ src/halls/${id}/ を作った。data.ts を書いて npm run check`);
