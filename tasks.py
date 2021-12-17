import celery
import os

app = celery.Celery('canna-track-bot')

app.conf.update(BROKER_URL=os.environ['REDIS_URL'],
                CELERY_RESULT_BACKEND=os.environ['REDIS_URL'])


@app.task
def schedule_response(resp):
    return str(resp)


def on_raw_message(body):
    print(body)
