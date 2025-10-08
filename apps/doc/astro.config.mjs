// @ts-check

import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import starlightLlmsTxt from "starlight-llms-txt";
import starlightTypeDoc, { typeDocSidebarGroup } from "starlight-typedoc";

export default defineConfig({
	site: "https://foldcms.dev",

	build: {
		assets: "assets",
	},

	integrations: [
		react(),
		starlight({
			title: "FoldCMS",
			customCss: ["./src/styles/global.css"],
			expressiveCode: {
				themes: ["dracula"],
			},
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
					typeDoc: {
						exclude: ["../../packages/core/examples/**/*"],
					},
					tsconfig: "../../packages/core/tsconfig.json",
				}),
				starlightLlmsTxt(),
			],
			sidebar: [
				{
					label: "Guides",
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: "Getting Started", slug: "guides/getting-started" },
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

	vite: {
		plugins: [tailwindcss()],
	},
});
