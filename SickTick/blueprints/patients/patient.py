class Patient_parser:
    def __init__(self, ):
        print('helllo')

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