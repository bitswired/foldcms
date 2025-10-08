/** biome-ignore-all lint/suspicious/noExplicitAny: library internals */

import { createHash } from "node:crypto";
import { SqlClient } from "@effect/sql";
import {
	Context,
	Data,
	Duration,
	Effect,
	Layer,
	Logger,
	Option,
	pipe,
	Record,
	Schema,
	Stream,
} from "effect";

/**
 * Error thrown when data loading fails during collection processing.
 *
 * @example
 * ```typescript
 * throw new LoadingError({
 *   message: "Failed to load file",
 *   cause: fileError
 * })
 * ```
 */
export class LoadingError extends Data.TaggedError("LoadingError")<{
	message: string;
	cause?: unknown;
}> {}

/**
 * Error thrown when data transformation fails during collection processing.
 *
 * @example
 * ```typescript
 * throw new TransformationError({
 *   message: "Failed to transform data format",
 *   cause: originalError
 * })
 * ```
 */
export class TransformationError extends Data.TaggedError(
	"TransformationError",
)<{
	message: string;
	cause?: unknown;
}> {}

/**
 * Error thrown when data validation fails during collection processing.
 * Contains detailed information about validation issues.
 *
 * @example
 * ```typescript
 * throw new ValidationError({
 *   message: "Data validation failed",
 *   issues: ["Field 'name' is required", "Field 'age' must be positive"]
 * })
 * ```
 */
export class ValidationError extends Data.TaggedError("ValidationError")<{
	message: string;
	issues: readonly string[];
}> {}

// ===== PURE EFFECT SCHEMA CONSTRAINTS =====

/**
 * Defines the type of relationship between collections.
 * - `single`: One-to-one relationship returning an Option of the target
 * - `array`: One-to-many relationship returning an array of targets
 * - `map`: Key-value mapping relationship returning a Map
 *
 * @example
 * ```typescript
 * const authorRelation: CollectionRelation<"authorId", "authors"> = {
 *   type: "single",
 *   field: "authorId",
 *   target: "authors"
 * };
 * ```
 */
export type CollectionRelation<
	TField extends string = string,
	TTarget extends string = string,
> = {
	readonly type: "single" | "array" | "map";
	readonly field: TField;
	readonly target: TTarget;
};

type AnySchema = Schema.Schema<any, any, never>;

/**
 * Defines a collection with its loading, transformation, and validation pipeline.
 *
 * @template TLoadSchema - Schema for the raw loaded data
 * @template TTransformSchema - Schema for the transformed data
 * @template TRelations - Map of field names to their collection relations
 * @template TLoaderDeps - Dependencies required by the loader
 * @template TTransformerDeps - Dependencies required by the transformer
 * @template TValidatorDeps - Dependencies required by the validator
 *
 * @example
 * ```typescript
 * const postsCollection: Collection<PostLoadSchema, PostSchema, {}, FileSystem> = {
 *   loadingSchema: PostLoadSchema,
 *   transformedSchema: PostSchema,
 *   loader: loadPostsFromFS,
 *   transformer: transformPost,
 *   validator: validatePost,
 *   relations: {}
 * };
 * ```
 */
export interface Collection<
	TLoadSchema extends AnySchema,
	TTransformSchema extends AnySchema,
	TRelations extends Partial<
		Record<keyof Schema.Schema.Type<TTransformSchema>, CollectionRelation>
	>,
	TLoaderDeps,
	TTransformerDeps,
	TValidatorDeps,
> {
	readonly loadingSchema: TLoadSchema;
	readonly transformedSchema: TTransformSchema;
	readonly loader: Stream.Stream<
		Schema.Schema.Type<TLoadSchema>,
		LoadingError,
		TLoaderDeps
	>;
	readonly transformer: (
		data: Schema.Schema.Type<TLoadSchema>,
	) => Effect.Effect<
		Schema.Schema.Type<TTransformSchema>,
		TransformationError,
		TTransformerDeps
	>;
	readonly validator: (
		data: Schema.Schema.Type<TTransformSchema>,
	) => Effect.Effect<void, ValidationError, TValidatorDeps>;
	readonly relations: TRelations;
}

