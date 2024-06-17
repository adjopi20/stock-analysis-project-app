from flask import Blueprint, jsonify
import yfinance as yf
import pandas as pd
from utils.add_jk import symbol_arr, symbol_arr2
import logging
from services.idx_list_scrape import *

info_bp = Blueprint('info', __name__)

@info_bp.route('/')
def index():
    return 'Hello World'

@info_bp.route('/info/<symbol>', methods=['GET'])
def get_info(symbol):
    return jsonify(yf.Ticker(symbol).info)

@info_bp.route('/info/stocklist', methods=['GET'])
def get_all_info():
    stock_arr = []
    for symbol in symbol_arr:
        try:
            stock = yf.Ticker(symbol)
            stock_info = stock.info
            stock_arr.append(stock_info)
        except Exception as e:
            logging.error(f"error getting symbol for {symbol}: {e}")
    return jsonify(stock_arr)

@info_bp.route('/info/stocklist2', methods=['GET'])
def get_all_info2():
    fetched_stocks = []
    stock_info = {}
    stocks_info = []
    scraped_stocks = scrape_stock()    

    #iterate over the symbol that has been added .JK from the scraped stock
    for symbol, scraped_stock in zip(symbol_arr2, scraped_stocks):
        try:
            stock = yf.Ticker(symbol)
            stock_info = stock.info
            fetched_stocks.append(stock_info)
            if scraped_stock["symbol"] == stock_info["symbol"]:
                stock_info = {**scraped_stock, **stock_info}
                stocks_info.append(stock_info)
        except Exception as e:
            logging.error(f"error getting symbol for {symbol}: {e}")

    return jsonify(stocks_info)


@info_bp.route('/info/excel', methods=['GET'])
def get_excel_info():
    src_path = '../assets/Daftar Saham  - 20240601.xlsx'
    stocklist = pd.read_excel(src_path)
    return jsonify(stocklist.to_dict(orient='index'))

@info_bp.route('/scrape', methods=['GET'])
def get_scrape():
    stocks = scrape_stock()
    if not stocks:
        return jsonify({"error": "No stock data found or an error occurred during scraping."}), 404
    return jsonify(stocks)



