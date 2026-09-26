import { defineConfig } from "vite";
import { readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";

// halls/<id>/index.html を1ホール1ページとしてすべてビルドする
const hallIds = readdirSync(resolve(__dirname, "halls")).filter((d) =>
  existsSync(resolve(__dirname, "halls", d, "index.html")),
);

export default defineConfig({
  base: "./",
  server: { open: "/halls/kantansui/" },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: Object.fromEntries(hallIds.map((id) => [id, resolve(__dirname, "halls", id, "index.html")])),
    },
  },
});
