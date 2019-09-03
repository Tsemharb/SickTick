from SickTick import db

class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_name = db.Column(db.String(20), nullable=False)
    patient_surname = db.Column(db.String(20))

    def __repr__(self):
        return f"Patient('{self.patient_name}', '{self.patient_surname}')"
