from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)

from SickTick import routes
from SickTick.blueprints.patients.routes import patient_visualizer

app.register_blueprint(patient_visualizer, url_prefix="/show_me_what_he's_got")
