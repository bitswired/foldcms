/** biome-ignore-all lint/suspicious/noExplicitAny: library internals */
import { SqlClient } from "@effect/sql";
import type { SqlError } from "@effect/sql/SqlError";
import { Data, Effect, type Predicate, Record, Schema } from "effect";
import type { ReadonlyRecord } from "effect/Record";
import * as Collection from "./collections";

type CollectionAny = Collection.Collection<any, any, any, any, any, any>;

export type CmsConfigAny = CmsConfig<any>;

export type CmsCollectionNames<T extends CmsConfigAny> = T extends CmsConfig<
	infer Collections
>
	? Collections extends CollectionAny
		? Collections["name"]
		: never
	: never;

type LoadedCollections<T extends CmsConfigAny> = {
	[K in CmsCollectionNames<T>]: T extends CmsConfig<infer Collections>
		? Collections extends Collection.Collection<K, any, any, infer TLoaded, any>
			? TLoaded[]
			: never
		: never;
};

type TransformedCollections<T extends CmsConfigAny> = {
	[K in CmsCollectionNames<T>]: T extends CmsConfig<infer Collections>
		? Collections extends Collection.Collection<
				K,
				any,
				any,
				any,
				infer TTransformed
			>
			? TTransformed[]
			: never
		: never;
};

export class CmsConfig<T extends CollectionAny> extends Data.Class<{
	readonly collections: ReadonlyRecord<string, CollectionAny>;
}> {
	add<A extends CollectionAny>(collection: A): CmsConfig<T | A> {
		return new CmsConfig({
			collections: {
				...this.collections,
				[collection.name]: collection,
			},
		});
	}

	load(): Effect.Effect<CmsLoaded<T>, Collection.LoadingError, never> {
		const self = this;
		return Effect.gen(function* () {
			yield* Effect.log("Loading collections");
			const loadedData = yield* Effect.all(
				Record.map(self.collections, (collection) => collection.loader),
			);

			return new CmsLoaded({
				collections: self.collections,
				loadedData: loadedData as LoadedCollections<CmsConfig<T>>,
			});
		});
	}

	init(): Effect.Effect<Cms<T>, never, SqlClient.SqlClient> {
		const self = this;
		return Effect.gen(function* () {
			yield* SqlClient.SqlClient;
			yield* Effect.log("Initialized SQLite database");

			return new Cms({
				collections: self.collections,
			});
		});
	}
}

export class CmsLoaded<T extends CollectionAny> extends Data.Class<{
	readonly collections: ReadonlyRecord<string, CollectionAny>;
	readonly loadedData: ReadonlyRecord<string, any[]>;
}> {
	transform(): Effect.Effect<
		CmsTransformed<T>,
		Collection.TransformationError,
		never
	> {
		const self = this;
		return Effect.gen(function* () {
			yield* Effect.log("Transforming collections");

			const transformedData = yield* Effect.all(
				Record.map(self.loadedData, (items, collectionName) => {
					const collection = self.collections[collectionName];
					if (!collection) {
						return Effect.fail(
							new Collection.TransformationError({
								message: `Collection ${collectionName} not found`,
							}),
						);
					}
					return Effect.forEach(items, (item) => collection.transformer(item));
				}),
			);

			return new CmsTransformed({
				collections: self.collections,
				loadedData: self.loadedData,
				transformedData: transformedData as TransformedCollections<
					CmsConfig<T>
				>,
			});
		});
	}
}

export class CmsTransformed<T extends CollectionAny> extends Data.Class<{
	readonly collections: ReadonlyRecord<string, CollectionAny>;
	readonly loadedData: ReadonlyRecord<string, any>;
	readonly transformedData: ReadonlyRecord<string, any>;
}> {
	validate(): Effect.Effect<
		CmsValidated<T>,
		Collection.ValidationError,
		never
	> {
		const self = this;
		return Effect.gen(function* () {
			yield* Effect.log("Validating collections");
			yield* Effect.all(
				Record.map(self.transformedData, (items, collectionName) => {
					const collection = self.collections[collectionName];
					if (!collection) {
						return Effect.fail(
							new Collection.ValidationError({
								message: `Collection ${collectionName} not found`,
								issues: [`Collection ${collectionName} not found`],
							}),
						);
					}
					return Effect.forEach(items, (item) => collection.validator(item));
				}),
			);

			return new CmsValidated({
				collections: self.collections,
				loadedData: self.loadedData,
				transformedData: self.transformedData,
			});
		});
	}
}

