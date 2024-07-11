import pandas as pd

src_path = '../assets/Daftar Saham  - 20240601.xlsx'

#alternative way manual
def addJK():
    dataframe = pd.read_excel(src_path)
    symbol_arr = []

    if 'Kode' in dataframe.columns:
        for symbol in dataframe['Kode']:
            modified_symbol = symbol + '.JK' #add .JK to symbol
            symbol_arr.append(modified_symbol) #add the symbol to the array
            # print(f"Symbols added to symbol_arr: {symbol_arr}")
    else:
        print('Kode not found in dataframe')


