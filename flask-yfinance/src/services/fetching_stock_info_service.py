import yfinance as yf
from utils.add_jk import addJK2
import logging
from configs.config import session

def fetched_info_without_cache():
    fetched_stocks = []
    # stock_info = {}
    try:
        symbol_arr2 = addJK2()
        print(f"symbol_arr2 from addJK2: {len(symbol_arr2)}")

    #iterate over the symbol that has been added .JK from the scraped stock
        for symbol in symbol_arr2:
        
            stock = yf.Ticker(symbol, session=session)
            stock_info = stock.info
            print(f"fetched stock without cache: {stock_info.get('underlyingSymbol')}")  

            fetched_stocks.append(stock_info)
            # return fetched_stocks
  

            
        print(f"fetched stock without cache: {len(fetched_stocks)}")    
        return fetched_stocks
            
            
    except Exception as e:
        logging.error(f"error getting symbol for {symbol}: {e}")

