web: flask db upgrade; gunicorn app:app
worker: celery --app=tasks.app worker -l INFO