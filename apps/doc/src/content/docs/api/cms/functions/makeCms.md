---
editUrl: false
next: false
prev: false
title: "makeCms"
---

> **makeCms**\<`TMap`, `TCollection`\>(`config`): `object`

Defined in: [packages/core/src/cms.ts:396](https://github.com/bitswired/foldcms/blob/1c891e1138f693233aa186873facbdb8139365a8/packages/core/src/cms.ts#L396)

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
