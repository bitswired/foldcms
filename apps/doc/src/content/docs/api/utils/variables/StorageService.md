---
editUrl: false
next: false
prev: false
title: "StorageService"
---

> **StorageService**: `Tag`\<[`StorageService`](/api/utils/interfaces/storageservice/), [`StorageService`](/api/utils/interfaces/storageservice/)\>

Defined in: [packages/core/src/utils.ts:25](https://github.com/bitswired/foldcms/blob/19c9e600da6c0170e8229bb7e1889de08e1cce6f/packages/core/src/utils.ts#L25)

Service tag for dependency injection of StorageService.
Used with Effect's Context system to provide StorageService instances.

## Example

```typescript
Effect.gen(function* () {
  const storage = yield* StorageService;
  yield* storage.upload("my-bucket", "file.txt", fileData);
});
```
