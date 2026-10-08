# Riptide-2
This project is the second version of ‘Riptide’, an AI natural language music recommendation system that utilizes artificial intelligence with a clustering backend to create a hybrid system that uses minimal user data and maximizes musical diversity. 

## Run with Docker

From the repository root, run:

```sh
docker compose up --build
```

Open http://localhost:8080. The container runs database migrations on startup, and its SQLite database is retained in the `riptide_data` volume. Stop the app with `Ctrl+C`; use `docker compose down` to remove the container while keeping its data.

For a deployment, set `DJANGO_SECRET_KEY` to a private key, set `DJANGO_DEBUG=0`, and provide the hostnames in `DJANGO_ALLOWED_HOSTS` before starting Compose.
