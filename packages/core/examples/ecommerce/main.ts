import { BunContext } from "@effect/platform-bun";
import { SqliteClient } from "@effect/sql-sqlite-bun";
import {
	build,
	defineCollection,
	makeCms,
	SqlContentStore,
} from "@foldcms/core";
import {
	jsonFilesLoader,
	mdxLoader,
	yamlFilesLoader,
	yamlStreamLoader,
} from "@foldcms/core/loaders";
import { Console, Effect, Layer, Option, Schema } from "effect";

// ============================================
// 1. DEFINE SCHEMAS
// ============================================

const CategorySchema = Schema.Struct({
	id: Schema.String,
	name: Schema.String,
	slug: Schema.String,
	description: Schema.String,
	icon: Schema.String,
	parentId: Schema.NullOr(Schema.String),
});

const TagSchema = Schema.Struct({
	id: Schema.String,
	name: Schema.String,
	color: Schema.String,
});

const ProductSchema = Schema.Struct({
	id: Schema.String,
	sku: Schema.String,
	name: Schema.String,
	slug: Schema.String,
	description: Schema.String,
	price: Schema.Number,
	currency: Schema.String,
	stock: Schema.Number,
	categoryId: Schema.String,
	tagIds: Schema.Array(Schema.String),
	images: Schema.Array(Schema.String),
	specifications: Schema.Record({
		key: Schema.String,
		value: Schema.String,
	}),
	featured: Schema.Boolean,
	available: Schema.Boolean,
	publishedAt: Schema.DateFromString,
});

const BlogPostSchema = Schema.Struct({
	id: Schema.String,
	title: Schema.String,
	slug: Schema.String,
	excerpt: Schema.String,
	author: Schema.String,
	publishedAt: Schema.DateFromString,
	updatedAt: Schema.DateFromString,
	categoryId: Schema.String,
	tagIds: Schema.Array(Schema.String),
	coverImage: Schema.String,
	featured: Schema.Boolean,
	meta: Schema.Struct({
		mdx: Schema.String,
		raw: Schema.String,
		exports: Schema.Record({
			key: Schema.String,
			value: Schema.Unknown,
		}),
	}),
});

// ============================================
// 2. DEFINE COLLECTIONS
// ============================================

const categories = defineCollection({
	loadingSchema: CategorySchema,
	loader: yamlFilesLoader(CategorySchema, {
		folder: "cms-data/categories",
	}),
	relations: {
		parentId: {
			type: "single",
			field: "parentId",
			target: "categories",
		},
	},
});

const tags = defineCollection({
	loadingSchema: TagSchema,
	loader: yamlStreamLoader(TagSchema, {
		folder: "cms-data/tags",
	}),
});

const products = defineCollection({
	loadingSchema: ProductSchema,
	loader: jsonFilesLoader(ProductSchema, {
		folder: "cms-data/products",
	}),
	relations: {
		categoryId: {
			type: "single",
			field: "categoryId",
			target: "categories",
		},
		tagIds: {
			type: "array",
			field: "tagIds",
			target: "tags",
		},
	},
});

const blog = defineCollection({
	loadingSchema: BlogPostSchema,
	loader: mdxLoader(BlogPostSchema, {
		folder: "cms-data/blog",
		bundlerOptions: {
			cwd: process.cwd(),
		},
	}),
	relations: {
		categoryId: {
			type: "single",
			field: "categoryId",
			target: "categories",
		},
		tagIds: {
			type: "array",
			field: "tagIds",
			target: "tags",
		},
	},
});

// ============================================
// 3. CREATE CMS INSTANCE
// ============================================

const { CmsTag, CmsLayer } = makeCms({
	collections: {
		categories,
		tags,
		products,
		blog,
	},
});

// ============================================
// 4. SETUP LAYERS
// ============================================

// Use on disk path for persistence
const SqlLive = SqliteClient.layer({
	filename: "cms-example.db",
});

