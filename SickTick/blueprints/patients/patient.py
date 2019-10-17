from os import listdir
import docx

# TODO: check dates by regexp (sometimes additional info presents)
# TODO: consider adding year info to dates of lab get_tests

class Patient_parser:
    def __init__(self, id):

        self.tables_mapping = {'ФИО': 'general_info',
                          'Общие анализы крови': 'cbc',
                          'Биохимические анализы крови': 'blood_tests',
                          'Общие анализы мочи': 'urine_tests',
                          'Иммунологические исследования': 'immunologic_tests',
                          'Дополнительные исследования': 'additional_tests',
                          'Микробиологические посевы': 'microbiology',
                          'Этиотропная терапия': 'antibiotics',
                          'Температурный лист': 'temperature'}

        self.patient_file_name = self.get_patient_file_name(id)
        self.doc = docx.Document('data/' + self.patient_file_name)

        self.tables = {}
        for table in self.doc.tables:  #get tables of doc file ('table_name': table_obj)
            self.tables[self.tables_mapping[table.rows[0].cells[0].text.strip()]] = table

        self.general_info = self.get_general_info()
        self.temperature = self.get_temperature()


    @staticmethod
    def get_patient_file_name(id):
        files = [f.replace('.docx', '') for f in listdir('data')]
        for file in files:
            if file.split(' ')[0] == id:
                return file + '.docx'


    def get_general_info(self):
        gen_info_mapping = {'ФИО': 'name',
                        'Дата рождения': 'birthdate',
                        'Адрес домашний': 'address',
                        'Отделение': 'department',
                        'Дата госпитализации': 'admission_date',
                        'Дата выписки': 'discharge_date',
                        'Клинический диагноз': 'diagnosis'}
        general_info = {}
        the_table = self.tables['general_info']
        for row in the_table.rows:
            general_info[gen_info_mapping[row.cells[0].text.strip()]] = row.cells[1].text
        return general_info


    def get_temperature(self):
        temperature = {}
        the_table = self.tables['temperature']
        rows_num = len(the_table.rows)
        cells_num = len(the_table.rows[1].cells)
        temp_id = 0
        for row in range(1, rows_num, 3):
            for cell in range(0, cells_num):
                date = the_table.rows[row].cells[cell].text
                if date != '':
                    temperature[temp_id] = {'date':date,
                                            'temp': the_table.rows[row+1].cells[cell].text}
                    temp_id+=1
                else:
                    break
        return temperature


    def get_tests(table):
        units = {}
        data = {}
        referent_col_name =''
        rows_num = len(table.rows)
        cells_num = len(table.rows[1].cells)
        blank_rows_ind = []
        is_referent_col = False  #referent column flag ("ед.измер", "Норма")

        #get referent name ("ед.измер", "Норма")
        if table.rows[1].cells[1].text == 'ед.изм' or table.rows[1].cells[1].text == 'Норма':
            referent_col_name = table.rows[1].cells[1].text
            is_referent_col = True

        #get blank rows
        for i in range(rows_num):
            row = table.rows[i]
            if (row.cells[0].text == '' and row.cells[1].text == ''):
                blank_rows_ind.append(i)
        blank_rows_ind.append(len(table.rows))

        #get sample units
        if is_referent_col:
            for row in range(1, rows_num):
                unit_name = table.rows[row].cells[0].text
                if unit_name != '':
                    units[table.rows[row].cells[0].text] = table.rows[row].cells[1].text
                else:
                    continue

        #get samples results
        start_row = 0
        start_col = 2 if is_referent_col else 1
        for blank in blank_rows_ind:
            for cell in range(start_col, cells_num):
                date = table.rows[start_row+1].cells[cell].text.strip()
                if date == '':
                    continue
                test = {}
                for row in range (start_row+2, blank):
                    observation = table.rows[row].cells[cell].text.strip()
                    if observation != '':
                        observation_name = table.rows[row].cells[0].text.strip()
                        test[observation_name] = observation
                    else:
                        continue
                data[date] = test
            start_row = blank
        return{'referent_col_name': referent_col_name, 'units': units, 'data': data}
