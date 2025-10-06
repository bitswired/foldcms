---
editUrl: false
next: false
prev: false
title: "Collection"
---

Defined in: [packages/core/src/cms.ts:52](https://github.com/bitswired/foldcms/blob/f5268f9ab9ef080063daf132e858e3c5524b2050/packages/core/src/cms.ts#L52)

## Type Parameters

### TLoadSchema

`TLoadSchema` *extends* `AnySchema`

### TTransformSchema

`TTransformSchema` *extends* `AnySchema`

### TRelations

`TRelations` *extends* `Partial`\<`Record`\<keyof `Schema.Schema.Type`\<`TTransformSchema`\>, [`CollectionRelation`](/api/cms/type-aliases/collectionrelation/)\>\>

### TLoaderDeps

`TLoaderDeps`

### TTransformerDeps

`TTransformerDeps`

### TValidatorDeps

`TValidatorDeps`

## Properties

### loader

> `readonly` **loader**: `Stream`\<`Type`\<`TLoadSchema`\>, [`LoadingError`](/api/cms/classes/loadingerror/), `TLoaderDeps`\>

Defined in: [packages/core/src/cms.ts:64](https://github.com/bitswired/foldcms/blob/f5268f9ab9ef080063daf132e858e3c5524b2050/packages/core/src/cms.ts#L64)

***

### loadingSchema

> `readonly` **loadingSchema**: `TLoadSchema`

Defined in: [packages/core/src/cms.ts:62](https://github.com/bitswired/foldcms/blob/f5268f9ab9ef080063daf132e858e3c5524b2050/packages/core/src/cms.ts#L62)

***

### relations

> `readonly` **relations**: `TRelations`

Defined in: [packages/core/src/cms.ts:79](https://github.com/bitswired/foldcms/blob/f5268f9ab9ef080063daf132e858e3c5524b2050/packages/core/src/cms.ts#L79)

***

### transformedSchema

> `readonly` **transformedSchema**: `TTransformSchema`

Defined in: [packages/core/src/cms.ts:63](https://github.com/bitswired/foldcms/blob/f5268f9ab9ef080063daf132e858e3c5524b2050/packages/core/src/cms.ts#L63)

***

### transformer()

> `readonly` **transformer**: (`data`) => `Effect`\<`Type`\<`TTransformSchema`\>, [`TransformationError`](/api/cms/classes/transformationerror/), `TTransformerDeps`\>

Defined in: [packages/core/src/cms.ts:69](https://github.com/bitswired/foldcms/blob/f5268f9ab9ef080063daf132e858e3c5524b2050/packages/core/src/cms.ts#L69)

#### Parameters

##### data

`Type`\<`TLoadSchema`\>

#### Returns

`Effect`\<`Type`\<`TTransformSchema`\>, [`TransformationError`](/api/cms/classes/transformationerror/), `TTransformerDeps`\>

***

### validator()

> `readonly` **validator**: (`data`) => `Effect`\<`void`, [`ValidationError`](/api/cms/classes/validationerror/), `TValidatorDeps`\>

Defined in: [packages/core/src/cms.ts:76](https://github.com/bitswired/foldcms/blob/f5268f9ab9ef080063daf132e858e3c5524b2050/packages/core/src/cms.ts#L76)

#### Parameters

##### data

`Type`\<`TTransformSchema`\>

#### Returns

`Effect`\<`void`, [`ValidationError`](/api/cms/classes/validationerror/), `TValidatorDeps`\>
