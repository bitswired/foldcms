---
editUrl: false
next: false
prev: false
title: "Collection"
---

Defined in: [packages/core/src/cms.ts:48](https://github.com/bitswired/foldcms/blob/1c891e1138f693233aa186873facbdb8139365a8/packages/core/src/cms.ts#L48)

## Type Parameters

### TLoadSchema

`TLoadSchema` *extends* `AnyStruct`

### TTransformSchema

`TTransformSchema` *extends* `AnyStruct`

### TRelations

`TRelations` *extends* `Partial`\<`Record`\<keyof `Schema.Schema.Type`\<`TTransformSchema`\>, [`CollectionRelation`](/api/cms/type-aliases/collectionrelation/)\>\>

### TLoaderDeps

`TLoaderDeps`

### TTransformerDeps

`TTransformerDeps`

### TValidatorDeps

`TValidatorDeps`

### TLoaded

`TLoaded` = `Schema.Schema.Type`\<`TLoadSchema`\>

### TTransformed

`TTransformed` = `Schema.Schema.Type`\<`TTransformSchema`\>

## Properties

### loader

> `readonly` **loader**: `Stream`\<`TLoaded`, [`LoadingError`](/api/cms/classes/loadingerror/), `TLoaderDeps`\>

Defined in: [packages/core/src/cms.ts:62](https://github.com/bitswired/foldcms/blob/1c891e1138f693233aa186873facbdb8139365a8/packages/core/src/cms.ts#L62)

***

### loadingSchema

> `readonly` **loadingSchema**: `TLoadSchema`

Defined in: [packages/core/src/cms.ts:60](https://github.com/bitswired/foldcms/blob/1c891e1138f693233aa186873facbdb8139365a8/packages/core/src/cms.ts#L60)

***

### relations

> `readonly` **relations**: `TRelations`

Defined in: [packages/core/src/cms.ts:69](https://github.com/bitswired/foldcms/blob/1c891e1138f693233aa186873facbdb8139365a8/packages/core/src/cms.ts#L69)

***

### transformedSchema

> `readonly` **transformedSchema**: `TTransformSchema`

Defined in: [packages/core/src/cms.ts:61](https://github.com/bitswired/foldcms/blob/1c891e1138f693233aa186873facbdb8139365a8/packages/core/src/cms.ts#L61)

***

### transformer()

> `readonly` **transformer**: (`data`) => `Effect`\<`TTransformed`, [`TransformationError`](/api/cms/classes/transformationerror/), `TTransformerDeps`\>

Defined in: [packages/core/src/cms.ts:63](https://github.com/bitswired/foldcms/blob/1c891e1138f693233aa186873facbdb8139365a8/packages/core/src/cms.ts#L63)

#### Parameters

##### data

`TLoaded`

#### Returns

`Effect`\<`TTransformed`, [`TransformationError`](/api/cms/classes/transformationerror/), `TTransformerDeps`\>

***

### validator()

> `readonly` **validator**: (`data`) => `Effect`\<`void`, [`ValidationError`](/api/cms/classes/validationerror/), `TValidatorDeps`\>

Defined in: [packages/core/src/cms.ts:66](https://github.com/bitswired/foldcms/blob/1c891e1138f693233aa186873facbdb8139365a8/packages/core/src/cms.ts#L66)

#### Parameters

##### data

`TTransformed`

#### Returns

`Effect`\<`void`, [`ValidationError`](/api/cms/classes/validationerror/), `TValidatorDeps`\>
