from flask import Flask, jsonify, render_template, abort
from flask import send_from_directory
from flask import request
from dataclasses import dataclass

from datetime import datetime
import csv
import os
import logging
import sys
from logging import Formatter

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, Column, Integer, Date, String
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from flask_migrate import Migrate


app = Flask(__name__, static_folder="client/static")

app.logger.addHandler(logging.StreamHandler(sys.stdout))
app.logger.setLevel(logging.DEBUG)
app.debug = True

if os.environ.get("FLASK_ENV") == "development":
    app.config.from_object("config.DevConfig")
else:
    app.config.from_object("config.ProdConfig")

app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL").replace(
    "postgres", "postgresql"
)
db = SQLAlchemy(app)
# migrate = Migrate(app, db)


def log_to_stderr(app):
    handler = logging.StreamHandler(sys.stderr)
    handler.setFormatter(
        Formatter(
            "%(asctime)s %(levelname)s: %(message)s " "[in %(pathname)s:%(lineno)d]"
        )
    )
    handler.setLevel(logging.WARNING)
    app.logger.addHandler(handler)


@app.route("/")
def serve_static_files_from_root():
    return render_template("index.html")


@app.route("/victims", methods=["GET"])
def get_victims():
    victims = Black_Victim.query.all()
    results = [
        {
            "name": victim.name,
            "birth_date": victim.birth_date,
            "death_date": victim.death_date,
            "age": victim.age,
        }
        for victim in victims
    ]

    return {"count": len(results), "victims": results}


@app.route("/api/detail/<name>", methods=["GET"])
def api_victim_detail(name):
    victim = Black_Victim.query.filter_by(name=name).one()
    victim_dict = victim.__dict__
    print("victim_dict = ")
    v = {
        "name": victim_dict["name"],
        "birth_date": victim_dict["birth_date"],
        "death_date": victim_dict["death_date"],
        "age": victim_dict["age"],
        "id": victim_dict["id"],
    }
    return jsonify(v)


@app.route("/api/exhibit/<city>", methods=["GET"])
def api_exhibit_detail(city):
    exhibit = Exhibit.query.filter_by(city=city).one()
    exhibit_dict = exhibit.__dict__
    print("exhibit_dict = ")
    e = {
        "id": exhibit_dict["id"],
        "city": exhibit_dict["city"],
        "start_date": exhibit_dict["start_date"],
    }
    return jsonify(e)


@app.route("/detail/<birth_or_death>/<name>", methods=["GET"])
def victim_detail(birth_or_death, name):
    if birth_or_death not in ["birth", "death"]:
        abort(404)
    victim = Black_Victim.query.filter_by(name=name).one()
    victim_dict = victim.__dict__
    print("victim_dict = ")
    v = {
        "name": victim_dict["name"],
        "birth_date": victim_dict["birth_date"],
        "death_date": victim_dict["death_date"],
        "age": victim_dict["age"],
        "id": victim_dict["id"],
    }
    print(v)
    return render_template(
        "detail.html",
        victim_name=v["name"],
        birth_or_death=birth_or_death,
        birth_date=v["birth_date"],
        death_date=v["death_date"],
    )


@dataclass
class Black_Victim(db.Model):
    # Tell SQLAlchemy what the table name is and if there's any table-specific arguments it should know about
    __tablename__ = "Black_Victim"
    __table_args__ = {"sqlite_autoincrement": True}
    # tell SQLAlchemy the name of column and its attributes:
    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String)
    birth_date = Column(Date)
    death_date = Column(Date)
    age = Column(Integer)


@dataclass
class Exhibit(db.Model):
    # Tell SQLAlchemy what the table name is and if there's any table-specific arguments it should know about
    __tablename__ = "Exhibit"
    __table_args__ = {"sqlite_autoincrement": True}
    # tell SQLAlchemy the name of column and its attributes:
    id = Column(Integer, primary_key=True, nullable=False)
    city = Column(String)  # Vancouver
    start_date = Column(Date)  # converted to a timestamp on the client


db.create_all()


if __name__ == "__main__":
    log_to_stderr(app)
    # set up logging
    # gunicorn_logger = logging.getLogger('gunicorn.error')
    # app.logger.handlers = gunicorn_logger.handlers
    # app.logger.setLevel(gunicorn_logger.level)
    app.logger.debug("In main ...")

    # Create the session
    session = sessionmaker()
    engine = create_engine(app.config["SQLALCHEMY_DATABASE_URI"])
    session.configure(bind=engine)
    s = session()

    app.run(debug=True)
