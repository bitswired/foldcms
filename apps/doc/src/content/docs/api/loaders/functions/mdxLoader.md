---
editUrl: false
next: false
prev: false
title: "mdxLoader"
---

> **mdxLoader**\<`T`\>(`schema`, `config`): `Stream`\<`T`\[`"Type"`\], [`LoadingError`](/api/cms/classes/loadingerror/), `never`\>

Defined in: [packages/core/src/loaders.ts:105](https://github.com/bitswired/foldcms/blob/92f893e734b1102683a12bd11c6183cc24996bdf/packages/core/src/loaders.ts#L105)

## Type Parameters

### T

`T` *extends* `AnyStruct`

## Parameters

### schema

`T`

### config

#### baseDir

`string`

#### bundlerOptions

`Omit`\<`Parameters`\<*typeof* `bundleMDX`\>\[`0`\], `"source"` \| `"file"`\>

#### exports?

`string`[]

#### folder

`string`

## Returns

`Stream`\<`T`\[`"Type"`\], [`LoadingError`](/api/cms/classes/loadingerror/), `never`\>
