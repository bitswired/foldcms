---
editUrl: false
next: false
prev: false
title: "Cms"
---

Defined in: [packages/core/src/cms.ts:305](https://github.com/bitswired/foldcms/blob/1c891e1138f693233aa186873facbdb8139365a8/packages/core/src/cms.ts#L305)

The core CMS interface providing type-safe access to collections and relations.

This interface is returned by [makeCms](/api/cms/functions/makecms/) and provides methods to query
collections and traverse relations with full type safety. All operations return
Effect values for composable error handling and resource management.

## Examples

Basic usage:
```ts
const { CmsTag, CmsLayer } = makeCms({
  collections: { posts, tags }
});

const program = Effect.gen(function* () {
  const cms = yield* CmsTag;

  // Get a single post by ID
  const post = yield* cms.getById("posts", "post-1");

  // Get all tags
  const allTags = yield* cms.getAll("tags");

  // Load related tags for a post
  if (Option.isSome(post)) {
    const tags = yield* cms.loadRelation("posts", post.value, "tagIds");
  }
});
```

Error handling:
```ts
const program = Effect.gen(function* () {
  const cms = yield* CmsTag;
  const post = yield* cms.getById("posts", "missing-id");

  // Returns Option.none() for missing entities
  if (Option.isNone(post)) {
    console.log("Post not found");
  }
}).pipe(
  Effect.catchTag("CmsError", (error) => {
    console.error("CMS error:", error.message);
    return Effect.succeed(null);
  })
);
```

## Type Parameters

### TMap

`TMap` *extends* `Record`\<`string`, `CollectionAny`\>

Record mapping collection names to their definitions

### TCollection

`TCollection` *extends* [`CollectionMap`](/api/cms/type-aliases/collectionmap/)\<`TMap`\> = [`CollectionMap`](/api/cms/type-aliases/collectionmap/)\<`TMap`\>

The collection map (usually inferred from TMap)

### TError

`TError` = `CmsError` \| `ContentStoreError`

Union of possible error types (CmsError | ContentStoreError)

## Properties

### collections

> **collections**: `TCollection`

Defined in: [packages/core/src/cms.ts:310](https://github.com/bitswired/foldcms/blob/1c891e1138f693233aa186873facbdb8139365a8/packages/core/src/cms.ts#L310)

***

### getAll()

> **getAll**: \<`TName`\>(`collectionName`) => `Effect`\<readonly `CollectionParts`\<`TCollection`\[`TName`\]\>\[`"transformed"`\][], `TError`\>

Defined in: [packages/core/src/cms.ts:319](https://github.com/bitswired/foldcms/blob/1c891e1138f693233aa186873facbdb8139365a8/packages/core/src/cms.ts#L319)

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

Defined in: [packages/core/src/cms.ts:311](https://github.com/bitswired/foldcms/blob/1c891e1138f693233aa186873facbdb8139365a8/packages/core/src/cms.ts#L311)

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

Defined in: [packages/core/src/cms.ts:326](https://github.com/bitswired/foldcms/blob/1c891e1138f693233aa186873facbdb8139365a8/packages/core/src/cms.ts#L326)

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
