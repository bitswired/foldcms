import { FileSystem } from "@effect/platform";
import { BunContext } from "@effect/platform-bun";
import { SqliteClient } from "@effect/sql-sqlite-bun";
import { afterEach, beforeEach, expect, test } from "bun:test";
import { Effect, pipe, Schema } from "effect";
import { make as makeCms } from "../src/cms";
import { make as makeCollection } from "../src/collections";

// Test collections
const postCollection = makeCollection({
	name: "posts",
	loadingSchema: Schema.Struct({
		id: Schema.String,
		title: Schema.String,
		content: Schema.String,
		publishedAt: Schema.Date,
	}),
	transformedSchema: Schema.Struct({
		id: Schema.String,
		title: Schema.String,
		content: Schema.String,
		publishedAt: Schema.Date,
		tagIds: Schema.Array(Schema.String),
	}),
	loader: Effect.succeed([
		{
			id: "1",
			title: "First Post",
			content: "First content",
			publishedAt: new Date("2024-01-01"),
		},
		{
			id: "2",
			title: "Second Post",
			content: "Second content",
			publishedAt: new Date("2024-01-02"),
		},
	]),
	transformer: (data) =>
		Effect.succeed({
			...data,
			tagIds: ["tag1", "tag2"],
		}),
	validator: (_data) => Effect.void,
	relations: {
		tagIds: {
			type: "array",
			field: "tagIds",
			target: "tags",
		},
	},
});

const tagCollection = makeCollection({
	name: "tags",
	loadingSchema: Schema.Struct({
		id: Schema.String,
		name: Schema.String,
		color: Schema.String,
	}),
	transformedSchema: Schema.Struct({
		id: Schema.String,
		name: Schema.String,
		color: Schema.String,
	}),
	loader: Effect.succeed([
		{
			id: "tag1",
			name: "Technology",
			color: "blue",
		},
		{
			id: "tag2",
			name: "Programming",
			color: "green",
		},
	]),
	transformer: (data) => Effect.succeed(data),
	validator: (_data) => Effect.void,
	relations: {},
});

const testDbPath = "test-cms.db";

const SqlLive = SqliteClient.layer({
	filename: testDbPath,
});
const cleanup = Effect.gen(function* () {
	const fs = yield* FileSystem.FileSystem;
	const shmpath = `${testDbPath}-shm`;
	const walpath = `${testDbPath}-wal`;
	const exists = yield* fs.exists(testDbPath);
	const shmexists = yield* fs.exists(shmpath);
	const walexists = yield* fs.exists(walpath);
	if (exists) {
		yield* fs.remove(testDbPath);
	}
	if (shmexists) {
		yield* fs.remove(shmpath);
	}
	if (walexists) {
		yield* fs.remove(walpath);
	}
	return 3;
});

beforeEach(async () => {
	// Clean up any existing test database using Effect FileSystem
	const _a = await Effect.runPromise(
		cleanup.pipe(Effect.provide(BunContext.layer)),
	);
});

afterEach(async () => {
	// Clean up test database using Effect FileSystem
	await Effect.runPromise(cleanup.pipe(Effect.provide(BunContext.layer)));
});

test("CMS initialization and build process", async () => {
	const cms = makeCms().add(postCollection).add(tagCollection);

	const program = pipe(
		cms.load(),
		Effect.flatMap((loaded) => loaded.transform()),
		Effect.flatMap((transformed) => transformed.validate()),
		Effect.flatMap((validated) => validated.build()),
	);

	const result = await Effect.runPromise(program.pipe(Effect.provide(SqlLive)));

	expect(result).toBeUndefined(); // build() returns void on success
});

test("CMS getById functionality", async () => {
	const cms = makeCms().add(postCollection).add(tagCollection);

	// Build the database first
	const buildProgram = pipe(
		cms.load(),
		Effect.flatMap((loaded) => loaded.transform()),
		Effect.flatMap((transformed) => transformed.validate()),
		Effect.flatMap((validated) => validated.build()),
	);

	await Effect.runPromise(Effect.provide(buildProgram, SqlLive));

	// Test getById
	const testProgram = Effect.gen(function* () {
		const c = yield* cms.init();

		const post = yield* c.getById("posts", "1");

		return post;
	});

	const post = await Effect.runPromise(Effect.provide(testProgram, SqlLive));

	expect(post.id).toBe("1");
	expect(post.title).toBe("First Post");
	expect(post.content).toBe("First content");
	expect(post.publishedAt).toBeInstanceOf(Date);
});

