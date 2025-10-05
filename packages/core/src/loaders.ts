import { FileSystem, Path } from "@effect/platform";
import { Effect, pipe, Schema, Stream } from "effect";
import { parseAllDocuments, parseDocument } from "yaml";
import { LoadingError } from "./cms";

// biome-ignore lint/suspicious/noExplicitAny: library internals
type AnyStruct = Schema.Struct<any>;

const streamFiles = (config: {
	baseDir: string;
	folder: string;
	filter: (filename: string) => boolean;
}) =>
	pipe(
		Effect.gen(function* () {
			const fs = yield* FileSystem.FileSystem;
			const path = yield* Path.Path;

			return fs.readDirectory(path.join(config.baseDir, config.folder)).pipe(
				Effect.map((x) => x.filter((file) => config.filter(file))),
				Effect.flatMap((result) => {
					if (result.length === 0) {
						return Effect.fail(
							new LoadingError({
								message: `No JSON files found in directory: ${path.join(config.baseDir, config.folder)}`,
							}),
						);
					}
					return Effect.succeed(result);
				}),
				Stream.fromIterableEffect,
				Stream.mapEffect((file) =>
					fs.readFileString(path.join(config.baseDir, config.folder, file)),
				),
			);
		}),
		Stream.unwrap,
	);

export const jsonFilesLoader = <T extends AnyStruct>(
	schema: T,
	config: { baseDir: string; folder: string },
) =>
	pipe(
		streamFiles({
			...config,
			filter: (filename) => filename.endsWith(".json"),
		}),
		Stream.map((content) => JSON.parse(content)),
		Stream.mapEffect((raw) => Schema.decodeUnknown(schema)(raw)),
		Stream.mapError((e) => new LoadingError({ message: e.message, cause: e })),
	) as Stream.Stream<T["Type"], LoadingError, never>;

export const jsonLinesLoader = <T extends AnyStruct>(
	schema: T,
	config: { baseDir: string; folder: string },
) =>
	pipe(
		streamFiles({
			...config,
			filter: (filename) => filename.endsWith(".jsonl"),
		}),
		Stream.mapConcat((content) =>
			content.split("\n").filter((line) => line.trim() !== ""),
		),
		Stream.map((line) => JSON.parse(line)),
		Stream.mapEffect((raw) => Schema.decodeUnknown(schema)(raw)),
		Stream.mapError((e) => new LoadingError({ message: e.message, cause: e })),
	) as Stream.Stream<T["Type"], LoadingError, never>;

export const yamlFilesLoader = <T extends AnyStruct>(
	schema: T,
	config: { baseDir: string; folder: string },
) =>
	pipe(
		streamFiles({
			...config,
			filter: (filename) =>
				filename.endsWith(".yaml") || filename.endsWith(".yml"),
		}),
		Stream.map((content) => parseDocument(content).toJSON()),
		Stream.mapEffect((raw) => Schema.decodeUnknown(schema)(raw)),
		Stream.mapError((e) => new LoadingError({ message: e.message, cause: e })),
	) as Stream.Stream<T["Type"], LoadingError, never>;

export const yamlStreamLoader = <T extends AnyStruct>(
	_schema: T,
	config: { baseDir: string; folder: string },
) =>
	pipe(
		streamFiles({
			...config,
			filter: (filename) =>
				filename.endsWith(".yaml") || filename.endsWith(".yml"),
		}),
		Stream.mapConcat((content) =>
			parseAllDocuments(content).map((doc) => doc.toJSON()),
		),
		Stream.mapError((e) => new LoadingError({ message: e.message, cause: e })),
	) as Stream.Stream<T["Type"], LoadingError, never>;
