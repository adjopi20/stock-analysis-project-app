from flask import Blueprint, jsonify
import yfinance as yf 
import pandas as pd
from utils.add_jk import addJK
from utils.convertTimestamp import convert_timestamp
import logging

history_bp = Blueprint('history', __name__)

symbol_arr = addJK

@history_bp.route('/history-metadata/<period>', methods=['GET'])
def get_all_history_metadata(period):
    stock_arr = []
    for symbol in symbol_arr:
        try:
            stock = yf.Ticker(symbol)
            hist = stock.history(period=period)
            hist.index = hist.index.strftime('%Y-%m-%d')
            metadata = stock.history_metadata
            stock_arr.append({
                'symbol': symbol,
                'history': hist.to_dict(orient='index'),
                'metadata': metadata
            })  
        except Exception as e:
            logging.error(f"error getting symbol for {symbol}: {e}")
    return jsonify(stock_arr)

@history_bp.route('/history-metadata/<symbol>/<period>/<start_date>/<end_date>', methods=['GET'])
def get_history_metadata(symbol, period, start_date, end_date):
    try:
        stock = yf.Ticker(symbol)
        hist = stock.history(period=period, start=start_date, end=end_date)
        hist_dict = convert_timestamp(hist.to_dict()) 
        metadata = stock.history_metadata

        return jsonify({
            'history': hist_dict,
            'metadata': metadata
        })

    except Exception as e:
        logging.error(f"Error getting stock info for {symbol}: {e}")
        return jsonify({"error": str(e)}), 500
    
