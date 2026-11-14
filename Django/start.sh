#!/bin/sh
set -eu
python manage.py prepare_deployment
python manage.py collectstatic --noinput
exec gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers "${WEB_CONCURRENCY:-1}" --threads 2 --timeout 110 --access-logfile /dev/null --error-logfile -
