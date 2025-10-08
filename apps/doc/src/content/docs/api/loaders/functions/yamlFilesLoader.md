---
editUrl: false
next: false
prev: false
title: "yamlFilesLoader"
---

> **yamlFilesLoader**\<`T`\>(`schema`, `config`): `LoaderReturn`\<`T`\>

Defined in: [packages/core/src/loaders.ts:140](https://github.com/bitswired/foldcms/blob/e40d0cf35579f8d8914becd5acbabb5d0cdf8620/packages/core/src/loaders.ts#L140)

Loads and parses YAML files from a directory, validating each file against a schema.
Supports both .yaml and .yml file extensions. Each file is parsed as a single YAML document.

## Type Parameters

### T

`T` *extends* `AnyStruct`

The schema type extending AnyStruct

## Parameters

### schema

`T`

Effect Schema used to validate and decode the YAML content

### config

Configuration object

#### folder

`string`

Path to the directory containing YAML files

## Returns

`LoaderReturn`\<`T`\>

A Stream of validated objects matching the schema type

## Throws

When no YAML files are found, parsing fails, or validation fails

## Example

```typescript
const ConfigSchema = Schema.Struct({
  name: Schema.String,
  settings: Schema.Record(Schema.String, Schema.Unknown),
});

const configs = yamlFilesLoader(ConfigSchema, { folder: './configs' });
```
