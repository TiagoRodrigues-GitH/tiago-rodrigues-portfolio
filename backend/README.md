# Portfolio backend

Spring Boot 3.5 (Java 17) API behind the portfolio site
(https://tiagorodrigues-gith.github.io/tiago-rodrigues-portfolio/):

| Endpoint | Access | Purpose |
|---|---|---|
| `GET /api/health` | public | health check (no database access) |
| `POST /api/auth/login` | public, rate limited | e-mail + password → JWT (HS256, scope `ADMIN`, 2 h) |
| `POST /api/analytics/visit` | public | records one page view (IP from the connection) |
| `GET /api/reviews?project=…`, `POST /api/reviews` | public, 5/hour per address | approved comments of a project; submit a comment for moderation |
| `POST /api/contact` | public, 3/hour per address | contact form message (name, e-mail, text) for the owner's inbox |
| `GET /api/admin/analytics/summary?days=30`, `GET /api/admin/analytics/visits?limit=100` | admin | visit statistics for the admin page |
| `GET /api/admin/reviews?status=…`, `PUT /api/admin/reviews/{id}/status`, `DELETE /api/admin/reviews/{id}` | admin | comment moderation |
| `GET /api/admin/messages`, `GET /api/admin/messages/unread`, `PUT /api/admin/messages/{id}/read`, `DELETE /api/admin/messages/{id}` | admin | contact inbox |

The site's project list is static (prerendered, three languages: `frontend/src/app/shared/portfolio-projects.ts`);
the former project CRUD API was removed because the site never read it.

New comments and contact messages can trigger an **e-mail alert** to the owner through Resend's free plan
(`RESEND_API_KEY`, `NOTIFY_EMAIL`); without them, everything still works and the inbox is in the admin page.

## Security model

- **One admin account**, created at start-up from `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH`
  (a BCrypt hash; the plain password is never stored or configured).
- **JWT** signed with `JWT_SECRET` (≥ 32 bytes, Base64 or text). Stateless: no session,
  no cookie, so no CSRF surface. The site keeps the token in `sessionStorage` and drops it
  when it expires.
- **Brute force**: 5 failed logins from one address lock it for 15 minutes (HTTP 429).
  Unknown e-mails and wrong passwords take the same time and get the same answer.
- **CORS** only for `CORS_ALLOWED_ORIGINS`; everything not listed above is denied.
- **Headers**: `Content-Security-Policy: default-src 'none'`, `X-Frame-Options: DENY`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, HSTS.
- **Errors** never return internal messages or stack traces.

## Visit statistics and LGPD

Stored per page view: IP address, user agent, page, language, first-page referrer, screen size,
time zone, a random per-tab visit id. Browsers that send `Sec-GPC: 1` or `DNT: 1` are not
recorded (the site also checks this before sending). Records are deleted after
`ANALYTICS_RETENTION_DAYS` (default 90) by a daily job. The site's privacy page
(`/privacy`) describes this to visitors; review its wording with someone who knows LGPD/GDPR
before relying on it.

## Configuration (environment variables)

| Variable | Required | Example / default |
|---|---|---|
| `ADMIN_EMAIL` | yes (for login) | your address |
| `ADMIN_PASSWORD_HASH` | yes (for login) | output of `htpasswd -bnBC 12 "" 'your-password' \| tr -d ':\n'` |
| `JWT_SECRET` | yes in production | `openssl rand -base64 32` |
| `DATABASE_URL`, `DATABASE_USER`, `DATABASE_PASSWORD` | recommended | `jdbc:postgresql://host:5432/db`; default is in-memory H2 (data lost on restart) |
| `CORS_ALLOWED_ORIGINS` | no | `https://tiagorodrigues-gith.github.io,http://localhost:4200` |
| `ANALYTICS_RETENTION_DAYS` | no | `90` |
| `CONTACT_RETENTION_DAYS`, `CONTACT_MAX_PER_HOUR` | no | `365`, `3` |
| `REVIEW_PROJECTS`, `REVIEW_MAX_PER_HOUR` | no | project keys accepting comments; `5` |
| `RESEND_API_KEY`, `NOTIFY_EMAIL` | no (alerts off when empty) | Resend API key; the Resend account's e-mail address |
| `PORT` | set by the host | `8080` |

## Run and test

```bash
mvn test                      # integration tests: login, rate limit, admin access, visits, CORS, headers
mvn spring-boot:run           # http://localhost:8080 (H2 in memory)
mvn spring-boot:run -Dspring-boot.run.profiles=dev   # local PostgreSQL (application-dev.properties)
```

The `dev` profile reads `PORTFOLIO_DB_URL`, `PORTFOLIO_DB_USER` and `PORTFOLIO_DB_PASSWORD` from the
environment (defaults: `jdbc:postgresql://localhost:5432/portfolio`, user `portfolio`).
The frontend's `npm run start:proxy` forwards `/api` to this server on port 8080.

`scripts/bcrypt-hash.ps1` prints the BCrypt hash for `ADMIN_PASSWORD_HASH` (password typed hidden).

## Deploy (Render + Neon)

Step by step, with the free-tier limits: [`../docs/DEPLOYMENT.md`](../docs/DEPLOYMENT.md).
The repository root has a Render Blueprint (`render.yaml`).

The `Dockerfile` is tuned for the free plan (0.1 CPU, 512 MB): C1 compiler only, serial GC and a CDS
archive recorded at build time. Measured locally with those limits: start-up 216 s → 56 s, ~170 MB RAM.
Free instances sleep when idle, so the first request after a pause waits about a minute; visits sent
during that time are simply lost, which is acceptable for statistics.
