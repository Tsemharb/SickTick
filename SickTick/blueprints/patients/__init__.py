from flask import Blueprint

patient_visualizer = Blueprint('patient_visualizer', __name__,
                    template_folder='templates',
                    static_folder='static')
