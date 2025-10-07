import { createHash } from "node:crypto";
import {
	DeleteObjectCommand,
	HeadObjectCommand,
	ListObjectsV2Command,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { FileSystem, Path } from "@effect/platform";
import { BunContext } from "@effect/platform-bun";
import {
	Config,
	ConfigProvider,
	Console,
	Context,
	Duration,
	Effect,
	Layer,
	Stream,
} from "effect";

// Generic storage service interface
export interface StorageService {
	readonly upload: (
		bucket: string,
		key: string,
		body: Uint8Array,
	) => Effect.Effect<void, Error>;
	readonly getETag: (
		bucket: string,
		key: string,
	) => Effect.Effect<string | null, Error>;
	readonly delete: (bucket: string, key: string) => Effect.Effect<void, Error>;
	readonly listAll: (bucket: string) => Effect.Effect<string[], Error>;
	readonly computeFileHash: (
		filePath: string,
	) => Effect.Effect<string, Error, FileSystem.FileSystem>;
}

// Service tag
export const StorageService = Context.GenericTag<StorageService>(
	"@fold/StorageService",
);

// S3 implementation
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

// Layer for S3 implementation
export const S3StorageServiceLive = Layer.effect(
	StorageService,
	makeS3StorageService,
);

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
