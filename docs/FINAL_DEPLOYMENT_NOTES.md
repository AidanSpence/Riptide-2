# Final deployment notes — 17 November 2026

This source package is intended to replace/update the repository files, not production secrets.
`Django/.env` and `Django/.env.spotify` are deliberately excluded from the delivered ZIP.

## Deployment-critical repairs in this package

- Added migration `0014_merge_0012_generationbudget_0013_chatmessage_playlist_data` so the two `0012` migration branches have one leaf.
- Restored `.github/workflows/deploy.yml` and made Elastic Beanstalk wait for application-version processing before updating the environment.
- Normalized `Django/start.sh` to Unix LF line endings so its Linux shebang works inside the container.
- Restored the Spotify reference-track compatibility helpers used by the backend/tests while keeping the new saved-attachment chat path.
- Prevented deleted playlist cards from reappearing when a saved chat is loaded.
- Prevented the frontend from creating a server-side chat and then hiding it because of the old local three-chat guard.
- Corrected frontend registration response typing and disabled Spotify sign-in when no access token exists.
- Corrected Django's email backend setting name and removed a browser debug table.
- Removed stale nested `.next` output and expanded ignore rules for credentials/build artifacts.

## Safe release path

1. Preserve your real deployment/local environment values. Do not replace them with `.env.example` placeholders.
2. Apply this ZIP at the repository root on a non-production branch first.
3. Commit/push that branch and open a pull request into `Deployment`.
4. Do not merge unless the `Validate and deploy Riptide` **validate** job is green. It runs PostgreSQL/pgvector setup, migrations, Django tests/security checks, frontend lint/build, Docker build, and backend packaging.
5. Merging into `Deployment` triggers the backend Elastic Beanstalk deployment after validation succeeds.
6. The workflow builds and stores the static frontend as the `riptide-frontend` artifact, but it does **not** upload that artifact to S3/CloudFront. Publish the frontend separately using your existing S3/CloudFront process.
7. After deployment, check the Elastic Beanstalk environment/events and test `/health/`, login, one generated playlist, Spotify attach/export, chat reload, and playlist deletion.

## Environment assumptions

The production environment still needs its existing values for `SECRET_KEY`, database variables, Spotify credentials/callback, CloudFront origin secret and allowed origins/hosts, Bedrock region/model/access, and generation limits. `BOOTSTRAP_MUSIC=1` causes first startup to load the included clean dataset only when `music.songs` is empty.

The backend startup runs `python manage.py prepare_deployment`, which serializes migrations with a PostgreSQL advisory lock and then starts Gunicorn. The merge migration is additive and does not drop existing user/chat/playlist data.

## Validation limitation of this packaging workspace

Source-level checks were rerun after the repairs. This workspace has no external package-registry/network access, Docker daemon, or PostgreSQL service, so it cannot reproduce the full GitHub runtime job for this final archive. Treat a green GitHub `validate` job as the release gate; do not bypass it.
