from flask import Blueprint, jsonify
import yfinance as yf
import pandas as pd
from utils.add_jk import addJK
from utils.convertTimestamp import convert_timestamp
import logging

news_bp = Blueprint('news', __name__)

symbol_arr = addJK()

@news_bp.route('/news/<symbol>', methods=['GET'])
def get_test(symbol):
    stock = yf.Ticker(symbol)
    news = stock.news
    return jsonify(news)

@news_bp.route('/news', methods=['GET'])
def get_all_news():
    news_arr = []
    for symbol in symbol_arr:
        try:
            stock = yf.Ticker(symbol)
            news = stock.news
            news_arr.append({
                'symbol': symbol,
                'news': news
            })
        except Exception as e:
            logging.error(f"error getting symbol for {symbol}: {e}")
    return jsonify(news_arr)