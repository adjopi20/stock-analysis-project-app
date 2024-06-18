from flask import jsonify
from services.idx_list_scrape import scrape_stock
import yfinance as yf
from utils.add_jk import symbol_arr2
import logging
from configs.config import session

def get_all_info2():
    fetched_stocks = []
    stock_info = {}
    stocks_info = []
    scraped_stocks = scrape_stock()    

    #iterate over the symbol that has been added .JK from the scraped stock
    for symbol, scraped_stock in zip(symbol_arr2, scraped_stocks):
        try:
            
            stock = yf.Ticker(symbol, session=session)
            stock_info = stock.info
            fetched_stocks.append(stock_info)
            if scraped_stock["symbol"] == stock_info["symbol"]:
                stock_info = {**scraped_stock, **stock_info}
                stocks_info.append(stock_info)
        except Exception as e:
            logging.error(f"error getting symbol for {symbol}: {e}")

    return jsonify(stocks_info)
