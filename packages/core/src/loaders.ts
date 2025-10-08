import { FileSystem, Path } from "@effect/platform";
import { Effect, pipe, Schema, Stream } from "effect";
import { bundleMDX } from "mdx-bundler";
import { getMDXExport } from "mdx-bundler/client";
import { parseAllDocuments, parseDocument } from "yaml";
import { LoadingError } from "./cms";

// biome-ignore lint/suspicious/noExplicitAny: library internals
type AnyStruct = Schema.Schema<any, any, never>;

type LoaderReturn<T extends AnyStruct> = Stream.Stream<
	T["Type"],
	LoadingError,
	FileSystem.FileSystem | Path.Path
>;

const streamFiles = (config: {
	folder: string;
	filter: (filename: string) => boolean;
}) =>
	pipe(
		Effect.gen(function* () {
			const fs = yield* FileSystem.FileSystem;
			const path = yield* Path.Path;

			return fs.readDirectory(path.join(config.folder)).pipe(
				Effect.map((x) => x.filter((file) => config.filter(file))),
				Effect.flatMap((result) => {
					if (result.length === 0) {
						return Effect.fail(
							new LoadingError({
								message: `No JSON files found in directory: ${path.join(config.folder)}`,
							}),
						);
					}
					return Effect.succeed(result);
				}),
				Stream.fromIterableEffect,
				Stream.mapEffect((file) =>
					fs.readFileString(path.join(config.folder, file)),
				),
			);
		}),
		Stream.unwrap,
	);

/**
 * Loads and parses JSON files from a directory, validating each file against a schema.
 *
 * @template T - The schema type extending AnyStruct
 * @param schema - Effect Schema used to validate and decode the JSON content
 * @param config - Configuration object
 * @param config.folder - Path to the directory containing JSON files
 * @returns A Stream of validated objects matching the schema type
 * @throws {LoadingError} When no JSON files are found, parsing fails, or validation fails
 *
 * @example
 * ```typescript
 * const UserSchema = Schema.Struct({
 *   id: Schema.String,
 *   name: Schema.String,
 * });
 *
 * const users = jsonFilesLoader(UserSchema, { folder: './data/users' });
 * ```
 */
export const jsonFilesLoader = <T extends AnyStruct>(
	schema: T,
	config: { folder: string },
): LoaderReturn<T> =>
	pipe(
		streamFiles({
			...config,
			filter: (filename) => filename.endsWith(".json"),
		}),
		Stream.map((content) => JSON.parse(content)),
		Stream.mapEffect((raw) => Schema.decodeUnknown(schema)(raw)),
		Stream.mapError((e) => new LoadingError({ message: e.message, cause: e })),
	);

/**
 * Loads and parses JSONL (JSON Lines) files from a directory, validating each line against a schema.
 * Each line in the file is treated as a separate JSON object.
 *
 * @template T - The schema type extending AnyStruct
 * @param schema - Effect Schema used to validate and decode each JSON line
 * @param config - Configuration object
 * @param config.folder - Path to the directory containing JSONL files
 * @returns A Stream of validated objects matching the schema type, one per line
 * @throws {LoadingError} When no JSONL files are found, parsing fails, or validation fails
 *
 * @example
 * ```typescript
 * const LogSchema = Schema.Struct({
 *   timestamp: Schema.String,
 *   message: Schema.String,
 * });
 *
 * const logs = jsonLinesLoader(LogSchema, { folder: './logs' });
 * ```
 */
export const jsonLinesLoader = <T extends AnyStruct>(
	schema: T,
	config: { folder: string },
): LoaderReturn<T> =>
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
	);

/**
 * Loads and parses YAML files from a directory, validating each file against a schema.
 * Supports both .yaml and .yml file extensions. Each file is parsed as a single YAML document.
 *
 * @template T - The schema type extending AnyStruct
 * @param schema - Effect Schema used to validate and decode the YAML content
 * @param config - Configuration object
 * @param config.folder - Path to the directory containing YAML files
 * @returns A Stream of validated objects matching the schema type
 * @throws {LoadingError} When no YAML files are found, parsing fails, or validation fails
 *
 * @example
 * ```typescript
 * const ConfigSchema = Schema.Struct({
 *   name: Schema.String,
 *   settings: Schema.Record(Schema.String, Schema.Unknown),
 * });
 *
 * const configs = yamlFilesLoader(ConfigSchema, { folder: './configs' });
 * ```
 */
