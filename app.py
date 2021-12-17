from twilio.twiml.messaging_response import MessagingResponse
from flask import Flask
from flask import request
from tasks import schedule_response

import os
import redis

app = Flask(__name__)


@app.route('/bot', methods=['POST'])
def bot():
    # add webhook logic here and return a response
    incoming_msg = request.values.get('Body', '').lower()
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
    r = schedule_response.apply_async(
        args=(async_message,), countdown=1)
    # r.get(on_message=on_raw_message, propagate=False)
    return str(resp)


if __name__ == '__main__':
    app.run()
