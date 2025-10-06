---
editUrl: false
next: false
prev: false
title: "makeCms"
---

> **makeCms**\<`TMap`, `TCollection`\>(`config`): `object`

Defined in: [packages/core/src/cms.ts:358](https://github.com/bitswired/foldcms/blob/92f893e734b1102683a12bd11c6183cc24996bdf/packages/core/src/cms.ts#L358)

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

`object`

### CmsLayer

> **CmsLayer**: `Layer`\<[`Cms`](/api/cms/interfaces/cms/)\<`TMap`, `TCollection`, `CmsError` \| `ContentStoreError`\>, `never`, `ContentStore`\>

### CmsTag

> **CmsTag**: `Tag`\<[`Cms`](/api/cms/interfaces/cms/)\<`TMap`, `TCollection`, `CmsError` \| `ContentStoreError`\>, [`Cms`](/api/cms/interfaces/cms/)\<`TMap`, `TCollection`, `CmsError` \| `ContentStoreError`\>\>
