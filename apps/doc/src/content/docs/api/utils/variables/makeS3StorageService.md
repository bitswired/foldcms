---
editUrl: false
next: false
prev: false
title: "makeS3StorageService"
---

> `const` **makeS3StorageService**: `Effect`\<[`StorageService`](/api/utils/interfaces/storageservice/), `ConfigError`, `never`\>

Defined in: [packages/core/src/utils.ts:113](https://github.com/bitswired/foldcms/blob/485aa8df4385a9a7d7379ad36deb6d860f28ee8b/packages/core/src/utils.ts#L113)

Creates an S3-compatible storage service instance configured for Cloudflare R2.
Reads configuration from environment variables and initializes an S3 client.

## Returns

An Effect that produces a StorageService implementation

## Throws

Error if required environment variables are missing

## Remarks

Required environment variables:
- S3_ACCOUNT_ID: Cloudflare account ID
- S3_ACCESS_KEY_ID: Access key for R2 storage
- S3_SECRET_ACCESS_KEY: Secret key for R2 storage

## Example

```typescript
const service = yield* makeS3StorageService;
yield* service.upload("my-bucket", "file.txt", fileData);
```
