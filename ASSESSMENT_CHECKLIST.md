# Assessment Checklist

| Requirement | Location | Verification | Status |
|-------------|----------|--------------|--------|
| Node/Express/TS/Mongo/Mongoose | `package.json`, `src/` | Build + run | Implemented |
| JWT + bcrypt | `auth.service.ts`, `user.model.ts` | Auth tests | Implemented |
| User CRUD own notes only | `note.service.ts`, `note.routes.ts` | Ownership tests | Implemented |
| Admin manage users | `admin.routes.ts` | Authz tests | Implemented |
| Admin view all notes | `GET /api/admin/notes` | Authz tests | Implemented |
| schema.index() Users | `user.model.ts` | Index tests | Implemented |
| schema.index() Notes | `note.model.ts` | Index tests | Implemented |
| schema.index() Posts | `post.model.ts` | Index tests | Implemented |
| No unnecessary indexes | models + index tests | Count asserted | Implemented |
| Group by interests — one aggregate | `user.service.ts` + `GET /api/users/grouped-by-interests` | Aggregation tests spy | Implemented |
| User posts `$lookup` | `user.service.ts` + `GET /api/users/:id/posts` | Aggregation tests | Implemented |
| Pagination all lists | `utils/pagination.ts` | Notes/admin tests | Implemented |
| Response shape success/data/pagination | `ApiResponse.ts` | API responses | Implemented |
| Zod validation | `*.validation.ts` | Invalid payloads | Implemented |
| Helmet/CORS/rate-limit | `app.ts`, `auth.routes.ts` | Manual inspect | Implemented |
| Role never trusted from client | `authenticate.ts`, register ignores role | Auth test | Implemented |
| Seed via env admin credentials | `src/scripts/seed.ts` | `npm run seed` | Implemented* |
| Frontend pages required | `frontend/src/pages/*` | Manual UI | Implemented |
| Backend tests | `tests/*` | `npm test` | Implemented* |
| README indexing explanation | `README.md` | Review | Implemented |
| Health + graceful shutdown | `app.ts`, `server.ts` | Manual | Implemented |
| Deployment verified live | — | Not deployed in this session | Not verified |

\* Seed/Atlas connection requires Network Access whitelist for your IP. Tests use MongoMemoryServer and do not need Atlas.