export class CmsValidated<_T extends CollectionAny> extends Data.Class<{
	readonly collections: ReadonlyRecord<string, CollectionAny>;
	readonly loadedData: ReadonlyRecord<string, any[]>;
	readonly transformedData: ReadonlyRecord<string, any[]>;
}> {
	build(): Effect.Effect<void, SqlError, SqlClient.SqlClient> {
		const self = this;
		return Effect.gen(function* () {
			const sql = yield* SqlClient.SqlClient;

			yield* sql`
				CREATE TABLE IF NOT EXISTS entities (
					id TEXT NOT NULL,
					collection TEXT NOT NULL,
					hash TEXT NOT NULL,
					data JSONB NOT NULL,
					created_at INTEGER NOT NULL,
					PRIMARY KEY (collection, id)
				)
			`;
			yield* sql`
				CREATE INDEX IF NOT EXISTS idx_entities_collection 
				ON entities (collection)
			`;

			yield* sql`
				CREATE INDEX IF NOT EXISTS idx_entities_created_at 
				ON entities (created_at)
			`;

			yield* sql`
				CREATE INDEX IF NOT EXISTS idx_entities_hash 
				ON entities (hash)
			`;

			yield* Effect.all(
				Record.toEntries(self.transformedData).map(([collectionName, items]) =>
					Effect.forEach(items, (item) => {
						const now = Date.now();
						const dataJson = JSON.stringify(item);
						const hasher = new Bun.CryptoHasher("sha256");
						hasher.update(dataJson);
						const hash = hasher.digest("hex");

						return sql`
								INSERT INTO entities (id, collection, hash, data, created_at)
								VALUES (${item.id}, ${collectionName}, ${hash}, ${dataJson}, ${now})
							`;
					}),
				),
			);
		});
	}
}

export class Cms<
	T extends CollectionAny,
	U extends CmsConfigAny = CmsConfig<T>,
> extends Data.Class<{
	readonly collections: ReadonlyRecord<string, CollectionAny>;
}> {
	getById<B extends CmsCollectionNames<U>>(
		collection: B,
		id: string,
	): Effect.Effect<GetTransformedTypeByName<U, B>, never, SqlClient.SqlClient> {
		const self = this;
		return Effect.gen(function* () {
			const sql = yield* SqlClient.SqlClient;
			const rows = yield* sql<{
				data: string;
			}>`
				SELECT data FROM entities 
				WHERE collection = ${collection} AND id = ${id}
			`;
			if (rows.length === 0) {
				return yield* Effect.die(
					new Error(
						`Entity with id ${id} not found in collection ${collection}`,
					),
				);
			}

			const data = rows[0]?.data;
			if (!data) {
				return yield* Effect.die(
					new Error(
						`Entity with id ${id} has no data in collection ${collection}`,
					),
				);
			}

			const collectionConfig = self.collections[collection];
			if (!collectionConfig) {
				return yield* Effect.die(
					new Error(`Collection ${collection} not found`),
				);
			}

			const rawData = JSON.parse(data);

			const res = yield* Schema.decodeUnknown(
				collectionConfig.transformedSchema,
			)(rawData);
			return res;
		}) as Effect.Effect<
			GetTransformedTypeByName<U, B>,
			never,
			SqlClient.SqlClient
		>;
	}

	getAll<B extends CmsCollectionNames<U>>(
		collection: B,
	): Effect.Effect<
		GetTransformedTypeByName<U, B>[],
		never,
		SqlClient.SqlClient
	> {
		const self = this;
		return Effect.gen(function* () {
			const sql = yield* SqlClient.SqlClient;
			const rows = yield* sql`
				SELECT data FROM entities 
				WHERE collection = ${collection}
			`;
			const collectionConfig = self.collections[collection];
			if (!collectionConfig) {
				return yield* Effect.die(
					new Error(`Collection ${collection} not found`),
				);
			}
			return yield* Effect.all(
				rows.map((row: any) => {
					const rawData = JSON.parse(row.data);
					return Schema.decodeUnknown(collectionConfig.transformedSchema)(
						rawData,
					);
				}),
			);
		}) as Effect.Effect<
			GetTransformedTypeByName<U, B>[],
			never,
			SqlClient.SqlClient
		>;
	}

	get<B extends CmsCollectionNames<U>>(
		collection: B,
		predicate: Predicate.Predicate<GetTransformedTypeByName<U, B>>,
	): Effect.Effect<
		GetTransformedTypeByName<U, B>[],
		never,
		SqlClient.SqlClient
	> {
		const self = this;
		return Effect.gen(function* () {
			const all = yield* self.getAll(collection);
			return all.filter(predicate);
		});
	}

	loadRelation<
		CollectionName extends CmsCollectionNames<U>,
		FieldName extends Collection.GetRelationFieldNames<
			U["collections"][CollectionName]
		>,
	>(
		collection: CollectionName,
		entity: GetTransformedTypeByName<U, CollectionName>,
		fieldName: FieldName,
	): Effect.Effect<
		InferRelationReturnType<U, CollectionName, FieldName>,
		never,
		SqlClient.SqlClient
	> {
		const self = this;
		return Effect.gen(function* () {
			const sql = yield* SqlClient.SqlClient;
			const collectionConfig = self.collections[collection];
			if (!collectionConfig) {
				return yield* Effect.die(
					new Error(`Collection ${collection} not found`),
				);
			}

			const relationConfig = collectionConfig.relations[fieldName];
			if (!relationConfig) {
				return yield* Effect.die(
					new Error(`Relation ${fieldName.toString()} not found`),
				);
			}

			const targetCollection = relationConfig.target;
			const targetCollectionConfig = self.collections[targetCollection];
			if (!targetCollectionConfig) {
				return yield* Effect.die(
					new Error(`Target collection ${targetCollection} not found`),
				);
			}
			const fieldValue = (entity as any)[relationConfig.field];

			if (!fieldValue) {
				if (relationConfig.type === "single") {
					return null;
				}
				return relationConfig.type === "array" ? [] : {};
			}

			if (relationConfig.type === "single") {
				const rows = yield* sql<{
					data: string;
				}>`
					SELECT data FROM entities 
					WHERE collection = ${targetCollection} AND id = ${fieldValue}
				`;
				const data = rows[0]?.data;
				if (!data) {
					return yield* Effect.die(
						new Error(
							`Related entity with id ${fieldValue} not found in collection ${targetCollection}`,
						),
					);
				}

				const rawData = JSON.parse(data);
				return yield* Schema.decodeUnknown(
					targetCollectionConfig.transformedSchema,
				)(rawData);
			}

			if (relationConfig.type === "array") {
				const ids = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
				if (ids.length === 0) {
					return [];
				}
				const rows = yield* sql`
					SELECT data FROM entities 
					WHERE collection = ${targetCollection} AND id IN ${sql.in(ids)}
				`;
				return yield* Effect.all(
					rows.map((row: any) => {
						const rawData = JSON.parse(row.data);
						return Schema.decodeUnknown(
							targetCollectionConfig.transformedSchema,
						)(rawData);
					}),
				);
			}

			if (relationConfig.type === "map") {
				const result: Record<string, any> = {};
				for (const [key, id] of Object.entries(
					fieldValue as Record<string, string>,
				)) {
					const rows = yield* sql<{
						data: string;
					}>`
						SELECT data FROM entities 
						WHERE collection = ${targetCollection} AND id = ${id}
					`;
					const data = rows[0]?.data;
					if (data) {
						const rawData = JSON.parse(data);
						result[key] = yield* Schema.decodeUnknown(
							targetCollectionConfig.transformedSchema,
						)(rawData);
					}
				}
				return result;
			}

			return yield* Effect.die(
				new Error(`Unknown relation type: ${relationConfig.type}`),
			);
		}) as Effect.Effect<
			InferRelationReturnType<U, CollectionName, FieldName>,
			never,
			SqlClient.SqlClient
		>;
	}
}

