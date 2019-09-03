from flask import Blueprint

patient_blpr = Blueprint('patient_blpr', __name__,
                    template_folder='templates',
                    static_folder='static')
