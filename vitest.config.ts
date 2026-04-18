import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["specs/**/*.spec.ts"],
		coverage: {
			provider: "v8",
			include: ["*.ts"],
			exclude: ["vitest.config.ts"],
			thresholds: {
				lines: 100,
				functions: 100,
				branches: 100,
				statements: 100,
			},
		},
	},
});
