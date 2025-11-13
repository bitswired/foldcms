---
editUrl: false
next: false
prev: false
title: "build"
---

> **build**\<`TMap`, `TCollection`\>(`config`): `Effect`\<`void`, [`LoadingError`](/api/cms/classes/loadingerror/) \| [`TransformationError`](/api/cms/classes/transformationerror/) \| [`ValidationError`](/api/cms/classes/validationerror/) \| `ContentStoreError`, [`ContentStore`](/api/cms/classes/contentstore/) \| \{ \[K in string \| number \| symbol\]: CollectionParts\<TCollection\[K\]\>\["loaderDeps"\] \| CollectionParts\<TCollection\[K\]\>\["transformerDeps"\] \| CollectionParts\<TCollection\[K\]\>\["validatorDeps"\] \}\[keyof `TCollection`\]\>

Defined in: [packages/core/src/cms.ts:487](https://github.com/bitswired/foldcms/blob/632c86107fa9a8831c2683e40b523156e2a6b68e/packages/core/src/cms.ts#L487)

Builds and initializes all collections in the CMS.
This function loads, transforms, validates, and stores all collection data.

## Type Parameters

### TMap

`TMap` *extends* `Record`\<`string`, `CollectionAny`\>

Record mapping collection names to their Collection definitions

### TCollection

`TCollection` *extends* `Record`\<`string`, `CollectionAny`\> = `TMap`

The collection map type

## Parameters

### config

Configuration object containing the collections to build

#### collections

`TCollection`

## Returns

`Effect`\<`void`, [`LoadingError`](/api/cms/classes/loadingerror/) \| [`TransformationError`](/api/cms/classes/transformationerror/) \| [`ValidationError`](/api/cms/classes/validationerror/) \| `ContentStoreError`, [`ContentStore`](/api/cms/classes/contentstore/) \| \{ \[K in string \| number \| symbol\]: CollectionParts\<TCollection\[K\]\>\["loaderDeps"\] \| CollectionParts\<TCollection\[K\]\>\["transformerDeps"\] \| CollectionParts\<TCollection\[K\]\>\["validatorDeps"\] \}\[keyof `TCollection`\]\>

Effect that completes when all collections have been built

## Example

```typescript
const buildEffect = build({
  collections: {
    posts: postsCollection,
    users: usersCollection
  }
});

yield* buildEffect;
```
