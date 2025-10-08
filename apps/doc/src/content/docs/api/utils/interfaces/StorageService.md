---
editUrl: false
next: false
prev: false
title: "StorageService"
---

Defined in: [packages/core/src/utils.ts:25](https://github.com/bitswired/foldcms/blob/19c9e600da6c0170e8229bb7e1889de08e1cce6f/packages/core/src/utils.ts#L25)

Generic storage service interface that provides cloud storage operations.
This interface abstracts storage operations to allow for different implementations
(S3, R2, etc.) while maintaining a consistent API.

## Properties

### computeFileHash()

> `readonly` **computeFileHash**: (`filePath`) => `Effect`\<`string`, `Error`, `FileSystem`\>

Defined in: [packages/core/src/utils.ts:73](https://github.com/bitswired/foldcms/blob/19c9e600da6c0170e8229bb7e1889de08e1cce6f/packages/core/src/utils.ts#L73)

Computes the MD5 hash of a local file.
This is useful for comparing local and remote file versions.

#### Parameters

##### filePath

`string`

The path to the local file

#### Returns

`Effect`\<`string`, `Error`, `FileSystem`\>

An Effect that succeeds with the MD5 hash string or fails with an Error, requiring FileSystem

***

### delete()

> `readonly` **delete**: (`bucket`, `key`) => `Effect`\<`void`, `Error`\>

Defined in: [packages/core/src/utils.ts:57](https://github.com/bitswired/foldcms/blob/19c9e600da6c0170e8229bb7e1889de08e1cce6f/packages/core/src/utils.ts#L57)

Deletes a file from the specified bucket.

#### Parameters

##### bucket

`string`

The name of the storage bucket

##### key

`string`

The unique identifier/path for the file within the bucket

#### Returns

`Effect`\<`void`, `Error`\>

An Effect that succeeds with void or fails with an Error

***

### getETag()

> `readonly` **getETag**: (`bucket`, `key`) => `Effect`\<`null` \| `string`, `Error`\>

Defined in: [packages/core/src/utils.ts:46](https://github.com/bitswired/foldcms/blob/19c9e600da6c0170e8229bb7e1889de08e1cce6f/packages/core/src/utils.ts#L46)

Retrieves the ETag (entity tag) for a file in the specified bucket.
ETags are typically used for cache validation and change detection.

#### Parameters

##### bucket

`string`

The name of the storage bucket

##### key

`string`

The unique identifier/path for the file within the bucket

#### Returns

`Effect`\<`null` \| `string`, `Error`\>

An Effect that succeeds with the ETag string or null if not found, or fails with an Error

***

### listAll()

> `readonly` **listAll**: (`bucket`) => `Effect`\<`string`[], `Error`\>

Defined in: [packages/core/src/utils.ts:65](https://github.com/bitswired/foldcms/blob/19c9e600da6c0170e8229bb7e1889de08e1cce6f/packages/core/src/utils.ts#L65)

Lists all object keys in the specified bucket.
This operation handles pagination automatically to retrieve all objects.

#### Parameters

##### bucket

`string`

The name of the storage bucket

#### Returns

`Effect`\<`string`[], `Error`\>

An Effect that succeeds with an array of all object keys or fails with an Error

***

### upload()

> `readonly` **upload**: (`bucket`, `key`, `body`) => `Effect`\<`void`, `Error`\>

Defined in: [packages/core/src/utils.ts:33](https://github.com/bitswired/foldcms/blob/19c9e600da6c0170e8229bb7e1889de08e1cce6f/packages/core/src/utils.ts#L33)

Uploads a file to the specified bucket with the given key.

#### Parameters

##### bucket

`string`

The name of the storage bucket

##### key

`string`

The unique identifier/path for the file within the bucket

##### body

`Uint8Array`

The file content as a Uint8Array

#### Returns

`Effect`\<`void`, `Error`\>

An Effect that succeeds with void or fails with an Error