type CollectionAny = Collection<any, any, any, any, any, any>;

/**
 * Type helper for mapping collection names to their collection definitions.
 *
 * @template T - Record mapping collection names to Collection instances
 */
/**
 * Type helper for mapping collection names to their collection definitions.
 *
 * @template T - Record mapping collection names to Collection instances
 */
export type CollectionMap<T extends Record<string, CollectionAny>> = T;

/**
 * Factory function to define collections with type-safe configurations.
 * Provides overloads for different collection configurations.
 *
 * @param config - Configuration object for the collection
 * @returns A fully configured Collection instance
 *
 * @example
 * ```typescript
 * // Simple collection without transformation
 * const users = defineCollection({
 *   loadingSchema: UserSchema,
 *   loader: loadUsersFromFiles
 * });
 *
 * // Collection with transformation
 * const posts = defineCollection({
 *   loadingSchema: RawPostSchema,
 *   transformedSchema: PostSchema,
 *   loader: loadRawPosts,
 *   transformer: transformPost,
 *   validator: validatePost,
 *   relations: {
 *     authorId: { type: "single", field: "authorId", target: "users" }
 *   }
 * });
 * ```
 */
// Overload 1: No transformation (minimal)
export function defineCollection<
	TLoadSchema extends AnySchema,
	const TRelations extends Partial<
		Record<keyof Schema.Schema.Type<TLoadSchema>, CollectionRelation>
	>,
	TLoaderDeps = never,
	TValidatorDeps = never,
>(config: {
	readonly loadingSchema: TLoadSchema;
	readonly loader: Stream.Stream<
		Schema.Schema.Type<TLoadSchema>,
		LoadingError,
		TLoaderDeps
	>;
	readonly relations?: TRelations;
	readonly validator?: (
		data: Schema.Schema.Type<TLoadSchema>,
	) => Effect.Effect<void, ValidationError, TValidatorDeps>;
	readonly transformer?: never;
	readonly transformedSchema?: never;
}): Collection<
	TLoadSchema,
	TLoadSchema,
	TRelations,
	TLoaderDeps,
	never,
	TValidatorDeps
>;

// Overload 2: With transformer but no transformedSchema
export function defineCollection<
	TLoadSchema extends AnySchema,
	const TRelations extends Partial<
		Record<keyof Schema.Schema.Type<TLoadSchema>, CollectionRelation>
	>,
	TLoaderDeps = never,
	TTransformerDeps = never,
	TValidatorDeps = never,
>(config: {
	readonly loadingSchema: TLoadSchema;
	readonly loader: Stream.Stream<
		Schema.Schema.Type<TLoadSchema>,
		LoadingError,
		TLoaderDeps
	>;
	readonly transformer: (
		data: Schema.Schema.Type<TLoadSchema>,
	) => Effect.Effect<
		Schema.Schema.Type<TLoadSchema>,
		TransformationError,
		TTransformerDeps
	>;
	readonly transformedSchema?: never;
	readonly relations?: TRelations;
	readonly validator?: (
		data: Schema.Schema.Type<TLoadSchema>,
	) => Effect.Effect<void, ValidationError, TValidatorDeps>;
}): Collection<
	TLoadSchema,
	TLoadSchema,
	TRelations,
	TLoaderDeps,
	TTransformerDeps,
	TValidatorDeps
>;

// Overload 3: With both transformedSchema and transformer
export function defineCollection<
	TLoadSchema extends AnySchema,
	TTransformSchema extends AnySchema,
	const TRelations extends Partial<
		Record<keyof Schema.Schema.Type<TTransformSchema>, CollectionRelation>
	>,
	TLoaderDeps = never,
	TTransformerDeps = never,
	TValidatorDeps = never,
