# Architecture

- **api (NestJS + TypeORM + Postgres)**: Hexagonal-lite with Controller → Service → Repository. DTO validation, idempotent create via `Idempotency-Key` header, OpenAPI at `/docs`.
- **web (Next.js App Router)**: simple form + list, client-side fetch. Validation with `zod`. Handles errors/loading.
- **infra**: Dockerfiles per app + docker-compose for local dev; Postgres as a service; health checks.
- **observability**: structured JSON logs can be added easily; `/health` endpoint.
- **security basics**: CORS per origin, rate limiting left as stretch.
