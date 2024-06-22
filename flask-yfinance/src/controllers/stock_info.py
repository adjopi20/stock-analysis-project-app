from flask import Blueprint, jsonify, render_template_string, send_file
import matplotlib.pyplot as plt
import io
import yfinance as yf
import pandas as pd
from utils.add_jk import addJK
import logging
from services.scraping_stock_info_service import *
from services.fetching_stock_info_service import fetched_info_with_cache, combine_fetched_scraped_info
from services.bell_curve_stock_info_service import bell_curve_stock_info
import numpy as np

info_bp = Blueprint('info', __name__)



@info_bp.route('/info/<symbol>', methods=['GET'])
def get_info(symbol):
    try:
        stocks_info = combine_fetched_scraped_info()
        for stock_info in stocks_info:
            # Ensure stock_info is a dictionary and 'symbol' key exists and is a string
            if isinstance(stock_info, dict) and 'symbol' in stock_info and isinstance(stock_info['symbol'], str):
                if stock_info['symbol'].lower() == symbol.lower():
                    return jsonify(stock_info)
        # If symbol not found, return a 404 response
        return jsonify({"error": "Symbol not found"}), 404
    except Exception as e:
        print(f"stock_info.get_info.error: {e}")
        return jsonify({"error": str(e)}), 500

#alternative way, manual
@info_bp.route('/info/stocklist2', methods=['GET']) #cadangan seandainya sumber data yang dr cache tidak tersedia
def get_all_info2():
    stock_arr = []
    symbol_arr = addJK()
    for symbol in symbol_arr:
        try:
            stock = yf.Ticker(symbol)
            stock_info = stock.info
            stock_arr.append(stock_info)
        except Exception as e:
            logging.error(f"error getting symbol for {symbol}: {e}")
    return jsonify(stock_arr)

@info_bp.route('/info/stocklist', methods=['GET'])
def get_all_info():
    stock_info = {}
    stocks_info = []
    scraped_stocks = scrape_stock_with_cache()
    print(f"controller.get_all_info_with_cache.scraped_stocks: {len(scraped_stocks)}")        
    fetched_stocks = fetched_info_with_cache()
    print(f"controller.get_all_info_with_cache.fetched_stocks: {len(fetched_stocks)}")        


    try:

        # if there is no cached list, take from method, and iterate over the both lists
        for fetched_stock, scraped_stock in zip(fetched_stocks, scraped_stocks):            
            if scraped_stock["symbol"] == fetched_stock["symbol"]:
                stock_info = {**scraped_stock, **fetched_stock}
                stocks_info.append(stock_info)

        print(f"stock_info.get_all_info2.stocks_info: {len(stocks_info)}")
        return jsonify(stocks_info)

    except Exception as e:
        logging.error(f"found error : {e}")

@info_bp.route('/clear_cache', methods=['POST'])
def clear_cache():
    try:
        client.delete('fetched_all_stock')
        client.delete('scrape_all_stock')
        return jsonify({"message": "Cache cleared successfully"}), 200
    except Exception as e:
        logging.error(f"Error clearing cache: {e}")
        return jsonify({"error": "Error clearing cache"}), 500

@info_bp.route('/info/excel', methods=['GET'])
def get_excel_info():
    src_path = '../assets/Daftar Saham  - 20240601.xlsx'
    stocklist = pd.read_excel(src_path)
    return jsonify(stocklist.to_dict(orient='index'))

@info_bp.route('/scrape', methods=['GET'])
def get_scrape():
    stocks = scrape_stock_with_cache()
    if not stocks:
        return jsonify({"error": "No stock data found or an error occurred during scraping."}), 404
    return jsonify(stocks)

@info_bp.route('/hist.png')
def create_bell_curve ():
    df = bell_curve_stock_info()
    print(f"create_bell_curve.df: {df}")

    if df is None:
        return "No data to display", 400
    
    if 'returnOnEquity' in df:
        # Filter out None or NaN values
        valid_data = df['returnOnEquity'].dropna()

        
        if not valid_data.empty:
            valid_data.plot.hist(bins=100, color='blue', edgecolor='black')
            plt.xlabel('returnOnEquity')
            plt.ylabel('Frequency')
            
            img = io.BytesIO()
            plt.savefig(img, format='png')
            img.seek(0)
            plt.close()
            return send_file(img, mimetype='image/png')
        else:
            return "No valid returnOnEquity data to display"
    else: 
        return "returnOnEquity column not found"
    
    
@info_bp.route("/hist", methods=['GET'])
def get_hist():
    return render_template_string('''<img src="{{url_for('info.create_bell_curve')}}" alt="histogram" />''')



