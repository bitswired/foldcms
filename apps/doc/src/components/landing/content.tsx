// ===== HERO SECTION =====
import effectLogo from "../../assets/effect.png";

const heroCodeExample = `
// Define your schema
const Post = Schema.Struct({
  id: Schema.String,
  title: Schema.String,
  authorId: Schema.String,
})

// Create collection with relations
const posts = defineCollection({
  loadingSchema: Post,
  loader: jsonFilesLoader(Post, { ... }),
  relations: {
    authorId: { type: "single", target: "authors" }
  }
})

// Query with full type safety
const post = yield* cms.getById("posts", "1")
const author = yield* cms.loadRelation("posts", post, "authorId")
// TypeScript knows everything
`;

export const hero = {
	headline: "The Type-Safe CMS That Actually Gets Out of Your Way",
	subheadline:
		"Build content-rich applications with full type safety, zero runtime overhead, and the power of Effect. No GraphQL layers, no complex APIs: just pure TypeScript elegance.",
	cta: {
		primary: {
			text: "Get Started",
			href: "/guides/getting-started",
		},
		secondary: {
			text: "View Examples",
			href: "/guides/getting-started",
		},
	},
	codeExample: heroCodeExample,
	trustIndicators: [
		{ text: "Built on Effect", icon: effectLogo },
		{ text: "Powered by SQLite", icon: effectLogo },
		{ text: "100% Type Safe", icon: effectLogo },
	],
} as const;

// ===== PROBLEM/SOLUTION SECTION =====

export const problemSolution = {
	headline: "Content Management Shouldn't Fight Your Build Process",
	cards: [
		{
			icon: "zap",
			title: "The Runtime Cost",
			problem: "GraphQL layers add complexity and runtime overhead",
			solution:
				"FoldCMS compiles to SQLite at build time. Zero runtime queries, maximum performance.",
		},
		{
			icon: "target",
			title: "The Type Chaos",
			problem: "Codegen, manual types, and runtime checks everywhere",
			solution:
				"Native TypeScript schemas that flow through your entire app. One source of truth.",
		},
		{
			icon: "unlock",
			title: "The Vendor Lock",
			problem: "Proprietary formats and hosted services",
			solution:
				"Your content in standard formats. JSON, YAML, MDX. Your filesystem, your control.",
		},
	],
} as const;

// ===== FEATURE SHOWCASE =====

const featureTypeSafetyCode = `
const cms = yield* CmsTag
const post = yield* cms.getById("posts", "hello-world")
//    ^? Option<{ id: string, title: string, authorId: string }>

const author = yield* cms.loadRelation("posts", post, "authorId")
//    ^? Option<{ id: string, name: string, email: string }>
`;

const featureStreamingCode = `
// Process 10,000 posts efficiently
const posts = defineCollection({
  loader: jsonFilesLoader(PostSchema, { folder: "posts" }),
  transformer: (post) => Effect.gen(function* () {
    // Add reading time, generate excerpts, optimize images
    return enrichedPost
  })
})
// Streams through everything in constant memory
`;

const featureAssetsCode = `
await syncFolderToStorage({
  folderPath: "./public/images",
  getBucket: (file) => file.endsWith(".pdf") 
    ? "private" : "public",
  deleteOrphaned: true,
  concurrency: 10
})
// ✅ Only uploads changed files
// ✅ Removes orphaned files
// ✅ Fully concurrent
`;

const featureRelationsCode = `
relations: {
  author: { type: "single", field: "authorId", target: "authors" },
  tags: { type: "array", field: "tagIds", target: "tags" },
  i18n: { type: "map", field: "translations", target: "content" }
}

// TypeScript infers the exact return type
const author = yield* cms.loadRelation("posts", post, "author")
//    ^? Option<Author>
const tags = yield* cms.loadRelation("posts", post, "tags")  
//    ^? readonly Tag[]
const i18n = yield* cms.loadRelation("posts", post, "i18n")
//    ^? ReadonlyMap<string, Content>
`;

