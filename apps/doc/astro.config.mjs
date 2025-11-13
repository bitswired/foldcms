// @ts-check

import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import starlightBlog from "starlight-blog";
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
					tsconfig: "../../packages/core/tsconfig.json",
				}),
				starlightLlmsTxt(),
				starlightBlog({
					title: "FoldCMS Blog",
				}),
			],
			sidebar: [
				{
					label: "Guides",
					items: [
						// Each item here is one entry in the navigation menu.
						{
							label: "Getting Started",
							// slug: "guides/getting-started",
							items: [
								{
									label: "What is FoldCMS?",
									slug: "guides/getting-started",
								},
							],
						},
					],
				},
				typeDocSidebarGroup,
			],
		}),
	],

	vite: {
		plugins: [tailwindcss()],
	},
});
