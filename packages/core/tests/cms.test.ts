import { SqliteClient } from "@effect/sql-sqlite-bun";
import { afterEach, beforeEach, expect, test } from "bun:test";
import { Effect, Layer, ManagedRuntime, Option, Schema, Stream } from "effect";
import { build, defineCollection, makeCms, SqlContentStore } from "../src/cms";

// Test schemas
const PostLoadSchema = Schema.Struct({
	id: Schema.String,
	title: Schema.String,
	content: Schema.String,
	publishedAt: Schema.Date,
});

const PostTransformSchema = Schema.Struct({
	id: Schema.String,
	title: Schema.String,
	content: Schema.String,
	publishedAt: Schema.Date,
	tagIds: Schema.Array(Schema.String),
});

const TagSchema = Schema.Struct({
	id: Schema.String,
	name: Schema.String,
	color: Schema.String,
});

// Define collections
const posts = defineCollection({
	loadingSchema: PostLoadSchema,
	transformedSchema: PostTransformSchema,
	loader: Stream.fromIterable([
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

const tags = defineCollection({
	loadingSchema: TagSchema,
	loader: Stream.fromIterable([
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

// Create CMS service
const { CmsTag: Cms, CmsLayer } = makeCms({
	collections: { posts, tags },
});

const SqlLive = SqliteClient.layer({
	filename: ":memory:",
});

// Create the layer that provides everything the CMS needs
const CmsLive = CmsLayer.pipe(
	Layer.provideMerge(SqlContentStore),
	Layer.provide(SqlLive),
);

let TestRuntime = ManagedRuntime.make(CmsLive);

beforeEach(async () => {
	await TestRuntime.dispose();
	TestRuntime = ManagedRuntime.make(CmsLive);
	await TestRuntime.runPromise(
		build({
			collections: { posts, tags },
		}),
	);
});

afterEach(async () => {
	await TestRuntime.dispose();
});

test("CMS initialization and automatic build", async () => {
	// The new implementation automatically loads, transforms, validates and builds
	// during service initialization
	const program = Effect.gen(function* () {
		const cms = yield* Cms;
		return cms;
	});

	const result = await TestRuntime.runPromise(program);

	expect(result).toBeDefined();
	expect(result.collections).toBeDefined();
});

test("CMS getById functionality", async () => {
	const program = Effect.gen(function* () {
		const cms = yield* Cms;
		const postOption = yield* cms.getById("posts", "1");

		// Handle Option type
		if (Option.isNone(postOption)) {
			return yield* Effect.fail(new Error("Post not found"));
		}

		return postOption.value;
	});

	const post = await TestRuntime.runPromise(program);

	expect(post.id).toBe("1");
	expect(post.title).toBe("First Post");
	expect(post.content).toBe("First content");
	expect(post.publishedAt).toBeInstanceOf(Date);
});

test("CMS getAll functionality", async () => {
	const program = Effect.gen(function* () {
		const cms = yield* Cms;
		const posts = yield* cms.getAll("posts");
		return posts;
	});

	const posts = await TestRuntime.runPromise(program);

	expect(posts).toHaveLength(2);
	expect(posts[0]?.title).toBe("First Post");
	expect(posts[1]?.title).toBe("Second Post");
});

test("CMS get with predicate functionality", async () => {
	const program = Effect.gen(function* () {
		const cms = yield* Cms;
		const allPosts = yield* cms.getAll("posts");

		// Filter manually since the new implementation doesn't have a get with predicate
		const filteredPosts = allPosts.filter((post) =>
			post.title.includes("First"),
		);

		return filteredPosts;
	});

	const posts = await TestRuntime.runPromise(program);

	expect(posts).toHaveLength(1);
	expect(posts[0]?.title).toBe("First Post");
});

test("CMS loadRelation functionality", async () => {
	const program = Effect.gen(function* () {
		const cms = yield* Cms;
		const postOption = yield* cms.getById("posts", "1");

		if (Option.isNone(postOption)) {
			return yield* Effect.fail(new Error("Post not found"));
		}

		const post = postOption.value;
		const tags = yield* cms.loadRelation("posts", post, "tagIds");

		return tags;
	});

	const tags = await TestRuntime.runPromise(program);

	expect(Array.isArray(tags)).toBe(true);
	expect(tags).toHaveLength(2);
	expect(tags[0]?.name).toBe("Technology");
	expect(tags[1]?.name).toBe("Programming");
});

test("CMS error handling - non-existent entity", async () => {
	const program = Effect.gen(function* () {
		const cms = yield* Cms;
		const postOption = yield* cms.getById("posts", "non-existent");

		// The new implementation returns Option.none() for missing entities
		// So we should check for that and fail if needed
		if (Option.isNone(postOption)) {
			return yield* Effect.fail(new Error("Entity not found"));
		}

		return postOption.value;
	});

	expect(TestRuntime.runPromise(program)).rejects.toThrow();
});

test("Schema transformation with dates", async () => {
	const program = Effect.gen(function* () {
		const cms = yield* Cms;
		const postOption = yield* cms.getById("posts", "1");

		if (Option.isNone(postOption)) {
			return yield* Effect.fail(new Error("Post not found"));
		}

		return postOption.value;
	});

	const post = await TestRuntime.runPromise(program);

	expect(post.publishedAt).toBeInstanceOf(Date);
	expect(post.publishedAt.getTime()).toBe(new Date("2024-01-01").getTime());
});

test("CMS getAllTags functionality", async () => {
	const program = Effect.gen(function* () {
		const cms = yield* Cms;
		const tags = yield* cms.getAll("tags");
		return tags;
	});

	const tags = await TestRuntime.runPromise(program);

	expect(tags).toHaveLength(2);
	expect(tags[0]?.name).toBe("Technology");
	expect(tags[0]?.color).toBe("blue");
	expect(tags[1]?.name).toBe("Programming");
	expect(tags[1]?.color).toBe("green");
});
