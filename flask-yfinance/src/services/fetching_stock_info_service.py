import yfinance as yf
from utils.add_jk import addJK2
import logging
from configs.config import session
from services.scraping_stock_info_service import scrape_stock_with_cache
import pydantic
from configs.cache_config import cache_ttl, client
import json

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


def fetched_info_with_cache():
    cache_key = 'fetched_all_stock'

    try:
        #get chaced file if it exist
        cached_raw_value= client.get(cache_key)

        if cached_raw_value is not None:
            typeAdapter = pydantic.TypeAdapter(list) #buat adapter dengan tipe value yang akan kita keluarkan
            retrieved_fetched_stock = typeAdapter.validate_json(cached_raw_value) #ambil jsonnya dan masukkan ke adapter
            print(f"fetching_stock_info_service.fetched_info_with_cache.retrieved_fetched_stock_info: {len(retrieved_fetched_stock)}")
            return retrieved_fetched_stock

        #now, save it in chace
        fetched_stocks = fetched_info_without_cache()
        raw_value = json.dumps(fetched_stocks)
        client.set(cache_key, raw_value, ex=cache_ttl)
        
        print(f"fetching_stock_info_service.fetched_info_with_cache.fetched_stock_info: {len(fetched_stocks)}")
        return fetched_stocks

    except Exception as e:
        logging.error(f"found error : {e}")

def combine_fetched_scraped_info():
    stock_info = {}
    stocks_info = []
    scraped_stocks = scrape_stock_with_cache()
    # print(f"controller.get_all_info_with_cache.scraped_stocks: {len(scraped_stocks)}")        
    fetched_stocks = fetched_info_with_cache()
    # print(f"controller.get_all_info_with_cache.fetched_stocks: {len(fetched_stocks)}")        


    try:

        for fetched_stock, scraped_stock in zip(fetched_stocks, scraped_stocks):            
            if scraped_stock["symbol"] == fetched_stock["symbol"]:
                stock_info = {**scraped_stock, **fetched_stock}
                stocks_info.append(stock_info)

        # print(f"kontollllll {len(stocks_info)}")
        return stocks_info

    except Exception as e:
        logging.error(f"found error : {e}")
combine_fetched_scraped_info()
