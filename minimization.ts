import { createMinifier } from "dts-minify";
import { transformSync } from "esbuild";
import { readFileSync, writeFileSync } from "node:fs";
import * as ts from "typescript";

const Bar = require("progress-barjs");
const minifier = createMinifier(ts);

type Opts = {
	encoding: "utf8";
	minifyWhitespace?: boolean;
	minifyIdentifiers?: boolean;
	minifySyntax?: boolean;
	minifyDeclaration?: boolean;
	banner?: string;
};

export async function minimization(files: string[], opts: Opts) {
	const { encoding = "utf8", minifyDeclaration, ...transformOpts } = opts;
	const options =
		Object.keys(transformOpts).length > 0 ? transformOpts : { minify: true };
	const filesFiltered = files.filter(
		(f) => f.endsWith(".js") || (minifyDeclaration && f.endsWith(".d.ts")),
	);
	if (filesFiltered.length === 0) return;
	const bar = Bar({
		label: "Minimize JS",
		info: "Processing",
		total: filesFiltered.length,
	});
	for (const [i, file] of filesFiltered.entries()) {
		const isDeclarationFile = minifyDeclaration && file.endsWith(".d.ts");
		const content = readFileSync(file, { encoding });
		const { code } = isDeclarationFile
			? { code: minifier.minify(content) }
			: transformSync(content, options);
		let c =
			code.search("#!/usr/bin/env") !== -1
				? code.replaceAll(/\n/g, "")
				: code.trim();
		if (isDeclarationFile) c = c.replaceAll("#!/usr/bin/env node", "");
		writeFileSync(file, c, { encoding });
		bar.tick(`Tick number ${i}`);
	}
	console.log("\n", "🎉 Files have been minimized with success. 🎉");
}
