from twilio.twiml.messaging_response import MessagingResponse
from flask import Flask
from flask import request
from tasks import schedule_response

import os
import redis

TEST_CLIENT_PHONE = os.environ['TEST_CLIENT_PHONE']

app = Flask(__name__)


@app.route('/bot', methods=['POST'])
def bot():
    # add webhook logic here and return a response
    incoming_msg = request.values.get('Body', '').lower()
    print(request.values)
    # phone_number = request.values.get('Number')
    phone_number = '+17786867970'  # temp
    resp = MessagingResponse()
    msg = resp.message()
    responded = False
    if 'cat' in incoming_msg:
        # return a cat pic
        msg.media('https://cataas.com/cat')
        responded = True
    if not responded:
        msg.body('I only know about famous quotes and cats, sorry!')
    async_message = "... and 5 second delayed response!"
    async_delay = 10
    r = schedule_response.apply_async(
        args=(async_message, TEST_CLIENT_PHONE), countdown=async_delay)
    # r.get(on_message=on_raw_message, propagate=False)
    return str(resp)


if __name__ == '__main__':
    app.run()
