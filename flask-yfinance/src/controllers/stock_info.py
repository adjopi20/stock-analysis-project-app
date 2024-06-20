from flask import Blueprint, jsonify
import yfinance as yf
import pandas as pd
from utils.add_jk import addJK
import logging
from services.scraping_stock_info_service import *
from services.fetching_stock_info_service import fetched_info_without_cache
import pydantic.parse
import pydantic
import redis
from datetime import timedelta
import json

info_bp = Blueprint('info', __name__)

cache_ttl = int(timedelta(hours=24).total_seconds())


@info_bp.route('/')
def index():
    return 'Hello World'

@info_bp.route('/info/<symbol>', methods=['GET'])
def get_info(symbol):
    return jsonify(yf.Ticker(symbol).info)

#alternative way, manual
@info_bp.route('/info/stocklist2', methods=['GET']) #cadangan seandainya sumber data yang dr cache tidak tersedia
def get_all_info():
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
def get_all_info_with_cache():
    stock_info = {}
    stocks_info = []
    scraped_stocks = scrape_stock_with_cache()
    print(f"controller.get_all_info_with_cache.scraped_stocks: {len(scraped_stocks)}")        
    fetched_stocks = fetched_info_without_cache()
    print(f"controller.get_all_info_with_cache.fetched_stocks: {len(fetched_stocks)}")        
    cache_key = 'fetched_all_stock'


    try:
        #get chaced file if it exist
        cached_raw_value= client.get(cache_key)

        if cached_raw_value is not None:
            typeAdapter = pydantic.TypeAdapter(list) #buat adapter dengan tipe value yang akan kita keluarkan
            retrieved_stock_info = typeAdapter.validate_json(cached_raw_value) #ambil jsonnya dan masukkan ke adapter
            print(f"stock_info.get_all_info_with_cache.retrieved_stock_info: {len(retrieved_stock_info)}")
            return retrieved_stock_info

        # if there is no cached list, take from method, and iterate over the both lists
        for fetched_stock, scraped_stock in zip(fetched_stocks, scraped_stocks):
                
            if scraped_stock["symbol"] == fetched_stock["symbol"]:
                stock_info = {**scraped_stock, **fetched_stock}
                stocks_info.append(stock_info)

        #now, save it in chace
        raw_value = json.dumps(stocks_info)
        client.set(cache_key, raw_value, ex=cache_ttl)
        
        print(f"stock_info.get_all_info_with_cache.stocks_info: {len(stocks_info)}")
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



