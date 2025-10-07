---
"@foldcms/core": minor
---

Add S3 storage service implementation and utility functions

    - Introduced a new `utils.ts` file containing the `StorageService` interface and its S3 implementation.
    - Updated `package.json` to include `@aws-sdk/client-s3` as a peer dependency.
    - Refactored loaders to remove `baseDir` from configuration, simplifying the folder structure.
    - Added tests for the new utility functions, covering upload, deletion, and synchronization of files with S3.
    - Implemented a mock storage service for testing purposes.
    - Enhanced `tsup.config.ts` to include the new `utils.ts` entry point.
