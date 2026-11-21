# CareGuide Secure Notes — Backend

Production-ready REST API for the CareGuide BD secure note-taking assessment.

## Stack

- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT + bcrypt
- Zod validation, Helmet, CORS, auth rate limiting
- Vitest + Supertest

## Setup

```bash
npm install
cp .env.example .env
# set MONGODB_URI, JWT_SECRET, FRONTEND_URL
npm run seed
npm run dev
```

Production:

```bash
npm run build
npm start
```

## Roles

| Role | Capabilities |
|------|--------------|
| user | Register/login, profile, CRUD **own** notes, create/list public posts, aggregations |
| admin | All user capabilities + `/api/admin/*` user management + view all notes |

Role is always loaded from the database after JWT verification. Public registration cannot set `role: admin`.

## API

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Notes (authenticated)
- `POST /api/notes`
- `GET /api/notes` — own notes only
- `GET /api/notes/:id`
- `PATCH /api/notes/:id` — owner only
- `DELETE /api/notes/:id` — owner only

### Admin
- `GET /api/admin/notes`
- `GET|POST /api/admin/users`
- `GET|PATCH|DELETE /api/admin/users/:id`

### Posts
- `GET|POST /api/posts`

### Aggregations
- `GET /api/users/grouped-by-interests` — **one** `collection.aggregate()`
- `GET /api/users/:id/posts` — single pipeline with `$lookup`

### Health
- `GET /api/health`

List endpoints support `?page=1&limit=10` (default page 1, limit 10, max 100).

Response shape:

```json
{
  "success": true,
  "message": "Notes fetched",
  "data": [],
  "pagination": { "page": 1, "limit": 10, "total": 0, "totalPages": 0 }
}
```

## Schema

**User:** name, email (unique), password (hashed), role, interests[], timestamps  
**Note:** title, content, userId → User, timestamps  
**Post:** title, content, userId → User, timestamps  

## Indexing strategy (why each index exists)

Declared with `schema.index()` only — no speculative indexes.

### Users
| Index | Supports |
|-------|----------|
| `{ email: 1 }` unique | Login + register uniqueness |
| `{ createdAt: -1 }` | Admin paginated user list sorted newest-first |
| `{ interests: 1 }` | `$unwind` / `$group` in grouped-by-interests |

### Notes
| Index | Supports |
|-------|----------|
| `{ userId: 1, createdAt: -1 }` | User own-notes list filter + sort + pagination |
| `{ createdAt: -1 }` | Admin all-notes list (no userId filter). Compound index cannot serve this efficiently |

`_id` default index covers `GET /notes/:id`.

### Posts
| Index | Supports |
|-------|----------|
| `{ userId: 1 }` | `$lookup` join `users._id` → `posts.userId` |

## Aggregation Scenario 1

`GET /api/users/grouped-by-interests`

Exactly one `User.collection.aggregate()`:

1. `$unwind` interests  
2. `$group` by interest, `$push` names  
3. `$sort`

No `find` / `populate` / extra aggregates.

## Aggregation Scenario 2

`GET /api/users/:id/posts`

Single pipeline: `$match` user → `$lookup` posts on `userId` → `$project` (strip password).

Posts.userId index supports the foreign-field join.

## Testing

```bash
npm test
```

Covers auth, ownership/RBAC, notes CRUD + pagination, aggregations (single aggregate / $lookup), and index declarations.

## Deploy (Render)

1. Connect this repo  
2. Build: `npm install && npm run build`  
3. Start: `npm start`  
4. Set env: `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `FRONTEND_URL`, `NODE_ENV=production`  
5. Health check: `/api/health`  

Whitelist your host IP (or `0.0.0.0/0` for demos) in Atlas Network Access.

## Seed accounts

From env (`SEED_ADMIN_*`) plus:

- `alice@careguide.test` / `user1234`
- `bob@careguide.test` / `user1234`
