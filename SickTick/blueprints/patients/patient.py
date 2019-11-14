from os import listdir
from datetime import datetime
import time
import docx
import re
# import random

# TODO: check dates by regexp (sometimes additional info presents)
# TODO: deal with get_correct_timestamp function variables outside of function

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

        self.current_date = None;
        self.date_counter = 1;

        self.general_info = self.get_general_info()
        self.temperature = self.get_temperature(self.general_info['admission_date'][-4:], self.general_info['discharge_date'][-4:])
        self.antibiotics = self.get_antibiotics(self.tables['antibiotics'])
        self.additional_tests = self.get_additional_tests(self.tables['additional_tests'])

    @staticmethod
    def get_timestamp(date_str):
        a = int(datetime.timestamp(datetime.strptime(date_str, '%d.%m.%Y')) * 1000)
        return a

    @staticmethod
    def get_patient_file_name(id):
        files = [f.replace('.docx', '') for f in listdir('data')]
        for file in files:
            if file.split(' ')[0] == id:
                return file + '.docx'

# method sets different timestamps for date duplicates (same dates won't have same x-coords)
    # @staticmethod
    def get_correct_timestamp(self, date, count):
        date_shift = 0;
        # print(self.current_date)
        if date == self.current_date: 
            date_shift = self.date_counter / count * 24 * 60 * 60 * 1000
            self.date_counter+=1
        else:
            self.current_date = date
            self.date_counter = 1
            date_shift = 0
        return self.get_timestamp(date) + date_shift



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


    def get_temperature(self, admission_year, discharge_year):
        same_year = admission_year == discharge_year  # check for change of the year while in hospital
        month = int(self.general_info['admission_date'][3:5])
        year = admission_year
        temperature = {}
        the_table = self.tables['temperature']
        rows_num = len(the_table.rows)
        cells_num = len(the_table.rows[1].cells)
        temp_id = 0
        for row in range(1, rows_num, 3):
            for cell in range(0, cells_num):
                date = the_table.rows[row].cells[cell].text
                if date != '':
                    if not same_year and month > int(date[-2:]):
                        year = discharge_year
                        month = int(date[-2:])
                    else:
                        month = int(date[-2:])
                    temperature[temp_id] = {'date':date + '.' + year,
                                            'temp': the_table.rows[row+1].cells[cell].text.replace(',', '.')}
                    temp_id += 1
                else:
                    break
        # add count for each unique date
        counts = {}
        dates = [temperature[i]['date'] for i in range(len(temperature))]
        for date in set(dates):
            for i in range(len(temperature)):
                counts[i] = dates.count(temperature[i]['date'])

        # add timestamp for every temperature measurement
        for i in range(len(temperature)):
            timestamp = self.get_correct_timestamp(temperature[i]['date'], counts[i])
            temperature[i]['timestamp'] = timestamp;
        return temperature


    def get_antibiotics(self, table):
        ab_colors = ['aqua', 'brown', 'cyan', 'darkred','deeppink', 
                     'fuchsia', 'lightgrey', 'olive', 'peru', 'tan',
                     'mediumblue', 'palegreen', 'rebeccapurple']
        antibiotics = []
        rows_num = len(table.rows)
        cells_num = len(table.rows[1].cells)
        for row in range(1, rows_num):
            row_content = []
            # get info from each row
            for cell in range(cells_num):
                row_content.append(table.rows[row].cells[cell].text)
            # row_content example: ['с 04.09.2018 по 05.09.2018', 'Цефепим 2,0 * 2р. в/в']
            ab_name = row_content[1]
            ab_name = re.split("(\d)+", ab_name)[0]
            ab_dose = row_content[1].replace(ab_name, '')
            # add antibiotics dates could be several runs for each ab
            dates = row_content[0].split(',')
            for date in dates:
                antibiotic = {}
                antibiotic['name'] = ab_name.strip()
                antibiotic['dose'] = ab_dose
                antibiotic['color'] = ab_colors[row-1]
                d = date.strip().split(' ')
                antibiotic['dates'] = {'begin': d[1][:10], 'end': d[3][:10]}
                antibiotic['timestamps'] = {'begin': self.get_timestamp(d[1][:10]), 'end': self.get_timestamp(d[3][:10])}
                antibiotic['draw'] = True
                # antibiotic['draw'] = random.choice([True, False])
                antibiotics.append(antibiotic)
        return antibiotics

    def get_additional_tests(self, table):
        additional_tests = []
        rows_num = len(table.rows)
        for r_num in range(1, rows_num):
            test = {}
            test['date'] = table.rows[r_num].cells[0].text
            test['result'] = table.rows[r_num].cells[1].text
            additional_tests.append(test)
        return additional_tests


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
