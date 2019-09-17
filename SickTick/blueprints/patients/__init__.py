from flask import Blueprint

patient_plotter = Blueprint('patient_plotter', __name__,
                    template_folder='templates',
                    static_folder='static')
