import { expect, test } from "bun:test";
import { BunContext } from "@effect/platform-bun";
import { Effect, Schema, Stream } from "effect";
import * as loaders from "../src/loaders";

const schema = Schema.Struct({
	organization: Schema.String,
	name: Schema.String,
});

const expectedData = [
	{ organization: "foldcms", name: "test1" },
	{ organization: "foldcms", name: "test2" },
];

test("loads JSON collection from files", async () => {
	const program = loaders
		.jsonFilesLoader(schema, {
			baseDir: "tests/data",
			folder: "json-files-loader",
		})
		.pipe(
			Stream.runCollect,
			Effect.map((chunk) => Array.from(chunk)),
		);

	const res = await Effect.runPromise(
		program.pipe(Effect.provide(BunContext.layer)),
	);

	expect(res).toEqual(expect.arrayContaining(expectedData));
	expect(res).toHaveLength(expectedData.length);
});

test("loads JSON collection from lines file", async () => {
	const program = loaders
		.jsonLinesLoader(schema, {
			baseDir: "tests/data",
			folder: "json-lines-loader",
		})
		.pipe(
			Stream.runCollect,
			Effect.map((chunk) => Array.from(chunk)),
		);

	const res = await Effect.runPromise(
		program.pipe(Effect.provide(BunContext.layer)),
	);

	expect(res).toEqual(expect.arrayContaining(expectedData));
	expect(res).toHaveLength(expectedData.length);
});

test("loads YAML collection from files", async () => {
	const program = loaders
		.yamlFilesLoader(schema, {
			baseDir: "tests/data",
			folder: "yaml-files-loader",
		})
		.pipe(
			Stream.runCollect,
			Effect.map((chunk) => Array.from(chunk)),
		);

	const res = await Effect.runPromise(
		program.pipe(Effect.provide(BunContext.layer)),
	);

	expect(res).toEqual(expect.arrayContaining(expectedData));
	expect(res).toHaveLength(expectedData.length);
});

test("loads YAML collection from stream file", async () => {
	const program = loaders
		.yamlStreamLoader(schema, {
			baseDir: "tests/data",
			folder: "yaml-stream-loader",
		})
		.pipe(
			Stream.runCollect,
			Effect.map((chunk) => Array.from(chunk)),
		);

	const res = await Effect.runPromise(
		program.pipe(Effect.provide(BunContext.layer)),
	);

	expect(res).toEqual(expect.arrayContaining(expectedData));
	expect(res).toHaveLength(expectedData.length);
});

test("loads MDX collection from files", async () => {
	const program = loaders
		.mdxLoader(
			Schema.Struct({
				title: Schema.String,
				slug: Schema.String,
				tags: Schema.Array(Schema.String),
				meta: Schema.Struct({
					raw: Schema.String,
					mdx: Schema.String,
					exports: Schema.Record({
						key: Schema.String,
						value: Schema.Any,
					}),
				}),
			}),
			{
				baseDir: "tests/data",
				folder: "mdx-loader",
				bundlerOptions: {},
				exports: ["data"],
			},
		)
		.pipe(
			Stream.runCollect,
			Effect.map((chunk) => Array.from(chunk)),
		);

	const res = await Effect.runPromise(
		program.pipe(Effect.provide(BunContext.layer)),
	);

	expect(res).toBeArray();
});