export const features = {
	headline: "Features That Just Work",
	tabs: [
		{
			id: "type-safety",
			label: "Type Safety That Actually Works",
			headline: "End-to-end type inference, zero codegen",
			description:
				"Define your schema once. Get perfect TypeScript types everywhere. Relations, transformations, validations—all fully typed. Your editor knows your content structure better than you do.",
			codeExample: featureTypeSafetyCode,
		},
		{
			id: "streaming",
			label: "Stream-Based Architecture",
			headline: "Handle massive datasets without breaking a sweat",
			description:
				"Process thousands of content files efficiently. FoldCMS streams data through transformations without loading everything into memory. Built on Effect Streams for composable, predictable data pipelines.",
			codeExample: featureStreamingCode,
		},
		{
			id: "assets",
			label: "Smart Asset Management",
			headline: "Sync assets to S3/R2 with intelligent change detection",
			description:
				"Sync your static assets to any S3-compatible storage. Only uploads what changed (hash-based detection). Clean up orphaned files automatically. Create a media collection to reference assets type-safely.",
			codeExample: featureAssetsCode,
		},
		{
			id: "relations",
			label: "Relations Done Right",
			headline: "Query relationships with perfect type safety",
			description:
				"Single, array, and map relations—all fully typed. No N+1 queries, no resolver complexity. Just load what you need, when you need it.",
			codeExample: featureRelationsCode,
		},
	],
} as const;

// ===== BUILT WITH EFFECT SECTION =====

const effectSectionCode = `
const program = Effect.gen(function* () {
  yield* build({ collections })
  const cms = yield* CmsTag
  return yield* cms.getAll("posts")
}).pipe(
  Effect.timeout("30 seconds"),
  Effect.retry({ times: 3 }),
  Effect.catchTag("LoadingError", (e) => /* handle */),
  Effect.provide(AppLayer)
)
`;

export const effectSection = {
	headline: "Standing on the Shoulders of Giants",
	description:
		"Built with Effect, the most powerful TypeScript framework for building robust applications.",
	benefits: [
		{
			title: "Composable by Design",
			description:
				"Chain operations, handle errors gracefully, and build complex pipelines from simple building blocks. Effect's composition model makes your CMS logic readable and maintainable.",
		},
		{
			title: "Testable Without Mocks",
			description:
				"Pure functional architecture means testing is a breeze. No mocks, no stubs—just supply test dependencies and validate outputs. Your CI will thank you.",
		},
		{
			title: "Production-Ready Error Handling",
			description:
				"Structured errors, not thrown exceptions. LoadingError, ValidationError, TransformationError—know exactly what can fail and handle it elegantly.",
		},
	],
	codeExample: effectSectionCode,
} as const;

// ===== USE CASES SECTION =====

export const useCases = {
	headline: "Built For Modern Content Workflows",
	cases: [
		{
			icon: "book-open",
			title: "Documentation Sites",
			description:
				"MDX support, type-safe navigation, automatic ToC generation",
			tag: "Used by open source projects",
		},
		{
			icon: "palette",
			title: "Marketing Sites",
			description:
				"Headless CMS freedom with type safety. Content in Git, deploy anywhere",
			tag: "Used by agencies",
		},
		{
			icon: "shopping-bag",
			title: "E-commerce Catalogs",
			description:
				"Product schemas, variant relations, inventory tracking—all type-safe",
			tag: "Used by online stores",
		},
		{
			icon: "globe",
			title: "Multi-Language Platforms",
			description:
				"Map relations for i18n, fallback chains, locale-aware querying",
			tag: "Used by global brands",
		},
	],
} as const;

// ===== PERFORMANCE SECTION =====

export const performance = {
	headline: "Stupid Fast. Seriously.",
	metrics: [
		{
			value: "< 2s",
			label: "Build Time",
			description: "Build 10,000 posts with relations",
		},
		{
			value: "< 1ms",
			label: "Query Time",
			description: "Average query response from SQLite",
		},
		{
			value: "Constant",
			label: "Memory Usage",
			description: "Stream-based processing, no memory spikes",
		},
	],
	technicalDetails: [
		"SQLite with automatic indexes",
		"Stream-based processing for constant memory",
		"Parallel collection loading",
		"Hash-based asset change detection",
		"Zero runtime overhead (all queries at build time)",
	],
} as const;

// ===== DEVELOPER EXPERIENCE SECTION =====

export const developerExperience = {
	headline: "Your IDE Is Now Your Content Editor",
	description:
		"Experience content management the way it should be—with your tools, your workflow, your way.",
	features: [
		"Zero Config",
		"Hot Reload",
		"TypeDoc Integration",
		"Bun Native",
		"Effect Ecosystem",
		"No Codegen",
		"Git-Friendly",
		"Framework Agnostic",
	],
} as const;

