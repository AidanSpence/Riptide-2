# Riptide AWS deployment — review copy

Prepared 9 November 2026. No AWS resources were changed and nothing was pushed to GitHub.

## Agreed setup

- Repository: AidanSpence/Riptide-2; deployment branch: `Deployment` (case matters).
- EB application: `Riptide`; environment: `Riptide2-env`; region: `us-east-1`.
- Existing single-instance Docker EB, x86_64 t3.micro, 20 GB gp3.
- Browser HTTPS to `https://d1caj2u4jm9c3j.cloudfront.net`; CloudFront HTTP to EB.
- Private, separate RDS PostgreSQL 16 with pgvector; Bedrock on demand.
- Frontend stays a static export. Upload it to S3 manually.
- No load balancer, NAT gateway, purchased domain, Redis or separate model server.

This is a temporary university demo configuration. The CloudFront-to-EB connection is not TLS encrypted, including credentials and tokens. The origin header restricts direct access but does not encrypt traffic. Use test accounts and do not reuse important passwords. RDS and Spotify connections use TLS. Browser access remains HTTPS.

## Start here

1. Review `CHANGES_AND_VALIDATION.md` and the source changes before merging.
2. Copy the source from `project/` into a NEW review branch of your existing repository. Compare against any changes you made after the uploaded ZIP. Do not replace newer work blindly.
3. Rename `Django/dockerfile` to `Django/Dockerfile`. On Windows use `git mv Django/dockerfile Django/Dockerfile.tmp` then `git mv Django/Dockerfile.tmp Django/Dockerfile` if needed. Remove the old lowercase tracked file. Keep your real local environment files; they are deliberately absent from this copy.
4. Open a PR targeting `Deployment`. The workflow runs validation without deploying on PRs. **Do not merge until the one-time AWS steps below are complete and CI passes.** A push/merge to `Deployment` deploys automatically.
5. The source archive includes its own `node_modules`-free frontend source; the outer `frontend-static/` directory contains the built files for S3. It is NOT a directory to commit into the source repository.

## 1. Budget and RDS (manual, once)

You reported US$126.69 credits, 140 days remaining, a US$27.41 current monthly forecast and a preferred US$50 monthly ceiling. The forecast does not include this new database or future Bedrock usage. Confirm the database estimate before clicking Create. Budget alerts are notifications, not a hard spending cap.

In RDS, choose standard PostgreSQL creation in N. Virginia:

- PostgreSQL 16, a currently supported minor version that provides pgvector; not Aurora.
- Dev/Test, Single-AZ DB instance; no Multi-AZ cluster.
- Start with `db.t4g.micro` if offered by your plan, otherwise compare the smallest available class. RDS being ARM does not conflict with x86 EB: they communicate over PostgreSQL's network protocol.
- 20 GiB gp3; turn off storage autoscaling for this fixed-size demo unless you intentionally budget for it.
- Initial database name `riptide`; record the master username and password privately.
- Same VPC as EB. A DB subnet group needs subnets in at least two availability zones, even for Single-AZ. Use the private database subnets.
- Public access **No**. RDS security group inbound TCP 5432 **from the EB instance security group**, not from the internet. EB must have outbound access to that group/port. VPC DNS resolution must work.
- Keep it separate from EB's environment lifecycle. Do not attach a disposable EB-managed database.
- Short automated backup retention (for example 1 day), no optional paid monitoring additions. Review the console's full estimate.

For this disposable demo, the configured DB account bootstraps schemas/extensions and runs migrations. It needs permission to create `citext`, `vector`, and schemas. An RDS master account normally has the necessary RDS privileges. A long-lived production service should split migration and runtime roles; that is outside this temporary setup.

The application startup creates the extensions before the first user table, applies migrations and creates a shared cache table. With `BOOTSTRAP_MUSIC=1`, it loads `data/clean_merged.csv` only when the song table is empty, and builds clusters if none exist. Later deploys preserve populated data. Do not manually rerun the raw `music.sql` against an already-migrated database. First startup is slower than later startups.

## 2. EB instance permissions and Bedrock (manual, once)

The EB **EC2 instance profile** needs Bedrock inference permission. This is not the GitHub Actions deployment role. Do not place AWS access keys in Django or GitHub for runtime inference.

Use Bedrock in `us-east-1`, confirm the model is available to your Free plan/account, and make a small playground request using the US DeepSeek-R1 inference profile `us.deepseek.r1-v1:0`. Do not choose provisioned throughput, a dedicated endpoint or a Marketplace deployment.

For the chosen profile, permit `bedrock:InvokeModel` and `bedrock:InvokeModelWithResponseStream` on its inference-profile ARN and the model ARNs in its destination regions. Inspect the profile in the console rather than guessing ARNs. Cross-region inference can require permissions in us-east-1, us-east-2 and us-west-2. Keep scope to the selected model/profile.

