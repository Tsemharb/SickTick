from flask import render_template
from SickTick import app
from SickTick.models import Patient

@app.route('/')
@app.route('/home')
def home():
    content_string = 'SickTick®'
    return render_template('index.html', str=content_string)
