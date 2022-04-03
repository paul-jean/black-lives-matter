from flask import Flask
from flask import request
from urllib.parse import urlparse

from datetime import datetime
import os
# from flask_sqlalchemy import SQLAlchemy, declarative_base
# from sqlalchemy import create_engine
# from flask_migrate import Migrate


app = Flask(__name__)

# redis_url = urlparse(os.environ.get("REDIS_URL"))
# r = redis.Redis(host=redis_url.hostname, port=redis_url.port, username=redis_url.username,
#                 password=redis_url.password, ssl=True, ssl_cert_reqs=None)

app.debug = False

if os.environ.get('FLASK_ENV') == 'development':
    app.config.from_object('config.DevConfig')
else:
    app.config.from_object('config.ProdConfig')

# app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
#     "DATABASE_URL").replace("postgres", "postgresql")
# db = SQLAlchemy(app)
# migrate = Migrate(app, db)

# in seconds:
HALF_HOUR = 60*30
HOUR_AND_A_HALF = 60*90

if __name__ == '__main__':
    app.run()
