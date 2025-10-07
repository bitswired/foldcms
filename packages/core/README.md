# FoldCMS

A type-safe, stream-based static CMS powered by Effect and SQLite. Build blazingly fast content workflows with full type safety, efficient querying, and seamless asset management.

## Features

- **🎯 Full Type Safety** - End-to-end type safety powered by Effect Schema
- **⚡ Stream-Based Architecture** - Efficient data loading and processing with Effect Streams
- **🗄️ SQLite Under the Hood** - Fast, efficient querying with automatic indexing
- **🔗 Type-Safe Relations** - Define and query relationships between collections with complete type inference
- **📦 Built-in Loaders** - JSON, YAML, MDX, and JSON Lines loaders included
- **☁️ Asset Sync Utilities** - Sync static assets to S3-compatible storage (R2, S3, etc.)
- **⚙️ Effect-Native** - Built on Effect for composable, testable, and maintainable code

## Installation

```bash
bun add @foldcms/core effect @effect/platform @effect/sql-sqlite-bun
```

### Peer Dependencies

```bash
# For MDX support
bun add mdx-bundler esbuild react react-dom

# For YAML support
bun add yaml

# For S3/R2 asset sync
bun add @aws-sdk/client-s3
```

## Quick Start

```typescript
import { Schema, Effect } from "effect";
import { defineCollection, makeCms, build, SqlContentStore } from "@foldcms/core";
import { jsonFilesLoader } from "@foldcms/core/loaders";
import { SqliteClient } from "@effect/sql-sqlite-bun";

// 1. Define your schemas
const PostSchema = Schema.Struct({
  id: Schema.String,
  title: Schema.String,
  content: Schema.String,
  authorId: Schema.String,
  publishedAt: Schema.Date,
});

const AuthorSchema = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  email: Schema.String,
});

// 2. Create collections with relations
const posts = defineCollection({
  loadingSchema: PostSchema,
  loader: jsonFilesLoader(PostSchema, {
    folder: "posts",
  }),
  relations: {
    authorId: {
      type: "single",
      field: "authorId",
      target: "authors",
    },
  },
});

const authors = defineCollection({
  loadingSchema: AuthorSchema,
  loader: jsonFilesLoader(AuthorSchema, {
    folder: "authors",
  }),
});

// 3. Create CMS instance
const { CmsTag, CmsLayer } = makeCms({
  collections: { posts, authors },
});

// 4. Set up dependencies
const SqlLive = SqliteClient.layer({
  filename: "cms.db",
});

const AppLayer = CmsLayer.pipe(
  Layer.provideMerge(SqlContentStore),
  Layer.provide(SqlLive),
);

// 5. Build and query
const program = Effect.gen(function* () {
  // Build the database
  yield* build({ collections: { posts, authors } });
  
  // Get CMS instance
  const cms = yield* CmsTag;
  
  // Query posts
  const allPosts = yield* cms.getAll("posts");
  
  // Get specific post
  const post = yield* cms.getById("posts", "post-1");
  
  // Load relations
  if (Option.isSome(post)) {
    const author = yield* cms.loadRelation("posts", post.value, "authorId");
    console.log(author); // Fully typed!
  }
  
  return allPosts;
});

await Effect.runPromise(program.pipe(Effect.provide(AppLayer)));
```

## Core Concepts

### Collections

Collections are type-safe data sources with optional transformation and validation:

```typescript
const posts = defineCollection({
  // Schema for loaded data
  loadingSchema: PostLoadSchema,
  
  // Schema after transformation (optional)
  transformedSchema: PostTransformSchema,
  
  // Stream-based loader
  loader: jsonFilesLoader(PostLoadSchema, {
    folder: "posts",
  }),
  
  // Optional transformer
  transformer: (post) => Effect.gen(function* () {
    return {
      ...post,
      excerpt: post.content.slice(0, 200),
    };
  }),
  
  // Optional validator
  validator: (post) => Effect.gen(function* () {
    if (post.title.length < 3) {
      return yield* Effect.fail(
        new ValidationError({
          message: "Title too short",
          issues: ["Title must be at least 3 characters"],
        })
      );
    }
  }),
  
  // Relations to other collections
  relations: {
    authorId: {
      type: "single",
      field: "authorId",
      target: "authors",
    },
    tagIds: {
      type: "array",
      field: "tagIds",
      target: "tags",
    },
  },
});
```

