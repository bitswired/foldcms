---
editUrl: false
next: false
prev: false
title: "ContentStore"
---

Defined in: [packages/core/src/cms.ts:805](https://github.com/bitswired/foldcms/blob/a5796744336f5646b8ccb4abf3c6d1334a83f443/packages/core/src/cms.ts#L805)

Content storage abstraction providing CRUD operations for collections.
Handles serialization, hashing, and database operations for content data.

## Example

```typescript
const contentStore = yield* ContentStore;

// Insert data
yield* contentStore.insert("post-1", "posts", postData);

// Retrieve by ID
const post = yield* contentStore.getById("posts", "post-1", PostSchema);

// Get all items
const allPosts = yield* contentStore.getAll("posts", PostSchema);
```

## Extends

- `TagClassShape`\<`"ContentStore"`, \{ `getAll`: \<`T`\>(`collection`, `schema`) => `Effect`\<readonly `T`\[`"Type"`\][], `ContentStoreError`\>; `getById`: \<`T`\>(`collection`, `id`, `schema`) => `Effect`\<`Option`\<`T`\[`"Type"`\]\>, `ContentStoreError`\>; `insert`: \<`T`\>(`id`, `collection`, `data`) => `Effect`\<`void`, `ContentStoreError`, `never`\>; `query`: \<`T`\>(`sql`, `schema`) => `Effect`\<readonly `T`\[`"Type"`\][], `ContentStoreError`\>; \}, `this`\>

## Constructors

### Constructor

> **new ContentStore**(`_`): `ContentStore`

Defined in: node\_modules/effect/dist/dts/Context.d.ts:109

#### Parameters

##### \_

`never`

#### Returns

`ContentStore`

#### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().constructor`

## Properties

### \[TagTypeId\]

> `readonly` **\[TagTypeId\]**: *typeof* `TagTypeId`

Defined in: node\_modules/effect/dist/dts/Context.d.ts:100

#### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().[TagTypeId]`

***

### Id

> **Id**: `"ContentStore"`

Defined in: node\_modules/effect/dist/dts/Context.d.ts:99

#### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().Id`

***

### Type

> `readonly` **Type**: `object`

Defined in: node\_modules/effect/dist/dts/Context.d.ts:101

#### getAll()

> **getAll**: \<`T`\>(`collection`, `schema`) => `Effect`\<readonly `T`\[`"Type"`\][], `ContentStoreError`\>

##### Type Parameters

###### T

`T` *extends* `AnySchema`

##### Parameters

###### collection

`string`

###### schema

`T`

##### Returns

`Effect`\<readonly `T`\[`"Type"`\][], `ContentStoreError`\>

#### getById()

> **getById**: \<`T`\>(`collection`, `id`, `schema`) => `Effect`\<`Option`\<`T`\[`"Type"`\]\>, `ContentStoreError`\>

##### Type Parameters

###### T

`T` *extends* `AnySchema`

##### Parameters

###### collection

`string`

###### id

`string`

###### schema

`T`

##### Returns

`Effect`\<`Option`\<`T`\[`"Type"`\]\>, `ContentStoreError`\>

#### insert()

> **insert**: \<`T`\>(`id`, `collection`, `data`) => `Effect`\<`void`, `ContentStoreError`, `never`\>

##### Type Parameters

###### T

`T` *extends* `Struct`\<`any`\>

##### Parameters

###### id

`string`

###### collection

`string`

###### data

`T`\[`"Type"`\]

##### Returns

`Effect`\<`void`, `ContentStoreError`, `never`\>

#### query()

> **query**: \<`T`\>(`sql`, `schema`) => `Effect`\<readonly `T`\[`"Type"`\][], `ContentStoreError`\>

##### Type Parameters

###### T

`T` *extends* `Struct`\<`any`\>

##### Parameters

###### sql

`string`

###### schema

`T`

##### Returns

`Effect`\<readonly `T`\[`"Type"`\][], `ContentStoreError`\>

#### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().Type`

***

### \_op

> `readonly` `static` **\_op**: `"Tag"`

Defined in: node\_modules/effect/dist/dts/Context.d.ts:33

#### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >()._op`

***

### \[ChannelTypeId\]

> `readonly` `static` **\[ChannelTypeId\]**: `VarianceStruct`\<`never`, `unknown`, `never`, `unknown`, \{ `getAll`: \<`T`\>(`collection`, `schema`) => `Effect`\<readonly `T`\[`"Type"`\][], `ContentStoreError`\>; `getById`: \<`T`\>(`collection`, `id`, `schema`) => `Effect`\<`Option`\<`T`\[`"Type"`\]\>, `ContentStoreError`\>; `insert`: \<`T`\>(`id`, `collection`, `data`) => `Effect`\<`void`, `ContentStoreError`, `never`\>; `query`: \<`T`\>(`sql`, `schema`) => `Effect`\<readonly `T`\[`"Type"`\][], `ContentStoreError`\>; \}, `unknown`, `ContentStore`\>

Defined in: node\_modules/effect/dist/dts/Channel.d.ts:108

#### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().[ChannelTypeId]`

***

### \[EffectTypeId\]

> `readonly` `static` **\[EffectTypeId\]**: `VarianceStruct`\<\{ `getAll`: \<`T`\>(`collection`, `schema`) => `Effect`\<readonly `T`\[`"Type"`\][], `ContentStoreError`\>; `getById`: \<`T`\>(`collection`, `id`, `schema`) => `Effect`\<`Option`\<`T`\[`"Type"`\]\>, `ContentStoreError`\>; `insert`: \<`T`\>(`id`, `collection`, `data`) => `Effect`\<`void`, `ContentStoreError`, `never`\>; `query`: \<`T`\>(`sql`, `schema`) => `Effect`\<readonly `T`\[`"Type"`\][], `ContentStoreError`\>; \}, `never`, `ContentStore`\>

Defined in: node\_modules/effect/dist/dts/Effect.d.ts:195

#### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().[EffectTypeId]`

***

### \[ignoreSymbol\]?

> `static` `optional` **\[ignoreSymbol\]**: `TagUnifyIgnore`

Defined in: node\_modules/effect/dist/dts/Context.d.ts:46

#### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().[ignoreSymbol]`

***

### \[SinkTypeId\]

> `readonly` `static` **\[SinkTypeId\]**: `VarianceStruct`\<\{ `getAll`: \<`T`\>(`collection`, `schema`) => `Effect`\<readonly `T`\[`"Type"`\][], `ContentStoreError`\>; `getById`: \<`T`\>(`collection`, `id`, `schema`) => `Effect`\<`Option`\<`T`\[`"Type"`\]\>, `ContentStoreError`\>; `insert`: \<`T`\>(`id`, `collection`, `data`) => `Effect`\<`void`, `ContentStoreError`, `never`\>; `query`: \<`T`\>(`sql`, `schema`) => `Effect`\<readonly `T`\[`"Type"`\][], `ContentStoreError`\>; \}, `unknown`, `never`, `never`, `ContentStore`\>

Defined in: node\_modules/effect/dist/dts/Sink.d.ts:82

#### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().[SinkTypeId]`

***

### \[STMTypeId\]

> `readonly` `static` **\[STMTypeId\]**: `object`

Defined in: node\_modules/effect/dist/dts/STM.d.ts:136

#### \_A

> `readonly` **\_A**: `Covariant`\<\{ `getAll`: \<`T`\>(`collection`, `schema`) => `Effect`\<readonly `T`\[`"Type"`\][], `ContentStoreError`\>; `getById`: \<`T`\>(`collection`, `id`, `schema`) => `Effect`\<`Option`\<`T`\[`"Type"`\]\>, `ContentStoreError`\>; `insert`: \<`T`\>(`id`, `collection`, `data`) => `Effect`\<`void`, `ContentStoreError`, `never`\>; `query`: \<`T`\>(`sql`, `schema`) => `Effect`\<readonly `T`\[`"Type"`\][], `ContentStoreError`\>; \}\>

#### \_E

> `readonly` **\_E**: `Covariant`\<`never`\>

#### \_R

> `readonly` **\_R**: `Covariant`\<`ContentStore`\>

#### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().[STMTypeId]`

***

### \[StreamTypeId\]

> `readonly` `static` **\[StreamTypeId\]**: `VarianceStruct`\<\{ `getAll`: \<`T`\>(`collection`, `schema`) => `Effect`\<readonly `T`\[`"Type"`\][], `ContentStoreError`\>; `getById`: \<`T`\>(`collection`, `id`, `schema`) => `Effect`\<`Option`\<`T`\[`"Type"`\]\>, `ContentStoreError`\>; `insert`: \<`T`\>(`id`, `collection`, `data`) => `Effect`\<`void`, `ContentStoreError`, `never`\>; `query`: \<`T`\>(`sql`, `schema`) => `Effect`\<readonly `T`\[`"Type"`\][], `ContentStoreError`\>; \}, `never`, `ContentStore`\>

Defined in: node\_modules/effect/dist/dts/Stream.d.ts:111

#### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().[StreamTypeId]`

***

### \[TagTypeId\]

> `readonly` `static` **\[TagTypeId\]**: `object`

Defined in: node\_modules/effect/dist/dts/Context.d.ts:36

#### \_Identifier

> `readonly` **\_Identifier**: `Invariant`\<`ContentStore`\>

#### \_Service

> `readonly` **\_Service**: `Invariant`\<\{ `getAll`: \<`T`\>(`collection`, `schema`) => `Effect`\<readonly `T`\[`"Type"`\][], `ContentStoreError`\>; `getById`: \<`T`\>(`collection`, `id`, `schema`) => `Effect`\<`Option`\<`T`\[`"Type"`\]\>, `ContentStoreError`\>; `insert`: \<`T`\>(`id`, `collection`, `data`) => `Effect`\<`void`, `ContentStoreError`, `never`\>; `query`: \<`T`\>(`sql`, `schema`) => `Effect`\<readonly `T`\[`"Type"`\][], `ContentStoreError`\>; \}\>

#### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().[TagTypeId]`

***

### \[typeSymbol\]?

> `static` `optional` **\[typeSymbol\]**: `unknown`

Defined in: node\_modules/effect/dist/dts/Context.d.ts:44

#### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().[typeSymbol]`

***

### \[unifySymbol\]?

> `static` `optional` **\[unifySymbol\]**: `TagUnify`\<`TagClass`\<`ContentStore`, `"ContentStore"`, \{ `getAll`: \<`T`\>(`collection`, `schema`) => `Effect`\<readonly `T`\[`"Type"`\][], `ContentStoreError`\>; `getById`: \<`T`\>(`collection`, `id`, `schema`) => `Effect`\<`Option`\<`T`\[`"Type"`\]\>, `ContentStoreError`\>; `insert`: \<`T`\>(`id`, `collection`, `data`) => `Effect`\<`void`, `ContentStoreError`, `never`\>; `query`: \<`T`\>(`sql`, `schema`) => `Effect`\<readonly `T`\[`"Type"`\][], `ContentStoreError`\>; \}\>\>

Defined in: node\_modules/effect/dist/dts/Context.d.ts:45

#### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().[unifySymbol]`

***

### Identifier

> `readonly` `static` **Identifier**: `ContentStore`

Defined in: node\_modules/effect/dist/dts/Context.d.ts:35

#### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().Identifier`

***

### key

> `readonly` `static` **key**: `"ContentStore"`

Defined in: node\_modules/effect/dist/dts/Context.d.ts:110

#### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().key`

***

### Service

> `readonly` `static` **Service**: `object`

Defined in: node\_modules/effect/dist/dts/Context.d.ts:34

#### getAll()

> **getAll**: \<`T`\>(`collection`, `schema`) => `Effect`\<readonly `T`\[`"Type"`\][], `ContentStoreError`\>

##### Type Parameters

###### T

`T` *extends* `AnySchema`

##### Parameters

###### collection

`string`

###### schema

`T`

##### Returns

`Effect`\<readonly `T`\[`"Type"`\][], `ContentStoreError`\>

#### getById()

> **getById**: \<`T`\>(`collection`, `id`, `schema`) => `Effect`\<`Option`\<`T`\[`"Type"`\]\>, `ContentStoreError`\>

##### Type Parameters

###### T

`T` *extends* `AnySchema`

##### Parameters

###### collection

`string`

###### id

`string`

###### schema

`T`

##### Returns

`Effect`\<`Option`\<`T`\[`"Type"`\]\>, `ContentStoreError`\>

#### insert()

> **insert**: \<`T`\>(`id`, `collection`, `data`) => `Effect`\<`void`, `ContentStoreError`, `never`\>

##### Type Parameters

###### T

`T` *extends* `Struct`\<`any`\>

##### Parameters

###### id

`string`

###### collection

`string`

###### data

`T`\[`"Type"`\]

##### Returns

`Effect`\<`void`, `ContentStoreError`, `never`\>

#### query()

> **query**: \<`T`\>(`sql`, `schema`) => `Effect`\<readonly `T`\[`"Type"`\][], `ContentStoreError`\>

##### Type Parameters

###### T

`T` *extends* `Struct`\<`any`\>

##### Parameters

###### sql

`string`

###### schema

`T`

##### Returns

`Effect`\<readonly `T`\[`"Type"`\][], `ContentStoreError`\>

#### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().Service`

***

### stack?

> `readonly` `static` `optional` **stack**: `string`

Defined in: node\_modules/effect/dist/dts/Context.d.ts:42

#### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().stack`

## Methods

### \[iterator\]()

> `static` **\[iterator\]**(): `EffectGenerator`\<`Tag`\<`ContentStore`, \{ `getAll`: \<`T`\>(`collection`, `schema`) => `Effect`\<readonly `T`\[`"Type"`\][], `ContentStoreError`\>; `getById`: \<`T`\>(`collection`, `id`, `schema`) => `Effect`\<`Option`\<`T`\[`"Type"`\]\>, `ContentStoreError`\>; `insert`: \<`T`\>(`id`, `collection`, `data`) => `Effect`\<`void`, `ContentStoreError`, `never`\>; `query`: \<`T`\>(`sql`, `schema`) => `Effect`\<readonly `T`\[`"Type"`\][], `ContentStoreError`\>; \}\>\>

Defined in: node\_modules/effect/dist/dts/Effect.d.ts:137

#### Returns

`EffectGenerator`\<`Tag`\<`ContentStore`, \{ `getAll`: \<`T`\>(`collection`, `schema`) => `Effect`\<readonly `T`\[`"Type"`\][], `ContentStoreError`\>; `getById`: \<`T`\>(`collection`, `id`, `schema`) => `Effect`\<`Option`\<`T`\[`"Type"`\]\>, `ContentStoreError`\>; `insert`: \<`T`\>(`id`, `collection`, `data`) => `Effect`\<`void`, `ContentStoreError`, `never`\>; `query`: \<`T`\>(`sql`, `schema`) => `Effect`\<readonly `T`\[`"Type"`\][], `ContentStoreError`\>; \}\>\>

#### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().[iterator]`

***

### \[NodeInspectSymbol\]()

> `static` **\[NodeInspectSymbol\]**(): `unknown`

Defined in: node\_modules/effect/dist/dts/Inspectable.d.ts:22

#### Returns

`unknown`

#### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().[NodeInspectSymbol]`

***

### context()

> `static` **context**(`self`): `Context`\<`ContentStore`\>

Defined in: node\_modules/effect/dist/dts/Context.d.ts:41

#### Parameters

##### self

###### getAll

\<`T`\>(`collection`, `schema`) => `Effect`\<readonly `T`\[`"Type"`\][], `ContentStoreError`\>

###### getById

\<`T`\>(`collection`, `id`, `schema`) => `Effect`\<`Option`\<`T`\[`"Type"`\]\>, `ContentStoreError`\>

###### insert

\<`T`\>(`id`, `collection`, `data`) => `Effect`\<`void`, `ContentStoreError`, `never`\>

###### query

\<`T`\>(`sql`, `schema`) => `Effect`\<readonly `T`\[`"Type"`\][], `ContentStoreError`\>

#### Returns

`Context`\<`ContentStore`\>

#### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().context`

***

### of()

> `static` **of**(`self`): `object`

Defined in: node\_modules/effect/dist/dts/Context.d.ts:40

#### Parameters

##### self

###### getAll

\<`T`\>(`collection`, `schema`) => `Effect`\<readonly `T`\[`"Type"`\][], `ContentStoreError`\>

###### getById

\<`T`\>(`collection`, `id`, `schema`) => `Effect`\<`Option`\<`T`\[`"Type"`\]\>, `ContentStoreError`\>

###### insert

\<`T`\>(`id`, `collection`, `data`) => `Effect`\<`void`, `ContentStoreError`, `never`\>

###### query

\<`T`\>(`sql`, `schema`) => `Effect`\<readonly `T`\[`"Type"`\][], `ContentStoreError`\>

#### Returns

`object`

##### getAll()

> **getAll**: \<`T`\>(`collection`, `schema`) => `Effect`\<readonly `T`\[`"Type"`\][], `ContentStoreError`\>

###### Type Parameters

###### T

`T` *extends* `AnySchema`

###### Parameters

###### collection

`string`

###### schema

`T`

###### Returns

`Effect`\<readonly `T`\[`"Type"`\][], `ContentStoreError`\>

##### getById()

> **getById**: \<`T`\>(`collection`, `id`, `schema`) => `Effect`\<`Option`\<`T`\[`"Type"`\]\>, `ContentStoreError`\>

###### Type Parameters

###### T

`T` *extends* `AnySchema`

###### Parameters

###### collection

`string`

###### id

`string`

###### schema

`T`

###### Returns

`Effect`\<`Option`\<`T`\[`"Type"`\]\>, `ContentStoreError`\>

##### insert()

> **insert**: \<`T`\>(`id`, `collection`, `data`) => `Effect`\<`void`, `ContentStoreError`, `never`\>

###### Type Parameters

###### T

`T` *extends* `Struct`\<`any`\>

###### Parameters

###### id

`string`

###### collection

`string`

###### data

`T`\[`"Type"`\]

###### Returns

`Effect`\<`void`, `ContentStoreError`, `never`\>

##### query()

> **query**: \<`T`\>(`sql`, `schema`) => `Effect`\<readonly `T`\[`"Type"`\][], `ContentStoreError`\>

###### Type Parameters

###### T

`T` *extends* `Struct`\<`any`\>

###### Parameters

###### sql

`string`

###### schema

`T`

###### Returns

`Effect`\<readonly `T`\[`"Type"`\][], `ContentStoreError`\>

#### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().of`

***

### pipe()

#### Call Signature

> `static` **pipe**\<`A`\>(`this`): `A`

Defined in: node\_modules/effect/dist/dts/Pipeable.d.ts:10

##### Type Parameters

###### A

`A`

##### Parameters

###### this

`A`

##### Returns

`A`

##### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`\>(`this`, `ab`): `B`

Defined in: node\_modules/effect/dist/dts/Pipeable.d.ts:11

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

##### Returns

`B`

##### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`\>(`this`, `ab`, `bc`): `C`

Defined in: node\_modules/effect/dist/dts/Pipeable.d.ts:12

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

##### Returns

`C`

##### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`\>(`this`, `ab`, `bc`, `cd`): `D`

Defined in: node\_modules/effect/dist/dts/Pipeable.d.ts:13

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

##### Returns

`D`

##### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`\>(`this`, `ab`, `bc`, `cd`, `de`): `E`

Defined in: node\_modules/effect/dist/dts/Pipeable.d.ts:14

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

##### Returns

`E`

##### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`): `F`

Defined in: node\_modules/effect/dist/dts/Pipeable.d.ts:15

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

##### Returns

`F`

##### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`): `G`

Defined in: node\_modules/effect/dist/dts/Pipeable.d.ts:16

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

##### Returns

`G`

##### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`): `H`

Defined in: node\_modules/effect/dist/dts/Pipeable.d.ts:17

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

##### Returns

`H`

##### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`): `I`

Defined in: node\_modules/effect/dist/dts/Pipeable.d.ts:18

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

##### Returns

`I`

##### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`): `J`

Defined in: node\_modules/effect/dist/dts/Pipeable.d.ts:19

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

##### Returns

`J`

##### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`, `jk`): `K`

Defined in: node\_modules/effect/dist/dts/Pipeable.d.ts:20

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

###### K

`K` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

###### jk

(`_`) => `K`

##### Returns

`K`

##### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`, `jk`, `kl`): `L`

Defined in: node\_modules/effect/dist/dts/Pipeable.d.ts:21

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

###### K

`K` = `never`

###### L

`L` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

###### jk

(`_`) => `K`

###### kl

(`_`) => `L`

##### Returns

`L`

##### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`, `jk`, `kl`, `lm`): `M`

Defined in: node\_modules/effect/dist/dts/Pipeable.d.ts:22

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

###### K

`K` = `never`

###### L

`L` = `never`

###### M

`M` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

###### jk

(`_`) => `K`

###### kl

(`_`) => `L`

###### lm

(`_`) => `M`

##### Returns

`M`

##### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`, `jk`, `kl`, `lm`, `mn`): `N`

Defined in: node\_modules/effect/dist/dts/Pipeable.d.ts:23

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

###### K

`K` = `never`

###### L

`L` = `never`

###### M

`M` = `never`

###### N

`N` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

###### jk

(`_`) => `K`

###### kl

(`_`) => `L`

###### lm

(`_`) => `M`

###### mn

(`_`) => `N`

##### Returns

`N`

##### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`, `jk`, `kl`, `lm`, `mn`, `no`): `O`

Defined in: node\_modules/effect/dist/dts/Pipeable.d.ts:24

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

###### K

`K` = `never`

###### L

`L` = `never`

###### M

`M` = `never`

###### N

`N` = `never`

###### O

`O` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

###### jk

(`_`) => `K`

###### kl

(`_`) => `L`

###### lm

(`_`) => `M`

###### mn

(`_`) => `N`

###### no

(`_`) => `O`

##### Returns

`O`

##### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`, `jk`, `kl`, `lm`, `mn`, `no`, `op`): `P`

Defined in: node\_modules/effect/dist/dts/Pipeable.d.ts:25

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

###### K

`K` = `never`

###### L

`L` = `never`

###### M

`M` = `never`

###### N

`N` = `never`

###### O

`O` = `never`

###### P

`P` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

###### jk

(`_`) => `K`

###### kl

(`_`) => `L`

###### lm

(`_`) => `M`

###### mn

(`_`) => `N`

###### no

(`_`) => `O`

###### op

(`_`) => `P`

##### Returns

`P`

##### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`, `Q`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`, `jk`, `kl`, `lm`, `mn`, `no`, `op`, `pq`): `Q`

Defined in: node\_modules/effect/dist/dts/Pipeable.d.ts:26

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

###### K

`K` = `never`

###### L

`L` = `never`

###### M

`M` = `never`

###### N

`N` = `never`

###### O

`O` = `never`

###### P

`P` = `never`

###### Q

`Q` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

###### jk

(`_`) => `K`

###### kl

(`_`) => `L`

###### lm

(`_`) => `M`

###### mn

(`_`) => `N`

###### no

(`_`) => `O`

###### op

(`_`) => `P`

###### pq

(`_`) => `Q`

##### Returns

`Q`

##### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`, `Q`, `R`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`, `jk`, `kl`, `lm`, `mn`, `no`, `op`, `pq`, `qr`): `R`

Defined in: node\_modules/effect/dist/dts/Pipeable.d.ts:27

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

###### K

`K` = `never`

###### L

`L` = `never`

###### M

`M` = `never`

###### N

`N` = `never`

###### O

`O` = `never`

###### P

`P` = `never`

###### Q

`Q` = `never`

###### R

`R` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

###### jk

(`_`) => `K`

###### kl

(`_`) => `L`

###### lm

(`_`) => `M`

###### mn

(`_`) => `N`

###### no

(`_`) => `O`

###### op

(`_`) => `P`

###### pq

(`_`) => `Q`

###### qr

(`_`) => `R`

##### Returns

`R`

##### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`, `Q`, `R`, `S`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`, `jk`, `kl`, `lm`, `mn`, `no`, `op`, `pq`, `qr`, `rs`): `S`

Defined in: node\_modules/effect/dist/dts/Pipeable.d.ts:28

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

###### K

`K` = `never`

###### L

`L` = `never`

###### M

`M` = `never`

###### N

`N` = `never`

###### O

`O` = `never`

###### P

`P` = `never`

###### Q

`Q` = `never`

###### R

`R` = `never`

###### S

`S` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

###### jk

(`_`) => `K`

###### kl

(`_`) => `L`

###### lm

(`_`) => `M`

###### mn

(`_`) => `N`

###### no

(`_`) => `O`

###### op

(`_`) => `P`

###### pq

(`_`) => `Q`

###### qr

(`_`) => `R`

###### rs

(`_`) => `S`

##### Returns

`S`

##### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`, `Q`, `R`, `S`, `T`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`, `jk`, `kl`, `lm`, `mn`, `no`, `op`, `pq`, `qr`, `rs`, `st`): `T`

Defined in: node\_modules/effect/dist/dts/Pipeable.d.ts:29

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

###### K

`K` = `never`

###### L

`L` = `never`

###### M

`M` = `never`

###### N

`N` = `never`

###### O

`O` = `never`

###### P

`P` = `never`

###### Q

`Q` = `never`

###### R

`R` = `never`

###### S

`S` = `never`

###### T

`T` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

###### jk

(`_`) => `K`

###### kl

(`_`) => `L`

###### lm

(`_`) => `M`

###### mn

(`_`) => `N`

###### no

(`_`) => `O`

###### op

(`_`) => `P`

###### pq

(`_`) => `Q`

###### qr

(`_`) => `R`

###### rs

(`_`) => `S`

###### st

(`_`) => `T`

##### Returns

`T`

##### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`, `Q`, `R`, `S`, `T`, `U`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`, `jk`, `kl`, `lm`, `mn`, `no`, `op`, `pq`, `qr`, `rs`, `st`, `tu`): `U`

Defined in: node\_modules/effect/dist/dts/Pipeable.d.ts:30

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

###### K

`K` = `never`

###### L

`L` = `never`

###### M

`M` = `never`

###### N

`N` = `never`

###### O

`O` = `never`

###### P

`P` = `never`

###### Q

`Q` = `never`

###### R

`R` = `never`

###### S

`S` = `never`

###### T

`T` = `never`

###### U

`U` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

###### jk

(`_`) => `K`

###### kl

(`_`) => `L`

###### lm

(`_`) => `M`

###### mn

(`_`) => `N`

###### no

(`_`) => `O`

###### op

(`_`) => `P`

###### pq

(`_`) => `Q`

###### qr

(`_`) => `R`

###### rs

(`_`) => `S`

###### st

(`_`) => `T`

###### tu

(`_`) => `U`

##### Returns

`U`

##### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().pipe`

#### Call Signature

> `static` **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`, `Q`, `R`, `S`, `T`, `U`\>(`this`, `ab`, `bc`, `cd`, `de`, `ef`, `fg`, `gh`, `hi`, `ij`, `jk`, `kl`, `lm`, `mn`, `no`, `op`, `pq`, `qr`, `rs`, `st`, `tu`): `U`

Defined in: node\_modules/effect/dist/dts/Pipeable.d.ts:31

##### Type Parameters

###### A

`A`

###### B

`B` = `never`

###### C

`C` = `never`

###### D

`D` = `never`

###### E

`E` = `never`

###### F

`F` = `never`

###### G

`G` = `never`

###### H

`H` = `never`

###### I

`I` = `never`

###### J

`J` = `never`

###### K

`K` = `never`

###### L

`L` = `never`

###### M

`M` = `never`

###### N

`N` = `never`

###### O

`O` = `never`

###### P

`P` = `never`

###### Q

`Q` = `never`

###### R

`R` = `never`

###### S

`S` = `never`

###### T

`T` = `never`

###### U

`U` = `never`

##### Parameters

###### this

`A`

###### ab

(`_`) => `B`

###### bc

(`_`) => `C`

###### cd

(`_`) => `D`

###### de

(`_`) => `E`

###### ef

(`_`) => `F`

###### fg

(`_`) => `G`

###### gh

(`_`) => `H`

###### hi

(`_`) => `I`

###### ij

(`_`) => `J`

###### jk

(`_`) => `K`

###### kl

(`_`) => `L`

###### lm

(`_`) => `M`

###### mn

(`_`) => `N`

###### no

(`_`) => `O`

###### op

(`_`) => `P`

###### pq

(`_`) => `Q`

###### qr

(`_`) => `R`

###### rs

(`_`) => `S`

###### st

(`_`) => `T`

###### tu

(`_`) => `U`

##### Returns

`U`

##### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().pipe`

***

### toJSON()

> `static` **toJSON**(): `unknown`

Defined in: node\_modules/effect/dist/dts/Inspectable.d.ts:21

#### Returns

`unknown`

#### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().toJSON`

***

### toString()

> `static` **toString**(): `string`

Defined in: node\_modules/effect/dist/dts/Inspectable.d.ts:20

#### Returns

`string`

#### Inherited from

`Context.Tag("ContentStore")< 	ContentStore, 	{ 		query: <T extends Schema.Struct<any>>( 			sql: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 		insert: <T extends Schema.Struct<any>>( 			id: string, 			collection: string, 			data: T["Type"], 		) => Effect.Effect<void, ContentStoreError, never>; 		getById: <T extends AnySchema>( 			collection: string, 			id: string, 			schema: T, 		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>; 		getAll: <T extends AnySchema>( 			collection: string, 			schema: T, 		) => Effect.Effect<readonly T["Type"][], ContentStoreError>; 	} >().toString`
