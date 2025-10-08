---
editUrl: false
next: false
prev: false
title: "syncFolderToStorage"
---

> **syncFolderToStorage**(`options`): `Effect`\<\[`Duration`, \[`Chunk`\<\{ `bucket`: `string`; `fileName`: `string`; `localETag`: `string`; `remoteETag`: `null` \| `string`; `uploaded`: `boolean`; \}\>, `void` \| `Chunk`\<\{ `bucket`: `string`; `deleted`: `boolean`; `fileName`: `string`; \}\>\]\], `Error` \| `PlatformError`, `FileSystem` \| `Path` \| [`StorageService`](/api/utils/interfaces/storageservice/)\>

Defined in: [packages/core/src/utils.ts:435](https://github.com/bitswired/foldcms/blob/e40d0cf35579f8d8914becd5acbabb5d0cdf8620/packages/core/src/utils.ts#L435)

Synchronizes a local folder with cloud storage buckets.
This function uploads changed files and optionally deletes orphaned files to keep
the storage buckets in sync with the local folder structure.

## Parameters

### options

Configuration object for the sync operation

#### bucketsToClean?

`string`[] = `[]`

Array of bucket names to clean of orphaned files (default: [])

#### concurrency?

`number` = `1`

Number of concurrent operations to run (default: 1)

#### deleteOrphaned?

`boolean` = `false`

Whether to delete files that exist in storage but not locally (default: false)

#### folderPath

`string`

The local folder path to synchronize

#### getBucket

(`fileName`) => `Effect`\<`string`, `Error`\>

Function that determines which bucket a file should be uploaded to based on filename

## Returns

`Effect`\<\[`Duration`, \[`Chunk`\<\{ `bucket`: `string`; `fileName`: `string`; `localETag`: `string`; `remoteETag`: `null` \| `string`; `uploaded`: `boolean`; \}\>, `void` \| `Chunk`\<\{ `bucket`: `string`; `deleted`: `boolean`; `fileName`: `string`; \}\>\]\], `Error` \| `PlatformError`, `FileSystem` \| `Path` \| [`StorageService`](/api/utils/interfaces/storageservice/)\>

An Effect that succeeds with sync results and timing information, or fails with an Error

## Example

```typescript
const syncResult = yield* syncFolderToStorage({
  folderPath: "/path/to/local/folder",
  getBucket: (fileName) => Effect.succeed(fileName.endsWith('.js') ? 'js-bucket' : 'other-bucket'),
  bucketsToClean: ['js-bucket', 'other-bucket'],
  concurrency: 3,
  deleteOrphaned: true
});
```
