import celery
import os
from twilio.rest import Client

app = celery.Celery('canna-track-bot')

app.config_from_object('celery_settings')

account_sid = os.environ['TWILIO_ACCOUNT_SID']
auth_token = os.environ['TWILIO_AUTH_TOKEN']
client = Client(account_sid, auth_token)

BOT_PHONE_NUMBER = os.environ['BOT_PHONE_NUMBER']


@app.task
def schedule_response(resp, phone_number):
    # https://www.twilio.com/docs/sms/api/message-resource#create-a-message-resource
    message = client.messages.create(
        body=resp,
        to=phone_number,
        from_=BOT_PHONE_NUMBER
    )
    return str(message)


def on_raw_message(body):
    print(body)
