---
editUrl: false
next: false
prev: false
title: "defineCollection"
---

## Call Signature

> **defineCollection**\<`TLoadSchema`, `TRelations`, `TLoaderDeps`, `TValidatorDeps`\>(`config`): [`Collection`](/api/cms/interfaces/collection/)\<`TLoadSchema`, `TLoadSchema`, `TRelations`, `TLoaderDeps`, `never`, `TValidatorDeps`\>

Defined in: [packages/core/src/cms.ts:77](https://github.com/bitswired/foldcms/blob/1c891e1138f693233aa186873facbdb8139365a8/packages/core/src/cms.ts#L77)

### Type Parameters

#### TLoadSchema

`TLoadSchema` *extends* `AnyStruct`

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

Defined in: [packages/core/src/cms.ts:107](https://github.com/bitswired/foldcms/blob/1c891e1138f693233aa186873facbdb8139365a8/packages/core/src/cms.ts#L107)

### Type Parameters

#### TLoadSchema

`TLoadSchema` *extends* `AnyStruct`

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

Defined in: [packages/core/src/cms.ts:144](https://github.com/bitswired/foldcms/blob/1c891e1138f693233aa186873facbdb8139365a8/packages/core/src/cms.ts#L144)

### Type Parameters

#### TLoadSchema

`TLoadSchema` *extends* `AnyStruct`

#### TTransformSchema

`TTransformSchema` *extends* `AnyStruct`

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
