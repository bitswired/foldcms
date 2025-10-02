/** biome-ignore-all lint/suspicious/noExplicitAny: library internals */

import { Data, type Effect, type Schema } from "effect";

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
	readonly target?: TTarget;
};

type AnyStruct = Schema.Struct<any>;

// Now our Collection interface can use schema-level constraints
export class Collection<
	TName extends string = string,
	TLoadSchema extends AnyStruct = AnyStruct,
	TTransformSchema extends AnyStruct = AnyStruct,
	TRelations extends Partial<
		Record<keyof Schema.Schema.Type<TTransformSchema>, CollectionRelation>
		// biome-ignore lint/complexity/noBannedTypes: library internals
	> = {},
	TLoaded = Schema.Schema.Type<TLoadSchema>,
	TTransformed = Schema.Schema.Type<TTransformSchema>,
> extends Data.TaggedClass("Collection")<{
	readonly name: TName;
	readonly loadingSchema: TLoadSchema;
	readonly transformedSchema: TTransformSchema;
	readonly loader: Effect.Effect<readonly TLoaded[], LoadingError, never>;
	readonly transformer: (
		data: TLoaded,
	) => Effect.Effect<TTransformed, TransformationError, never>;
	readonly validator: (
		data: TTransformed,
	) => Effect.Effect<void, ValidationError, never>;
	readonly relations: TRelations;
}> {}

export const make = <
	TName extends string = string,
	TLoadSchema extends Schema.Struct<any> = Schema.Struct<any>,
	TTransformSchema extends Schema.Struct<any> = Schema.Struct<any>,
	const TRelations extends Partial<
		Record<keyof Schema.Schema.Type<TTransformSchema>, CollectionRelation>
		// biome-ignore lint/complexity/noBannedTypes: library internals
	> = {},
	TLoaded = Schema.Schema.Type<TLoadSchema>,
	TTransformed = Schema.Schema.Type<TTransformSchema>,
>(
	collection: Omit<
		Collection<
			TName,
			TLoadSchema,
			TTransformSchema,
			TRelations,
			TLoaded,
			TTransformed
		>,
		"_tag"
	>,
) => {
	return new Collection(collection);
};

export type GetRelationNames<
	T extends Collection<any, any, any, any, any, any>,
> = T extends Collection<any, any, any, infer Relations, any, any>
	? keyof Relations
	: never;

export type GetRelationField<
	T extends Collection<any, any, any, any, any, any>,
	K extends GetRelationNames<T>,
> = T extends Collection<any, any, any, infer Relations, any, any>
	? K extends keyof Relations
		? Relations[K]
		: never
	: never;

// Additional helper for getting relation field names (what you had in cms.ts)
export type GetRelationFieldNames<
	T extends Collection<any, any, any, any, any, any>,
> = GetRelationNames<T>;

export type GetRelationFieldType<
	T extends Collection<any, any, any, any, any, any>,
	K extends GetRelationNames<T>,
> = GetRelationField<T, K> extends CollectionRelation<any, any>
	? GetRelationField<T, K>["type"]
	: never;

// Helper to get the target collection name
export type GetRelationFieldTarget<
	T extends Collection<any, any, any, any, any, any>,
	K extends GetRelationNames<T>,
> = GetRelationField<T, K> extends CollectionRelation<any, infer Target>
	? Target
	: never;
