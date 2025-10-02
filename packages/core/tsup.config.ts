import { defineConfig } from "tsup";

export default defineConfig({
	entry: {
		collections: "src/collections.ts",
		cms: "src/cms.ts",
		loaders: "src/loaders.ts",
	},
	format: ["esm"],
	dts: true,
	splitting: false,
	sourcemap: true,
	clean: true,
	minify: true,
	shims: false,
	treeshake: true,
	target: "esnext",
});
