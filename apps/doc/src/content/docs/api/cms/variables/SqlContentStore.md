---
editUrl: false
next: false
prev: false
title: "SqlContentStore"
---

> `const` **SqlContentStore**: `Layer`\<[`ContentStore`](/api/cms/classes/contentstore/), `SqlError`, `SqlClient`\>

Defined in: [packages/core/src/cms.ts:854](https://github.com/bitswired/foldcms/blob/a5796744336f5646b8ccb4abf3c6d1334a83f443/packages/core/src/cms.ts#L854)

SQL-based implementation of the ContentStore service using Effect SQL.
Provides persistent storage for CMS content with SQLite/PostgreSQL/MySQL compatibility.

Creates the necessary database tables and indexes for efficient content storage and retrieval.
Handles automatic serialization/deserialization of content data with integrity hashing.

## Example

```typescript
import { SqliteClient } from "@effect/sql-sqlite-node";

const program = Effect.gen(function* () {
  const cms = yield* CmsTag;
  const posts = yield* cms.getAll("posts");
  return posts;
}).pipe(
  Effect.provide(CmsLayer),
  Effect.provide(SqlContentStore),
  Effect.provide(SqliteClient.layer({ filename: "cms.db" }))
);
```
