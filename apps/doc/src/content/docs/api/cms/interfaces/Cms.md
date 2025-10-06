---
editUrl: false
next: false
prev: false
title: "Cms"
---

Defined in: [packages/core/src/cms.ts:259](https://github.com/bitswired/foldcms/blob/92f893e734b1102683a12bd11c6183cc24996bdf/packages/core/src/cms.ts#L259)

## Type Parameters

### TMap

`TMap` *extends* `Record`\<`string`, `CollectionAny`\>

### TCollection

`TCollection` *extends* [`CollectionMap`](/api/cms/type-aliases/collectionmap/)\<`TMap`\> = [`CollectionMap`](/api/cms/type-aliases/collectionmap/)\<`TMap`\>

### TError

`TError` = `CmsError` \| `ContentStoreError`

## Properties

### collections

> **collections**: `TCollection`

Defined in: [packages/core/src/cms.ts:264](https://github.com/bitswired/foldcms/blob/92f893e734b1102683a12bd11c6183cc24996bdf/packages/core/src/cms.ts#L264)

***

### getAll()

> **getAll**: \<`TName`\>(`collectionName`) => `Effect`\<readonly `CollectionParts`\<`TCollection`\[`TName`\]\>\[`"transformed"`\][], `TError`\>

Defined in: [packages/core/src/cms.ts:273](https://github.com/bitswired/foldcms/blob/92f893e734b1102683a12bd11c6183cc24996bdf/packages/core/src/cms.ts#L273)

#### Type Parameters

##### TName

`TName` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### collectionName

`TName`

#### Returns

`Effect`\<readonly `CollectionParts`\<`TCollection`\[`TName`\]\>\[`"transformed"`\][], `TError`\>

***

### getById()

> **getById**: \<`TName`\>(`collectionName`, `id`) => `Effect`\<`Option`\<`CollectionParts`\<`TCollection`\[`TName`\]\>\[`"transformed"`\]\>, `TError`\>

Defined in: [packages/core/src/cms.ts:265](https://github.com/bitswired/foldcms/blob/92f893e734b1102683a12bd11c6183cc24996bdf/packages/core/src/cms.ts#L265)

#### Type Parameters

##### TName

`TName` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### collectionName

`TName`

##### id

`string`

#### Returns

`Effect`\<`Option`\<`CollectionParts`\<`TCollection`\[`TName`\]\>\[`"transformed"`\]\>, `TError`\>

***

### loadRelation()

> **loadRelation**: \<`TSourceName`, `TField`\>(`sourceCollection`, `item`, `field`) => `Effect`\<`RelationReturnType`\<`RelationAt`\<`CollectionParts`\<`TCollection`\[`TSourceName`\]\>\[`"relations"`\], `TField`\>, `TCollection`\>, `TError`\>

Defined in: [packages/core/src/cms.ts:280](https://github.com/bitswired/foldcms/blob/92f893e734b1102683a12bd11c6183cc24996bdf/packages/core/src/cms.ts#L280)

#### Type Parameters

##### TSourceName

`TSourceName` *extends* `string` \| `number` \| `symbol`

##### TField

`TField` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### sourceCollection

`TSourceName`

##### item

`CollectionParts`\<`TCollection`\[`TSourceName`\]\>\[`"transformed"`\]

##### field

`TField`

#### Returns

`Effect`\<`RelationReturnType`\<`RelationAt`\<`CollectionParts`\<`TCollection`\[`TSourceName`\]\>\[`"relations"`\], `TField`\>, `TCollection`\>, `TError`\>
