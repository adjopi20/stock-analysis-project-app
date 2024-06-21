import logging
from utils.convertTimestamp import convert_timestamp
import yfinance as yf
from utils.add_jk import addJK2
from configs.cache_config import cache_ttl, client
import pydantic
import json
import redis

symbol_arr = addJK2()

def get_quarterly_income_statement(symbol):
    try:
        stock = yf.Ticker(symbol)
        financials = stock.quarterly_income_stmt
        financials_dict = convert_timestamp(financials.to_dict())
        return ({
            'quarterly-income-statement': financials_dict,
            'symbol': symbol
        })
    except Exception as e:
        logging.error(f"Error getting stock info for {symbol}: {e}")
        return ({"error": str(e)}), 500
    
def get_all_q_income_statement():
    financials_arr = []
    for symbol in symbol_arr:
        try:
            stock = yf.Ticker(symbol)
            financials = stock.quarterly_income_stmt
            financials_dict = convert_timestamp(financials.to_dict())
            financials_arr.append({
                'symbol': symbol,
                'quarterly-income-statement': financials_dict
            })
        except Exception as e:
            logging.error(f"error getting symbol for {symbol}: {e}")
    return financials_arr

def get_all_q_income_statement_with_cache():
    stocks_income_statement = get_all_q_income_statement()
    cache_key = "financials_income_statement"

    try:
        cached_raw_value = client.get(cache_key)
        
        if cached_raw_value is not None:
            typeAdapter = pydantic.TypeAdapter(list)
            retrieved_cached = typeAdapter.validate_json(cached_raw_value)
            print(f"cached: {len(retrieved_cached)}")
            return retrieved_cached

        raw_value = json.dumps(stocks_income_statement)
        
        client.set(cache_key, raw_value, ex=cache_ttl)
        print(f"not cached: {len(stocks_income_statement)}")
        return stocks_income_statement
    
    except Exception as e:
        logging.error(f"found error: {e}")

def get_q_inc_stmt_with_cache(symbol):
    cache_key: str = symbol

    try:
        cached_raw_value = client.get(cache_key)

        if cached_raw_value is not None:
            typeAdapter = pydantic.TypeAdapter(dict)
            retrieved_cache = typeAdapter.validate_json(cached_raw_value)
            print("with cache")
            return retrieved_cache

        inc_stmt = (yf.Ticker(symbol).quarterly_income_stmt).to_dict()
        financial_dict = convert_timestamp(inc_stmt)
        res = {
            'symbol' : symbol,
            'quarterly_income_statement' : financial_dict
        }

        client.set(cache_key, json.dumps(res), ex=cache_ttl)
        print("without cache")
        return res
    except Exception as e:  
        logging.error(f"found error: {e}")            
    



    # financials_arr = []
    # for symbol in symbol_arr:
    #     try:
    #         stock = yf.Ticker(symbol)
    #         financials = stock.quarterly_income_stmt
    #         financials_dict = convert_timestamp(financials.to_dict())
    #         financials_arr.append({
    #             'symbol': symbol,
    #             'quarterly-income-statement': financials_dict
    #         })
    #     except Exception as e:
    #         logging.error(f"error getting symbol for {symbol}: {e}")
    # return financials_arr