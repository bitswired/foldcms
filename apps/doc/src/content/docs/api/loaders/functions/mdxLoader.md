---
editUrl: false
next: false
prev: false
title: "mdxLoader"
---

> **mdxLoader**\<`T`\>(`schema`, `config`): `LoaderReturn`\<`T`\>

Defined in: [packages/core/src/loaders.ts:230](https://github.com/bitswired/foldcms/blob/a5796744336f5646b8ccb4abf3c6d1334a83f443/packages/core/src/loaders.ts#L230)

Loads and processes MDX files from a directory, bundling them and validating against a schema.
Extracts frontmatter, compiles MDX to executable code, and optionally captures named exports.

## Type Parameters

### T

`T` *extends* `AnyStruct`

The schema type extending AnyStruct

## Parameters

### schema

`T`

Effect Schema used to validate the combined frontmatter and metadata

### config

Configuration object

#### bundlerOptions

`Omit`\<`Parameters`\<*typeof* `bundleMDX`\>\[`0`\], `"source"` \| `"file"`\>

Options passed to mdx-bundler (excluding 'source' and 'file')

#### exports?

`string`[]

Optional array of export names to extract from the MDX module

#### folder

`string`

Path to the directory containing MDX files

## Returns

`LoaderReturn`\<`T`\>

A Stream of validated objects containing frontmatter and a meta object with mdx code, raw content, and exports

## Throws

When no MDX files are found, bundling fails, or validation fails

## Example

```typescript
const PostSchema = Schema.Struct({
  title: Schema.String,
  date: Schema.String,
  meta: Schema.Struct({
    mdx: Schema.String,
    raw: Schema.String,
    exports: Schema.Record(Schema.String, Schema.Unknown),
  }),
});

const posts = mdxLoader(PostSchema, {
  folder: './content/posts',
  bundlerOptions: { cwd: process.cwd() },
  exports: ['metadata', 'getStaticProps'],
});
```
