---
editUrl: false
next: false
prev: false
title: "Collection"
---

Defined in: [packages/core/src/cms.ts:50](https://github.com/bitswired/foldcms/blob/92f893e734b1102683a12bd11c6183cc24996bdf/packages/core/src/cms.ts#L50)

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

Defined in: [packages/core/src/cms.ts:62](https://github.com/bitswired/foldcms/blob/92f893e734b1102683a12bd11c6183cc24996bdf/packages/core/src/cms.ts#L62)

***

### loadingSchema

> `readonly` **loadingSchema**: `TLoadSchema`

Defined in: [packages/core/src/cms.ts:60](https://github.com/bitswired/foldcms/blob/92f893e734b1102683a12bd11c6183cc24996bdf/packages/core/src/cms.ts#L60)

***

### relations

> `readonly` **relations**: `TRelations`

Defined in: [packages/core/src/cms.ts:77](https://github.com/bitswired/foldcms/blob/92f893e734b1102683a12bd11c6183cc24996bdf/packages/core/src/cms.ts#L77)

***

### transformedSchema

> `readonly` **transformedSchema**: `TTransformSchema`

Defined in: [packages/core/src/cms.ts:61](https://github.com/bitswired/foldcms/blob/92f893e734b1102683a12bd11c6183cc24996bdf/packages/core/src/cms.ts#L61)

***

### transformer()

> `readonly` **transformer**: (`data`) => `Effect`\<`Type`\<`TTransformSchema`\>, [`TransformationError`](/api/cms/classes/transformationerror/), `TTransformerDeps`\>

Defined in: [packages/core/src/cms.ts:67](https://github.com/bitswired/foldcms/blob/92f893e734b1102683a12bd11c6183cc24996bdf/packages/core/src/cms.ts#L67)

#### Parameters

##### data

`Type`\<`TLoadSchema`\>

#### Returns

`Effect`\<`Type`\<`TTransformSchema`\>, [`TransformationError`](/api/cms/classes/transformationerror/), `TTransformerDeps`\>

***

### validator()

> `readonly` **validator**: (`data`) => `Effect`\<`void`, [`ValidationError`](/api/cms/classes/validationerror/), `TValidatorDeps`\>

Defined in: [packages/core/src/cms.ts:74](https://github.com/bitswired/foldcms/blob/92f893e734b1102683a12bd11c6183cc24996bdf/packages/core/src/cms.ts#L74)

#### Parameters

##### data

`Type`\<`TTransformSchema`\>

#### Returns

`Effect`\<`void`, [`ValidationError`](/api/cms/classes/validationerror/), `TValidatorDeps`\>
