# @foldcms/core

## 0.3.4

### Patch Changes

- 47f2c02: Fix biome error with Tailwind

## 0.3.3

### Patch Changes

- a07c83e: chore: update dependencies in package.json and core package.json

      - Upgraded @biomejs/biome from 2.2.4 to 2.3.5
      - Upgraded turbo from 2.5.8 to 2.6.1
      - Upgraded typescript from 5.9.2 to 5.9.3
      - Upgraded @effect/platform-bun from 0.81.0 to 0.83.0
      - Upgraded @effect/sql-sqlite-bun from 0.47.0 to 0.49.0
      - Updated @types/bun to version ^1.3.2
      - Upgraded tsup from 8.5.0 to 8.5.1
      - Updated peer dependencies:
        - @aws-sdk/client-s3 from ^3.901.0 to ^3.931.0
        - @effect/platform from ^0.92.1 to ^0.93.1
        - effect from ^3.18.1 to ^3.19.3
        - esbuild from ^0.25.10 to ^0.27.0
        - typescript to ^5.9.3

## 0.3.2

### Patch Changes

- e40d0cf: Enhance documentation and error handling for loaders and storage services

  - Updated yamlFilesLoader and yamlStreamLoader documentation to clarify functionality and parameters.
  - Introduced syncFolderToStorage utility with comprehensive documentation for synchronizing local folders with cloud storage.
  - Added StorageService interface documentation to standardize cloud storage operations.
  - Created S3StorageServiceLive and makeS3StorageService documentation for S3 integration.
  - Improved error handling with new ValidationError and ContentStoreError classes.
  - Enhanced comments and examples throughout the codebase for better clarity and usability.

## 0.3.1

### Patch Changes

- 95183c8: Fix core README

## 0.3.0

### Minor Changes

- 2a2b3a9: Add S3 storage service implementation and utility functions

      - Introduced a new `utils.ts` file containing the `StorageService` interface and its S3 implementation.
      - Updated `package.json` to include `@aws-sdk/client-s3` as a peer dependency.
      - Refactored loaders to remove `baseDir` from configuration, simplifying the folder structure.
      - Added tests for the new utility functions, covering upload, deletion, and synchronization of files with S3.
      - Implemented a mock storage service for testing purposes.
      - Enhanced `tsup.config.ts` to include the new `utils.ts` entry point.

## 0.2.6

### Patch Changes

- 07eb4d3: Fix

## 0.2.5

### Patch Changes

- 353ed1d: Fix

## 0.2.4

### Patch Changes

- b8453b7: Fix

## 0.2.3

### Patch Changes

- 54d9861: Fix

## 0.2.2

### Patch Changes

- c5b2e7f: Fix

## 0.2.1

### Patch Changes

- f5268f9: Fix

## 0.2.0

### Minor Changes

- 2a297e8: Remaster and doc

## 0.1.5

### Patch Changes

- 1c891e1: Fix

## 0.1.4

### Patch Changes

- 4ed8161: Update README

## 0.1.3

### Patch Changes

- b5a2e89: Fix

## 0.1.2

### Patch Changes

- 5d2822d: Fix
- 9ac7eae: Fix

## 0.1.1

### Patch Changes

- 66c7e1f: Fix files included in package.json

## 0.1.1

### Patch Changes

- 320af88: Add files to package.json

## 0.1.0

### Minor Changes

- 68d440e: Add CMS, Collections and basic loaders