### Relations

FoldCMS supports three types of relations with full type safety:

**Single Relations** - One-to-one relationships
```typescript
relations: {
  authorId: {
    type: "single",
    field: "authorId",
    target: "authors",
  },
}

// Returns: Option<Author>
const author = yield* cms.loadRelation("posts", post, "authorId");
```

**Array Relations** - One-to-many relationships
```typescript
relations: {
  tagIds: {
    type: "array",
    field: "tagIds",
    target: "tags",
  },
}

// Returns: readonly Tag[]
const tags = yield* cms.loadRelation("posts", post, "tagIds");
```

**Map Relations** - Key-value relationships
```typescript
relations: {
  translations: {
    type: "map",
    field: "translationMap", // { "en": "id1", "fr": "id2" }
    target: "translations",
  },
}

// Returns: ReadonlyMap<string, Translation>
const translations = yield* cms.loadRelation("posts", post, "translations");
```

## Built-in Loaders

### JSON Files
```typescript
import { jsonFilesLoader } from "@foldcms/core/loaders";

const loader = jsonFilesLoader(MySchema, {
  folder: "posts", // Loads all .json files
});
```

### JSON Lines
```typescript
import { jsonLinesLoader } from "@foldcms/core/loaders";

const loader = jsonLinesLoader(MySchema, {
  folder: "data", // Loads .jsonl files
});
```

### YAML Files
```typescript
import { yamlFilesLoader } from "@foldcms/core/loaders";

const loader = yamlFilesLoader(MySchema, {
  folder: "config", // Loads .yaml/.yml files
});
```

### YAML Stream
```typescript
import { yamlStreamLoader } from "@foldcms/core/loaders";

// For YAML files with multiple documents (---)
const loader = yamlStreamLoader(MySchema, {
  folder: "data",
});
```

### MDX
```typescript
import { mdxLoader } from "@foldcms/core/loaders";

const PostSchema = Schema.Struct({
  title: Schema.String,
  slug: Schema.String,
  tags: Schema.Array(Schema.String),
  meta: Schema.Struct({
    mdx: Schema.String,      // Compiled MDX
    raw: Schema.String,       // Original content
    exports: Schema.Record({  // Exported values
      key: Schema.String,
      value: Schema.Any,
    }),
  }),
});

const loader = mdxLoader(PostSchema, {
  folder: "posts",
  bundlerOptions: {
    cwd: process.cwd(),
    // Any mdx-bundler options
  },
  exports: ["metadata", "toc"], // Export names to capture
});
```

## Asset Management

Sync static assets to S3-compatible storage with automatic change detection:

```typescript
import { syncFolderToStorage, S3StorageServiceLive } from "@foldcms/core/utils";
import { ConfigProvider, Effect } from "effect";

const program = syncFolderToStorage({
  folderPath: "/path/to/assets",
  
  // Determine bucket based on filename
  getBucket: (fileName) => {
    if (fileName.endsWith(".pdf")) {
      return Effect.succeed("private-bucket");
    }
    return Effect.succeed("public-bucket");
  },
  
  // Clean up orphaned files
  bucketsToClean: ["public-bucket", "private-bucket"],
  deleteOrphaned: true,
  
  concurrency: 10,
}).pipe(
  Effect.provide(S3StorageServiceLive),
  Effect.withConfigProvider(
    ConfigProvider.fromJson({
      S3_ACCOUNT_ID: "your-account-id",
      S3_ACCESS_KEY_ID: "your-key",
      S3_SECRET_ACCESS_KEY: "your-secret",
    })
  )
);

await Effect.runPromise(program);
```

### Creating a Media Collection

After syncing assets, create a collection to reference them:

