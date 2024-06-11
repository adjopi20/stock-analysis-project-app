from flask import Blueprint, jsonify
import yfinance as yf 
import pandas as pd
from utils.excelParser import symbol_arr
import logging
from utils.idx_list_scrape import *

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

@info_bp.route('/info/excel', methods=['GET'])
def get_excel_info():
    src_path = 'assets/Daftar Saham  - 20240601.xlsx'
    stocklist = pd.read_excel(src_path)
    return jsonify(stocklist.to_dict(orient='index'))

@info_bp.route('/scrape', methods=['GET'])
def get_scrape():
    stocks = scrape_stock()
    if not stocks:
        return jsonify({"error": "No stock data found or an error occurred during scraping."}), 404
    return jsonify(stocks)

@info_bp.route('/scrape2', methods=['GET'])
def get_scrape2():
    stocks = scrape_stock2()
    if not stocks:
        return jsonify({"error": "No stock data found or an error occurred during scraping."}), 404
    return jsonify(stocks)