>(config: {
	readonly loadingSchema: TLoadSchema;
	readonly transformedSchema: TTransformSchema;
	readonly loader: Stream.Stream<
		Schema.Schema.Type<TLoadSchema>,
		LoadingError,
		TLoaderDeps
	>;
	readonly transformer: (
		data: Schema.Schema.Type<TLoadSchema>,
	) => Effect.Effect<
		Schema.Schema.Type<TTransformSchema>,
		TransformationError,
		TTransformerDeps
	>;
	readonly relations?: TRelations;
	readonly validator?: (
		data: Schema.Schema.Type<TTransformSchema>,
	) => Effect.Effect<void, ValidationError, TValidatorDeps>;
}): Collection<
	TLoadSchema,
	TTransformSchema,
	TRelations,
	TLoaderDeps,
	TTransformerDeps,
	TValidatorDeps
>;

// Implementation
export function defineCollection(config: any): any {
	const {
		loadingSchema,
		transformedSchema = loadingSchema,
		loader,
		transformer,
		validator,
		relations = {},
	} = config;

	return {
		loadingSchema,
		transformedSchema,
		loader,
		transformer: transformer ?? ((data: any) => Effect.succeed(data)),
		validator: validator ?? ((_data: any) => Effect.void),
		relations,
	};
}

// CollectionParts helper
type CollectionParts<C> = C extends Collection<
	infer TLoadSchema,
	infer TTransformSchema,
	infer TRelations,
	infer TLoaderDeps,
	infer TTransformerDeps,
	infer TValidatorDeps
>
	? {
			loadingSchema: TLoadSchema;
			transformedSchema: TTransformSchema;
			relations: TRelations;
			loaded: Schema.Schema.Type<TLoadSchema>;
			transformed: Schema.Schema.Type<TTransformSchema>;
			loaderDeps: TLoaderDeps;
			transformerDeps: TTransformerDeps;
			validatorDeps: TValidatorDeps;
		}
	: never;

type RelationAt<Relations, Field> = Field extends keyof Relations
	? Relations[Field]
	: never;

// Helper to map relation type to return shape
type RelationReturnType<Rel, TCollection> = Rel extends CollectionRelation<
	any,
	infer Target
>
	? Target extends keyof TCollection
		? Rel["type"] extends "single"
			? Option.Option<CollectionParts<TCollection[Target]>["transformed"]>
			: Rel["type"] extends "array"
				? readonly CollectionParts<TCollection[Target]>["transformed"][]
				: Rel["type"] extends "map"
					? ReadonlyMap<
							string,
							CollectionParts<TCollection[Target]>["transformed"]
						>
					: never
		: never
	: never;

/**
 * Error thrown when CMS operations fail.
 *
 * @example
 * ```typescript
 * throw new CmsError({
 *   message: "Collection not found",
 *   cause: originalError
 * })
 * ```
 */
class CmsError extends Data.TaggedError("CmsError")<{
	message: string;
	cause?: unknown;
}> {}

/**
 * Core CMS interface that provides type-safe content management operations.
 * Manages collections of typed content with support for relationships.
 *
 * @template TMap - Record mapping collection names to their Collection definitions
 * @template TCollection - The collection map type
 * @template TError - Union of possible error types
 *
 * @example
 * ```typescript
 * const cms: Cms<{ posts: PostCollection, users: UserCollection }> = buildCms({
 *   collections: { posts: postCollection, users: userCollection }
 * });
 *
 * // Get a single item by ID
 * const post = yield* cms.getById("posts", "post-1");
 *
 * // Get all items from a collection
 * const allPosts = yield* cms.getAll("posts");
 *
 * // Load related data
 * const author = yield* cms.loadRelation("posts", post, "authorId");
 * ```
 */