// ===== COMPARISON TABLE =====

export const comparison = {
	headline: "How FoldCMS Stacks Up",
	table: {
		headers: ["Feature", "FoldCMS", "Contentful", "Sanity", "Contentlayer"],
		rows: [
			{
				feature: "Type Safety",
				foldcms: { status: "full", text: "Native" },
				contentful: { status: "partial", text: "Codegen" },
				sanity: { status: "partial", text: "Codegen" },
				contentlayer: { status: "full", text: "Native" },
			},
			{
				feature: "Runtime Overhead",
				foldcms: { status: "full", text: "Zero" },
				contentful: { status: "none", text: "API Calls" },
				sanity: { status: "none", text: "API Calls" },
				contentlayer: { status: "full", text: "Zero" },
			},
			{
				feature: "Offline First",
				foldcms: { status: "full", text: "Yes" },
				contentful: { status: "none", text: "No" },
				sanity: { status: "none", text: "No" },
				contentlayer: { status: "full", text: "Yes" },
			},
			{
				feature: "Relations",
				foldcms: { status: "full", text: "Typed" },
				contentful: { status: "partial", text: "Manual" },
				sanity: { status: "partial", text: "Manual" },
				contentlayer: { status: "none", text: "Limited" },
			},
			{
				feature: "Asset Sync",
				foldcms: { status: "full", text: "Built-in" },
				contentful: { status: "full", text: "Built-in" },
				sanity: { status: "full", text: "Built-in" },
				contentlayer: { status: "none", text: "Manual" },
			},
			{
				feature: "Cost",
				foldcms: { status: "full", text: "Free" },
				contentful: { status: "none", text: "Paid" },
				sanity: { status: "none", text: "Paid" },
				contentlayer: { status: "full", text: "Free" },
			},
			{
				feature: "Data Ownership",
				foldcms: { status: "full", text: "Yours" },
				contentful: { status: "none", text: "Hosted" },
				sanity: { status: "none", text: "Hosted" },
				contentlayer: { status: "full", text: "Yours" },
			},
		],
	},
} as const;

// ===== INTEGRATION SECTION =====

const integrationAstroCode = `
const cms = await getCms()
const posts = await cms.getAll("posts")
`;

const integrationNextCode = `
export async function generateStaticParams() {
  const cms = await getCms()
  const posts = await cms.getAll("posts")
  return posts.map((post) => ({ slug: post.slug }))
}
`;

const integrationRemixCode = `
export async function loader() {
  const cms = await getCms()
  const posts = await cms.getAll("posts")
  return json({ posts })
}
`;

const integrationSvelteKitCode = `
export async function load() {
  const cms = await getCms()
  const posts = await cms.getAll("posts")
  return { posts }
}
`;

const integrationSolidStartCode = `
const posts = createAsync(async () => {
  const cms = await getCms()
  return cms.getAll("posts")
})
`;

const integrationQwikCode = `
export const usePostsLoader = routeLoader$(async () => {
  const cms = await getCms()
  return cms.getAll("posts")
})
`;

export const integrations = {
	headline: "Works With Your Stack",
	frameworks: [
		{
			name: "Astro",
			description: "Perfect for content sites",
			logo: "/logos/astro.svg",
			codeExample: integrationAstroCode,
		},
		{
			name: "Next.js",
			description: "SSG, ISR, or Server Components",
			logo: "/logos/nextjs.svg",
			codeExample: integrationNextCode,
		},
		{
			name: "Remix",
			description: "Loader functions with type safety",
			logo: "/logos/remix.svg",
			codeExample: integrationRemixCode,
		},
		{
			name: "SvelteKit",
			description: "Load data in +page.server.ts",
			logo: "/logos/svelte.svg",
			codeExample: integrationSvelteKitCode,
		},
		{
			name: "Solid Start",
			description: "Reactive content queries",
			logo: "/logos/solid.svg",
			codeExample: integrationSolidStartCode,
		},
		{
			name: "Qwik",
			description: "Resumable with static content",
			logo: "/logos/qwik.svg",
			codeExample: integrationQwikCode,
		},
	],
} as const;

// ===== GETTING STARTED SECTION =====

const gettingStartedInstallCode = `
bun add @foldcms/core effect
`;

const gettingStartedDefineCode = `
const posts = defineCollection({
  loadingSchema: PostSchema,
  loader: jsonFilesLoader(PostSchema, { ... })
})
`;

