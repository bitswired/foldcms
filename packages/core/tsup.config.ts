import { defineConfig } from "tsup";

export default defineConfig({
	entry: {
		index: "src/cms.ts",
		loaders: "src/loaders.ts",
		utils: "src/utils.ts",
	},
	format: ["esm"],
	dts: {
		compilerOptions: {
			skipLibCheck: true,
		},
	},
	splitting: false,
	sourcemap: true,
	clean: true,
	minify: true,
	shims: false,
	treeshake: true,
	target: "esnext",
});