export interface Cms<
	TMap extends Record<string, CollectionAny>,
	TCollection extends CollectionMap<TMap> = CollectionMap<TMap>,
	TError = CmsError | ContentStoreError,
> {
	/** The collection definitions managed by this CMS instance */
	collections: TCollection;

	/**
	 * Retrieves a single item from a collection by its ID.
	 *
	 * @param collectionName - Name of the collection to query
	 * @param id - Unique identifier of the item
	 * @returns Effect yielding an Option containing the item if found
	 */
	getById: <TName extends keyof TCollection>(
		collectionName: TName,
		id: string,
	) => Effect.Effect<
		Option.Option<CollectionParts<TCollection[TName]>["transformed"]>,
		TError
	>;

	/**
	 * Retrieves all items from a collection.
	 *
	 * @param collectionName - Name of the collection to query
	 * @returns Effect yielding an array of all items in the collection
	 */
	getAll: <TName extends keyof TCollection>(
		collectionName: TName,
	) => Effect.Effect<
		readonly CollectionParts<TCollection[TName]>["transformed"][],
		TError
	>;

	/**
	 * Loads related data for a specific field on an item.
	 * Resolves relationships defined in the collection configuration.
	 *
	 * @param sourceCollection - Name of the source collection
	 * @param item - The source item containing the relation field
	 * @param field - The field name that defines the relationship
	 * @returns Effect yielding the related data based on relation type
	 */
	loadRelation: <
		TSourceName extends keyof TCollection,
		TField extends keyof CollectionParts<TCollection[TSourceName]>["relations"],
	>(
		sourceCollection: TSourceName,
		item: CollectionParts<TCollection[TSourceName]>["transformed"],
		field: TField,
	) => Effect.Effect<
		RelationReturnType<
			RelationAt<
				CollectionParts<TCollection[TSourceName]>["relations"],
				TField
			>,
			TCollection
		>,
		TError
	>;
}

/**
 * Builds and initializes all collections in the CMS.
 * This function loads, transforms, validates, and stores all collection data.
 *
 * @template TMap - Record mapping collection names to their Collection definitions
 * @template TCollection - The collection map type
 * @param config - Configuration object containing the collections to build
 * @returns Effect that completes when all collections have been built
 *
 * @example
 * ```typescript
 * const buildEffect = build({
 *   collections: {
 *     posts: postsCollection,
 *     users: usersCollection
 *   }
 * });
 *
 * yield* buildEffect;
 * ```
 */
export const build = <
	TMap extends Record<string, CollectionAny>,
	TCollection extends CollectionMap<TMap> = CollectionMap<TMap>,
>(config: {
	collections: TCollection;
}): Effect.Effect<
	void,
	LoadingError | TransformationError | ValidationError | ContentStoreError,
	| ContentStore
	| {
			[K in keyof TCollection]:
				| CollectionParts<TCollection[K]>["loaderDeps"]
				| CollectionParts<TCollection[K]>["transformerDeps"]
				| CollectionParts<TCollection[K]>["validatorDeps"];
	  }[keyof TCollection]
> =>
	Effect.gen(function* () {
		const contentStore = yield* ContentStore;

		const collectionStreams = Record.map(
			config.collections,
			(collection, key) =>
				pipe(
					collection.loader,
					Stream.mapEffect((item) => collection.transformer(item)),
					Stream.tap((item) => collection.validator(item)),
					Stream.tap((item: any) =>
						contentStore.insert(item.id, key as string, item),
					),
				),
		);

		yield* pipe(
			Record.values(collectionStreams),
			Stream.mergeAll({ concurrency: 1 }),
			Stream.drain,
			Stream.runCollect,
		);
	}).pipe(
		Effect.withSpan("foldcms-build"),
		Effect.timed,
		Effect.tap(([duration]) =>
			Effect.log(`Build completed in ${Duration.toMillis(duration)}ms`),
		),
		Effect.map(([_duration, result]) => result),
		Effect.provide(Logger.pretty),
	);

