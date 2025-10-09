---
editUrl: false
next: false
prev: false
title: "StorageService"
---

> **StorageService**: `Tag`\<[`StorageService`](/api/utils/interfaces/storageservice/), [`StorageService`](/api/utils/interfaces/storageservice/)\>

Defined in: [packages/core/src/utils.ts:25](https://github.com/bitswired/foldcms/blob/a5796744336f5646b8ccb4abf3c6d1334a83f443/packages/core/src/utils.ts#L25)

Service tag for dependency injection of StorageService.
Used with Effect's Context system to provide StorageService instances.

## Example

```typescript
Effect.gen(function* () {
  const storage = yield* StorageService;
  yield* storage.upload("my-bucket", "file.txt", fileData);
});
```