```typescript
const MediaSchema = Schema.Struct({
  id: Schema.String,
  filename: Schema.String,
  url: Schema.String,
  size: Schema.Number,
  mimeType: Schema.String,
});

const media = defineCollection({
  loadingSchema: MediaSchema,
  loader: jsonFilesLoader(MediaSchema, {
    folder: "media",
  }),
});

// Reference media in other collections
const posts = defineCollection({
  loadingSchema: PostSchema,
  loader: jsonFilesLoader(PostSchema, {
    folder: "posts",
  }),
  relations: {
    featuredImageId: {
      type: "single",
      field: "featuredImageId",
      target: "media",
    },
  },
});
```

## Advanced Usage

### Custom Loaders

Create custom loaders using Effect Streams:

```typescript
import { Stream, Effect } from "effect";
import { LoadingError } from "@foldcms/core";

const customLoader = <T extends Schema.Struct<any>>(
  schema: T,
  config: { source: string }
) => {
  return Stream.fromIterable([/* your data */])
    .pipe(
      Stream.mapEffect((raw) => Schema.decodeUnknown(schema)(raw)),
      Stream.mapError((e) => new LoadingError({ 
        message: e.message, 
        cause: e 
      }))
    );
};
```

### Transformation Pipeline

Transform data during loading:

```typescript
const posts = defineCollection({
  loadingSchema: PostLoadSchema,
  transformedSchema: PostTransformSchema,
  loader: jsonFilesLoader(PostLoadSchema, {
    folder: "posts",
  }),
  transformer: (post) => Effect.gen(function* () {
    // Add computed fields
    const wordCount = post.content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    
    // Fetch related data
    const author = yield* fetchAuthor(post.authorId);
    
    return {
      ...post,
      wordCount,
      readingTime,
      authorName: author.name,
    };
  }),
});
```

### Custom Validation

Add validation logic to ensure data quality:

```typescript
const posts = defineCollection({
  loadingSchema: PostSchema,
  loader: jsonFilesLoader(PostSchema, {
    folder: "posts",
  }),
  validator: (post) => Effect.gen(function* () {
    const issues: string[] = [];
    
    if (post.title.length < 10) {
      issues.push("Title too short");
    }
    
    if (post.content.length < 100) {
      issues.push("Content too short");
    }
    
    if (issues.length > 0) {
      return yield* Effect.fail(
        new ValidationError({
          message: `Validation failed for post ${post.id}`,
          issues,
        })
      );
    }
  }),
});
```

## Testing

FoldCMS is built with Effect, making it highly testable:

```typescript
import { test, expect } from "bun:test";
import { Effect, Layer, ManagedRuntime } from "effect";
import { SqliteClient } from "@effect/sql-sqlite-bun";

const SqlLive = SqliteClient.layer({ filename: ":memory:" });

const CmsLive = CmsLayer.pipe(
  Layer.provideMerge(SqlContentStore),
  Layer.provide(SqlLive)
);

const TestRuntime = ManagedRuntime.make(CmsLive);

test("loads and queries posts", async () => {
  await TestRuntime.runPromise(build({ collections: { posts } }));
  
  const program = Effect.gen(function* () {
    const cms = yield* CmsTag;
    const allPosts = yield* cms.getAll("posts");
    return allPosts;
  });
  
  const posts = await TestRuntime.runPromise(program);
  expect(posts).toHaveLength(2);
});
```

## Performance

- **Efficient Querying**: SQLite with automatic indexes
- **Streaming**: Process large datasets without loading everything into memory
- **Concurrent Loading**: Multiple collections load in parallel
- **Smart Caching**: Asset sync only uploads changed files (hash-based)

## Why Effect?

FoldCMS is built on [Effect](https://effect.website), providing:

- **Composability**: Build complex workflows from simple pieces
- **Type Safety**: Catch errors at compile time
- **Testability**: Pure functions make testing easy
- **Resource Management**: Automatic cleanup of database connections
- **Error Handling**: Structured error types instead of throwing
- **Observability**: Built-in logging and tracing

## Examples

Check out the `/tests` directory for complete examples:
- Basic CMS setup
- Relations between collections
- Custom loaders
- Asset sync

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.

## Support
