from flask import Blueprint, jsonify
import yfinance as yf 
import pandas as pd
from utils.excelParser import symbol_arr
import logging

holders_bp = Blueprint('holders', __name__)

@holders_bp.route('/holders/<symbol>', methods=['GET'])
def get_holders(symbol):
    try:
        stock = yf.Ticker(symbol)
        holders = stock.major_holders
        return jsonify(holders.to_dict(orient='index'))
    except Exception as e:
        logging.error(f"Error getting stock info for {symbol}: {e}")
        return jsonify({"error": str(e)}), 500  