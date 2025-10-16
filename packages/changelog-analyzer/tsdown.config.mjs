import { defineConfig } from "tsdown"

export default defineConfig({
  entry: ["src/index.ts"], // 入口文件
  outDir: "dist", // 输出目录
  format: ["esm", "cjs"], // 输出格式
  sourcemap: true, // 生成sourcemap
  minify: false, // 是否压缩
})
