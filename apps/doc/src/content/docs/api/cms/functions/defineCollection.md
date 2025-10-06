---
editUrl: false
next: false
prev: false
title: "defineCollection"
---

## Call Signature

> **defineCollection**\<`TLoadSchema`, `TRelations`, `TLoaderDeps`, `TValidatorDeps`\>(`config`): [`Collection`](/api/cms/interfaces/collection/)\<`TLoadSchema`, `TLoadSchema`, `TRelations`, `TLoaderDeps`, `never`, `TValidatorDeps`\>

Defined in: [packages/core/src/cms.ts:85](https://github.com/bitswired/foldcms/blob/92f893e734b1102683a12bd11c6183cc24996bdf/packages/core/src/cms.ts#L85)

### Type Parameters

#### TLoadSchema

`TLoadSchema` *extends* `AnySchema`

#### TRelations

`TRelations` *extends* `Partial`\<`Record`\<keyof `Type`\<`TLoadSchema`\>, [`CollectionRelation`](/api/cms/type-aliases/collectionrelation/)\<`string`, `string`\>\>\> = \{ \}

#### TLoaderDeps

`TLoaderDeps` = `never`

#### TValidatorDeps

`TValidatorDeps` = `never`

### Parameters

#### config

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

## Call Signature

> **defineCollection**\<`TLoadSchema`, `TRelations`, `TLoaderDeps`, `TTransformerDeps`, `TValidatorDeps`\>(`config`): [`Collection`](/api/cms/interfaces/collection/)\<`TLoadSchema`, `TLoadSchema`, `TRelations`, `TLoaderDeps`, `TTransformerDeps`, `TValidatorDeps`\>

Defined in: [packages/core/src/cms.ts:115](https://github.com/bitswired/foldcms/blob/92f893e734b1102683a12bd11c6183cc24996bdf/packages/core/src/cms.ts#L115)

### Type Parameters

#### TLoadSchema

`TLoadSchema` *extends* `AnySchema`

#### TRelations

`TRelations` *extends* `Partial`\<`Record`\<keyof `Type`\<`TLoadSchema`\>, [`CollectionRelation`](/api/cms/type-aliases/collectionrelation/)\<`string`, `string`\>\>\> = \{ \}

#### TLoaderDeps

`TLoaderDeps` = `never`

#### TTransformerDeps

`TTransformerDeps` = `never`

#### TValidatorDeps

`TValidatorDeps` = `never`

### Parameters

#### config

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

## Call Signature

> **defineCollection**\<`TLoadSchema`, `TTransformSchema`, `TRelations`, `TLoaderDeps`, `TTransformerDeps`, `TValidatorDeps`\>(`config`): [`Collection`](/api/cms/interfaces/collection/)\<`TLoadSchema`, `TTransformSchema`, `TRelations`, `TLoaderDeps`, `TTransformerDeps`, `TValidatorDeps`\>

Defined in: [packages/core/src/cms.ts:152](https://github.com/bitswired/foldcms/blob/92f893e734b1102683a12bd11c6183cc24996bdf/packages/core/src/cms.ts#L152)

### Type Parameters

#### TLoadSchema

`TLoadSchema` *extends* `AnySchema`

#### TTransformSchema

`TTransformSchema` *extends* `AnySchema`

#### TRelations

`TRelations` *extends* `Partial`\<`Record`\<keyof `Type`\<`TTransformSchema`\>, [`CollectionRelation`](/api/cms/type-aliases/collectionrelation/)\<`string`, `string`\>\>\> = \{ \}

#### TLoaderDeps

`TLoaderDeps` = `never`

#### TTransformerDeps

`TTransformerDeps` = `never`

#### TValidatorDeps

`TValidatorDeps` = `never`

### Parameters

#### config

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
