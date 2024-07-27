from flask import Blueprint, jsonify
import yfinance as yf
import pandas as pd
from utils.add_jk import addJK
import logging
from services.stock_info_service import scrape_stock_with_cache

news_bp = Blueprint('news', __name__)

symbol_arr = addJK()

@news_bp.route('/news/<symbol>', methods=['GET'])
def get_test(symbol):
    stock = yf.Ticker(symbol)
    news = stock.news
    return jsonify(news)

@news_bp.route('/news', methods=['GET'])
def get_all_news():
    scraped_stock = scrape_stock_with_cache()
            
    symbolJK = [item['symbol'] for item in scraped_stock]

    news_arr = []
    for symbol in symbolJK:
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