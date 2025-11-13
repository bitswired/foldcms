---
editUrl: false
next: false
prev: false
title: "CollectionRelation"
---

> **CollectionRelation**\<`TField`, `TTarget`\> = `object`

Defined in: [packages/core/src/cms.ts:87](https://github.com/bitswired/foldcms/blob/485aa8df4385a9a7d7379ad36deb6d860f28ee8b/packages/core/src/cms.ts#L87)

Defines the type of relationship between collections.
- `single`: One-to-one relationship returning an Option of the target
- `array`: One-to-many relationship returning an array of targets
- `map`: Key-value mapping relationship returning a Map

## Example

```typescript
const authorRelation: CollectionRelation<"authorId", "authors"> = {
  type: "single",
  field: "authorId",
  target: "authors"
};
```

## Type Parameters

### TField

`TField` *extends* `string` = `string`

### TTarget

`TTarget` *extends* `string` = `string`

## Properties

### field

> `readonly` **field**: `TField`

Defined in: [packages/core/src/cms.ts:92](https://github.com/bitswired/foldcms/blob/485aa8df4385a9a7d7379ad36deb6d860f28ee8b/packages/core/src/cms.ts#L92)

***

### target

> `readonly` **target**: `TTarget`

Defined in: [packages/core/src/cms.ts:93](https://github.com/bitswired/foldcms/blob/485aa8df4385a9a7d7379ad36deb6d860f28ee8b/packages/core/src/cms.ts#L93)

***

### type

> `readonly` **type**: `"single"` \| `"array"` \| `"map"`

Defined in: [packages/core/src/cms.ts:91](https://github.com/bitswired/foldcms/blob/485aa8df4385a9a7d7379ad36deb6d860f28ee8b/packages/core/src/cms.ts#L91)
