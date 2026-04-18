import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeEach, expect, test } from "vitest";
import { minimization } from "../minimization";

let tmpDir: string;

beforeEach(() => {
	tmpDir = mkdtempSync(join(tmpdir(), "minimize-test-"));
});

test("minifies JS file", async () => {
	const file = join(tmpDir, "test.js");
	writeFileSync(file, 'const foo = "bar";\nconst baz = "qux";\n', "utf8");
	await minimization([file], {
		encoding: "utf8",
		minifyWhitespace: true,
		minifySyntax: true,
	});
	const result = readFileSync(file, "utf8");
	expect(result).not.toMatch(/\n/);
});

test("minifies .d.ts declaration file", async () => {
	const file = join(tmpDir, "test.d.ts");
	writeFileSync(
		file,
		"export declare const foo: string;\nexport declare const baz: string;\n",
		"utf8",
	);
	await minimization([file], { encoding: "utf8", minifyDeclaration: true });
	const result = readFileSync(file, "utf8");
	expect(result).not.toMatch(/\n/);
});

test("adds banner to JS file", async () => {
	const file = join(tmpDir, "test.js");
	writeFileSync(file, 'const foo = "bar";\n', "utf8");
	await minimization([file], { encoding: "utf8", banner: '"use client";' });
	const result = readFileSync(file, "utf8");
	expect(result).toContain('"use client";');
});

test("preserves shebang in JS file", async () => {
	const file = join(tmpDir, "test.js");
	writeFileSync(file, '#!/usr/bin/env node\nconst foo = "bar";\n', "utf8");
	await minimization([file], { encoding: "utf8", minifyWhitespace: true });
	const result = readFileSync(file, "utf8");
	expect(result).toContain("#!/usr/bin/env");
});

test("uses default minify when no transform options provided", async () => {
	const file = join(tmpDir, "test.js");
	const original = 'const foo = "bar";\nconst baz = "qux";\n';
	writeFileSync(file, original, "utf8");
	await minimization([file], { encoding: "utf8" });
	const result = readFileSync(file, "utf8");
	expect(result.length).toBeLessThan(original.length);
});

test("skips files that are not .js or .d.ts", async () => {
	const file = join(tmpDir, "test.txt");
	const original = "hello world\n";
	writeFileSync(file, original, "utf8");
	await minimization([file], { encoding: "utf8" });
	expect(readFileSync(file, "utf8")).toBe(original);
});
