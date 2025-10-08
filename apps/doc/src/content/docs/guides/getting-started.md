---
title: Getting Started
description: A comprehensive guide to building your first FoldCMS project from scratch.
---

Welcome to FoldCMS! This guide will walk you through building a complete e-commerce content system with products, blog posts, categories, and tags. By the end, you'll understand how to load multiple content formats, define type-safe relationships, and query your content with full TypeScript safety.

## What We're Building

We'll create a tech e-commerce site with:
- **Products** loaded from JSON files
- **Blog posts** written in MDX
- **Categories** stored in YAML files
- **Tags** in a YAML stream format
- **Type-safe relationships** between all content types

## Prerequisites

- [Bun](https://bun.sh) installed (v1.0+)
- Basic TypeScript knowledge
- Familiarity with Effect (helpful but not required)

## Installation

First, create a new directory and install FoldCMS:

```bash
mkdir my-cms-project
cd my-cms-project
bun init -y
```

Install the required dependencies:

```bash
bun add @foldcms/core effect @effect/platform @effect/sql-sqlite-bun
```

### Peer Dependencies

Depending on which loaders you'll use, install the appropriate peer dependencies:

```bash
# For MDX support
bun add mdx-bundler esbuild react react-dom

# For YAML support
bun add yaml

# TypeScript
bun add -D typescript @types/bun
```

## Project Structure

Let's set up a well-organized content structure. Create the following directory layout:

```
.
├── cms-data/              # All your content lives here
│   ├── blog/             # MDX blog posts
│   ├── categories/       # YAML category files
│   ├── products/         # JSON product files
│   └── tags/             # YAML stream for tags
├── main.ts               # Your CMS program
└── package.json
```

Create the directories:

```bash
mkdir -p cms-data/{blog,categories,products,tags}
```

### Understanding the Structure

**Why this structure?**

- **Separation by content type**: Each content type gets its own folder
- **Format flexibility**: Use JSON for data-heavy content, YAML for human-friendly config, MDX for rich content
- **Scalability**: Easy to add new content types as folders
- **Version control friendly**: Text-based formats work great with Git

The build process will create SQLite database files (`cms-example.db`, `.db-shm`, `.db-wal`) for efficient querying.

## Step 1: Create Your Content

### Categories (YAML)

Categories use YAML because they're configuration-like data that humans need to edit frequently. Create individual YAML files for better organization.

**`cms-data/categories/electronics.yaml`**

```yaml
id: cat-electronics
name: Electronics
slug: electronics
description: Latest in consumer electronics and gadgets
icon: 💻
parentId: null
```

**`cms-data/categories/smartphones.yaml`**

```yaml
id: cat-smartphones
name: Smartphones
slug: smartphones
description: Modern smartphones and mobile devices
icon: 📱
parentId: cat-electronics  # This creates a parent-child relationship
```

Create two more: `laptops.yaml` (parent: electronics) and `accessories.yaml` (parent: null).

**Why YAML for categories?**
- Human-readable and easy to edit
- Great for hierarchical data
- No quotes needed for most values
- Comments supported

### Tags (YAML Stream)

Tags use YAML stream format (multiple documents in one file separated by `---`) because they're simple and often edited together.

**`cms-data/tags/content.yaml`**

```yaml
---
id: tag-5g
name: 5G
color: "#3B82F6"
---
id: tag-wireless
name: Wireless
color: "#8B5CF6"
---
id: tag-gaming
name: Gaming
color: "#EF4444"
---
id: tag-premium
name: Premium
color: "#F59E0B"
```

Add more tags as needed (productivity, budget, sustainable, innovation).

**Why YAML stream for tags?**
- All tags in one file for easy overview
- Quick to add new tags
- Separated by `---` markers
- Still human-readable

### Products (JSON)

Products use JSON because they have complex nested data structures and many fields.

**`cms-data/products/pixel-9-pro.json`**

```json
{
  "id": "prod-pixel-9-pro",
  "sku": "GOOG-PIX9P-128",
  "name": "Google Pixel 9 Pro",
  "slug": "google-pixel-9-pro",
  "description": "Experience the power of Google AI in a premium smartphone.",
  "price": 999,
  "currency": "USD",
  "stock": 45,
  "categoryId": "cat-smartphones",
  "tagIds": ["tag-5g", "tag-premium", "tag-innovation"],
  "images": [
    "/products/pixel-9-pro-front.jpg",
    "/products/pixel-9-pro-back.jpg"
  ],
  "specifications": {
    "display": "6.7\" LTPO OLED",
    "processor": "Google Tensor G4",
    "ram": "12GB",
    "storage": "128GB"
  },
  "featured": true,
  "available": true,
  "publishedAt": "2024-10-15T10:00:00Z"
}
```

Create 5-6 more product files with different categories and tags.

**Why JSON for products?**
- Complex nested structures (specifications)
- Arrays of images
- Precise data types (numbers for prices)
- Easy to generate programmatically

### Blog Posts (MDX)

Blog posts use MDX for rich content with frontmatter metadata.

**`cms-data/blog/ai-smartphones-2025.mdx`**

```mdx
---
id: blog-ai-smartphones-2025
title: "The AI Revolution in Smartphones: What to Expect in 2025"
slug: ai-smartphones-2025
excerpt: "From real-time translation to advanced photography, AI is transforming how we use our smartphones."
author: Sarah Chen
publishedAt: 2024-12-01T09:00:00Z
updatedAt: 2024-12-01T09:00:00Z
categoryId: cat-smartphones
tagIds:
  - tag-5g
  - tag-innovation
coverImage: /blog/ai-smartphones-cover.jpg
featured: true
---

# The AI Revolution in Smartphones

The smartphone industry is experiencing its biggest transformation since touchscreens. **Artificial Intelligence** is fundamentally changing how we interact with devices.

## On-Device AI Processing

Modern processors feature dedicated **Neural Processing Units (NPUs)** that handle complex AI tasks locally:

- Faster response times
- Better privacy
- Works offline
- Lower battery consumption

## Code Example

```typescript
const translate = async (text: string, targetLang: string) => {
  return await device.neuralEngine.translate(text, targetLang);
};
```

Real-time translation without cloud APIs!
```

Create 3-4 more blog posts covering different topics and categories.

**Why MDX for blog posts?**
- Frontmatter for metadata
- Rich markdown content
- Code blocks with syntax highlighting
- Can embed React components
- Compiled and bundled automatically

## Step 2: Define Your Schemas

Now let's write the TypeScript code. Create `main.ts`:

```typescript
import { Schema } from "effect";

// Define the shape of your Category
const CategorySchema = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  slug: Schema.String,
  description: Schema.String,
  icon: Schema.String,
  parentId: Schema.NullOr(Schema.String), // Can be null for root categories
});
```

**What's happening here?**

- `Schema.Struct` defines the structure of your data
- Each field has a type (`Schema.String`, `Schema.Number`, etc.)
- `Schema.NullOr` allows a field to be null
- This gives you **compile-time and runtime type safety**

Continue with Tag schema:

```typescript
const TagSchema = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  color: Schema.String, // Hex color code
});
```

Product schema with more complex types:

```typescript
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
  tagIds: Schema.Array(Schema.String), // Array of tag IDs
  images: Schema.Array(Schema.String), // Array of image URLs
  specifications: Schema.Record({      // Key-value pairs
    key: Schema.String,
    value: Schema.String,
  }),
  featured: Schema.Boolean,
  available: Schema.Boolean,
  publishedAt: Schema.DateFromString,  // Parses ISO string to Date
});
```

**Key concepts:**

- `Schema.Array` for arrays
- `Schema.Record` for key-value objects
- `Schema.DateFromString` automatically parses ISO date strings
- Field names must match your JSON exactly

Blog post schema with nested MDX metadata:

```typescript
const BlogPostSchema = Schema.Struct({
  id: Schema.String,
  title: Schema.String,
  slug: Schema.String,
  excerpt: Schema.String,
  author: Schema.String,
  publishedAt: Schema.Date,        // YAML parses dates automatically
  updatedAt: Schema.Date,
  categoryId: Schema.String,
  tagIds: Schema.Array(Schema.String),
  coverImage: Schema.String,
  featured: Schema.Boolean,
  meta: Schema.Struct({            // Nested structure for MDX data
    mdx: Schema.String,            // Compiled MDX code
    raw: Schema.String,            // Original markdown
    exports: Schema.Record({       // Any exported values from MDX
      key: Schema.String,
      value: Schema.Unknown,
    }),
  }),
});
```

**Date handling tip:**

- Use `Schema.DateFromString` for JSON (dates are strings)
- Use `Schema.Date` for YAML/MDX frontmatter (dates are parsed)

## Step 3: Define Collections with Loaders

Collections connect your schemas to your content files. Import the loaders:

```typescript
import {
  jsonFilesLoader,
  mdxLoader,
  yamlFilesLoader,
  yamlStreamLoader,
} from "@foldcms/core/loaders";
import { defineCollection } from "@foldcms/core";
```

### Categories Collection

```typescript
const categories = defineCollection({
  loadingSchema: CategorySchema,
  loader: yamlFilesLoader(CategorySchema, {
    folder: "cms-data/categories",
  }),
  relations: {
    parentId: {
      type: "single",      // One parent per category
      field: "parentId",   // Field that stores the parent ID
      target: "categories", // Points to another category
    },
  },
});
```

**What's happening?**

1. `loadingSchema`: Validates data as it loads
2. `loader`: Uses `yamlFilesLoader` to read all `.yaml` files in the folder
3. `relations`: Defines the parent-child relationship (self-referential)

### Tags Collection

```typescript
const tags = defineCollection({
  loadingSchema: TagSchema,
  loader: yamlStreamLoader(TagSchema, {
    folder: "cms-data/tags",
  }),
});
```

**Simpler!** No relations needed for tags. The `yamlStreamLoader` reads YAML documents separated by `---`.

### Products Collection

```typescript
const products = defineCollection({
  loadingSchema: ProductSchema,
  loader: jsonFilesLoader(ProductSchema, {
    folder: "cms-data/products",
  }),
  relations: {
    categoryId: {
      type: "single",       // One category per product
      field: "categoryId",
      target: "categories",
    },
    tagIds: {
      type: "array",        // Multiple tags per product
      field: "tagIds",
      target: "tags",
    },
  },
});
```

**Understanding relations:**

- `type: "single"` returns `Option<Category>` when loaded
- `type: "array"` returns `readonly Tag[]` when loaded
- Relations are **type-safe**: TypeScript knows the exact return type

### Blog Collection

```typescript
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
```

**MDX loader features:**

- Parses frontmatter automatically
- Bundles MDX into executable code
- Captures exported values
- Handles imports and components

## Step 4: Create the CMS Instance

```typescript
import { makeCms } from "@foldcms/core";

const { CmsTag, CmsLayer } = makeCms({
  collections: {
    categories,
    tags,
    products,
    blog,
  },
});
```

**What you get:**

- `CmsTag`: For dependency injection in Effect code
- `CmsLayer`: Provides the CMS service to your program

This creates a **fully type-safe** CMS. TypeScript knows:
- All collection names (`"categories"`, `"tags"`, etc.)
- All field types
- All relation types
- Return types for every query

## Step 5: Set Up the Runtime

```typescript
import { BunContext } from "@effect/platform-bun";
import { SqliteClient } from "@effect/sql-sqlite-bun";
import { Layer } from "effect";
import { SqlContentStore } from "@foldcms/core";

// SQLite database layer
const SqlLive = SqliteClient.layer({
  filename: "cms-example.db",
});

// Combine all layers
const AppLayer = CmsLayer.pipe(
  Layer.provideMerge(SqlContentStore),
  Layer.provideMerge(SqlLive),
  Layer.provideMerge(BunContext.layer),
);
```

**Layer composition:**

- `SqlLive`: SQLite database connection
- `SqlContentStore`: Content storage implementation
- `CmsLayer`: Your CMS instance
- `BunContext.layer`: Bun runtime services (file system, etc.)

Layers provide dependencies to your Effect programs.

## Step 6: Build the CMS

```typescript
import { build } from "@foldcms/core";
import { Effect, Console } from "effect";

const program = Effect.gen(function* () {
  // Build phase: Load, transform, validate, and store all content
  yield* Console.log("🔨 Building CMS...");
  
  yield* build({
    collections: {
      categories,
      tags,
      products,
      blog,
    },
  });
  
  yield* Console.log("✅ Build complete!");
});
```

**What build does:**

1. **Loads** all files from each collection
2. **Validates** against schemas
3. **Transforms** if transformers are defined
4. **Stores** in SQLite database
5. **Creates indexes** for efficient queries

This happens **once** at build time, not on every request.

## Step 7: Query Your Content

### Get All Items

```typescript
const cms = yield* CmsTag;

// Get all products
const allProducts = yield* cms.getAll("products");
//    ^? readonly Product[]

console.log(`Found ${allProducts.length} products`);
```

**Type safety:** TypeScript knows `allProducts` is `readonly Product[]` with all the fields from your schema.

### Get Item by ID

```typescript
const pixelOption = yield* cms.getById("products", "prod-pixel-9-pro");
//    ^? Option<Product>

if (Option.isSome(pixelOption)) {
  const pixel = pixelOption.value;
  console.log(`${pixel.name}: $${pixel.price}`);
}
```

**Option type:** Returns `Option<Product>` because the item might not exist. Pattern match with `Option.isSome()` to safely access the value.

### Load Single Relations

```typescript
if (Option.isSome(pixelOption)) {
  const pixel = pixelOption.value;
  
  const categoryOption = yield* cms.loadRelation(
    "products",      // Source collection
    pixel,          // Source item
    "categoryId"    // Relation field
  );
  //  ^? Option<Category>
  
  if (Option.isSome(categoryOption)) {
    console.log(`Category: ${categoryOption.value.name}`);
  }
}
```

**Single relation** returns `Option<Category>` - one item or none.

### Load Array Relations

```typescript
const productTags = yield* cms.loadRelation(
  "products",
  pixel,
  "tagIds"
);
//  ^? readonly Tag[]

console.log("Tags:");
for (const tag of productTags) {
  console.log(`  - ${tag.name} (${tag.color})`);
}
```

**Array relation** returns `readonly Tag[]` - always an array, never null.

### Filter and Transform

```typescript
// Get all products
const allProducts = yield* cms.getAll("products");

// Filter in JavaScript
const premiumProducts = allProducts.filter(p => p.price > 1000);
const inStock = allProducts.filter(p => p.available && p.stock > 0);
const featured = allProducts.filter(p => p.featured);

// Transform
const productNames = allProducts.map(p => p.name);
const totalValue = allProducts.reduce((sum, p) => sum + p.price, 0);
```

**In-memory queries:** Since everything is in SQLite and loaded into memory for queries, you can use normal JavaScript array methods.

### Load Self-Referential Relations

```typescript
const allCategories = yield* cms.getAll("categories");

for (const category of allCategories) {
  if (category.parentId) {
    const parentOption = yield* cms.loadRelation(
      "categories",
      category,
      "parentId"
    );
    
    if (Option.isSome(parentOption)) {
      console.log(`${category.name} → child of ${parentOption.value.name}`);
    }
  }
}
```

**Self-referential:** Categories can point to other categories as parents.

## Step 8: Run Your Program

```typescript
// Execute the program
program
  .pipe(Effect.provide(AppLayer))
  .pipe(Effect.runPromise)
  .then(
    () => {
      console.log("✨ Success!");
      process.exit(0);
    },
    (error) => {
      console.error("❌ Error:", error);
      process.exit(1);
    }
  );
```

Run it:

```bash
bun main.ts
```

You should see:
```
🔨 Building CMS...
[foldcms-build] Build completed in 1234ms
✅ Build complete!
Found 6 products
✨ Success!
```

## Understanding the Database

After running, you'll see these files:

```
cms-example.db      # Main SQLite database
cms-example.db-shm  # Shared memory file
cms-example.db-wal  # Write-ahead log
```

**What's stored:**

- All content as JSON blobs
- Content hashes for change detection
- Indexes on collection and ID for fast queries

**Why SQLite?**

- **Fast queries**: Orders of magnitude faster than reading files
- **Portable**: Single file database
- **Reliable**: ACID compliant
- **No server**: Embedded database

You can inspect it with:

```bash
bun install -g sqlite3
sqlite3 cms-example.db "SELECT collection, count(*) FROM entities GROUP BY collection"
```

## Advanced: Transformations

Add custom transformations during loading:

```typescript
const products = defineCollection({
  loadingSchema: ProductSchema,
  transformedSchema: EnrichedProductSchema,
  loader: jsonFilesLoader(ProductSchema, {
    folder: "cms-data/products",
  }),
  transformer: (product) => Effect.gen(function* () {
    // Add computed fields
    const discount = product.featured ? 0.1 : 0;
    const discountedPrice = product.price * (1 - discount);
    
    return {
      ...product,
      discount,
      discountedPrice,
    };
  }),
});
```

**Use cases:**
- Add computed fields
- Enrich with external data
- Generate slugs
- Optimize images

## Advanced: Validation

Add custom validation rules:

```typescript
import { ValidationError } from "@foldcms/core";

const products = defineCollection({
  loadingSchema: ProductSchema,
  loader: jsonFilesLoader(ProductSchema, {
    folder: "cms-data/products",
  }),
  validator: (product) => Effect.gen(function* () {
    const issues: string[] = [];
    
    if (product.price <= 0) {
      issues.push("Price must be positive");
    }
    
    if (product.stock < 0) {
      issues.push("Stock cannot be negative");
    }
    
    if (product.name.length < 3) {
      issues.push("Name too short");
    }
    
    if (issues.length > 0) {
      return yield* Effect.fail(
        new ValidationError({
          message: `Product ${product.id} validation failed`,
          issues,
        })
      );
    }
  }),
});
```

**Validation runs** during the build phase and will fail the build if any item is invalid.

## Advanced: Custom Loaders

Create a custom loader for remote data:

```typescript
import { Stream, Effect } from "effect";
import { LoadingError } from "@foldcms/core";

const customApiLoader = <T extends Schema.Struct<any>>(
  schema: T,
  config: { apiUrl: string }
) => {
  return Stream.fromIterableEffect(
    Effect.gen(function* () {
      // Fetch from API
      const response = yield* Effect.tryPromise({
        try: () => fetch(config.apiUrl),
        catch: (e) => new LoadingError({
          message: "API fetch failed",
          cause: e
        })
      });
      
      const data = yield* Effect.tryPromise({
        try: () => response.json(),
        catch: (e) => new LoadingError({
          message: "JSON parse failed",
          cause: e
        })
      });
      
      return data;
    })
  ).pipe(
    Stream.mapEffect((raw) => Schema.decodeUnknown(schema)(raw)),
    Stream.mapError((e) => new LoadingError({
      message: e.message,
      cause: e
    }))
  );
};
```

**Use it:**

```typescript
const remoteProducts = defineCollection({
  loadingSchema: ProductSchema,
  loader: customApiLoader(ProductSchema, {
    apiUrl: "https://api.example.com/products",
  }),
});
```

## Next Steps

Now that you have a working CMS, you can:

1. **Integrate with your framework**
   - Use with Astro, Next.js, Remix, etc.
   - Access CMS in route loaders or server components

2. **Add more content types**
   - Authors, Reviews, FAQs
   - Any structured content

3. **Customize loaders**
   - Load from databases
   - Fetch from APIs
   - Parse custom formats

4. **Deploy**
   - Build phase runs once during deployment
   - Ship the SQLite database with your app
   - Ultra-fast queries at runtime

## Common Patterns

### Framework Integration Example (Astro)

```typescript
// src/cms.ts
import { Effect } from "effect";
import { CmsTag, AppLayer } from "./cms-setup";

export async function getCms() {
  return Effect.runPromise(
    Effect.gen(function* () {
      return yield* CmsTag;
    }).pipe(Effect.provide(AppLayer))
  );
}

// src/pages/products/[slug].astro
---
import { getCms } from "../../cms";

const cms = await getCms();
const products = await Effect.runPromise(cms.getAll("products"));
const product = products.find(p => p.slug === Astro.params.slug);
---

<h1>{product.name}</h1>
<p>${product.price}</p>
```

### Rebuild on Content Changes

Watch for content changes and rebuild:

```typescript
import { watch } from "fs";

watch("cms-data", { recursive: true }, async () => {
  console.log("Content changed, rebuilding...");
  await Effect.runPromise(
    build({ collections }).pipe(Effect.provide(AppLayer))
  );
});
```

## Troubleshooting

### Schema Validation Errors

**Error:** `Expected string, actual undefined`

**Fix:** Make sure your content files have all required fields, or make fields optional:

```typescript
Schema.Struct({
  requiredField: Schema.String,
  optionalField: Schema.optional(Schema.String),
})
```

### Date Parsing Issues

**Error:** `Expected string, actual Date`

**Fix:** Use correct date schema for your format:
- `Schema.DateFromString` for JSON
- `Schema.Date` for YAML/MDX

### Loader Not Finding Files

**Error:** `No files found in directory`

**Fix:** Check:
- Folder path is correct
- Files have correct extensions (`.json`, `.yaml`, `.mdx`)
- Files are not empty

### Relation Errors

**Error:** `Related entity not found`

**Fix:** Ensure:
- Target collection is defined
- Referenced IDs exist in target collection
- IDs are spelled correctly

## Performance Tips

1. **Use SQLite for large datasets**: Queries are O(log n) instead of O(n)
2. **Index frequently queried fields**: SQLite auto-indexes collection and ID
3. **Filter after loading**: In-memory filtering is fast for reasonable dataset sizes
4. **Build once, query many**: Build phase is one-time, queries are instant
5. **Use readonly types**: Prevents accidental mutations

## Summary

You've learned:

- ✅ How to organize content in different formats
- ✅ Defining type-safe schemas with Effect Schema
- ✅ Creating collections with loaders
- ✅ Setting up relationships between content
- ✅ Building and querying the CMS
- ✅ Loading relations with full type safety
- ✅ Advanced features like transformations and custom loaders

**Key concepts:**

- **Collections**: Type-safe content containers
- **Schemas**: Runtime validation + TypeScript types
- **Loaders**: Stream-based content loading
- **Relations**: Type-safe references between content
- **Build phase**: One-time setup, stores in SQLite
- **Query phase**: Instant lookups with full type safety

FoldCMS gives you the power of a traditional CMS with the developer experience of TypeScript and the reliability of Effect. Your content is version-controlled, your queries are instant, and your types are guaranteed.

Happy building! 🚀