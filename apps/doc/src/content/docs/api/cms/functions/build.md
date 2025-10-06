---
editUrl: false
next: false
prev: false
title: "build"
---

> **build**\<`TMap`, `TCollection`\>(`config`): `Effect`\<`void`, [`LoadingError`](/api/cms/classes/loadingerror/) \| [`TransformationError`](/api/cms/classes/transformationerror/) \| [`ValidationError`](/api/cms/classes/validationerror/), `ContentStore` \| `Exclude`\<`Exclude`\<`CollectionDeps`\<`TCollection`\>, `ParentSpan`\>, `never`\>\>

Defined in: [packages/core/src/cms.ts:301](https://github.com/bitswired/foldcms/blob/f5268f9ab9ef080063daf132e858e3c5524b2050/packages/core/src/cms.ts#L301)

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
