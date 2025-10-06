// @ts-check

import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightLlmsTxt from "starlight-llms-txt";
import starlightTypeDoc, { typeDocSidebarGroup } from "starlight-typedoc";

// https://astro.build/config
export default defineConfig({
	site: "https://bitswired.github.io",
	base: "/foldcms",
	build: {
		assets: "assets",
	},
	integrations: [
		starlight({
			title: "My Docs",
			social: [
				{
					icon: "github",
					label: "GitHub",
					href: "https://github.com/withastro/starlight",
				},
			],
			plugins: [
				// Generate the documentation.
				starlightTypeDoc({
					entryPoints: [
						"../../packages/core/src/cms.ts",
						"../../packages/core/src/loaders.ts",
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
