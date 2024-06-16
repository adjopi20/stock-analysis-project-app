import pandas as pd
from utils.idx_list_scrape import *

src_path = '../assets/Daftar Saham  - 20240601.xlsx'
symbol_arr = []
symbol_arr2 = [] 

def addJK():
    dataframe = pd.read_excel(src_path)

    if 'Kode' in dataframe.columns:
        for symbol in dataframe['Kode']:
            modified_symbol = symbol + '.JK' #add .JK to symbol
            symbol_arr.append(modified_symbol) #add the symbol to the array
            # print(f"Symbols added to symbol_arr: {symbol_arr}")
    else:
        print('Kode not found in dataframe')
addJK()

def addJK2():
    try:
        stocks = scrape_stock()
        for stock in stocks:
            for key in stock:
                if key=='symbol':
                    symbol_val = str(stock[key])
                    symbol_arr2.append(symbol_val)
                    # print(symbol_arr2) 
    except Exception as e:
        print(f"exception: {e}")
addJK2()







