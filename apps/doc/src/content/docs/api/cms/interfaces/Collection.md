---
editUrl: false
next: false
prev: false
title: "Collection"
---

Defined in: [packages/core/src/cms.ts:120](https://github.com/bitswired/foldcms/blob/19c9e600da6c0170e8229bb7e1889de08e1cce6f/packages/core/src/cms.ts#L120)

Defines a collection with its loading, transformation, and validation pipeline.

## Example

```typescript
const postsCollection: Collection<PostLoadSchema, PostSchema, {}, FileSystem> = {
  loadingSchema: PostLoadSchema,
  transformedSchema: PostSchema,
  loader: loadPostsFromFS,
  transformer: transformPost,
  validator: validatePost,
  relations: {}
};
```

## Type Parameters

### TLoadSchema

`TLoadSchema` *extends* `AnySchema`

Schema for the raw loaded data

### TTransformSchema

`TTransformSchema` *extends* `AnySchema`

Schema for the transformed data

### TRelations

`TRelations` *extends* `Partial`\<`Record`\<keyof `Schema.Schema.Type`\<`TTransformSchema`\>, [`CollectionRelation`](/api/cms/type-aliases/collectionrelation/)\>\>

Map of field names to their collection relations

### TLoaderDeps

`TLoaderDeps`

Dependencies required by the loader

### TTransformerDeps

`TTransformerDeps`

Dependencies required by the transformer

### TValidatorDeps

`TValidatorDeps`

Dependencies required by the validator

## Properties

### loader

> `readonly` **loader**: `Stream`\<`Type`\<`TLoadSchema`\>, [`LoadingError`](/api/cms/classes/loadingerror/), `TLoaderDeps`\>

Defined in: [packages/core/src/cms.ts:132](https://github.com/bitswired/foldcms/blob/19c9e600da6c0170e8229bb7e1889de08e1cce6f/packages/core/src/cms.ts#L132)

***

### loadingSchema

> `readonly` **loadingSchema**: `TLoadSchema`

Defined in: [packages/core/src/cms.ts:130](https://github.com/bitswired/foldcms/blob/19c9e600da6c0170e8229bb7e1889de08e1cce6f/packages/core/src/cms.ts#L130)

***

### relations

> `readonly` **relations**: `TRelations`

Defined in: [packages/core/src/cms.ts:147](https://github.com/bitswired/foldcms/blob/19c9e600da6c0170e8229bb7e1889de08e1cce6f/packages/core/src/cms.ts#L147)

***

### transformedSchema

> `readonly` **transformedSchema**: `TTransformSchema`

Defined in: [packages/core/src/cms.ts:131](https://github.com/bitswired/foldcms/blob/19c9e600da6c0170e8229bb7e1889de08e1cce6f/packages/core/src/cms.ts#L131)

***

### transformer()

> `readonly` **transformer**: (`data`) => `Effect`\<`Type`\<`TTransformSchema`\>, [`TransformationError`](/api/cms/classes/transformationerror/), `TTransformerDeps`\>

Defined in: [packages/core/src/cms.ts:137](https://github.com/bitswired/foldcms/blob/19c9e600da6c0170e8229bb7e1889de08e1cce6f/packages/core/src/cms.ts#L137)

#### Parameters

##### data

`Type`\<`TLoadSchema`\>

#### Returns

`Effect`\<`Type`\<`TTransformSchema`\>, [`TransformationError`](/api/cms/classes/transformationerror/), `TTransformerDeps`\>

***

### validator()

> `readonly` **validator**: (`data`) => `Effect`\<`void`, [`ValidationError`](/api/cms/classes/validationerror/), `TValidatorDeps`\>

Defined in: [packages/core/src/cms.ts:144](https://github.com/bitswired/foldcms/blob/19c9e600da6c0170e8229bb7e1889de08e1cce6f/packages/core/src/cms.ts#L144)

#### Parameters

##### data

`Type`\<`TTransformSchema`\>

#### Returns

`Effect`\<`void`, [`ValidationError`](/api/cms/classes/validationerror/), `TValidatorDeps`\>
