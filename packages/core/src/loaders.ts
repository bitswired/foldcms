import { FileSystem, Path } from "@effect/platform";
import { Config, Data, Effect, pipe, Schema } from "effect";
import { isDocument, parseAllDocuments, parseDocument } from "yaml";
import * as Collections from "./collections";

export type JSONLoaderConfig = Data.TaggedEnum<{
	JSONFiles: {
		folder: string;
	};
	JSONLines: {
		folder: string;
	};
}>;
export const JSONLoaderConfig = Data.taggedEnum<JSONLoaderConfig>();

const collectionsBaseDirectory = Config.string("COLLECTIONS_BASE_DIRECTORY");

// biome-ignore lint/suspicious/noExplicitAny: library internals
type AnyStruct = Schema.Struct<any>;

type LoaderResult<T extends AnyStruct> = Effect.Effect<
	readonly T["Type"][],
	Collections.LoadingError,
	FileSystem.FileSystem | Path.Path | Schema.Schema.Context<T>
>;

export const jsonCollectionLoader = <T extends AnyStruct>(
	schema: T,
	config: JSONLoaderConfig,
): LoaderResult<T> =>
	Effect.gen(function* () {
		const fs = yield* FileSystem.FileSystem;
		const path = yield* Path.Path;
		const baseDir = yield* collectionsBaseDirectory;

		const raws = yield* JSONLoaderConfig.$match(config, {
			JSONFiles: ({ folder }) =>
				pipe(
					fs.readDirectory(path.join(baseDir, folder)),
					Effect.map((files) => files.filter((file) => file.endsWith(".json"))),
					Effect.flatMap((files) =>
						Effect.forEach(files, (file) =>
							fs.readFileString(path.join(baseDir, folder, file)),
						),
					),
					Effect.map((contents) =>
						contents.map((content) => JSON.parse(content)),
					),
				),
			JSONLines: ({ folder }) =>
				pipe(
					fs.readDirectory(path.join(baseDir, folder)),
					Effect.map(
						(files) => files.filter((file) => file.endsWith(".jsonl"))[0],
					),
					Effect.flatMap((file) =>
						file
							? Effect.succeed(file)
							: Effect.fail(new Error("No .jsonl file found")),
					),
					Effect.flatMap((file) =>
						fs.readFileString(path.join(baseDir, folder, file)),
					),
					Effect.map((content) =>
						content.split("\n").filter((line) => line.trim() !== ""),
					),
					Effect.map((lines) => lines.map((line) => JSON.parse(line))),
				),
		});

		const parsed = yield* Schema.decodeUnknown(Schema.Array(schema))(raws);

		return parsed;
	}).pipe(
		Effect.mapError(
			(e) => new Collections.LoadingError({ message: e.message, cause: e }),
		),
	);

export type YAMLLoaderConfig = Data.TaggedEnum<{
	YAMLFiles: {
		folder: string;
	};
	YAMLStream: {
		folder: string;
	};
}>;
export const YAMLLoaderConfig = Data.taggedEnum<YAMLLoaderConfig>();

export const yamlCollectionLoader = <T extends AnyStruct>(
	schema: T,
	config: YAMLLoaderConfig,
): LoaderResult<T> =>
	Effect.gen(function* () {
		const fs = yield* FileSystem.FileSystem;
		const path = yield* Path.Path;
		const baseDir = yield* collectionsBaseDirectory;

		const raws = yield* YAMLLoaderConfig.$match(config, {
			YAMLFiles: ({ folder }) =>
				pipe(
					fs.readDirectory(path.join(baseDir, folder)),
					Effect.map((files) =>
						files.filter(
							(file) => file.endsWith(".yaml") || file.endsWith(".yml"),
						),
					),
					Effect.flatMap((files) =>
						Effect.forEach(files, (file) =>
							fs.readFileString(path.join(baseDir, folder, file)),
						),
					),
					Effect.map((contents) =>
						contents.map((content) => parseDocument(content).toJSON()),
					),
				),
			YAMLStream: ({ folder }) =>
				pipe(
					fs.readDirectory(path.join(baseDir, folder)),
					Effect.map(
						(files) =>
							files.filter(
								(file) => file.endsWith(".yaml") || file.endsWith(".yml"),
							)[0],
					),
					Effect.flatMap((file) =>
						file
							? Effect.succeed(file)
							: Effect.fail(new Error("No .yaml/.yml file found")),
					),
					Effect.flatMap((file) =>
						fs.readFileString(path.join(baseDir, folder, file)),
					),
					Effect.map((content) => parseAllDocuments(content)),
					Effect.map((documents) =>
						documents
							.map((doc) => (isDocument(doc) ? doc.toJSON() : null))
							.filter((doc) => doc !== null),
					),
				),
		});

		const parsed = yield* Schema.decodeUnknown(Schema.Array(schema))(raws);

		return parsed;
	}).pipe(
		Effect.mapError(
			(e) => new Collections.LoadingError({ message: e.message, cause: e }),
		),
	);

export const mdxCollectionLoader = () => {};