const AppLayer = CmsLayer.pipe(
	Layer.provideMerge(SqlContentStore),
	Layer.provideMerge(SqlLive),
	Layer.provideMerge(BunContext.layer),
);

// ============================================
// 5. EXAMPLE QUERIES
// ============================================

const examples = Effect.gen(function* () {
	const cms = yield* CmsTag;

	yield* Console.log("\n========================================");
	yield* Console.log("🚀 FoldCMS E-commerce Example");
	yield* Console.log("========================================\n");

	// Example 1: Get all products
	yield* Console.log("📦 Example 1: Get all products");
	yield* Console.log("========================================");
	const allProducts = yield* cms.getAll("products");
	yield* Console.log(`Found ${allProducts.length} products:`);
	for (const product of allProducts) {
		yield* Console.log(`  - ${product.name} ($${product.price})`);
	}

	// Example 2: Get a specific product by ID
	yield* Console.log("\n📦 Example 2: Get product by ID");
	yield* Console.log("========================================");
	const pixelOption = yield* cms.getById("products", "prod-pixel-9-pro");
	if (Option.isSome(pixelOption)) {
		const pixel = pixelOption.value;
		yield* Console.log(`Product: ${pixel.name}`);
		yield* Console.log(`Price: $${pixel.price}`);
		yield* Console.log(`Stock: ${pixel.stock} units`);
		yield* Console.log(`SKU: ${pixel.sku}`);
	}

	// Example 3: Load product category relation
	yield* Console.log("\n🔗 Example 3: Load product category");
	yield* Console.log("========================================");
	if (Option.isSome(pixelOption)) {
		const pixel = pixelOption.value;
		const categoryOption = yield* cms.loadRelation(
			"products",
			pixel,
			"categoryId",
		);

		if (Option.isSome(categoryOption)) {
			const category = categoryOption.value;
			yield* Console.log(`Product: ${pixel.name}`);
			yield* Console.log(`Category: ${category.name}`);
			yield* Console.log(`Category Description: ${category.description}`);
		}
	}

	// Example 4: Load product tags relation
	yield* Console.log("\n🏷️  Example 4: Load product tags");
	yield* Console.log("========================================");
	if (Option.isSome(pixelOption)) {
		const pixel = pixelOption.value;
		const productTags = yield* cms.loadRelation("products", pixel, "tagIds");

		yield* Console.log(`Product: ${pixel.name}`);
		yield* Console.log("Tags:");
		for (const tag of productTags) {
			yield* Console.log(`  - ${tag.name} (${tag.color})`);
		}
	}

	// Example 5: Get all blog posts
	yield* Console.log("\n📝 Example 5: Get all blog posts");
	yield* Console.log("========================================");
	const allPosts = yield* cms.getAll("blog");
	yield* Console.log(`Found ${allPosts.length} blog posts:`);
	for (const post of allPosts) {
		yield* Console.log(`  - ${post.title}`);
		yield* Console.log(
			`    by ${post.author} on ${post.publishedAt.toLocaleDateString()}`,
		);
		yield* Console.log(`    Featured: ${post.featured ? "Yes" : "No"}`);
	}

	// Example 6: Get a specific blog post and load relations
	yield* Console.log("\n📝 Example 6: Get blog post with relations");
	yield* Console.log("========================================");
	const aiPostOption = yield* cms.getById("blog", "blog-ai-smartphones-2025");
	if (Option.isSome(aiPostOption)) {
		const aiPost = aiPostOption.value;
		yield* Console.log(`Title: ${aiPost.title}`);
		yield* Console.log(`Excerpt: ${aiPost.excerpt}`);
		yield* Console.log(`Author: ${aiPost.author}`);

		// Load category
		const postCategoryOption = yield* cms.loadRelation(
			"blog",
			aiPost,
			"categoryId",
		);
		if (Option.isSome(postCategoryOption)) {
			yield* Console.log(`Category: ${postCategoryOption.value.name}`);
		}

		// Load tags
		const postTags = yield* cms.loadRelation("blog", aiPost, "tagIds");
		yield* Console.log("Tags:");
		for (const tag of postTags) {
			yield* Console.log(`  - ${tag.name}`);
		}

		// Show MDX metadata
		yield* Console.log(
			`\nMDX Content Length: ${aiPost.meta.mdx.length} characters`,
		);
		yield* Console.log(
			`Raw Markdown Length: ${aiPost.meta.raw.length} characters`,
		);
	}

	// Example 7: Get all categories with parent relations
	yield* Console.log("\n📂 Example 7: Categories with parent relations");
	yield* Console.log("========================================");
	const allCategories = yield* cms.getAll("categories");
	for (const category of allCategories) {
		if (category.parentId) {
			const parentOption = yield* cms.loadRelation(
				"categories",
				category,
				"parentId",
			);
			if (Option.isSome(parentOption)) {
				yield* Console.log(
					`${category.icon} ${category.name} (child of ${parentOption.value.name})`,
				);
			}
		} else {
			yield* Console.log(`${category.icon} ${category.name} (root category)`);
		}
	}

	// Example 8: Filter products by price
	yield* Console.log("\n💰 Example 8: Filter products by price");
	yield* Console.log("========================================");
	const premiumProducts = allProducts.filter((p) => p.price > 1000);
	yield* Console.log(`Premium products (>$1000): ${premiumProducts.length}`);
	for (const product of premiumProducts) {
		yield* Console.log(`  - ${product.name}: $${product.price}`);
	}

	// Example 9: Filter products by availability and stock
	yield* Console.log("\n📊 Example 9: Filter by availability and stock");
	yield* Console.log("========================================");
	const inStockProducts = allProducts.filter((p) => p.available && p.stock > 0);
	yield* Console.log(`Products in stock: ${inStockProducts.length}`);
	for (const product of inStockProducts) {
		yield* Console.log(`  - ${product.name}: ${product.stock} units available`);
	}

	// Example 10: Featured products
	yield* Console.log("\n⭐ Example 10: Featured products");
	yield* Console.log("========================================");
	const featuredProducts = allProducts.filter((p) => p.featured);
	yield* Console.log(`Featured products: ${featuredProducts.length}`);
	for (const product of featuredProducts) {
		yield* Console.log(`  - ${product.name}`);
		yield* Console.log(`    ${product.description.substring(0, 80)}...`);
	}

	// Example 11: Get all tags
	yield* Console.log("\n🏷️  Example 11: All tags");
	yield* Console.log("========================================");
	const allTags = yield* cms.getAll("tags");
	yield* Console.log(`Total tags: ${allTags.length}`);
	for (const tag of allTags) {
		yield* Console.log(`  - ${tag.name} (${tag.color})`);
	}

	// Example 12: Featured blog posts
	yield* Console.log("\n⭐ Example 12: Featured blog posts");
	yield* Console.log("========================================");
	const featuredPosts = allPosts.filter((p) => p.featured);
	yield* Console.log(`Featured posts: ${featuredPosts.length}`);
	for (const post of featuredPosts) {
		yield* Console.log(`  - ${post.title}`);
		yield* Console.log(`    ${post.excerpt.substring(0, 80)}...`);
	}

	yield* Console.log("\n========================================");
	yield* Console.log("✅ All examples completed successfully!");
	yield* Console.log("========================================\n");
});

// ============================================
// 6. RUN THE PROGRAM
// ============================================

const program = Effect.gen(function* () {
	// Build the CMS (load and store all content)
	yield* Console.log("🔨 Building CMS...\n");
	yield* build({
		collections: {
			categories,
			tags,
			products,
			blog,
		},
	});

	yield* Console.log("✅ Build complete!\n");

	// Run all examples
	yield* examples;
});

// Execute the program
program.pipe(Effect.provide(AppLayer), Effect.runPromise).then(
	() => {
		console.log("✨ Example completed successfully!");
		process.exit(0);
	},
	(error) => {
		console.error("❌ Error:", error);
		process.exit(1);
	},
);
