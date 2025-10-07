import { describe, expect, it } from "bun:test";
import { FileSystem, Error as PlatformError } from "@effect/platform";
import { BunContext } from "@effect/platform-bun";
import { Chunk, Effect, Layer, Option, Ref, Stream } from "effect";
import { StorageService, syncFolderToStorage } from "../src/utils";

// Helper type for upload/deletion results
type UploadResult = {
	fileName: string;
	localETag: string;
	remoteETag: string | null;
	uploaded: boolean;
};

type DeletionResult = {
	fileName: string;
	deleted: boolean;
};

// Mock StorageService implementation
interface MockStorageState {
	files: Map<string, { etag: string; body: Uint8Array }>;
	uploadedFiles: string[];
	deletedFiles: string[];
}

const makeMockStorageService = (initialState?: MockStorageState) =>
	Effect.gen(function* () {
		const state = yield* Ref.make<MockStorageState>(
			initialState ?? {
				files: new Map(),
				uploadedFiles: [],
				deletedFiles: [],
			},
		);

		return StorageService.of({
			upload: (_bucket: string, key: string, body: Uint8Array) =>
				Effect.gen(function* () {
					// Generate the same hash format as computeFileHash would
					const etag = `mock-hash-${key}-${body.length}`;

					yield* Ref.update(state, (s) => ({
						...s,
						files: new Map(s.files).set(key, { etag, body }),
						uploadedFiles: [...s.uploadedFiles, key],
					}));
				}),

			getETag: (_bucket: string, key: string) =>
				Effect.gen(function* () {
					const currentState = yield* Ref.get(state);
					const file = currentState.files.get(key);
					return file?.etag ?? null;
				}),

			delete: (_bucket: string, key: string) =>
				Effect.gen(function* () {
					yield* Ref.update(state, (s) => {
						const newFiles = new Map(s.files);
						newFiles.delete(key);
						return {
							...s,
							files: newFiles,
							deletedFiles: [...s.deletedFiles, key],
						};
					});
				}),

			listAll: (_bucket: string) =>
				Effect.gen(function* () {
					const currentState = yield* Ref.get(state);
					return Array.from(currentState.files.keys());
				}),

			computeFileHash: (filePath: string) =>
				Effect.gen(function* () {
					const fs = yield* FileSystem.FileSystem;
					const content = yield* fs.readFile(filePath);
					// Simple mock hash: just use the content length as part of the "hash"
					// In real implementation this would be MD5
					return `mock-hash-${filePath.split("/").pop()}-${content.length}`;
				}),
		});
	});

const MockStorageServiceLive = (initialState?: MockStorageState) =>
	Layer.effect(StorageService, makeMockStorageService(initialState));

// Helper to create mock file system layer
interface MockFileSystemState {
	files: Map<string, Uint8Array>;
}

