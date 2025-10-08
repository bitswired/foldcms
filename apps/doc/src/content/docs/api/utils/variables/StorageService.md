---
editUrl: false
next: false
prev: false
title: "StorageService"
---

> **StorageService**: `Tag`\<[`StorageService`](/api/utils/interfaces/storageservice/), [`StorageService`](/api/utils/interfaces/storageservice/)\>

Defined in: [packages/core/src/utils.ts:25](https://github.com/bitswired/foldcms/blob/e40d0cf35579f8d8914becd5acbabb5d0cdf8620/packages/core/src/utils.ts#L25)

Service tag for dependency injection of StorageService.
Used with Effect's Context system to provide StorageService instances.

## Example

```typescript
Effect.gen(function* () {
  const storage = yield* StorageService;
  yield* storage.upload("my-bucket", "file.txt", fileData);
});
```
