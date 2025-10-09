---
editUrl: false
next: false
prev: false
title: "factory"
---

> **factory**\<`TMap`, `TCollection`\>(): `Tag`\<[`Cms`](/api/cms/interfaces/cms/)\<`TMap`, `TCollection`, `CmsError` \| `ContentStoreError`\>, [`Cms`](/api/cms/interfaces/cms/)\<`TMap`, `TCollection`, `CmsError` \| `ContentStoreError`\>\>

Defined in: [packages/core/src/cms.ts:554](https://github.com/bitswired/foldcms/blob/a5796744336f5646b8ccb4abf3c6d1334a83f443/packages/core/src/cms.ts#L554)

Factory function that creates a Context.Tag for a CMS instance.
This tag is used to identify and inject CMS instances in the Effect context.

## Type Parameters

### TMap

`TMap` *extends* `Record`\<`string`, `CollectionAny`\>

Record mapping collection names to their Collection definitions

### TCollection

`TCollection` *extends* `Record`\<`string`, `CollectionAny`\> = `TMap`

The collection map type

## Returns

`Tag`\<[`Cms`](/api/cms/interfaces/cms/)\<`TMap`, `TCollection`, `CmsError` \| `ContentStoreError`\>, [`Cms`](/api/cms/interfaces/cms/)\<`TMap`, `TCollection`, `CmsError` \| `ContentStoreError`\>\>

A Context.Tag for the CMS type

## Example

```typescript
const CmsTag = factory<{ posts: PostCollection }>();

// Use in an Effect
const getCms = Effect.gen(function* () {
  const cms = yield* CmsTag;
  return cms;
});
```
