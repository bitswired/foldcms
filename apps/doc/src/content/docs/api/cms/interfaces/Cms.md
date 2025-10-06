---
editUrl: false
next: false
prev: false
title: "Cms"
---

Defined in: [packages/core/src/cms.ts:261](https://github.com/bitswired/foldcms/blob/f5268f9ab9ef080063daf132e858e3c5524b2050/packages/core/src/cms.ts#L261)

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

Defined in: [packages/core/src/cms.ts:266](https://github.com/bitswired/foldcms/blob/f5268f9ab9ef080063daf132e858e3c5524b2050/packages/core/src/cms.ts#L266)

***

### getAll()

> **getAll**: \<`TName`\>(`collectionName`) => `Effect`\<readonly `CollectionParts`\<`TCollection`\[`TName`\]\>\[`"transformed"`\][], `TError`\>

Defined in: [packages/core/src/cms.ts:275](https://github.com/bitswired/foldcms/blob/f5268f9ab9ef080063daf132e858e3c5524b2050/packages/core/src/cms.ts#L275)

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

Defined in: [packages/core/src/cms.ts:267](https://github.com/bitswired/foldcms/blob/f5268f9ab9ef080063daf132e858e3c5524b2050/packages/core/src/cms.ts#L267)

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

Defined in: [packages/core/src/cms.ts:282](https://github.com/bitswired/foldcms/blob/f5268f9ab9ef080063daf132e858e3c5524b2050/packages/core/src/cms.ts#L282)

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