/**
 * Factory function that creates a Context.Tag for a CMS instance.
 * This tag is used to identify and inject CMS instances in the Effect context.
 *
 * @template TMap - Record mapping collection names to their Collection definitions
 * @template TCollection - The collection map type
 * @returns A Context.Tag for the CMS type
 *
 * @example
 * ```typescript
 * const CmsTag = factory<{ posts: PostCollection }>();
 *
 * // Use in an Effect
 * const getCms = Effect.gen(function* () {
 *   const cms = yield* CmsTag;
 *   return cms;
 * });
 * ```
 */
export const factory = <
	TMap extends Record<string, CollectionAny>,
	TCollection extends CollectionMap<TMap> = CollectionMap<TMap>,
>() => Context.GenericTag<Cms<TMap, TCollection>>("@foldcms/Cms");

/**
 * Creates a CMS instance with its associated Context.Tag and Layer.
 * This is the main factory function for creating a complete CMS setup.
 *
 * @template TMap - Record mapping collection names to their Collection definitions
 * @template TCollection - The collection map type
 * @param config - Configuration object containing the collections to manage
 * @returns Object containing CmsTag for dependency injection and CmsLayer for providing the service
 *
 * @example
 * ```typescript
 * const { CmsTag, CmsLayer } = makeCms({
 *   collections: {
 *     posts: postsCollection,
 *     users: usersCollection
 *   }
 * });
 *
 * // Use in your application
 * const program = Effect.gen(function* () {
 *   const cms = yield* CmsTag;
 *   const posts = yield* cms.getAll("posts");
 *   return posts;
 * }).pipe(Effect.provide(CmsLayer));
 * ```
 */
export const makeCms = <
	TMap extends Record<string, CollectionAny>,
	TCollection extends CollectionMap<TMap> = CollectionMap<TMap>,
>(config: {
	collections: TCollection;
}) => {
	const CmsTag = factory<TMap, TCollection>();

	const CmsLayer = Layer.effect(
		CmsTag,

		Effect.gen(function* () {
			const contentStore = yield* ContentStore;

			const cms: Cms<TMap, TCollection> = {
				collections: config.collections,
				getById: (collectionName, id) =>
					Effect.gen(function* () {
						const collection = config.collections[collectionName];

						if (!collection) {
							return yield* Effect.fail(
								new CmsError({
									message: `Collection ${String(collectionName)} not found`,
								}),
							);
						}

						const schema = collection.transformedSchema;

						const row = yield* contentStore.getById(
							collectionName as string,
							id,
							schema,
						);
						return row;
					}),

				getAll: (collectionName) =>
					Effect.gen(function* () {
						const collection = config.collections[collectionName];
						if (!collection) {
							return yield* Effect.fail(
								new CmsError({
									message: `Collection ${String(collectionName)} not found`,
								}),
							);
						}

						const schema = collection.transformedSchema;

						const rows = yield* contentStore.getAll(
							collectionName as string,
							schema,
						);
						return rows;
					}),

				loadRelation: (sourceCollection, item, field) =>
					Effect.gen(function* () {
						const collection = config.collections[sourceCollection];
						if (!collection) {
							return yield* Effect.fail(
								new CmsError({
									message: `Collection ${String(sourceCollection)} not found`,
								}),
							);
						}

						const relation = collection.relations[field];
						if (!relation) {
							return yield* Effect.fail(
								new CmsError({
									message: `Relation ${String(field)} not found on collection ${String(sourceCollection)}`,
								}),
							);
						}

						const targetCollection = config.collections[relation.target];
						if (!targetCollection) {
							return yield* Effect.fail(
								new CmsError({
									message: `Target collection ${relation.target} not found`,
								}),
							);
						}

						const fieldValue = (item as any)[relation.field];

						if (relation.type === "single") {
							const result = yield* contentStore.getById(
								relation.target,
								fieldValue,
								targetCollection.transformedSchema,
							);
							if (Option.isNone(result)) {
								return yield* Effect.fail(
									new CmsError({
										message: `Related entity not found: ${relation.target}#${fieldValue}`,
									}),
								);
							}
							return result;
						}

						if (relation.type === "array") {
							const ids = fieldValue as string[];
							const results = yield* Effect.all(
								ids.map((id) =>
									pipe(
										contentStore.getById(
											relation.target,
											id,
											targetCollection.transformedSchema,
										),
										Effect.flatMap((opt) =>
											Option.isNone(opt)
												? Effect.fail(
														new CmsError({
															message: `Related entity not found: ${relation.target}#${id}`,
														}),
													)
												: Effect.succeed(opt.value),
										),
									),
								),
							);
							return results;
						}

						if (relation.type === "map") {
							const entries = Object.entries(
								fieldValue as Record<string, string>,
							);
							const results = yield* Effect.all(
								entries.map(([key, id]) =>
									pipe(
										contentStore.getById(
											relation.target,
											id,
											targetCollection.transformedSchema,
										),
										Effect.flatMap((opt) =>
											Option.isNone(opt)
												? Effect.fail(
														new CmsError({
															message: `Related entity not found: ${relation.target}#${id}`,
														}),
													)
												: Effect.succeed([key, opt.value] as const),
										),
									),
								),
							);
							return new Map(results);
						}

						return yield* Effect.fail(
							new CmsError({ message: "Invalid relation type" }),
						);
					}) as any,
			};

			return cms;
		}),
	);

	return {
		CmsTag,
		CmsLayer,
	};
};

