import celery
import os

app = celery.Celery('canna-track-bot')

app.config_from_object('celery_settings')


@app.task
def schedule_response(resp):
    return str(resp)


def on_raw_message(body):
    print(body)
