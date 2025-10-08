---
"@foldcms/core": patch
---

Enhance documentation and error handling for loaders and storage services

- Updated yamlFilesLoader and yamlStreamLoader documentation to clarify functionality and parameters.
- Introduced syncFolderToStorage utility with comprehensive documentation for synchronizing local folders with cloud storage.
- Added StorageService interface documentation to standardize cloud storage operations.
- Created S3StorageServiceLive and makeS3StorageService documentation for S3 integration.
- Improved error handling with new ValidationError and ContentStoreError classes.
- Enhanced comments and examples throughout the codebase for better clarity and usability.
