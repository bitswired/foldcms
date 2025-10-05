import { SqlClient } from "@effect/sql";
import {
	Context,
	Data,
	Effect,
	Layer,
	Option,
	pipe,
	Record,
	Schema,
	Stream,
} from "effect";
import { createHash } from "node:crypto";

export class LoadingError extends Data.TaggedError("LoadingError")<{
	message: string;
	cause?: unknown;
}> {}

export class TransformationError extends Data.TaggedError(
	"TransformationError",
)<{
	message: string;
	cause?: unknown;
}> {}

export class ValidationError extends Data.TaggedError("ValidationError")<{
	message: string;
	issues: readonly string[];
}> {}

// ===== PURE EFFECT SCHEMA CONSTRAINTS =====

// Relation types
export type RelationType = "single" | "array" | "map";

export type CollectionRelation<
	TField extends string = string,
	TTarget extends string = string,
> = {
	readonly type: "single" | "array" | "map";
	readonly field: TField;
	readonly target: TTarget;
};

type AnyStruct = Schema.Struct<any>;

export interface Collection<
	TLoadSchema extends AnyStruct,
	TTransformSchema extends AnyStruct,
	TRelations extends Partial<
		Record<keyof Schema.Schema.Type<TTransformSchema>, CollectionRelation>
	>,
	TLoaderDeps,
	TTransformerDeps,
	TValidatorDeps,
	TLoaded = Schema.Schema.Type<TLoadSchema>,
	TTransformed = Schema.Schema.Type<TTransformSchema>,
> {
	readonly loadingSchema: TLoadSchema;
	readonly transformedSchema: TTransformSchema;
	readonly loader: Stream.Stream<TLoaded, LoadingError, TLoaderDeps>;
	readonly transformer: (
		data: TLoaded,
	) => Effect.Effect<TTransformed, TransformationError, TTransformerDeps>;
	readonly validator: (
		data: TTransformed,
	) => Effect.Effect<void, ValidationError, TValidatorDeps>;
	readonly relations: TRelations;
}

type CollectionAny = Collection<any, any, any, any, any, any, any, any>;

export type CollectionMap<T extends Record<string, CollectionAny>> = T;

// Overload 1: No transformation (minimal)
export function defineCollection<
	TLoadSchema extends AnyStruct,
	const TRelations extends Partial<
		Record<keyof Schema.Schema.Type<TLoadSchema>, CollectionRelation>
	> = {},
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
	readonly transformer?: never; // Explicitly exclude transformer
	readonly transformedSchema?: never; // Explicitly exclude transformedSchema
}): Collection<
	TLoadSchema,
	TLoadSchema,
	TRelations,
	TLoaderDeps,
	never,
	TValidatorDeps
>;

// Overload 2: With transformer but no transformedSchema (transforms within same schema)
export function defineCollection<
	TLoadSchema extends AnyStruct,
	const TRelations extends Partial<
		Record<keyof Schema.Schema.Type<TLoadSchema>, CollectionRelation>
	> = {},
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
	readonly transformedSchema?: never; // Explicitly exclude transformedSchema
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

// Overload 3: With both transformedSchema and transformer (full transformation)
export function defineCollection<
	TLoadSchema extends AnyStruct,
	TTransformSchema extends AnyStruct,
	const TRelations extends Partial<
		Record<keyof Schema.Schema.Type<TTransformSchema>, CollectionRelation>
	> = {},
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

type CollectionParts<C> = C extends Collection<
	infer LS,
	infer TS,
	infer R,
	infer TLoaderDeps,
	infer TTransformerDeps,
	infer TValidatorDeps,
	infer TLoaded,
	infer TTransformed
