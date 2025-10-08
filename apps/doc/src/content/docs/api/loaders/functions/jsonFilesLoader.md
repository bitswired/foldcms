---
editUrl: false
next: false
prev: false
title: "jsonFilesLoader"
---

> **jsonFilesLoader**\<`T`\>(`schema`, `config`): `LoaderReturn`\<`T`\>

Defined in: [packages/core/src/loaders.ts:67](https://github.com/bitswired/foldcms/blob/e40d0cf35579f8d8914becd5acbabb5d0cdf8620/packages/core/src/loaders.ts#L67)

Loads and parses JSON files from a directory, validating each file against a schema.

## Type Parameters

### T

`T` *extends* `AnyStruct`

The schema type extending AnyStruct

## Parameters

### schema

`T`

Effect Schema used to validate and decode the JSON content

### config

Configuration object

#### folder

`string`

Path to the directory containing JSON files

## Returns

`LoaderReturn`\<`T`\>

A Stream of validated objects matching the schema type

## Throws

When no JSON files are found, parsing fails, or validation fails

## Example

```typescript
const UserSchema = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
});

const users = jsonFilesLoader(UserSchema, { folder: './data/users' });
```
