from flask import Flask
from flask import send_from_directory
from flask import request
from urllib.parse import urlparse

from datetime import datetime
import csv
import os

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, Column, Integer, Date, String
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from flask_migrate import Migrate


app = Flask(__name__, static_folder='client/static')

# redis_url = urlparse(os.environ.get("REDIS_URL"))
# r = redis.Redis(host=redis_url.hostname, port=redis_url.port, username=redis_url.username,
#                 password=redis_url.password, ssl=True, ssl_cert_reqs=None)

app.debug = False

if os.environ.get('FLASK_ENV') == 'development':
    app.config.from_object('config.DevConfig')
else:
    app.config.from_object('config.ProdConfig')

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
    "DATABASE_URL").replace("postgres", "postgresql")
db = SQLAlchemy(app)
migrate = Migrate(app, db)

@app.route('/index.html')  
def serve_static_files_from_root():
    return send_from_directory(app.static_folder, request.path[1:])


def csv_to_dict(file_name):
    with open(file_name, newline='') as csvfile:
        csv_dicts = [{k: v for k, v in row.items()} for row in csv.DictReader(csvfile.splitlines(), skipinitialspace=True)]
        return csv_dicts

Base = declarative_base()

class Black_Victim(Base):
    #Tell SQLAlchemy what the table name is and if there's any table-specific arguments it should know about
    __tablename__ = 'Black_Victim'
    __table_args__ = {'sqlite_autoincrement': True}
    #tell SQLAlchemy the name of column and its attributes:
    id = Column(Integer, primary_key=True, nullable=False) 
    name = Column(String)
    birth_date = Column(Date)
    death_date = Column(Date)
    age = Column(Integer)

if __name__ == '__main__':
    #Create the session
    session = sessionmaker()
    engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])
    session.configure(bind=engine)
    s = session()

    csv_dict = csv_to_dict('./static/data/data.csv')
    try:
        for i in csv_dict:
            record = Black_Victim(**{
                'name': i[0],
                'birth_date' : datetime.strptime(i[1], '%b %d %Y').date(),
                'death_date' : datetime.strptime(i[2], '%b %d %Y').date(),
                'age': i[3]
            })
            s.add(record) #Add all the records

        s.commit() #Attempt to commit all the records
    except:
        s.rollback() #Rollback the changes on error
    finally:
        s.close() #Close the connection

    app.run()