/**
 * Error class for content store operations.
 *
 * @example
 * ```typescript
 * throw new ContentStoreError({
 *   message: "Database connection failed",
 *   cause: dbError
 * })
 * ```
 */
class ContentStoreError extends Data.TaggedError("ContentStoreError")<{
	message: string;
	cause?: unknown;
}> {}

/**
 * Internal interface representing a database row.
 * Contains metadata and serialized content data.
 *
 */
interface RowData {
	id: string;
	collection: string;
	hash: string;
	data: string;
	created_at: number;
}

/**
 * Content storage abstraction providing CRUD operations for collections.
 * Handles serialization, hashing, and database operations for content data.
 *
 * @example
 * ```typescript
 * const contentStore = yield* ContentStore;
 *
 * // Insert data
 * yield* contentStore.insert("post-1", "posts", postData);
 *
 * // Retrieve by ID
 * const post = yield* contentStore.getById("posts", "post-1", PostSchema);
 *
 * // Get all items
 * const allPosts = yield* contentStore.getAll("posts", PostSchema);
 * ```
 */
export class ContentStore extends Context.Tag("ContentStore")<
	ContentStore,
	{
		query: <T extends Schema.Struct<any>>(
			sql: string,
			schema: T,
		) => Effect.Effect<readonly T["Type"][], ContentStoreError>;

		insert: <T extends Schema.Struct<any>>(
			id: string,
			collection: string,
			data: T["Type"],
		) => Effect.Effect<void, ContentStoreError, never>;

		getById: <T extends AnySchema>(
			collection: string,
			id: string,
			schema: T,
		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>;

		getAll: <T extends AnySchema>(
			collection: string,
			schema: T,
		) => Effect.Effect<readonly T["Type"][], ContentStoreError>;
	}
>() {}

/**
 * SQL-based implementation of the ContentStore service using Effect SQL.
 * Provides persistent storage for CMS content with SQLite/PostgreSQL/MySQL compatibility.
 *
 * Creates the necessary database tables and indexes for efficient content storage and retrieval.
 * Handles automatic serialization/deserialization of content data with integrity hashing.
 *
 * @example
 * ```typescript
 * import { SqliteClient } from "@effect/sql-sqlite-node";
 *
 * const program = Effect.gen(function* () {
 *   const cms = yield* CmsTag;
 *   const posts = yield* cms.getAll("posts");
 *   return posts;
 * }).pipe(
 *   Effect.provide(CmsLayer),
 *   Effect.provide(SqlContentStore),
 *   Effect.provide(SqliteClient.layer({ filename: "cms.db" }))
 * );
 * ```
 */
export const SqlContentStore = Layer.effect(
	ContentStore,
	Effect.gen(function* () {
		const sql = yield* SqlClient.SqlClient;

		const init = pipe(
			sql`CREATE TABLE IF NOT EXISTS entities (
                    id TEXT NOT NULL,
                    collection TEXT NOT NULL,
                    hash TEXT NOT NULL,
                    data TEXT NOT NULL,
                    created_at INTEGER NOT NULL,
                    PRIMARY KEY (collection, id)
                )`,
			Effect.andThen(
				() => sql`CREATE INDEX IF NOT EXISTS idx_entities_collection 
                    ON entities (collection)`,
			),
			Effect.andThen(
				() => sql`CREATE INDEX IF NOT EXISTS idx_entities_created_at 
                    ON entities (created_at)`,
			),
			Effect.andThen(
				() => sql`CREATE INDEX IF NOT EXISTS idx_entities_hash 
                    ON entities (hash)`,
			),
		);

		yield* init;

		const query = <T extends Schema.Struct<any>>(
			q: string,
			schema: T,
		): Effect.Effect<readonly T["Type"][], ContentStoreError> =>
			pipe(
				sql`${q}`,
				Effect.andThen((result) =>
					Schema.decodeUnknown(Schema.Array(schema))(result),
				),
				Effect.mapError(
					(e) => new ContentStoreError({ message: e.message, cause: e }),
				),
			) as unknown as Effect.Effect<readonly T["Type"][], ContentStoreError>;

		return ContentStore.of({
			query,
			insert: (id, collectionn, data) =>
				Effect.Do.pipe(
					Effect.let("raw", () => JSON.stringify(data)),
					Effect.let("hash", ({ raw }) =>
						createHash("sha256").update(raw).digest("hex"),
					),
					Effect.let("now", () => Date.now()),
					Effect.andThen(
						({ hash, raw, now }) =>
							sql`INSERT OR REPLACE INTO entities (id, collection, hash, data, created_at) 
                            VALUES (${id}, ${collectionn}, ${hash}, ${raw}, ${now})`,
					),
					Effect.mapError(
						(e) => new ContentStoreError({ message: e.message, cause: e }),
					),
				),

			getById: (collection, id, schema) =>
				pipe(
					sql<RowData>`SELECT data FROM entities WHERE collection = ${collection} AND id = ${id}`,
					Effect.flatMap((result) => {
						if (!result[0]) {
							return Effect.succeed(Option.none());
						}
						return pipe(
							Schema.decodeUnknown(schema)(JSON.parse(result[0].data)),
							Effect.map(Option.some),
						);
					}),
					Effect.mapError(
						(e) => new ContentStoreError({ message: e.message, cause: e }),
					),
				),

			getAll: (collection, schema) =>
				pipe(
					sql<RowData>`SELECT data FROM entities WHERE collection = ${collection}`,
					Effect.map((results) => results.map((row) => JSON.parse(row.data))),
					Effect.flatMap((parsed) =>
						// TypeScript can't infer that Schema.Array(schema) preserves the 'never'
						// requirement constraint from AnySchema, even though schema: T extends AnySchema.
						// We cast through unknown to assert that the array schema also has no requirements.
						Schema.decodeUnknown(Schema.Array(schema) as unknown as AnySchema)(
							parsed,
						),
					),
					Effect.mapError(
						(e) => new ContentStoreError({ message: e.message, cause: e }),
					),
				),
		});
	}),
);