test("CMS getAll functionality", async () => {
	const cms = makeCms().add(postCollection).add(tagCollection);

	// Build the database first
	const buildProgram = pipe(
		cms.load(),
		Effect.flatMap((loaded) => loaded.transform()),
		Effect.flatMap((transformed) => transformed.validate()),
		Effect.flatMap((validated) => validated.build()),
	);

	await Effect.runPromise(Effect.provide(buildProgram, SqlLive));

	// Test getAll
	const testProgram = Effect.gen(function* () {
		const c = yield* cms.init();
		const posts = yield* c.getAll("posts");
		return posts;
	});

	const posts = await Effect.runPromise(Effect.provide(testProgram, SqlLive));

	expect(posts).toHaveLength(2);
	expect(posts[0]?.title).toBe("First Post");
	expect(posts[1]?.title).toBe("Second Post");
});

test("CMS get with predicate functionality", async () => {
	const cms = makeCms().add(postCollection).add(tagCollection);

	// Build the database first
	const buildProgram = pipe(
		cms.load(),
		Effect.flatMap((loaded) => loaded.transform()),
		Effect.flatMap((transformed) => transformed.validate()),
		Effect.flatMap((validated) => validated.build()),
	);

	await Effect.runPromise(Effect.provide(buildProgram, SqlLive));

	// Test get with predicate
	const testProgram = Effect.gen(function* () {
		const c = yield* cms.init();
		const posts = yield* c.get("posts", (post) => post.title.includes("First"));
		return posts;
	});

	const posts = await Effect.runPromise(Effect.provide(testProgram, SqlLive));

	expect(posts).toHaveLength(1);
	expect(posts[0]?.title).toBe("First Post");
});

test("CMS loadRelation functionality", async () => {
	const cms = makeCms().add(postCollection).add(tagCollection);

	// Build the database first
	const buildProgram = pipe(
		cms.load(),
		Effect.flatMap((loaded) => loaded.transform()),
		Effect.flatMap((transformed) => transformed.validate()),
		Effect.flatMap((validated) => validated.build()),
	);

	await Effect.runPromise(Effect.provide(buildProgram, SqlLive));

	// Test loadRelation
	const testProgram = Effect.gen(function* () {
		const c = yield* cms.init();
		const post = yield* c.getById("posts", "1");
		const tags = yield* c.loadRelation("posts", post, "tagIds");
		return tags;
	});

	const tags = await Effect.runPromise(Effect.provide(testProgram, SqlLive));

	expect(Array.isArray(tags)).toBe(true);
	expect(tags).toHaveLength(2);
	expect(tags[0]?.name).toBe("Technology");
	expect(tags[1]?.name).toBe("Programming");
});

test("CMS error handling - non-existent entity", async () => {
	const cms = makeCms().add(postCollection).add(tagCollection);

	// Build the database first
	const buildProgram = pipe(
		cms.load(),
		Effect.flatMap((loaded) => loaded.transform()),
		Effect.flatMap((transformed) => transformed.validate()),
		Effect.flatMap((validated) => validated.build()),
	);

	await Effect.runPromise(Effect.provide(buildProgram, SqlLive));

	// Test error handling
	const testProgram = Effect.gen(function* () {
		const c = yield* cms.init();
		const post = yield* c.getById("posts", "non-existent");
		return post;
	});

	await expect(
		Effect.runPromise(Effect.provide(testProgram, SqlLive)),
	).rejects.toThrow();
});

test("Schema transformation with dates", async () => {
	const cms = makeCms().add(postCollection).add(tagCollection);

	// Build the database first
	const buildProgram = pipe(
		cms.load(),
		Effect.flatMap((loaded) => loaded.transform()),
		Effect.flatMap((transformed) => transformed.validate()),
		Effect.flatMap((validated) => validated.build()),
	);

	await Effect.runPromise(Effect.provide(buildProgram, SqlLive));

	// Test that dates are properly transformed
	const testProgram = Effect.gen(function* () {
		const c = yield* cms.init();
		const post = yield* c.getById("posts", "1");
		return post;
	});

	const post = await Effect.runPromise(Effect.provide(testProgram, SqlLive));

	expect(post.publishedAt).toBeInstanceOf(Date);
	expect(post.publishedAt.getTime()).toBe(new Date("2024-01-01").getTime());
});
