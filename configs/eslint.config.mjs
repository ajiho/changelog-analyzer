import { defineConfig, globalIgnores } from "eslint/config"
import eslint from "@eslint/js"
import tseslint from "typescript-eslint"
import eslintPluginPrettier from "eslint-plugin-prettier"
import globals from "globals"
import eslintConfigPrettier from "eslint-config-prettier/flat"
import eslintPluginUnicorn from "eslint-plugin-unicorn"

const ignores = [
  "**/dist/**",
  "**/configs/**",
  "**/node_modules/**",
  ".*",
  "scripts/**",
  "**/*.d.ts",
  "**/eslint.config.mjs",
  "docs/.vitepress/cache",
]

export default defineConfig([
  eslint.configs.recommended,
  tseslint.configs.recommended,
  eslintConfigPrettier,
  globalIgnores(ignores),
  // 通用配置
  {
    plugins: {
      prettier: eslintPluginPrettier,
      unicorn: eslintPluginUnicorn,
    },
    languageOptions: {
      ecmaVersion: "latest", // ecma语法支持版本
      sourceType: "module", // 模块化类型
      parser: tseslint.parser, // 解析器
      // parserOptions: {
      //   // ✅ 显式指定 tsconfig 的根目录
      //   tsconfigRootDir: import.meta.dirname,
      //   // ✅ 指定 tsconfig 路径（相对 tsconfigRootDir）
      //   projectService: true,
      //   // project: ["./configs/tsconfig.eslint.json"],
      // },
    },
    rules: {
      // 自定义
      "no-var": "off", //禁止使用var
      "@typescript-eslint/no-unused-vars": "off",

      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-expect-error": "allow-with-description",
          "ts-ignore": true,
          "ts-nocheck": false,
          "ts-check": true,
        },
      ],
    },
  },
  // 包配置
  {
    ignores,
    files: ["packages/changelog-analyzer/**/*.{ts}", "packages/cli/**/*.{ts}"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
])
