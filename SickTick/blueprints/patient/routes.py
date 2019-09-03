from flask import render_template, jsonify
from . import patient_blpr
from SickTick import db
from SickTick.models import Patient

@patient_blpr.route('/')
def test_react():
    content_string = 'Test React Here!'
    return render_template('patient/test_react.html', str=content_string)

@patient_blpr.route('/patient')
def get_patients():
    patients_list = Patient.query.all()
    patients = []

    for patient in patients_list:
        patients.append({'name': patient.patient_name, 'surname': patient.patient_surname})
    return jsonify({'patients' : patients})
