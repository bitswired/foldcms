---
editUrl: false
next: false
prev: false
title: "Cms"
---

Defined in: [packages/core/src/cms.ts:402](https://github.com/bitswired/foldcms/blob/a5796744336f5646b8ccb4abf3c6d1334a83f443/packages/core/src/cms.ts#L402)

Core CMS interface that provides type-safe content management operations.
Manages collections of typed content with support for relationships.

## Example

```typescript
const cms: Cms<{ posts: PostCollection, users: UserCollection }> = buildCms({
  collections: { posts: postCollection, users: userCollection }
});

// Get a single item by ID
const post = yield* cms.getById("posts", "post-1");

// Get all items from a collection
const allPosts = yield* cms.getAll("posts");

// Load related data
const author = yield* cms.loadRelation("posts", post, "authorId");
```

## Type Parameters

### TMap

`TMap` *extends* `Record`\<`string`, `CollectionAny`\>

Record mapping collection names to their Collection definitions

### TCollection

`TCollection` *extends* [`CollectionMap`](/api/cms/type-aliases/collectionmap/)\<`TMap`\> = [`CollectionMap`](/api/cms/type-aliases/collectionmap/)\<`TMap`\>

The collection map type

### TError

`TError` = `CmsError` \| `ContentStoreError`

Union of possible error types

## Properties

### collections

> **collections**: `TCollection`

Defined in: [packages/core/src/cms.ts:408](https://github.com/bitswired/foldcms/blob/a5796744336f5646b8ccb4abf3c6d1334a83f443/packages/core/src/cms.ts#L408)

The collection definitions managed by this CMS instance

***

### getAll()

> **getAll**: \<`TName`\>(`collectionName`) => `Effect`\<readonly `CollectionParts`\<`TCollection`\[`TName`\]\>\[`"transformed"`\][], `TError`\>

Defined in: [packages/core/src/cms.ts:431](https://github.com/bitswired/foldcms/blob/a5796744336f5646b8ccb4abf3c6d1334a83f443/packages/core/src/cms.ts#L431)

Retrieves all items from a collection.

#### Type Parameters

##### TName

`TName` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### collectionName

`TName`

Name of the collection to query

#### Returns

`Effect`\<readonly `CollectionParts`\<`TCollection`\[`TName`\]\>\[`"transformed"`\][], `TError`\>

Effect yielding an array of all items in the collection

***

### getById()

> **getById**: \<`TName`\>(`collectionName`, `id`) => `Effect`\<`Option`\<`CollectionParts`\<`TCollection`\[`TName`\]\>\[`"transformed"`\]\>, `TError`\>

Defined in: [packages/core/src/cms.ts:417](https://github.com/bitswired/foldcms/blob/a5796744336f5646b8ccb4abf3c6d1334a83f443/packages/core/src/cms.ts#L417)

Retrieves a single item from a collection by its ID.

#### Type Parameters

##### TName

`TName` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### collectionName

`TName`

Name of the collection to query

##### id

`string`

Unique identifier of the item

#### Returns

`Effect`\<`Option`\<`CollectionParts`\<`TCollection`\[`TName`\]\>\[`"transformed"`\]\>, `TError`\>

Effect yielding an Option containing the item if found

***

### loadRelation()

> **loadRelation**: \<`TSourceName`, `TField`\>(`sourceCollection`, `item`, `field`) => `Effect`\<`RelationReturnType`\<`RelationAt`\<`CollectionParts`\<`TCollection`\[`TSourceName`\]\>\[`"relations"`\], `TField`\>, `TCollection`\>, `TError`\>

Defined in: [packages/core/src/cms.ts:447](https://github.com/bitswired/foldcms/blob/a5796744336f5646b8ccb4abf3c6d1334a83f443/packages/core/src/cms.ts#L447)

Loads related data for a specific field on an item.
Resolves relationships defined in the collection configuration.

#### Type Parameters

##### TSourceName

`TSourceName` *extends* `string` \| `number` \| `symbol`

##### TField

`TField` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### sourceCollection

`TSourceName`

Name of the source collection

##### item

`CollectionParts`\<`TCollection`\[`TSourceName`\]\>\[`"transformed"`\]

The source item containing the relation field

##### field

`TField`

The field name that defines the relationship

#### Returns

`Effect`\<`RelationReturnType`\<`RelationAt`\<`CollectionParts`\<`TCollection`\[`TSourceName`\]\>\[`"relations"`\], `TField`\>, `TCollection`\>, `TError`\>

Effect yielding the related data based on relation type