If the Free plan blocks the model, stop and review the account restriction before upgrading the plan or provisioning something else. No paid-plan upgrade is assumed by these files.

Django reads `LLM_PROVIDER=bedrock`, `AWS_REGION=us-east-1`, `BEDROCK_MODEL_ID=us.deepseek.r1-v1:0`. `BEDROCK_MAX_TOKENS=4096` includes the model's output budget; reasoning can consume it. Truncation becomes a visible generation failure. The exact prompt, model response format and latency still need a live smoke test.

## 3. EB environment variables (manual, once)

Use `Django/.env.example` as the checklist. Add values in EB Configuration → Updates, monitoring and logging → Runtime environment variables (console labels can vary). Do not upload your real `.env` files.

Generate two DIFFERENT random secrets locally, for example by running `python -c "import secrets; print(secrets.token_urlsafe(64))"` twice:

- `SECRET_KEY`: stable Django signing key, at least 50 characters.
- `CLOUDFRONT_ORIGIN_SECRET`: separate random header value shared only with your CloudFront origin configuration.

Supply the private RDS endpoint and actual DB credentials, the Spotify client ID/secret, and the example's public URLs. Do not leave placeholder values. EB environment variables persist across application deployments. Secrets Manager/Parameter Store references are optional; this guide does not require another paid service.

`DJANGO_DEBUG=0`, `DB_SSLMODE=require`, `WEB_CONCURRENCY=1` are the initial production values. Database `require` encrypts the connection but does not verify the RDS hostname/certificate; stronger verification can be added with the RDS CA bundle later.

The daily global AI limit defaults to **10 attempted generations**, with a secondary per-user limit of **5 saved user messages per UTC day**. The global counter survives chat deletion and is reserved transactionally before calling the model. Failed calls consume attempts; the per-user count is based on retained messages and is not an independent billing cap. Set the global limit to `0` to disable new AI calls. These are request limits, not exact dollar limits. Changing an EB variable can restart the application.

The default SMTP backend is unused: no email verification/password-reset service has been added. Authentication remains username/password + JWT. Access tokens expire after 15 minutes; reloading the page refreshes a valid saved login. Automatic mid-session token refresh is not implemented. Tokens are stored in tab-scoped sessionStorage for the Spotify round trip; they remain accessible to JavaScript.

## 4. CloudFront (manual, once)

Keep the existing S3 origin for static files. Use the S3 REST origin with Origin Access Control and a bucket policy restricted to this distribution. Block public S3 access. Set default root object `index.html`.

Add an EB custom origin:

- Origin domain: `riptide2-env.eba-kq3mbgdd.us-east-1.elasticbeanstalk.com` (no scheme or path).
- Origin protocol: **HTTP only**, port 80.
- Origin custom header: `X-Riptide-Origin`, value exactly equal to `CLOUDFRONT_ORIGIN_SECRET` in EB.
- Response/read timeout: 120 seconds if your console/quota permits. If a response-completion timeout is enabled, it must also allow that long. DeepSeek can take longer than the default 30 seconds. If the account does not permit the timeout, stop and report that limit; do not silently accept repeated 504 errors.

Add these behaviours ABOVE the S3 default:

| Path | Origin | Methods | Cache policy | Origin request policy |
| --- | --- | --- | --- | --- |
| `/api/*` | EB | All seven supported methods | Managed `CachingDisabled` | Managed `AllViewerExceptHostHeader` |
| `/spotify/*` | EB | All seven supported methods | Managed `CachingDisabled` | Managed `AllViewerExceptHostHeader` |
| `/admin/*` (if needed) | EB | All seven supported methods | Managed `CachingDisabled` | Managed `AllViewerExceptHostHeader` |
| `/static/*` (admin assets) | EB | GET, HEAD | `CachingDisabled` initially | `AllViewerExceptHostHeader` |

Set **Redirect HTTP to HTTPS** on ALL behaviours including default. The origin middleware assumes this when it marks validated CloudFront requests secure. The origin request policy must preserve Authorization, query strings (especially OAuth state/code), and cookies while using the EB Host header. Do not cache authenticated responses. Do not use a distribution-wide error mapping that turns API 403/404 responses into `index.html` with status 200.

The `/health/` endpoint deliberately remains available directly on EB for liveness checks and CI. Other direct EB requests without the secret return 403. If you later restrict port 80 to CloudFront IP ranges, the workflow's direct health probe must change too; this package does not make that network change.

Do not include the origin secret in frontend variables or files. A browser needs only the CloudFront address. No separate certificate or domain registration is needed for that address.

## 5. Spotify (manual, once)

Add exactly this redirect URI in the Spotify developer app:

`https://d1caj2u4jm9c3j.cloudfront.net/spotify/callback/`

The trailing slash matters. Set the same URI in EB. Keep your localhost redirect registered as a separate development URI if needed. Add intended testers to the app's permitted users and meet Spotify's current Development Mode account requirements.

