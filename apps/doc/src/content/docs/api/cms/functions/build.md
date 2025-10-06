---
editUrl: false
next: false
prev: false
title: "build"
---

> **build**\<`TMap`, `TCollection`\>(`config`): `Effect`\<`void`, [`LoadingError`](/api/cms/classes/loadingerror/) \| [`TransformationError`](/api/cms/classes/transformationerror/) \| [`ValidationError`](/api/cms/classes/validationerror/), `ContentStore` \| `Exclude`\<`Exclude`\<`CollectionDeps`\<`TCollection`\>, `ParentSpan`\>, `never`\>\>

Defined in: [packages/core/src/cms.ts:299](https://github.com/bitswired/foldcms/blob/92f893e734b1102683a12bd11c6183cc24996bdf/packages/core/src/cms.ts#L299)

## Type Parameters

### TMap

`TMap` *extends* `Record`\<`string`, `CollectionAny`\>

### TCollection

`TCollection` *extends* `Record`\<`string`, `CollectionAny`\> = `TMap`

## Parameters

### config

#### collections

`TCollection`

## Returns

`Effect`\<`void`, [`LoadingError`](/api/cms/classes/loadingerror/) \| [`TransformationError`](/api/cms/classes/transformationerror/) \| [`ValidationError`](/api/cms/classes/validationerror/), `ContentStore` \| `Exclude`\<`Exclude`\<`CollectionDeps`\<`TCollection`\>, `ParentSpan`\>, `never`\>\>
