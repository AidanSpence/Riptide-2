# Changes and validation

Prepared 9 November 2026 from the uploaded Riptide project ZIP. This is a review package, not a claim that live AWS deployment has passed. The source archive and original log archive were left unchanged. No commits, pushes, AWS writes or paid API calls were made.

## Main changes

- `.github/workflows/deploy.yml`: case-correct `Deployment` trigger and AWS target; PR validation; PostgreSQL/pgvector integration tests; frontend lint/build; Docker build; OIDC via repository variable; allowlisted source bundle; processed-version wait; environment/version/liveness checks. Does not deploy frontend.
- `Django/Dockerfile`, `start.sh`: replace loopback development server with Gunicorn on 0.0.0.0:8000. Database preparation and collectstatic run before serving. Lowercase `dockerfile` must be removed/renamed in the real repository.
- `config/settings.py`, `.env.example`, `.dockerignore`: environment-driven public URLs and secrets; debug off by default; secure browser cookies; RDS TLS; database-backed cache; request throttling; no environment files included in the image/bundle.
- `middleware.py`: validate a CloudFront origin secret before accepting application requests; only `/health/` is exempt. Authenticated origin traffic is marked HTTPS for Django's browser-facing redirects/cookies. This does not encrypt the upstream HTTP leg.
- `prepare_deployment.py`: advisory lock around initial extensions/schema creation, migrations, shared cache setup, and optional initial music load/clustering. Existing music is not overwritten on normal startup.
- `0001_initial.py`: added the citext extension operation before the initial user table. Existing applied migrations are not replayed; this supports fresh databases. No migration history was deleted or squashed.
- `0012_generationbudget_spotifyoauthstate.py`: additive tables for single-use Spotify OAuth state and the global daily AI-attempt counter. No user/playlist tables are dropped.
- API and services: ownership-checked playlist deletion; corrected export routing, title argument, Spotify track field access and missing-track handling; fixed Spotify reference formatting call; return saved playlist IDs; retain system replies/chat names; expose generation failures without pretending a playlist was generated.
- Bedrock: configurable output limit, bounded SDK retries/connect/read timeouts, stream closure, ignore reasoning blocks when extracting playlist text, report truncated/failed responses.
- Frontend: same-origin API requests in production; tab-scoped token persistence through Spotify redirect and token refresh on reload; consume saved IDs/replies/errors; complete the delete action; remove token logging; fix stale demo-data typing; reset account state by remounting when login changes. No CSS redesign or server-side frontend hosting added.
- `requirements.txt`: UTF-16 to UTF-8 normalization only. Pinned versions were retained. Unused historical dependencies have NOT been aggressively pruned.
- Documentation and packaging script. Original `.env` values, caches, compiled files and nested `.next` build remnants were excluded from the delivered source copy.

## Verification actually completed here

| Check | Result |
| --- | --- |
| Install original pinned Python requirements in isolated venv | Passed |
| `npm ci` against supplied lockfile | Passed |
| Next.js production static export, including TypeScript | Passed |
| ESLint | Passed with one non-blocking native `<img>` thumbnail warning |
| Six database-free backend tests | Passed |
| Django model/migration change detection | No changes detected; database history check unavailable |
| Django deployment checks | No errors; HSTS warning remains |
| Gunicorn boot + local HTTP health request | 200 with `{"status":"ok"}` |
| Direct API request without origin secret | 403 |
| Python compilation, start.sh syntax, workflow YAML and embedded bash syntax | Passed |
| Deployment ZIP structure and exclusions | Checked during packaging |

The workspace could not run the PostgreSQL system service because it cannot switch to the database service user. Docker is also unavailable here. The full suite's database-dependent tests and Docker image build are therefore **not verified locally**. The workflow makes them required before deployment. Syntax/model checks alone do not prove that migrations or initial data loading work on RDS.

The six completed tests cover health without a database, origin-header enforcement, export URL parameters, Spotify context formatting, Bedrock reasoning-block exclusion/stream closure, and truncated-output errors.

The additional database tests prepared for CI cover signup/login/refresh, cross-user chat and playlist isolation, playlist deletion, saved clarifications, visible generation failure with retained user message, global budget persistence after chat deletion, the three-message limit, expired OAuth state and callback replay rejection.

## Still required before launch

- Green GitHub CI against the real pgvector PostgreSQL service and Docker.
- RDS creation/estimate, network rules, extension privileges and actual bootstrap/data load.
- EB instance-profile Bedrock access and an actual DeepSeek request; model availability, output format and latency are account-dependent.
- CloudFront behaviours, origin secret, timeout settings and manual frontend upload.
- Spotify callback registration, permitted test users, reconnection with the export scope and real end-to-end export.
- Review the first deployment's events/logs and monthly forecast.

## Deliberate limits

- This demo uses HTTP from CloudFront to EB. The database remains private and its client connection uses TLS, but DB SSL mode `require` does not verify the server hostname.
- HSTS remains unset while the final CloudFront setup is being verified. Django's security warning is recorded rather than suppressed.
- The browser stores JWTs in sessionStorage; this is not an HttpOnly-cookie auth redesign. Reload refreshes the login; idle access tokens expire after 15 minutes and may require reload/login.
- Generic API throttles are best-effort. The serialized global daily generation counter is the cost guard; it limits calls, not exact dollars. The per-user secondary limit counts saved messages and can be reduced by deleting chats, but deletion does not reset the global counter.
- AI generation remains synchronous. Model timeouts fail visibly. A background queue/polling design would require separate approval if real response times exceed the CloudFront limit.
- Deployment migrations are serialized, but an existing old worker can still be serving while a replacement starts. The added migration is additive; future destructive schema changes need a separate rollout plan.
- On/off automation, a custom domain, full upstream HTTPS and production database-role separation are deferred.
