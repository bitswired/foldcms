---
editUrl: false
next: false
prev: false
title: "yamlStreamLoader"
---

> **yamlStreamLoader**\<`T`\>(`schema`, `config`): `LoaderReturn`\<`T`\>

Defined in: [packages/core/src/loaders.ts:181](https://github.com/bitswired/foldcms/blob/95183c86c9f5ae59bfbaa7d6e4a44975123622e3/packages/core/src/loaders.ts#L181)

Loads and parses YAML files containing multiple documents, validating each document against a schema.
Supports both .yaml and .yml file extensions. Each file can contain multiple YAML documents separated by `---`.

## Type Parameters

### T

`T` *extends* `AnyStruct`

The schema type extending AnyStruct

## Parameters

### schema

`T`

Effect Schema used to validate and decode each YAML document

### config

Configuration object

#### folder

`string`

Path to the directory containing YAML files

## Returns

`LoaderReturn`\<`T`\>

A Stream of validated objects matching the schema type, one per YAML document

## Throws

When no YAML files are found, parsing fails, or validation fails

## Example

```typescript
const ArticleSchema = Schema.Struct({
  title: Schema.String,
  content: Schema.String,
});

// Handles files with multiple YAML documents:
// ---
// title: "First"
// ---
// title: "Second"
const articles = yamlStreamLoader(ArticleSchema, { folder: './articles' });
```
