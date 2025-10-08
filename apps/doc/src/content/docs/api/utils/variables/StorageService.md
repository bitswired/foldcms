---
editUrl: false
next: false
prev: false
title: "StorageService"
---

> **StorageService**: `Tag`\<[`StorageService`](/api/utils/interfaces/storageservice/), [`StorageService`](/api/utils/interfaces/storageservice/)\>

Defined in: [packages/core/src/utils.ts:25](https://github.com/bitswired/foldcms/blob/95183c86c9f5ae59bfbaa7d6e4a44975123622e3/packages/core/src/utils.ts#L25)

Service tag for dependency injection of StorageService.
Used with Effect's Context system to provide StorageService instances.

## Example

```typescript
Effect.gen(function* () {
  const storage = yield* StorageService;
  yield* storage.upload("my-bucket", "file.txt", fileData);
});
```