const gettingStartedQueryCode = `
const cms = yield* CmsTag
const posts = yield* cms.getAll("posts")
`;

export const gettingStarted = {
	headline: "From Zero to Shipped in 5 Minutes",
	steps: [
		{
			number: 1,
			title: "Install",
			code: gettingStartedInstallCode,
		},
		{
			number: 2,
			title: "Define",
			code: gettingStartedDefineCode,
		},
		{
			number: 3,
			title: "Query",
			code: gettingStartedQueryCode,
		},
	],
	cta: {
		primary: {
			text: "Read the Docs",
			href: "/docs",
		},
		secondary: {
			text: "View Examples",
			href: "/examples",
		},
		tertiary: {
			text: "Join Discord",
			href: "https://discord.gg/effect-ts",
		},
	},
} as const;

// ===== SOCIAL PROOF SECTION =====

export const socialProof = {
	headline: "Trusted By Teams Who Ship Fast",
	testimonials: [
		{
			quote:
				"Finally, a CMS that doesn't fight TypeScript. FoldCMS just gets out of the way and lets us build.",
			author: "Developer Name",
			role: "Engineering Lead",
			company: "Company Name",
			avatar: "/avatars/1.jpg",
		},
		// Add more testimonials as you get them
	],
	stats: {
		githubStars: "https://img.shields.io/github/stars/yourusername/foldcms",
		npmDownloads: "https://img.shields.io/npm/dw/@foldcms/core",
		contributors:
			"https://img.shields.io/github/contributors/yourusername/foldcms",
	},
} as const;

// ===== FINAL CTA SECTION =====

export const finalCta = {
	headline: "Stop Fighting Your CMS. Start Shipping.",
	subheadline:
		"FoldCMS is open source, MIT licensed, and ready for production. Join developers who chose type safety over complexity.",
	cta: {
		primary: {
			text: "Get Started",
			href: "/docs/getting-started",
		},
		secondary: {
			text: "View on GitHub",
			href: "https://github.com/yourusername/foldcms",
		},
		tertiary: {
			text: "Join Community",
			href: "https://discord.gg/effect-ts",
		},
	},
} as const;

// ===== FOOTER LINKS =====

export const footerLinks = {
	sections: [
		{
			title: "Documentation",
			links: [
				{ text: "Getting Started", href: "/docs/getting-started" },
				{ text: "API Reference", href: "/docs/api" },
				{ text: "Examples", href: "/examples" },
				{ text: "Guides", href: "/docs/guides" },
			],
		},
		{
			title: "Community",
			links: [
				{ text: "GitHub", href: "https://github.com/yourusername/foldcms" },
				{ text: "Discord", href: "https://discord.gg/effect-ts" },
				{ text: "Twitter", href: "https://twitter.com/foldcms" },
				{ text: "Contribute", href: "/docs/contributing" },
			],
		},
		{
			title: "Resources",
			links: [
				{ text: "Changelog", href: "/changelog" },
				{ text: "Roadmap", href: "/roadmap" },
				{ text: "Blog", href: "/blog" },
				{ text: "Newsletter", href: "/newsletter" },
			],
		},
		{
			title: "Legal",
			links: [
				{ text: "License", href: "/license" },
				{ text: "Privacy", href: "/privacy" },
				{ text: "Terms", href: "/terms" },
			],
		},
	],
} as const;

// ===== SEO METADATA =====

export const seo = {
	title: "FoldCMS - Type-Safe Static CMS for Modern JavaScript",
	description:
		"Build content-rich applications with full TypeScript type safety, zero runtime overhead, and the power of Effect. Open source, git-based, framework agnostic.",
	keywords: [
		"TypeScript CMS",
		"Static CMS",
		"Type-safe CMS",
		"Effect-TS",
		"Content Management",
		"Git-based CMS",
		"Headless CMS",
		"Bun",
		"SQLite",
		"Effect",
	],
	ogImage: "/og-image.png",
	twitterCard: "summary_large_image",
} as const;

// ===== TYPE HELPERS =====

export type HeroContent = typeof hero;
export type FeatureTab = (typeof features.tabs)[number];
export type UseCase = (typeof useCases.cases)[number];
export type Framework = (typeof integrations.frameworks)[number];
export type ComparisonStatus = "full" | "partial" | "none";
