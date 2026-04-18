import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["specs/**/*.spec.ts"],
		coverage: {
			provider: "v8",
			include: ["minimization.ts"],
			thresholds: {
				lines: 100,
				functions: 100,
				branches: 100,
				statements: 100,
			},
		},
	},
});
