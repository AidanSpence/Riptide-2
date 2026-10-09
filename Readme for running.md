Running locally (development)
1. From the repository folder, install the Python dependencies:
	`pip install -r requirements.txt`
2. Change into the Django folder:
	cd Django
3. Start the development server on port 8080:
	`python manage.py runserver 8080`
4. Open http://localhost:8080 in your browser.

Port 8000 is blocked on the YB PC. If port 8080 is also unavailable, use another port, for example:
	'python manage.py runserver 8081'
Then open http://localhost:8081.

Running with Docker
1. Start Docker Desktop and wait for it to finish starting.
2. From the repository folder (the folder containing compose.yaml), run:
	`docker compose up --build`
3. Open http://localhost:8080 in your browser.

To stop the container, press Ctrl+C. To stop and remove the container later, run:
	`docker compose down`
The SQLite database is stored in a Docker volume and is kept when the container is stopped or removed.

If port 8080 is unavailable, in PowerShell choose another host port and start Compose:
	`$env:PORT=8081; docker compose up --build`
Then open http://localhost:8081. To use port 8080 again in that PowerShell window, run:
	Remove-Item Env:PORT