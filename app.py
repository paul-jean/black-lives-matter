from redis import client
from twilio.rest.api.v2010.account import message
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
from flask_migrate import Migrate


app = Flask(__name__)

redis_url = urlparse(os.environ.get("REDIS_URL"))
r = redis.Redis(host=redis_url.hostname, port=redis_url.port, username=redis_url.username,
                password=redis_url.password, ssl=True, ssl_cert_reqs=None)

app.debug = False

if os.environ.get('FLASK_ENV') == 'development':
    app.config.from_object('config.DevConfig')
else:
    app.config.from_object('config.ProdConfig')

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
    "DATABASE_URL").replace("postgres", "postgresql")

db = SQLAlchemy(app)
migrate = Migrate(app, db)

# in seconds:
HALF_HOUR = 60*30
HOUR_AND_A_HALF = 60*90

class Message(db.Model):
    __tablename__ = 'message'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    date = db.Column(db.DateTime)
    phone_number = db.Column(db.String(20, convert_unicode=True))
    message_body = db.Column(db.String(200, convert_unicode=True))
    user = db.relationship("User", primaryjoin='User.id==Message.user_id')

    def __init__(self, phone_number, message_body, user, **kwargs):
        super(Message, self).__init__(**kwargs)
        self.date = datetime.now()
        self.phone_number = phone_number
        self.message_body = message_body
        self.user = user
        self.user_id = user.id


class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    phone_number = db.Column(db.String(20, convert_unicode=True))

    def __init__(self, phone_number, **kwargs):
        super(User, self).__init__(**kwargs)
        self.phone_number = phone_number


db.create_all()

@app.route('/bot', methods=['POST'])
def bot():
    print("[DEBUG] request:")
    print(request.values)
    client_phone = request.values.get('From')
    print("[DEBUG] querying for this user ...")
    user = User.query.filter_by(phone_number=client_phone).first()
    print("[DEBUG] storing message ...")
    message_body = request.values.get('Body', '').lower()
    store_message(client_phone, message_body, user)
    print("[DEBUG] message stored.")

    resp = MessagingResponse()
    msg = resp.message()
    responded = False

    if type(user) is not User:
        print("[DEBUG] this is a new user!")
        msg.body(welcome_message())
        store_user(client_phone)
        print("[DEBUG] new user stored")

    if 'puff' in message_body:
        response = f"[C8] Ok I'll check back in 30 min ..."
        async_delay = HALF_HOUR
        async_message = f"[C8] How are you feeling after your {message_body}?"
        responded = True

    if 'drop' in message_body:
        response = f"[C8] Ok I'll check back in 90 min ..."
        async_delay = HOUR_AND_A_HALF
        async_message = f"[C8] How are you feeling after your {message_body}?"
        responded = True

    if not responded:
        response = f"[C8] Noted!"

    msg.body(response)
    if async_message and async_delay:
        r = schedule_response.apply_async(
            args=(async_message, client_phone), countdown=async_delay)

    return str(resp)


def store_message(phone_number, message_body, user, _db=db):
    message = Message(phone_number, message_body, user)
    _db.session.add(message)
    _db.session.commit()


def store_user(phone_number, _db=db):
    data = User(phone_number)
    _db.session.add(data)
    _db.session.commit()


def welcome_message():
    return "Welcome to Calibrate!"


if __name__ == '__main__':
    app.run()
