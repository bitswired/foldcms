// @ts-check

import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightLlmsTxt from "starlight-llms-txt";
import starlightTypeDoc, { typeDocSidebarGroup } from "starlight-typedoc";

// https://astro.build/config
export default defineConfig({
	site: "https://foldcms.dev",
	build: {
		assets: "assets",
	},
	integrations: [
		starlight({
			title: "FoldCMS",
			social: [
				{
					icon: "github",
					label: "GitHub",
					href: "https://github.com/bitswired/foldcms",
				},
			],
			plugins: [
				// Generate the documentation.
				starlightTypeDoc({
					entryPoints: [
						"../../packages/core/src/cms.ts",
						"../../packages/core/src/loaders.ts",
						"../../packages/core/src/utils.ts",
					],
					tsconfig: "../../packages/core/tsconfig.json",
				}),
				starlightLlmsTxt(),
			],
			sidebar: [
				{
					label: "Guides",
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: "Example Guide", slug: "guides/example" },
					],
				},
				typeDocSidebarGroup,
				{
					label: "Reference",
					autogenerate: { directory: "reference" },
				},
			],
		}),
	],
});
