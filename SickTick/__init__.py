from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)

from SickTick import routes
from SickTick.blueprints.patient.routes import patient_blpr

app.register_blueprint(patient_blpr, url_prefix='/test')