const createMockFileSystem = (state: MockFileSystemState) => {
	const getFilesInDirectory = (dirPath: string, recursive: boolean) => {
		const files = Array.from(state.files.keys());
		const normalizedDir = dirPath.endsWith("/") ? dirPath : `${dirPath}/`;

		if (recursive) {
			return files
				.filter((f) => f.startsWith(normalizedDir))
				.map((f) => f.slice(normalizedDir.length));
		}
		const immediateChildren = new Set<string>();
		for (const file of files) {
			if (file.startsWith(normalizedDir)) {
				const relative = file.slice(normalizedDir.length);
				const firstPart = relative.split("/")[0];
				if (firstPart) {
					immediateChildren.add(firstPart);
				}
			}
		}
		return Array.from(immediateChildren);
	};

	return FileSystem.layerNoop({
		readDirectory: (path, options) =>
			Effect.succeed(getFilesInDirectory(path, options?.recursive ?? false)),

		readFile: (path) => {
			const content = state.files.get(path);
			if (content) {
				return Effect.succeed(content);
			}
			return Effect.fail(
				new PlatformError.SystemError({
					module: "FileSystem",
					method: "readFile",
					pathOrDescriptor: path,
					description: `File not found: ${path}`,
					reason: "NotFound",
				}),
			);
		},

		readFileString: (path, _encoding) => {
			const content = state.files.get(path);
			if (content) {
				return Effect.succeed(new TextDecoder().decode(content));
			}
			return Effect.fail(
				new PlatformError.SystemError({
					module: "FileSystem",
					method: "readFileString",
					pathOrDescriptor: path,
					description: `File not found: ${path}`,
					reason: "NotFound",
				}),
			);
		},

		stat: (path) => {
			const allPaths = Array.from(state.files.keys());

			// Check if it's a file
			const content = state.files.get(path);
			if (content) {
				return Effect.succeed({
					type: "File" as const,
					size: FileSystem.Size(BigInt(content.length)),
					mtime: Option.some(new Date()),
					atime: Option.some(new Date()),
					birthtime: Option.some(new Date()),
					mtimeMs: Date.now(),
					atimeMs: Date.now(),
					birthtimeMs: Date.now(),
					dev: 0,
					ino: Option.some(0),
					mode: 0o644,
					nlink: Option.some(1),
					uid: Option.some(0),
					gid: Option.some(0),
					rdev: Option.some(0),
					blksize: Option.some(FileSystem.Size(BigInt(4096))),
					blocks: Option.some(0),
				});
			}

			// Check if it's a directory (has children)
			const normalizedPath = path.endsWith("/") ? path : `${path}/`;
			const isDirectory = allPaths.some((p) => p.startsWith(normalizedPath));
			if (isDirectory) {
				return Effect.succeed({
					type: "Directory" as const,
					size: FileSystem.Size(BigInt(0)),
					mtime: Option.some(new Date()),
					atime: Option.some(new Date()),
					birthtime: Option.some(new Date()),
					mtimeMs: Date.now(),
					atimeMs: Date.now(),
					birthtimeMs: Date.now(),
					dev: 0,
					ino: Option.some(0),
					mode: 0o755,
					nlink: Option.some(2),
					uid: Option.some(0),
					gid: Option.some(0),
					rdev: Option.some(0),
					blksize: Option.some(FileSystem.Size(BigInt(4096))),
					blocks: Option.some(0),
				});
			}

			return Effect.fail(
				new PlatformError.SystemError({
					module: "FileSystem",
					method: "stat",
					pathOrDescriptor: path,
					description: `Path not found: ${path}`,
					reason: "NotFound",
				}),
			);
		},

		stream: (path, _options) => {
			const content = state.files.get(path);
			if (content) {
				return Stream.succeed(content);
			}
			return Stream.fail(
				new PlatformError.SystemError({
					module: "FileSystem",
					method: "stream",
					pathOrDescriptor: path,
					description: `File not found: ${path}`,
					reason: "NotFound",
				}),
			);
		},
	});
};

