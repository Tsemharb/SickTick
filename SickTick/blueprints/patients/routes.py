from flask import render_template, jsonify
from . import patient_visualizer

from SickTick import db
from SickTick.models import Patient

from os import listdir

from .patient import Patient_parser


@patient_visualizer.route('/')
def patients():
    content_string = 'Patients list'
    files = [f.replace('.docx', '') for f in listdir('data') if '~$' not in f]
    files = sorted(files, key = lambda x: int(x.split(' ')[0]))
    return render_template('patients/patients.html', str=content_string, files=files)


@patient_visualizer.route('/patient/<file_name>')
def patient(file_name):
    return render_template('patients/patient.html')


@patient_visualizer.route('/patient/data/<patient_id>')
def get_patient_data(patient_id):
    patient_data = Patient_parser(patient_id)
    return jsonify({
                    'general_info': patient_data.general_info,
                    'temperature': patient_data.temperature
                   })

    # patients_list = Patient.query.all()
    # patients = [{'as': 's'}]
    #
    # for patient in patients_list:
    #     patients.append({'name': patient.patient_name, 'surname': patient.patient_surname})
    # return jsonify({'patients' : patients})
