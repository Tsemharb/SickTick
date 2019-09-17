from flask import render_template, jsonify
from . import patient_plotter

from SickTick import db
from SickTick.models import Patient

from os import listdir


@patient_plotter.route('/')
def patients():
    content_string = 'Patients list'
    files = [f.replace('.docx', '') for f in listdir('data')]
    return render_template('patients/patients.html', str=content_string, files=files)


@patient_plotter.route('/patient/<file_name>')
def patient(file_name):
    content_string = 'The patient'
    return render_template('patients/patient.html', str=content_string)


@patient_plotter.route('/patient/data')
def get_patients():
    patients_list = Patient.query.all()
    patients = []

    for patient in patients_list:
        patients.append({'name': patient.patient_name, 'surname': patient.patient_surname})
    return jsonify({'patients' : patients})
