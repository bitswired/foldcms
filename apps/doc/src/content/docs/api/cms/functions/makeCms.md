---
editUrl: false
next: false
prev: false
title: "makeCms"
---

> **makeCms**\<`TMap`, `TCollection`\>(`config`): `object`

Defined in: [packages/core/src/cms.ts:585](https://github.com/bitswired/foldcms/blob/95183c86c9f5ae59bfbaa7d6e4a44975123622e3/packages/core/src/cms.ts#L585)

Creates a CMS instance with its associated Context.Tag and Layer.
This is the main factory function for creating a complete CMS setup.

## Type Parameters

### TMap

`TMap` *extends* `Record`\<`string`, `CollectionAny`\>

Record mapping collection names to their Collection definitions

### TCollection

`TCollection` *extends* `Record`\<`string`, `CollectionAny`\> = `TMap`

The collection map type

## Parameters

### config

Configuration object containing the collections to manage

#### collections

`TCollection`

## Returns

`object`

Object containing CmsTag for dependency injection and CmsLayer for providing the service

### CmsLayer

> **CmsLayer**: `Layer`\<[`Cms`](/api/cms/interfaces/cms/)\<`TMap`, `TCollection`, `CmsError` \| `ContentStoreError`\>, `never`, [`ContentStore`](/api/cms/classes/contentstore/)\>

### CmsTag

> **CmsTag**: `Tag`\<[`Cms`](/api/cms/interfaces/cms/)\<`TMap`, `TCollection`, `CmsError` \| `ContentStoreError`\>, [`Cms`](/api/cms/interfaces/cms/)\<`TMap`, `TCollection`, `CmsError` \| `ContentStoreError`\>\>

## Example

```typescript
const { CmsTag, CmsLayer } = makeCms({
  collections: {
    posts: postsCollection,
    users: usersCollection
  }
});

// Use in your application
const program = Effect.gen(function* () {
  const cms = yield* CmsTag;
  const posts = yield* cms.getAll("posts");
  return posts;
}).pipe(Effect.provide(CmsLayer));
```
