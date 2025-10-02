import { BunContext } from "@effect/platform-bun";
import { expect, test } from "bun:test";
import { ConfigProvider, Effect, Schema } from "effect";
import * as loaders from "../src/loaders";

const schema = Schema.Struct({
	organization: Schema.String,
	name: Schema.String,
});

const withPathConfig = Effect.withConfigProvider(
	ConfigProvider.fromJson({
		COLLECTIONS_BASE_DIRECTORY: "tests/data",
	}),
);

const expectedData = [
	{ organization: "foldcms", name: "test1" },
	{ organization: "foldcms", name: "test2" },
];

test("loads JSON collection from files", async () => {
	const program = loaders
		.jsonCollectionLoader(
			schema,
			loaders.JSONLoaderConfig.JSONFiles({ folder: "json-files-loader" }),
		)
		.pipe(withPathConfig);

	const res = await Effect.runPromise(
		program.pipe(Effect.provide(BunContext.layer)),
	);

	expect(res).toEqual(expect.arrayContaining(expectedData));
	expect(res).toHaveLength(expectedData.length);
});

test("loads JSON collection from lines file", async () => {
	const program = loaders
		.jsonCollectionLoader(
			schema,
			loaders.JSONLoaderConfig.JSONLines({ folder: "json-lines-loader" }),
		)
		.pipe(withPathConfig);

	const res = await Effect.runPromise(
		program.pipe(Effect.provide(BunContext.layer)),
	);

	expect(res).toEqual(expect.arrayContaining(expectedData));
	expect(res).toHaveLength(expectedData.length);
});

test("loads YAML collection from files", async () => {
	const program = loaders
		.yamlCollectionLoader(
			schema,
			loaders.YAMLLoaderConfig.YAMLFiles({ folder: "yaml-files-loader" }),
		)
		.pipe(withPathConfig);

	const res = await Effect.runPromise(
		program.pipe(Effect.provide(BunContext.layer)),
	);

	expect(res).toEqual(expect.arrayContaining(expectedData));
	expect(res).toHaveLength(expectedData.length);
});

test("loads YAML collection from stream file", async () => {
	const program = loaders
		.yamlCollectionLoader(
			schema,
			loaders.YAMLLoaderConfig.YAMLStream({ folder: "yaml-stream-loader" }),
		)
		.pipe(withPathConfig);

	const res = await Effect.runPromise(
		program.pipe(Effect.provide(BunContext.layer)),
	);

	expect(res).toEqual(expect.arrayContaining(expectedData));
	expect(res).toHaveLength(expectedData.length);
});