export type GetTransformedTypeByName<
	T extends CmsConfigAny,
	K extends string,
> = T extends CmsConfig<infer Collections>
	? Collections extends Collection.Collection<
			infer Name,
			any,
			any,
			any,
			any,
			infer TTransformed
		>
		? Name extends K
			? TTransformed
			: never
		: never
	: never;

// Helper to extract a specific collection from CmsConfig by name
export type GetCollectionFromConfig<
	T extends CmsConfigAny,
	CollectionName extends string,
> = T extends CmsConfig<infer Collections>
	? Collections extends infer U
		? U extends Collection.Collection<CollectionName, any, any, any, any, any>
			? U
			: never
		: never
	: never;

export type InferRelationReturnType<
	TCmsConfig extends CmsConfigAny,
	TCollectionName extends string,
	TFieldName extends Collection.GetRelationNames<
		GetCollectionFromConfig<TCmsConfig, TCollectionName>
	>,
> = GetCollectionFromConfig<
	TCmsConfig,
	TCollectionName
> extends Collection.Collection<any, any, any, any, any, any>
	? Collection.GetRelationFieldTarget<
			GetCollectionFromConfig<TCmsConfig, TCollectionName>,
			TFieldName
		> extends string
		? Collection.GetRelationFieldType<
				GetCollectionFromConfig<TCmsConfig, TCollectionName>,
				TFieldName
			> extends "single"
			? GetTransformedTypeByName<
					TCmsConfig,
					Collection.GetRelationFieldTarget<
						GetCollectionFromConfig<TCmsConfig, TCollectionName>,
						TFieldName
					>
				>
			: Collection.GetRelationFieldType<
						GetCollectionFromConfig<TCmsConfig, TCollectionName>,
						TFieldName
					> extends "array"
				? GetTransformedTypeByName<
						TCmsConfig,
						Collection.GetRelationFieldTarget<
							GetCollectionFromConfig<TCmsConfig, TCollectionName>,
							TFieldName
						>
					>[]
				: Collection.GetRelationFieldType<
							GetCollectionFromConfig<TCmsConfig, TCollectionName>,
							TFieldName
						> extends "map"
					? Record<
							string,
							GetTransformedTypeByName<
								TCmsConfig,
								Collection.GetRelationFieldTarget<
									GetCollectionFromConfig<TCmsConfig, TCollectionName>,
									TFieldName
								>
							>
						>
					: never
		: never
	: never;

export function make() {
	return new CmsConfig<never>({
		collections: {},
	});
}