export const yamlFilesLoader = <T extends AnyStruct>(
	schema: T,
	config: { folder: string },
): LoaderReturn<T> =>
	pipe(
		streamFiles({
			...config,
			filter: (filename) =>
				filename.endsWith(".yaml") || filename.endsWith(".yml"),
		}),
		Stream.map((content) => parseDocument(content).toJSON()),
		Stream.mapEffect((raw) => Schema.decodeUnknown(schema)(raw)),
		Stream.mapError((e) => new LoadingError({ message: e.message, cause: e })),
	);

/**
 * Loads and parses YAML files containing multiple documents, validating each document against a schema.
 * Supports both .yaml and .yml file extensions. Each file can contain multiple YAML documents separated by `---`.
 *
 * @template T - The schema type extending AnyStruct
 * @param schema - Effect Schema used to validate and decode each YAML document
 * @param config - Configuration object
 * @param config.folder - Path to the directory containing YAML files
 * @returns A Stream of validated objects matching the schema type, one per YAML document
 * @throws {LoadingError} When no YAML files are found, parsing fails, or validation fails
 *
 * @example
 * ```typescript
 * const ArticleSchema = Schema.Struct({
 *   title: Schema.String,
 *   content: Schema.String,
 * });
 *
 * // Handles files with multiple YAML documents:
 * // ---
 * // title: "First"
 * // ---
 * // title: "Second"
 * const articles = yamlStreamLoader(ArticleSchema, { folder: './articles' });
 * ```
 */
export const yamlStreamLoader = <T extends AnyStruct>(
	schema: T,
	config: { folder: string },
): LoaderReturn<T> =>
	pipe(
		streamFiles({
			...config,
			filter: (filename) =>
				filename.endsWith(".yaml") || filename.endsWith(".yml"),
		}),
		Stream.mapConcat((content) =>
			parseAllDocuments(content).map((doc) => doc.toJSON()),
		),
		Stream.mapEffect((raw) => Schema.decodeUnknown(schema)(raw)),
		Stream.mapError((e) => new LoadingError({ message: e.message, cause: e })),
	);

/**
 * Loads and processes MDX files from a directory, bundling them and validating against a schema.
 * Extracts frontmatter, compiles MDX to executable code, and optionally captures named exports.
 *
 * @template T - The schema type extending AnyStruct
 * @param schema - Effect Schema used to validate the combined frontmatter and metadata
 * @param config - Configuration object
 * @param config.folder - Path to the directory containing MDX files
 * @param config.bundlerOptions - Options passed to mdx-bundler (excluding 'source' and 'file')
 * @param config.exports - Optional array of export names to extract from the MDX module
 * @returns A Stream of validated objects containing frontmatter and a meta object with mdx code, raw content, and exports
 * @throws {LoadingError} When no MDX files are found, bundling fails, or validation fails
 *
 * @example
 * ```typescript
 * const PostSchema = Schema.Struct({
 *   title: Schema.String,
 *   date: Schema.String,
 *   meta: Schema.Struct({
 *     mdx: Schema.String,
 *     raw: Schema.String,
 *     exports: Schema.Record(Schema.String, Schema.Unknown),
 *   }),
 * });
 *
 * const posts = mdxLoader(PostSchema, {
 *   folder: './content/posts',
 *   bundlerOptions: { cwd: process.cwd() },
 *   exports: ['metadata', 'getStaticProps'],
 * });
 * ```
 */
export const mdxLoader = <T extends AnyStruct>(
	schema: T,
	config: {
		folder: string;
		bundlerOptions: Omit<Parameters<typeof bundleMDX>[0], "source" | "file">;
		exports?: string[];
	},
): LoaderReturn<T> =>
	pipe(
		streamFiles({
			...config,
			filter: (filename) => filename.endsWith(".mdx"),
		}),
		Stream.mapEffect((content) =>
			Effect.gen(function* () {
				const { code, frontmatter } = yield* Effect.tryPromise({
					try: () =>
						bundleMDX({
							source: content,
							...config.bundlerOptions,
						}),
					catch: (e) =>
						new LoadingError({ message: "MDX bundler error", cause: e }),
				});

				const exportsConfig = config.exports;

				let exports: Record<string, unknown> = {};
				if (exportsConfig && exportsConfig.length > 0) {
					const mdxExports = getMDXExport(code);
					exports = Object.keys(mdxExports)
						.filter((key) => key !== "default" && exportsConfig.includes(key))
						.reduce(
							(acc, key) => {
								acc[key] = mdxExports[key];
								return acc;
							},
							{} as Record<string, unknown>,
						);
				}

				return {
					...frontmatter,
					meta: {
						mdx: code,
						raw: content,
						exports,
					},
				};
			}),
		),
		Stream.mapEffect((x) => Schema.decodeUnknown(schema)(x)),
		Stream.mapError((e) => new LoadingError({ message: e.message, cause: e })),
	);
