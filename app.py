from twilio.twiml.messaging_response import MessagingResponse
from flask import Flask
from flask import request
from tasks import schedule_response
from urllib.parse import urlparse

from datetime import datetime
import os
import redis
from flask_sqlalchemy import SQLAlchemy, declarative_base
from sqlalchemy import create_engine


app = Flask(__name__)

redis_url = urlparse(os.environ.get("REDIS_URL"))
r = redis.Redis(host=redis_url.hostname, port=redis_url.port, username=redis_url.username,
                password=redis_url.password, ssl=True, ssl_cert_reqs=None)

app.debug = False
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
    "DATABASE_URL").replace("postgres", "postgresql")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

Base = declarative_base()
engine = create_engine("postgres", echo=False)
Base.metadata.create_all(engine)


class Message(Base):
    __tablename__ = 'message'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime)
    phone_number = db.Column(db.String(20))
    message_body = db.Column(db.String(200))

    def __init__(self, phone_number, message_body):
        self.date = datetime.now()
        self.phone_number = phone_number
        self.message_body = message_body


@app.route('/bot', methods=['POST'])
def bot():
    print("[DEBUG] request:")
    print(request.values)
    client_phone = request.values.get('From')
    print("[DEBUG] storing message ...")
    message_body = request.values.get('Body', '').lower()
    store_message(client_phone, message_body)
    print("[DEBUG] message stored.")
    resp = MessagingResponse()
    msg = resp.message()
    responded = False
    if 'cat' in message_body:
        # return a cat pic
        msg.media('https://cataas.com/cat')
        responded = True
    if not responded:
        msg.body('I only know about famous quotes and cats, sorry!')
    async_delay = 60
    async_message = f"... and {async_delay}-second delayed response!"
    r = schedule_response.apply_async(
        args=(async_message, client_phone), countdown=async_delay)
    return str(resp)


def store_message(phone_number, message_body, _db=db):
    data = Message(phone_number, message_body)
    _db.session.add(data)
    _db.session.commit()


if __name__ == '__main__':
    app.run()
