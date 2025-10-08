import { createHash } from "node:crypto";
import {
	DeleteObjectCommand,
	HeadObjectCommand,
	ListObjectsV2Command,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { FileSystem, Path } from "@effect/platform";
import {
	Config,
	Console,
	Context,
	Duration,
	Effect,
	Layer,
	Stream,
} from "effect";

/**
 * Generic storage service interface that provides cloud storage operations.
 * This interface abstracts storage operations to allow for different implementations
 * (S3, R2, etc.) while maintaining a consistent API.
 */
export interface StorageService {
	/**
	 * Uploads a file to the specified bucket with the given key.
	 * @param bucket - The name of the storage bucket
	 * @param key - The unique identifier/path for the file within the bucket
	 * @param body - The file content as a Uint8Array
	 * @returns An Effect that succeeds with void or fails with an Error
	 */
	readonly upload: (
		bucket: string,
		key: string,
		body: Uint8Array,
	) => Effect.Effect<void, Error>;

	/**
	 * Retrieves the ETag (entity tag) for a file in the specified bucket.
	 * ETags are typically used for cache validation and change detection.
	 * @param bucket - The name of the storage bucket
	 * @param key - The unique identifier/path for the file within the bucket
	 * @returns An Effect that succeeds with the ETag string or null if not found, or fails with an Error
	 */
	readonly getETag: (
		bucket: string,
		key: string,
	) => Effect.Effect<string | null, Error>;

	/**
	 * Deletes a file from the specified bucket.
	 * @param bucket - The name of the storage bucket
	 * @param key - The unique identifier/path for the file within the bucket
	 * @returns An Effect that succeeds with void or fails with an Error
	 */
	readonly delete: (bucket: string, key: string) => Effect.Effect<void, Error>;

	/**
	 * Lists all object keys in the specified bucket.
	 * This operation handles pagination automatically to retrieve all objects.
	 * @param bucket - The name of the storage bucket
	 * @returns An Effect that succeeds with an array of all object keys or fails with an Error
	 */
	readonly listAll: (bucket: string) => Effect.Effect<string[], Error>;

	/**
	 * Computes the MD5 hash of a local file.
	 * This is useful for comparing local and remote file versions.
	 * @param filePath - The path to the local file
	 * @returns An Effect that succeeds with the MD5 hash string or fails with an Error, requiring FileSystem
	 */
	readonly computeFileHash: (
		filePath: string,
	) => Effect.Effect<string, Error, FileSystem.FileSystem>;
}

/**
 * Service tag for dependency injection of StorageService.
 * Used with Effect's Context system to provide StorageService instances.
 *
 * @example
 * ```typescript
 * Effect.gen(function* () {
 *   const storage = yield* StorageService;
 *   yield* storage.upload("my-bucket", "file.txt", fileData);
 * });
 * ```
 */
export const StorageService = Context.GenericTag<StorageService>(
	"@fold/StorageService",
);

/**
 * Creates an S3-compatible storage service instance configured for Cloudflare R2.
 * Reads configuration from environment variables and initializes an S3 client.
 *
 * @returns An Effect that produces a StorageService implementation
 * @throws Error if required environment variables are missing
 *
 * @remarks
 * Required environment variables:
 * - S3_ACCOUNT_ID: Cloudflare account ID
 * - S3_ACCESS_KEY_ID: Access key for R2 storage
 * - S3_SECRET_ACCESS_KEY: Secret key for R2 storage
 *
 * @example
 * ```typescript
 * const service = yield* makeS3StorageService;
 * yield* service.upload("my-bucket", "file.txt", fileData);
 * ```
 */
export const makeS3StorageService = Effect.gen(function* () {
	const config = yield* Config.all({
		S3_ACCOUNT_ID: Config.string("S3_ACCOUNT_ID"),
		S3_ACCESS_KEY_ID: Config.string("S3_ACCESS_KEY_ID"),
		S3_SECRET_ACCESS_KEY: Config.string("S3_SECRET_ACCESS_KEY"),
	});

	const s3Client = new S3Client({
		region: "auto",
		endpoint: `https://${config.S3_ACCOUNT_ID}.r2.cloudflarestorage.com`,
		credentials: {
			accessKeyId: config.S3_ACCESS_KEY_ID,
			secretAccessKey: config.S3_SECRET_ACCESS_KEY,
		},
	});

	return StorageService.of({
		upload: (bucket: string, key: string, body: Uint8Array) =>
			Effect.tryPromise({
				try: async () => {
					const command = new PutObjectCommand({
						Bucket: bucket,
						Key: key,
						Body: body,
					});
					await s3Client.send(command);
				},
				catch: (error) => new Error(`Failed to upload ${key}: ${error}`),
			}),

		getETag: (bucket: string, key: string) =>
			Effect.tryPromise({
				try: async () => {
					const command = new HeadObjectCommand({
						Bucket: bucket,
						Key: key,
					});
					const response = await s3Client.send(command);
					return response.ETag?.replace(/"/g, "") ?? null;
				},
				catch: () => null as string | null,
			}).pipe(Effect.catchAll(() => Effect.succeed(null as string | null))),

		delete: (bucket: string, key: string) =>
			Effect.tryPromise({
				try: async () => {
					const command = new DeleteObjectCommand({
						Bucket: bucket,
						Key: key,
					});
					await s3Client.send(command);
				},
				catch: (error) => new Error(`Failed to delete ${key}: ${error}`),
			}),

		listAll: (bucket: string) =>
			Effect.gen(function* () {
				const allKeys: string[] = [];
				let continuationToken: string | undefined;

				do {
					const response = yield* Effect.tryPromise({
						try: async () => {
							const command = new ListObjectsV2Command({
								Bucket: bucket,
								ContinuationToken: continuationToken,
							});
							return await s3Client.send(command);
						},
						catch: (error) => new Error(`Failed to list objects: ${error}`),
					});

					const keys = (response.Contents ?? [])
						.map((obj) => obj.Key)
						.filter((key): key is string => key !== undefined);

					allKeys.push(...keys);
					continuationToken = response.NextContinuationToken;

					yield* Effect.log(
						`Fetched ${keys.length} objects (total: ${allKeys.length})`,
					);
				} while (continuationToken);

				return allKeys;
			}),

		computeFileHash: (filePath: string) =>
			Effect.gen(function* () {
				const fs = yield* FileSystem.FileSystem;
				const hash = createHash("md5");

				yield* fs.stream(filePath).pipe(
					Stream.runForEach((chunk) =>
						Effect.sync(() => {
							hash.update(chunk);
						}),
					),
				);

				return hash.digest("hex");
			}).pipe(
				Effect.mapError(
					(error) => new Error(`Failed to compute hash: ${error}`),
				),
			),
	});
});

/**
 * Effect layer that provides a live implementation of StorageService using S3.
 * This layer can be used to inject the S3 storage service into your Effect application.
 *
 * @example
 * ```typescript
 * const program = Effect.gen(function* () {
 *   const storage = yield* StorageService;
 *   yield* storage.upload("my-bucket", "file.txt", fileData);
 * }).pipe(Effect.provide(S3StorageServiceLive));
 * ```
 */
export const S3StorageServiceLive = Layer.effect(
	StorageService,
	makeS3StorageService,
);

/**
 * Internal utility function that uploads changed files from a local folder to storage buckets.
 * This function compares local file hashes with remote ETags to determine which files need uploading.
 *
 * @internal
 * @param options - Configuration object
 * @param options.folderPath - The local folder path to sync
 * @param options.getBucket - Function that determines which bucket a file should be uploaded to
 * @param options.concurrency - Number of concurrent operations (default: 1)
 * @returns A Stream of upload results for changed files
 */
const uploadChangedToStorage = ({
	folderPath,
	getBucket,
	concurrency = 1,
}: {
	folderPath: string;
	getBucket: (fileName: string) => Effect.Effect<string, Error>;
	concurrency?: number;
}) =>
	Effect.gen(function* () {
		yield* Effect.log("Syncing folder to storage...");

		const fs = yield* FileSystem.FileSystem;
		const path = yield* Path.Path;
		const storage = yield* StorageService;

		const checkStream = fs
			.readDirectory(folderPath, { recursive: true })
			.pipe(Stream.fromIterableEffect)
			.pipe(Stream.filter((file) => !file.includes(".DS_Store")))
			.pipe(
				Stream.filterEffect((file) =>
					Effect.gen(function* () {
						const stat = yield* fs.stat(path.join(folderPath, file));
						return stat.type === "File";
					}),
				),
			)
			.pipe(
				Stream.mapEffect(
					(fileName) =>
						Effect.gen(function* () {
							const fullPath = path.join(folderPath, fileName);
							const bucket = yield* getBucket(fileName);
							const localETag = yield* storage.computeFileHash(fullPath);
							const remoteETag = yield* storage.getETag(bucket, fileName);
							const hasChanged =
								remoteETag === null || localETag !== remoteETag;

							return {
								fileName,
								bucket,
								hasChanged,
								fullPath,
								localETag,
								remoteETag,
							};
						}),
					{ concurrency },
				),
			)
			.pipe(Stream.filter(({ hasChanged }) => hasChanged))
			.pipe(
				Stream.mapEffect(
					({ fileName, bucket, fullPath, localETag, remoteETag }) =>
						Effect.gen(function* () {
							yield* Effect.log(`Uploading ${fileName} to ${bucket}...`);

							const fileContent = yield* fs.readFile(fullPath);
							yield* storage.upload(bucket, fileName, fileContent);

							yield* Effect.log(`Uploaded ${fileName} to ${bucket}`);

							return {
								fileName,
								bucket,
								localETag,
								remoteETag,
								uploaded: true,
							};
						}),
					{ concurrency },
				),
			);

		return checkStream;
	});

/**
 * Internal utility function that deletes orphaned files from storage buckets.
 * This function identifies files that exist in storage but not in the local folder
 * and removes them to keep the buckets synchronized.
 *
 * @internal
 * @param options - Configuration object
 * @param options.folderPath - The local folder path to compare against
 * @param options.buckets - Array of bucket names to clean
 * @param options.concurrency - Number of concurrent operations (default: 1)
 * @returns A Stream of deletion results for orphaned files
 */
const deleteOrphanedFiles = ({
	folderPath,
	buckets,
	concurrency = 1,
}: {
	folderPath: string;
	buckets: string[];
	concurrency?: number;
}) =>
	Effect.gen(function* () {
		yield* Effect.log("Checking for orphaned files...");

		const fs = yield* FileSystem.FileSystem;
		const path = yield* Path.Path;
		const storage = yield* StorageService;

		// Get all local files
		const localFiles = yield* fs
			.readDirectory(folderPath, { recursive: true })
			.pipe(Stream.fromIterableEffect)
			.pipe(Stream.filter((file) => !file.includes(".DS_Store")))
			.pipe(
				Stream.filterEffect((file) =>
					Effect.gen(function* () {
						const stat = yield* fs.stat(path.join(folderPath, file));
						return stat.type === "File";
					}),
				),
			)
			.pipe(Stream.runCollect);

		const localFileSet = new Set(localFiles);

		// Process all buckets and delete orphaned files
		const deleteStream = Stream.fromIterable(buckets)
			.pipe(
				Stream.flatMap((bucket) =>
					Stream.fromIterableEffect(
						Effect.gen(function* () {
							yield* Effect.log(
								`Checking bucket ${bucket} for orphaned files...`,
							);
							const remoteKeys = yield* storage.listAll(bucket);
							return remoteKeys.map((key) => ({ bucket, key }));
						}),
					),
				),
			)
			.pipe(Stream.filter(({ key }) => !localFileSet.has(key)))
			.pipe(
				Stream.mapEffect(
					({ bucket, key }) =>
						Effect.gen(function* () {
							yield* Effect.log(`Deleting ${key} from ${bucket}...`);
							yield* storage.delete(bucket, key);
							yield* Effect.log(`Deleted ${key} from ${bucket}`);

							return {
								bucket,
								fileName: key,
								deleted: true,
							};
						}),
					{ concurrency },
				),
			);

		return deleteStream;
	});

/**
 * Synchronizes a local folder with cloud storage buckets.
 * This function uploads changed files and optionally deletes orphaned files to keep
 * the storage buckets in sync with the local folder structure.
 *
 * @param options - Configuration object for the sync operation
 * @param options.folderPath - The local folder path to synchronize
 * @param options.getBucket - Function that determines which bucket a file should be uploaded to based on filename
 * @param options.bucketsToClean - Array of bucket names to clean of orphaned files (default: [])
 * @param options.concurrency - Number of concurrent operations to run (default: 1)
 * @param options.deleteOrphaned - Whether to delete files that exist in storage but not locally (default: false)
 *
 * @returns An Effect that succeeds with sync results and timing information, or fails with an Error
 *
 * @example
 * ```typescript
 * const syncResult = yield* syncFolderToStorage({
 *   folderPath: "/path/to/local/folder",
 *   getBucket: (fileName) => Effect.succeed(fileName.endsWith('.js') ? 'js-bucket' : 'other-bucket'),
 *   bucketsToClean: ['js-bucket', 'other-bucket'],
 *   concurrency: 3,
 *   deleteOrphaned: true
 * });
 * ```
 */
export const syncFolderToStorage = ({
	folderPath,
	getBucket,
	bucketsToClean = [],
	concurrency = 1,
	deleteOrphaned = false,
}: {
	folderPath: string;
	getBucket: (fileName: string) => Effect.Effect<string, Error>;
	bucketsToClean?: string[];
	concurrency?: number;
	deleteOrphaned?: boolean;
}) =>
	Effect.all(
		[
			uploadChangedToStorage({ folderPath, getBucket, concurrency }).pipe(
				Stream.unwrap,
				Stream.runCollect,
			),
			deleteOrphaned
				? deleteOrphanedFiles({
						folderPath,
						buckets: bucketsToClean,
						concurrency,
					}).pipe(
						Stream.unwrap,
						Stream.tap((x) => Console.log(x)),
						Stream.runCollect,
					)
				: Effect.void,
		],
		{ concurrency: "unbounded" },
	).pipe(
		Effect.timed,
		Effect.tap(([duration, _result]) =>
			Effect.log(`Completed in ${Duration.toMillis(duration)}ms`),
		),
	);
