---
editUrl: false
next: false
prev: false
title: "defineCollection"
---

## Call Signature

> **defineCollection**\<`TLoadSchema`, `TRelations`, `TLoaderDeps`, `TValidatorDeps`\>(`config`): [`Collection`](/api/cms/interfaces/collection/)\<`TLoadSchema`, `TLoadSchema`, `TRelations`, `TLoaderDeps`, `never`, `TValidatorDeps`\>

Defined in: [packages/core/src/cms.ts:193](https://github.com/bitswired/foldcms/blob/a5796744336f5646b8ccb4abf3c6d1334a83f443/packages/core/src/cms.ts#L193)

Factory function to define collections with type-safe configurations.
Provides overloads for different collection configurations.

### Type Parameters

#### TLoadSchema

`TLoadSchema` *extends* `AnySchema`

#### TRelations

`TRelations` *extends* `Partial`\<`Record`\<keyof `Type`\<`TLoadSchema`\>, [`CollectionRelation`](/api/cms/type-aliases/collectionrelation/)\<`string`, `string`\>\>\>

#### TLoaderDeps

`TLoaderDeps` = `never`

#### TValidatorDeps

`TValidatorDeps` = `never`

### Parameters

#### config

Configuration object for the collection

##### loader

`Stream`\<`Type`\<`TLoadSchema`\>, [`LoadingError`](/api/cms/classes/loadingerror/), `TLoaderDeps`\>

##### loadingSchema

`TLoadSchema`

##### relations?

`TRelations`

##### transformedSchema?

`undefined`

##### transformer?

`undefined`

##### validator?

(`data`) => `Effect`\<`void`, [`ValidationError`](/api/cms/classes/validationerror/), `TValidatorDeps`\>

### Returns

[`Collection`](/api/cms/interfaces/collection/)\<`TLoadSchema`, `TLoadSchema`, `TRelations`, `TLoaderDeps`, `never`, `TValidatorDeps`\>

A fully configured Collection instance

### Example

```typescript
// Simple collection without transformation
const users = defineCollection({
  loadingSchema: UserSchema,
  loader: loadUsersFromFiles
});

// Collection with transformation
const posts = defineCollection({
  loadingSchema: RawPostSchema,
  transformedSchema: PostSchema,
  loader: loadRawPosts,
  transformer: transformPost,
  validator: validatePost,
  relations: {
    authorId: { type: "single", field: "authorId", target: "users" }
  }
});
```

## Call Signature

> **defineCollection**\<`TLoadSchema`, `TRelations`, `TLoaderDeps`, `TTransformerDeps`, `TValidatorDeps`\>(`config`): [`Collection`](/api/cms/interfaces/collection/)\<`TLoadSchema`, `TLoadSchema`, `TRelations`, `TLoaderDeps`, `TTransformerDeps`, `TValidatorDeps`\>

Defined in: [packages/core/src/cms.ts:223](https://github.com/bitswired/foldcms/blob/a5796744336f5646b8ccb4abf3c6d1334a83f443/packages/core/src/cms.ts#L223)

Factory function to define collections with type-safe configurations.
Provides overloads for different collection configurations.

### Type Parameters

#### TLoadSchema

`TLoadSchema` *extends* `AnySchema`

#### TRelations

`TRelations` *extends* `Partial`\<`Record`\<keyof `Type`\<`TLoadSchema`\>, [`CollectionRelation`](/api/cms/type-aliases/collectionrelation/)\<`string`, `string`\>\>\>

#### TLoaderDeps

`TLoaderDeps` = `never`

#### TTransformerDeps

`TTransformerDeps` = `never`

#### TValidatorDeps

`TValidatorDeps` = `never`

### Parameters

#### config

Configuration object for the collection

##### loader

`Stream`\<`Type`\<`TLoadSchema`\>, [`LoadingError`](/api/cms/classes/loadingerror/), `TLoaderDeps`\>

##### loadingSchema

`TLoadSchema`

##### relations?

`TRelations`

##### transformedSchema?

`undefined`

##### transformer

(`data`) => `Effect`\<`Type`\<`TLoadSchema`\>, [`TransformationError`](/api/cms/classes/transformationerror/), `TTransformerDeps`\>

##### validator?

(`data`) => `Effect`\<`void`, [`ValidationError`](/api/cms/classes/validationerror/), `TValidatorDeps`\>

### Returns

[`Collection`](/api/cms/interfaces/collection/)\<`TLoadSchema`, `TLoadSchema`, `TRelations`, `TLoaderDeps`, `TTransformerDeps`, `TValidatorDeps`\>

A fully configured Collection instance

### Example

```typescript
// Simple collection without transformation
const users = defineCollection({
  loadingSchema: UserSchema,
  loader: loadUsersFromFiles
});

// Collection with transformation
const posts = defineCollection({
  loadingSchema: RawPostSchema,
  transformedSchema: PostSchema,
  loader: loadRawPosts,
  transformer: transformPost,
  validator: validatePost,
  relations: {
    authorId: { type: "single", field: "authorId", target: "users" }
  }
});
```

## Call Signature

> **defineCollection**\<`TLoadSchema`, `TTransformSchema`, `TRelations`, `TLoaderDeps`, `TTransformerDeps`, `TValidatorDeps`\>(`config`): [`Collection`](/api/cms/interfaces/collection/)\<`TLoadSchema`, `TTransformSchema`, `TRelations`, `TLoaderDeps`, `TTransformerDeps`, `TValidatorDeps`\>

Defined in: [packages/core/src/cms.ts:260](https://github.com/bitswired/foldcms/blob/a5796744336f5646b8ccb4abf3c6d1334a83f443/packages/core/src/cms.ts#L260)

Factory function to define collections with type-safe configurations.
Provides overloads for different collection configurations.

### Type Parameters

#### TLoadSchema

`TLoadSchema` *extends* `AnySchema`

#### TTransformSchema

`TTransformSchema` *extends* `AnySchema`

#### TRelations

`TRelations` *extends* `Partial`\<`Record`\<keyof `Type`\<`TTransformSchema`\>, [`CollectionRelation`](/api/cms/type-aliases/collectionrelation/)\<`string`, `string`\>\>\>

#### TLoaderDeps

`TLoaderDeps` = `never`

#### TTransformerDeps

`TTransformerDeps` = `never`

#### TValidatorDeps

`TValidatorDeps` = `never`

### Parameters

#### config

Configuration object for the collection

##### loader

`Stream`\<`Type`\<`TLoadSchema`\>, [`LoadingError`](/api/cms/classes/loadingerror/), `TLoaderDeps`\>

##### loadingSchema

`TLoadSchema`

##### relations?

`TRelations`

##### transformedSchema

`TTransformSchema`

##### transformer

(`data`) => `Effect`\<`Type`\<`TTransformSchema`\>, [`TransformationError`](/api/cms/classes/transformationerror/), `TTransformerDeps`\>

##### validator?

(`data`) => `Effect`\<`void`, [`ValidationError`](/api/cms/classes/validationerror/), `TValidatorDeps`\>

### Returns

[`Collection`](/api/cms/interfaces/collection/)\<`TLoadSchema`, `TTransformSchema`, `TRelations`, `TLoaderDeps`, `TTransformerDeps`, `TValidatorDeps`\>

A fully configured Collection instance

### Example

```typescript
// Simple collection without transformation
const users = defineCollection({
  loadingSchema: UserSchema,
  loader: loadUsersFromFiles
});

// Collection with transformation
const posts = defineCollection({
  loadingSchema: RawPostSchema,
  transformedSchema: PostSchema,
  loader: loadRawPosts,
  transformer: transformPost,
  validator: validatePost,
  relations: {
    authorId: { type: "single", field: "authorId", target: "users" }
  }
});
```