Reconnect Spotify after deployment so users grant the new `playlist-modify-private` scope. Existing grants may lack permission to export playlists. Spotify access restrictions and the live create/add-items endpoints still need a real-account check; cloud hosting alone does not override Development Mode limits.

## 6. GitHub (manual, once)

Set repository Actions variable `AWS_ROLE_ARN` to your existing GitHub OIDC role ARN. No AWS access-key secret is required.

Keep trust restricted to `AidanSpence/Riptide-2` and `refs/heads/Deployment`. Your redacted subject contained immutable owner/repository ID markers; preserve the actual IDs if your repository uses that format. Do not paste the redacted example or substitute an older subject format blindly. This workflow does not use a named GitHub Environment, so its subject should stay branch-based.

The deployment role must be able to assume via OIDC, obtain/create EB's storage bucket, upload the source bundle, create/read application versions, describe/update the target environment, and access any resources needed by those operations. Your current managed policy may cover these; validate with the first test run. Do not add unrestricted AdministratorAccess merely to fix a permissions error.

The workflow:

1. Installs the pinned Python dependencies.
2. Starts an isolated `pgvector/pgvector:pg16` CI database, bootstraps it, checks migrations and runs the full API test suite.
3. Checks production Django settings, lints and exports the frontend, and builds the Docker image.
4. Uploads separate frontend and backend artifacts.
5. On a push to `Deployment` (or an explicit deployment dispatch from that branch), authenticates with OIDC, discovers EB's storage bucket, creates a commit-labelled application version, waits for processing, updates EB and checks the deployed version and `/health/`.

PRs only validate. Manual workflow dispatch defaults to validation only. Deployments are queued rather than cancelling one already in progress. No frontend upload is automated.

## 7. First deployment and frontend upload

After reviewing a passing PR and completing the above setup, merge into `Deployment`. Watch GitHub Actions and EB events. The application runs migrations automatically before Gunicorn starts. Do not click Rebuild or delete the RDS database to fix an application error.

Upload the **contents** of `frontend-static/` (or the workflow's frontend artifact) into the S3 bucket root: `index.html`, `_next/`, images, etc. Do not upload the containing directory or the ZIP itself. Retain MIME types, and invalidate CloudFront `/*` after replacing a version. For this small project, avoid long caching of `index.html`; hashed `_next/static/` assets can be cached longer.

The export uses same-origin requests (empty `NEXT_PUBLIC_API_URL`). It does not embed the EB HTTP hostname or any secret. For a manual rebuild, set `NEXT_PUBLIC_API_URL` to an empty string before `npm run build` in `HTML/riptide-web`.

## Acceptance checks before considering it ready

- CI's full PostgreSQL tests AND Docker build pass.
- Direct EB `/health/` returns 200; direct `/api/me/` without origin header returns 403.
- CloudFront serves the website over HTTPS; `/api/me/` without login returns JSON 401, not S3 XML/HTML or 403 from the origin guard.
- Register, log in, refresh page, and verify the same account remains available.
- Connect Spotify, return to the site, and list an allowed user's playlists.
- Generate a playlist both with and without a Spotify reference playlist. Verify a response arrives within CloudFront's timeout and the actual Bedrock charge is acceptable.
- Reload a chat: saved system replies and its title remain.
- Export a generated playlist, then delete a saved playlist. Another user's data must remain inaccessible.
- Send a fourth message to a chat: it is rejected without another model call. Confirm the daily limit works as configured.
- Check logs for unexpected errors and Billing for the newly added RDS/AI costs.

If live model calls cannot fit the synchronous timeout, pause for a design decision about a background job/polling flow. This package deliberately does not silently add a queue or worker service.

## Rollback, shutdown and limits

Record the previously deployed EB version before merging. For code rollback, deploy a retained earlier application version from EB's Application versions page. This does not reverse database migrations. The new migration is additive; do not automatically migrate backwards or delete tables during rollback.

On/off automation is deferred until the first stable deployment. Do not manually stop EB's managed EC2 instance and assume it will remain stopped. EB recreation is not instant and may change resources. Separate RDS can be stopped for at most seven days before AWS restarts it; storage/backup charges remain. Bedrock on-demand has no provisioned model to shut down.

## Reference documentation

- EB Docker bundles: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/single-container-docker-configuration.html
- EB environment variables: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/environments-cfg-softwaresettings.html
- RDS PostgreSQL extensions: https://docs.aws.amazon.com/AmazonRDS/latest/PostgreSQLReleaseNotes/postgresql-extensions.html
- GitHub OIDC: https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws
- DeepSeek model: https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-deepseek-deepseek-r1.html
- Bedrock pricing: https://aws.amazon.com/bedrock/pricing/
- CloudFront origin policies: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-origin-request-policies.html
- Spotify scopes: https://developer.spotify.com/documentation/web-api/concepts/scopes
- RDS stop/start: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_StopInstance.html
