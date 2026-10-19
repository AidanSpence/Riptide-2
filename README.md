# Riptide 2

Riptide 2 is a music recommendation system that combines AI-driven recommendations with clustering-based discovery. The project includes a Django backend for data processing and APIs, a PostgreSQL database, and a Next.js frontend for the user-facing interface.

## Tech stack

- Python / Django
- PostgreSQL
- Docker / Docker Compose
- Next.js / React
- AI clustering and recommendation workflow

## Project structure

```text
Riptide-2/
├── Django/
│   ├── config/
│   ├── Riptide2/
│   ├── db/
│   ├── data/
│   ├── compose.yaml
│   ├── dockerfile
│   ├── manage.py
│   └── requirements.txt
├── HTML/
│   └── riptide-web/
├── README.md
└── ...
```

## Prerequisites

Before running the project, make sure you have:

- Python 3.11+
- Node.js 20+
- npm or pnpm
- Docker Desktop (optional, for containerized setup)
- PostgreSQL client tools if running the database locally

## Environment variables

The Django app reads configuration from a `.env` file in the `Django/` folder. Create one before starting the backend.

Example:

```dotenv
DB_NAME=<your_database_name>
DB_USER=<your_database_user>
DB_PASSWORD=<your_database_password>
DB_HOST=localhost
DB_PORT=5432
SECRET_KEY=<your_secret_key>
DJANGO_DEBUG=1
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

> If you do not know the exact values for your local environment, use placeholders such as `<your_database_name>` until the required credentials are available.

## Quick start

### Option 1: Local Django development

From the repository root:

```bash
cd Django
python -m venv .venv
```

Activate the virtual environment:

```bash
# Windows PowerShell
.venv\Scripts\Activate.ps1

# macOS / Linux
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the database migrations:

```bash
python manage.py migrate
```

Start the Django server:

```bash
python manage.py runserver 8080
```

Open the app in your browser at:

```text
http://localhost:8080
```

If port 8080 is unavailable, use a different port such as:

```bash
python manage.py runserver 8081
```

### Option 2: Docker Compose

From the `Django/` directory:

```bash
cd Django
docker compose up --build -d
```

Then open:

```text
http://localhost:8000
```

To stop the containers:

```bash
docker compose down
```

The Compose configuration includes a PostgreSQL service and exposes the app on port 8000.

### Option 3: Frontend development server

The frontend is in `HTML/riptide-web`.

```bash
cd HTML/riptide-web
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Useful commands

### Django

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py shell
```

### Data loading

```bash
python manage.py load_songs data/<file>.csv
python manage.py load_songs data/<file>_clean.csv --no-clean
```

### Clustering

```bash
python manage.py build_clusters --k <num_clusters>
```

### Docker

```bash
docker compose up --build
docker compose down
docker compose logs -f
docker compose ps
```

### Frontend

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Database notes

The application is configured for PostgreSQL. If you are using Docker, the database runs through the Compose setup automatically. If you are running it locally, make sure the database server is reachable using the values defined in your `.env` file.

## Deployment notes

For a production deployment, set the following to secure values:

- `SECRET_KEY`
- `DJANGO_DEBUG=0`
- `DJANGO_ALLOWED_HOSTS=<your_domain_name>`
- `CORS_ALLOWED_ORIGINS=https://<your_frontend_domain>`

## Troubleshooting

- If `python manage.py` reports missing environment variables, ensure your `.env` file exists in `Django/` and contains the expected keys.
- If the database connection fails, confirm `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD` match your local or Docker configuration.
- If the frontend cannot connect to the backend, verify the `CORS_ALLOWED_ORIGINS` value and the selected backend URL.
- If a port is already in use, change the port in the run command, for example `python manage.py runserver 8081`.

## Notes

This project may require additional secrets or API keys depending on the recommendation and AI features in use. If a credential is not yet defined, add a placeholder such as `<your_api_key>` and update it later when the real value is available.

