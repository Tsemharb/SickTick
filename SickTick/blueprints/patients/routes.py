from flask import render_template, jsonify
from . import patient_visualizer

from SickTick import db
from SickTick.models import Patient

from os import listdir

from .patient import Patient_parser


@patient_visualizer.route('/')
def patients():
    content_string = 'Patients list'
    files = [f.replace('.docx', '') for f in listdir('data')]
    return render_template('patients/patients.html', str=content_string, files=files)


@patient_visualizer.route('/patient/<file_name>')
def patient(file_name):
    content_string = file_name
    return render_template('patients/patient.html', str=content_string)


@patient_visualizer.route('/patient/data/<patient_id>')
def get_patient_data(patient_id):
    patient_data = Patient_parser(patient_id)
    return jsonify({'patients': [patient_data.general_info]})

    # patients_list = Patient.query.all()
    # patients = [{'as': 's'}]
    #
    # for patient in patients_list:
    #     patients.append({'name': patient.patient_name, 'surname': patient.patient_surname})
    # return jsonify({'patients' : patients})
