---
editUrl: false
next: false
prev: false
title: "build"
---

> **build**\<`TMap`, `TCollection`\>(`config`): `Effect`\<`void`, [`LoadingError`](/api/cms/classes/loadingerror/) \| [`TransformationError`](/api/cms/classes/transformationerror/) \| [`ValidationError`](/api/cms/classes/validationerror/), `ContentStore` \| `CollectionDeps`\<`TCollection`\>\>

Defined in: [packages/core/src/cms.ts:345](https://github.com/bitswired/foldcms/blob/1c891e1138f693233aa186873facbdb8139365a8/packages/core/src/cms.ts#L345)

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

`Effect`\<`void`, [`LoadingError`](/api/cms/classes/loadingerror/) \| [`TransformationError`](/api/cms/classes/transformationerror/) \| [`ValidationError`](/api/cms/classes/validationerror/), `ContentStore` \| `CollectionDeps`\<`TCollection`\>\>
