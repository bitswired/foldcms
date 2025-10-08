---
editUrl: false
next: false
prev: false
title: "S3StorageServiceLive"
---

> `const` **S3StorageServiceLive**: `Layer`\<[`StorageService`](/api/utils/interfaces/storageservice/), `ConfigError`, `never`\>

Defined in: [packages/core/src/utils.ts:234](https://github.com/bitswired/foldcms/blob/e40d0cf35579f8d8914becd5acbabb5d0cdf8620/packages/core/src/utils.ts#L234)

Effect layer that provides a live implementation of StorageService using S3.
This layer can be used to inject the S3 storage service into your Effect application.

## Example

```typescript
const program = Effect.gen(function* () {
  const storage = yield* StorageService;
  yield* storage.upload("my-bucket", "file.txt", fileData);
}).pipe(Effect.provide(S3StorageServiceLive));
```