describe("Storage Sync Utils", () => {
	describe("syncFolderToStorage", () => {
		it("should upload new files", async () => {
			const fileSystemState: MockFileSystemState = {
				files: new Map([
					["/test/file1.txt", new TextEncoder().encode("content1")],
					["/test/file2.txt", new TextEncoder().encode("content2")],
				]),
			};

			const testProgram = Effect.gen(function* () {
				const [_duration, [uploads, _deletions]] = yield* syncFolderToStorage({
					folderPath: "/test",
					getBucket: (_fileName) => Effect.succeed("test-bucket"),
					concurrency: 2,
					deleteOrphaned: false,
				});

				// Verify uploads
				const uploadedFiles = Chunk.toArray(uploads) as UploadResult[];
				expect(uploadedFiles).toHaveLength(2);
				expect(uploadedFiles.map((f) => f.fileName).sort()).toEqual([
					"file1.txt",
					"file2.txt",
				]);

				// Verify all files were uploaded
				expect(uploadedFiles.every((f) => f.uploaded)).toBe(true);

				// Verify files are in storage
				const storage = yield* StorageService;
				const remoteFiles = yield* storage.listAll("test-bucket");
				expect(remoteFiles.sort()).toEqual(["file1.txt", "file2.txt"]);
			});

			await Effect.runPromise(
				testProgram.pipe(
					Effect.provide(MockStorageServiceLive()),
					Effect.provide(createMockFileSystem(fileSystemState)),
					Effect.provide(BunContext.layer),
				),
			);
		});

		it("should skip unchanged files", async () => {
			const content = new TextEncoder().encode("content1");
			const fileSystemState: MockFileSystemState = {
				files: new Map([["/test/file1.txt", content]]),
			};

			const testProgram = Effect.gen(function* () {
				// First, upload the file to get the etag that will be generated
				const [_d1, [firstUploads, _del1]] = yield* syncFolderToStorage({
					folderPath: "/test",
					getBucket: (_fileName) => Effect.succeed("test-bucket"),
					concurrency: 1,
					deleteOrphaned: false,
				});

				const firstUploadedFiles = Chunk.toArray(
					firstUploads as Chunk.Chunk<UploadResult>,
				);
				expect(firstUploadedFiles).toHaveLength(1);
				expect(firstUploadedFiles[0]?.fileName).toBe("file1.txt");

				// Now sync again - should not upload anything since file is unchanged
				const [_d2, [secondUploads, _del2]] = yield* syncFolderToStorage({
					folderPath: "/test",
					getBucket: (_fileName) => Effect.succeed("test-bucket"),
					concurrency: 1,
					deleteOrphaned: false,
				});

				const secondUploadedFiles = Chunk.toArray(
					secondUploads as Chunk.Chunk<UploadResult>,
				);
				expect(secondUploadedFiles).toHaveLength(0);
			});

			await Effect.runPromise(
				testProgram.pipe(
					Effect.provide(MockStorageServiceLive()),
					Effect.provide(createMockFileSystem(fileSystemState)),
					Effect.provide(BunContext.layer),
				),
			);
		});

		it("should upload changed files", async () => {
			const oldContent = new TextEncoder().encode("old");
			const newContent = new TextEncoder().encode("new content");

			const fileSystemState: MockFileSystemState = {
				files: new Map([["/test/file1.txt", newContent]]),
			};

			// Pre-populate storage with old version
			const initialStorageState: MockStorageState = {
				files: new Map([
					[
						"file1.txt",
						{
							etag: `mock-hash-file1.txt-${oldContent.length}`,
							body: oldContent,
						},
					],
				]),
				uploadedFiles: [],
				deletedFiles: [],
			};

			const testProgram = Effect.gen(function* () {
				const [_d, [uploads, _del]] = yield* syncFolderToStorage({
					folderPath: "/test",
					getBucket: (_fileName) => Effect.succeed("test-bucket"),
					concurrency: 1,
					deleteOrphaned: false,
				});

				const uploadedFiles = Chunk.toArray(
					uploads as Chunk.Chunk<UploadResult>,
				);
				expect(uploadedFiles).toHaveLength(1);
				expect(uploadedFiles[0]?.fileName).toBe("file1.txt");
				expect(uploadedFiles[0]?.localETag).not.toBe(
					uploadedFiles[0]?.remoteETag,
				);
			});

			await Effect.runPromise(
				testProgram.pipe(
					Effect.provide(MockStorageServiceLive(initialStorageState)),
					Effect.provide(createMockFileSystem(fileSystemState)),
					Effect.provide(BunContext.layer),
				),
			);
		});

		it("should delete orphaned files when enabled", async () => {
			const fileSystemState: MockFileSystemState = {
				files: new Map([
					["/test/exists.txt", new TextEncoder().encode("exists")],
				]),
			};

			// Storage has an extra file that doesn't exist locally
			const initialStorageState: MockStorageState = {
				files: new Map([
					[
						"orphaned.txt",
						{
							etag: "orphaned-etag",
							body: new TextEncoder().encode("orphaned"),
						},
					],
					[
						"exists.txt",
						{
							etag: `mock-hash-exists.txt-6`,
							body: new TextEncoder().encode("exists"),
						},
					],
				]),
				uploadedFiles: [],
				deletedFiles: [],
			};

			const testProgram = Effect.gen(function* () {
				const [_d, [_uploads, deletions]] = yield* syncFolderToStorage({
					folderPath: "/test",
					getBucket: (_fileName) => Effect.succeed("test-bucket"),
					bucketsToClean: ["test-bucket"],
					concurrency: 1,
					deleteOrphaned: true,
				});

				// Verify orphaned file was deleted
				if (deletions === undefined) {
					throw new Error("Expected deletions to be defined");
				}
				const deletedFiles = Chunk.toArray(
					deletions as Chunk.Chunk<DeletionResult>,
				);
				expect(deletedFiles).toHaveLength(1);
				expect(deletedFiles[0]?.fileName).toBe("orphaned.txt");
				expect(deletedFiles[0]?.deleted).toBe(true);

				// Verify only exists.txt remains in storage
				const storage = yield* StorageService;
				const remoteFiles = yield* storage.listAll("test-bucket");
				expect(remoteFiles).toEqual(["exists.txt"]);
			});

			await Effect.runPromise(
				testProgram.pipe(
					Effect.provide(MockStorageServiceLive(initialStorageState)),
					Effect.provide(createMockFileSystem(fileSystemState)),
					Effect.provide(BunContext.layer),
				),
			);
		});

		it("should not delete files when deleteOrphaned is false", async () => {
			const fileSystemState: MockFileSystemState = {
				files: new Map([["/test/new.txt", new TextEncoder().encode("new")]]),
			};

			const initialStorageState: MockStorageState = {
				files: new Map([
					[
						"orphaned.txt",
						{
							etag: "orphaned-etag",
							body: new TextEncoder().encode("orphaned"),
						},
					],
				]),
				uploadedFiles: [],
				deletedFiles: [],
			};

			const testProgram = Effect.gen(function* () {
				yield* syncFolderToStorage({
					folderPath: "/test",
					getBucket: (_fileName) => Effect.succeed("test-bucket"),
					concurrency: 1,
					deleteOrphaned: false,
				});

				// Verify orphaned file still exists
				const storage = yield* StorageService;
				const remoteFiles = yield* storage.listAll("test-bucket");
				expect(remoteFiles.sort()).toEqual(["new.txt", "orphaned.txt"]);
			});

			await Effect.runPromise(
				testProgram.pipe(
					Effect.provide(MockStorageServiceLive(initialStorageState)),
					Effect.provide(createMockFileSystem(fileSystemState)),
					Effect.provide(BunContext.layer),
				),
			);
		});

		it("should handle nested directories", async () => {
			const fileSystemState: MockFileSystemState = {
				files: new Map([
					["/test/root.txt", new TextEncoder().encode("root")],
					["/test/subdir/nested.txt", new TextEncoder().encode("nested")],
				]),
			};

			const testProgram = Effect.gen(function* () {
				const [_d, [uploads, _del]] = yield* syncFolderToStorage({
					folderPath: "/test",
					getBucket: (_fileName) => Effect.succeed("test-bucket"),
					concurrency: 2,
					deleteOrphaned: false,
				});

				const uploadedFiles = Chunk.toArray(
					uploads as Chunk.Chunk<UploadResult>,
				).map((f) => f.fileName);
				expect(uploadedFiles.sort()).toEqual(["root.txt", "subdir/nested.txt"]);
			});

			await Effect.runPromise(
				testProgram.pipe(
					Effect.provide(MockStorageServiceLive()),
					Effect.provide(createMockFileSystem(fileSystemState)),
					Effect.provide(BunContext.layer),
				),
			);
		});

		it("should filter out .DS_Store files", async () => {
			const fileSystemState: MockFileSystemState = {
				files: new Map([
					["/test/real.txt", new TextEncoder().encode("real")],
					["/test/.DS_Store", new TextEncoder().encode("macos")],
				]),
			};

			const testProgram = Effect.gen(function* () {
				const [_d, [uploads, _del]] = yield* syncFolderToStorage({
					folderPath: "/test",
					getBucket: (_fileName) => Effect.succeed("test-bucket"),
					concurrency: 1,
					deleteOrphaned: false,
				});

				const uploadedFiles = Chunk.toArray(
					uploads as Chunk.Chunk<UploadResult>,
				);
				expect(uploadedFiles).toHaveLength(1);
				expect(uploadedFiles[0]?.fileName).toBe("real.txt");
			});

			await Effect.runPromise(
				testProgram.pipe(
					Effect.provide(MockStorageServiceLive()),
					Effect.provide(createMockFileSystem(fileSystemState)),
					Effect.provide(BunContext.layer),
				),
			);
		});

		it("should handle concurrent operations", async () => {
			const fileSystemState: MockFileSystemState = {
				files: new Map(
					Array.from({ length: 10 }, (_, i) => [
						`/test/file${i}.txt`,
						new TextEncoder().encode(`content${i}`),
					]),
				),
			};

			const testProgram = Effect.gen(function* () {
				const [_d, [uploads, _del]] = yield* syncFolderToStorage({
					folderPath: "/test",
					getBucket: (_fileName) => Effect.succeed("test-bucket"),
					concurrency: 5,
					deleteOrphaned: false,
				});

				expect(
					Chunk.toArray(uploads as Chunk.Chunk<UploadResult>),
				).toHaveLength(10);
			});

			await Effect.runPromise(
				testProgram.pipe(
					Effect.provide(MockStorageServiceLive()),
					Effect.provide(createMockFileSystem(fileSystemState)),
					Effect.provide(BunContext.layer),
				),
			);
		});

		it("should handle empty directories", async () => {
			const fileSystemState: MockFileSystemState = {
				files: new Map([]),
			};

			const testProgram = Effect.gen(function* () {
				const [_d, [uploads, _del]] = yield* syncFolderToStorage({
					folderPath: "/test",
					getBucket: (_fileName) => Effect.succeed("test-bucket"),
					concurrency: 1,
					deleteOrphaned: false,
				});

				expect(
					Chunk.toArray(uploads as Chunk.Chunk<UploadResult>),
				).toHaveLength(0);
			});

			await Effect.runPromise(
				testProgram.pipe(
					Effect.provide(MockStorageServiceLive()),
					Effect.provide(createMockFileSystem(fileSystemState)),
					Effect.provide(BunContext.layer),
				),
			);
		});

		it("should correctly compute file hashes for change detection", async () => {
			const content1 = new TextEncoder().encode("content");
			const content2 = new TextEncoder().encode("different");

			const fileSystemState: MockFileSystemState = {
				files: new Map([["/test/file.txt", content2]]),
			};

			const initialStorageState: MockStorageState = {
				files: new Map([
					[
						"file.txt",
						{
							etag: `mock-hash-file.txt-${content1.length}`,
							body: content1,
						},
					],
				]),
				uploadedFiles: [],
				deletedFiles: [],
			};

			const testProgram = Effect.gen(function* () {
				const [_d, [uploads, _del]] = yield* syncFolderToStorage({
					folderPath: "/test",
					getBucket: (_fileName) => Effect.succeed("test-bucket"),
					concurrency: 1,
					deleteOrphaned: false,
				});

				const uploadedFiles = Chunk.toArray(
					uploads as Chunk.Chunk<UploadResult>,
				);
				expect(uploadedFiles).toHaveLength(1);
				// The local and remote etags should be different
				expect(uploadedFiles[0]?.localETag).not.toBe(
					uploadedFiles[0]?.remoteETag,
				);
			});

			await Effect.runPromise(
				testProgram.pipe(
					Effect.provide(MockStorageServiceLive(initialStorageState)),
					Effect.provide(createMockFileSystem(fileSystemState)),
					Effect.provide(BunContext.layer),
				),
			);
		});

		it("should handle multiple files with same content but different names", async () => {
			const content = new TextEncoder().encode("same content");
			const fileSystemState: MockFileSystemState = {
				files: new Map([
					["/test/file1.txt", content],
					["/test/file2.txt", content],
					["/test/file3.txt", content],
				]),
			};

			const testProgram = Effect.gen(function* () {
				const [_d, [uploads, _del]] = yield* syncFolderToStorage({
					folderPath: "/test",
					getBucket: (_fileName) => Effect.succeed("test-bucket"),
					concurrency: 3,
					deleteOrphaned: false,
				});

				const uploadedFiles = Chunk.toArray(
					uploads as Chunk.Chunk<UploadResult>,
				);
				expect(uploadedFiles).toHaveLength(3);

				// Each file should have its own unique key
				const fileNames = uploadedFiles.map((f) => f.fileName).sort();
				expect(fileNames).toEqual(["file1.txt", "file2.txt", "file3.txt"]);
			});

			await Effect.runPromise(
				testProgram.pipe(
					Effect.provide(MockStorageServiceLive()),
					Effect.provide(createMockFileSystem(fileSystemState)),
					Effect.provide(BunContext.layer),
				),
			);
		});

		it("should handle deeply nested directory structures", async () => {
			const fileSystemState: MockFileSystemState = {
				files: new Map([
					["/test/a/b/c/deep.txt", new TextEncoder().encode("deep")],
					["/test/a/sibling.txt", new TextEncoder().encode("sibling")],
					["/test/x/y/z/other.txt", new TextEncoder().encode("other")],
				]),
			};

			const testProgram = Effect.gen(function* () {
				const [_d, [uploads, _del]] = yield* syncFolderToStorage({
					folderPath: "/test",
					getBucket: (_fileName) => Effect.succeed("test-bucket"),
					concurrency: 2,
					deleteOrphaned: false,
				});

				const uploadedFiles = Chunk.toArray(
					uploads as Chunk.Chunk<UploadResult>,
				)
					.map((f) => f.fileName)
					.sort();
				expect(uploadedFiles).toEqual([
					"a/b/c/deep.txt",
					"a/sibling.txt",
					"x/y/z/other.txt",
				]);
			});

			await Effect.runPromise(
				testProgram.pipe(
					Effect.provide(MockStorageServiceLive()),
					Effect.provide(createMockFileSystem(fileSystemState)),
					Effect.provide(BunContext.layer),
				),
			);
		});
	});
});
