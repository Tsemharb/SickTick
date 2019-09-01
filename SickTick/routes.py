from flask import render_template
from SickTick import app

@app.route('/')
@app.route('/home')
def home():
    content_string = 'Hello, Flask!'
    return render_template('index.html', str=content_string)

@app.route('/test')
def test_react():
    content_string = 'Test React Here!'
    return render_template('test_react.html', str=content_string)
