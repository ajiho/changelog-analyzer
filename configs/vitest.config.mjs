import { configDefaults, defineConfig } from "vitest/config"
export default defineConfig({
  test: {
    projects: [
      {
        test: {
          globals: true,
          name: "core",
          include: [
            "packages/changelog-analyzer/__tests__/**/*.{test,spec}.{ts,js,tsx,jsx}",
          ],
          environment: "node",
          clearMocks: true,
        },
      },
      {
        test: {
          globals: true,
          name: "cli",
          clearMocks: true,
          include: ["packages/cli/__tests__/**/*.{test,spec}.{ts,js,tsx,jsx}"],
          environment: "node",
        },
      },
    ],

    coverage: {
      all: true,
      provider: "v8",
      reportsDirectory: "./coverage",
      include: ["packages/{changelog-analyzer,cli}/src/**/*.ts"],
      exclude: [
        ...configDefaults.exclude,
        "**/*.test.ts",
        "**/__tests__/**",
        "**/interfaces.ts",
        "**/types.ts",
        "**/src/cli.ts",
        "**/*.d.ts",
      ],
    },
  },
})