>
	? {
			loadingSchema: LS;
			transformedSchema: TS;
			relations: R;
			loaded: TLoaded;
			transformed: TTransformed;
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

class CmsError extends Data.TaggedError("CmsError")<{
	message: string;
	cause?: unknown;
}> {}

export interface Cms<
	TMap extends Record<string, CollectionAny>,
	TCollection extends CollectionMap<TMap> = CollectionMap<TMap>,
	TError = CmsError | ContentStoreError,
> {
	collections: TCollection;
	getById: <TName extends keyof TCollection>(
		collectionName: TName,
		id: string,
	) => Effect.Effect<
		Option.Option<CollectionParts<TCollection[TName]>["transformed"]>,
		TError
	>;

	getAll: <TName extends keyof TCollection>(
		collectionName: TName,
	) => Effect.Effect<
		readonly CollectionParts<TCollection[TName]>["transformed"][],
		TError
	>;

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

export const build = <
	TMap extends Record<string, CollectionAny>,
	TCollection extends CollectionMap<TMap> = CollectionMap<TMap>,
>(config: {
	collections: TCollection;
}) =>
	Effect.gen(function* () {
		const contentStore = yield* ContentStore;

		type CollectionDeps<T extends CollectionMap<any>> = {
			[K in keyof T]:
				| CollectionParts<T[K]>["loaderDeps"]
				| CollectionParts<T[K]>["transformerDeps"]
				| CollectionParts<T[K]>["validatorDeps"];
		}[keyof T];

		// Helper type to extract return types from collections
		type CollectionReturns<T extends CollectionMap<any>> = {
			[K in keyof T]: CollectionParts<T[K]>["transformed"];
		}[keyof T];

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
				) as Stream.Stream<
					CollectionReturns<TCollection>,
					LoadingError | TransformationError | ValidationError,
					CollectionDeps<TCollection>
				>,
		);

		yield* pipe(
			Record.values(collectionStreams),
			Stream.mergeAll({ concurrency: 1 }),
			Stream.drain,
			Stream.runCollect,
		);
	});

export const factory = <
	TMap extends Record<string, CollectionAny>,
	TCollection extends CollectionMap<TMap> = CollectionMap<TMap>,
>() => Context.GenericTag<Cms<TMap, TCollection>>("@foldcms/Cms");

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
			yield* Effect.log("kajsndf");

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
						const row = yield* contentStore.getById(
							collectionName as string,
							id,
							collection.transformedSchema,
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
						const rows = yield* contentStore.getAll(
							collectionName as string,
							collection.transformedSchema,
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

class ContentStoreError extends Data.TaggedError("ContentStoreError")<{
	message: string;
	cause?: unknown;
}> {}

interface RowData {
	id: string;
	collection: string;
	hash: string;
	data: string;
	created_at: number;
}

class ContentStore extends Context.Tag("ContentStore")<
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

		getById: <T extends Schema.Struct<any>>(
			collection: string,
			id: string,
			schema: T,
		) => Effect.Effect<Option.Option<T["Type"]>, ContentStoreError>;

		getAll: <T extends Schema.Struct<any>>(
			collection: string,
			schema: T,
		) => Effect.Effect<readonly T["Type"][], ContentStoreError>;
	}
>() {}

export const SqlContentStore = Layer.effect(
	ContentStore,
	Effect.gen(function* () {
		yield* Effect.log("kajsndf");

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
				) as Effect.Effect<
					Option.Option<Schema.Schema.Type<typeof schema>>,
					ContentStoreError
				>,

			getAll: (collection, schema) =>
				pipe(
					sql<RowData>`SELECT data FROM entities WHERE collection = ${collection}`,
					Effect.map((results) => results.map((row) => JSON.parse(row.data))),
					Effect.flatMap((parsed) =>
						Schema.decodeUnknown(Schema.Array(schema))(parsed),
					),
					Effect.mapError(
						(e) => new ContentStoreError({ message: e.message, cause: e }),
					),
				) as Effect.Effect<
					readonly Schema.Schema.Type<typeof schema>[],
					ContentStoreError
				>,
		});
	}),
);
