---
editUrl: false
next: false
prev: false
title: "jsonLinesLoader"
---

> **jsonLinesLoader**\<`T`\>(`schema`, `config`): `LoaderReturn`\<`T`\>

Defined in: [packages/core/src/loaders.ts:102](https://github.com/bitswired/foldcms/blob/e40d0cf35579f8d8914becd5acbabb5d0cdf8620/packages/core/src/loaders.ts#L102)

Loads and parses JSONL (JSON Lines) files from a directory, validating each line against a schema.
Each line in the file is treated as a separate JSON object.

## Type Parameters

### T

`T` *extends* `AnyStruct`

The schema type extending AnyStruct

## Parameters

### schema

`T`

Effect Schema used to validate and decode each JSON line

### config

Configuration object

#### folder

`string`

Path to the directory containing JSONL files

## Returns

`LoaderReturn`\<`T`\>

A Stream of validated objects matching the schema type, one per line

## Throws

When no JSONL files are found, parsing fails, or validation fails

## Example

```typescript
const LogSchema = Schema.Struct({
  timestamp: Schema.String,
  message: Schema.String,
});

const logs = jsonLinesLoader(LogSchema, { folder: './logs' });
```
