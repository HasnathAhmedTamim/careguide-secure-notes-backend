# Assessment Checklist

| Requirement | Location | Verification | Status |
|-------------|----------|--------------|--------|
| Node/Express/TS/Mongo/Mongoose | `package.json`, `src/` | Build + run | Verified |
| Clean modular architecture | `src/modules/*`, middleware, utils | Code review | Verified |
| JWT + bcrypt | `auth.service.ts`, `user.model.ts` | `npm test` auth suite | Verified |
| User CRUD own notes only | `note.service.ts`, `note.routes.ts` | Ownership tests | Verified |
| Admin manage users | `admin.routes.ts` | Authz tests | Verified |
| Admin view all notes | `GET /api/admin/notes` | Authz tests | Verified |
| schema.index() Users | `user.model.ts` | Index tests | Verified |
| schema.index() Notes | `note.model.ts` | Index tests | Verified |
| schema.index() Posts | `post.model.ts` | Index tests | Verified |
| No unnecessary indexes | models + index tests | Count asserted | Verified |
| Group by interests — one aggregate | `user.service.ts` + `GET /api/users/grouped-by-interests` | Aggregation spy test + UI | Verified |
| User posts `$lookup` | `user.service.ts` + `GET /api/users/:id/posts` | Aggregation test + UI | Verified |
| Pagination all lists | `utils/pagination.ts` | Notes/admin/posts tests + APIs | Verified |
| Response shape success/data/pagination | `ApiResponse.ts` | API responses | Verified |
| Zod validation | `*.validation.ts` | Invalid payloads | Verified |
| Helmet/CORS/rate-limit | `app.ts`, `auth.routes.ts` | Code review | Verified |
| Role never trusted from client | `authenticate.ts`, register ignores role | Auth test | Verified |
| Seed via env admin credentials | `src/scripts/seed.ts` | `npm run seed` | Verified |
| Frontend required pages | `frontend/src/pages/*` | Routes in App.tsx | Verified |
| Posts + aggregation UI | Posts / Interests / UserPosts pages | Manual UI | Verified |
| Backend tests | `tests/*` | `npm test` (15 passed) | Verified |
| README indexing explanation | `README.md` | Review | Verified |
| Sample API requests | `README.md` | Review | Verified |
| explain("executionStats") | `npm run explain` | Script present | Verified |
| Health + graceful shutdown | `app.ts`, `server.ts` | Manual | Verified |
| Deployment verified live | — | Deferred (user will deploy) | Deferred |

## Manual verification notes

- Seed accounts: `admin@careguide.test` / `admin123`, `alice@careguide.test` / `user1234`
- Frontend: http://localhost:5173
- API: http://localhost:5000
