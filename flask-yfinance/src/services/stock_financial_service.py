import logging
from utils.convertTimestamp import convert_timestamp
import yfinance as yf
from services.stock_info_service import scrape_stock
from configs.cache_config import cache_ttl, client
import pydantic
import json
import redis

scraped_stocks = scrape_stock()
symbol_arr = [item['symbol'] for item in scraped_stocks]
    
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
    cache_key = "financials_income_statement"

    try:
        cached_raw_value = client.get(cache_key)
        
        if cached_raw_value is not None:
            typeAdapter = pydantic.TypeAdapter(list)
            retrieved_cached = typeAdapter.validate_json(cached_raw_value)
            print(f"cached: {len(retrieved_cached)}")
            return retrieved_cached

        stocks_income_statement = get_all_q_income_statement()
        raw_value = json.dumps(stocks_income_statement)        
        client.set(cache_key, raw_value, ex=cache_ttl)
        print(f"not cached: {len(stocks_income_statement)}")
        return stocks_income_statement
    
    except Exception as e:
        logging.error(f"found error: {e}")

def get_q_inc_stmt_with_cache(symbol):
    cache_key: str = "inc-stmt" + symbol

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
    


#========================================================================
def get_all_q_bal_sheet():
    financials_arr = []
    for symbol in symbol_arr:
        try:
            stock = yf.Ticker(symbol)
            financials = stock.quarterly_balance_sheet
            financials_dict = convert_timestamp(financials.to_dict())
            financials_arr.append({
                'symbol': symbol,
                'quarterly-balance-sheet': financials_dict
            })
        except Exception as e:
            logging.error(f"error getting symbol for {symbol}: {e}")
    return financials_arr

def get_all_q_bal_sheet_with_cache():
    cache_key = "financials_balance_sheet"

    try:
        cached_raw_value = client.get(cache_key)
        
        if cached_raw_value is not None:
            typeAdapter = pydantic.TypeAdapter(list)
            retrieved_cached = typeAdapter.validate_json(cached_raw_value)
            print(f"cached: {len(retrieved_cached)}")
            return retrieved_cached

        stocks_bal_sheet = get_all_q_bal_sheet()
        raw_value = json.dumps(stocks_bal_sheet)
        client.set(cache_key, raw_value, ex=cache_ttl)
        print(f"not cached: {len(stocks_bal_sheet)}")
        return stocks_bal_sheet
    
    except Exception as e:
        logging.error(f"found error: {e}")

def get_q_bal_sheet_with_cache(symbol):
    cache_key: str = "bal-sheet" + symbol

    try:
        cached_raw_value = client.get(cache_key)

        if cached_raw_value is not None:
            typeAdapter = pydantic.TypeAdapter(dict)
            retrieved_cache = typeAdapter.validate_json(cached_raw_value)
            print("with cache")
            return retrieved_cache

        inc_stmt = (yf.Ticker(symbol).quarterly_balance_sheet).to_dict()
        financial_dict = convert_timestamp(inc_stmt)
        res = {
            'symbol' : symbol,
            'quarterly_balance_sheet' : financial_dict
        }

        client.set(cache_key, json.dumps(res), ex=cache_ttl)
        print("without cache")
        return res
    
    except Exception as e:  
        logging.error(f"found error: {e}")  


#========================================================================
def get_all_q_cash_flow():
    financials_arr = []
    for symbol in symbol_arr:
        try:
            stock = yf.Ticker(symbol)
            financials = stock.quarterly_cash_flow
            financials_dict = convert_timestamp(financials.to_dict())
            financials_arr.append({
                'symbol': symbol,
                'quarterly-cash-flow': financials_dict
            })
        except Exception as e:
            logging.error(f"error getting symbol for {symbol}: {e}")
    return financials_arr

def get_all_q_cash_flow_with_cache():
    cache_key = "financials_cash_flow"

    try:
        cached_raw_value = client.get(cache_key)
        
        if cached_raw_value is not None:
            typeAdapter = pydantic.TypeAdapter(list)
            retrieved_cached = typeAdapter.validate_json(cached_raw_value)
            print(f"cached: {len(retrieved_cached)}")
            return retrieved_cached

        stocks_cash_flow = get_all_q_cash_flow()
        raw_value = json.dumps(stocks_cash_flow)
        client.set(cache_key, raw_value, ex=cache_ttl)
        print("not cached")
        return stocks_cash_flow
    
    except Exception as e:
        logging.error(f"found error: {e}")

def get_q_cash_flow_with_cache(symbol):
    cache_key: str = "cash-flow" + symbol

    try:
        cached_raw_value = client.get(cache_key)

        if cached_raw_value is not None:
            typeAdapter = pydantic.TypeAdapter(dict)
            retrieved_cache = typeAdapter.validate_json(cached_raw_value)
            print("with cache")
            return retrieved_cache

        cash_flow = (yf.Ticker(symbol).quarterly_cashflow).to_dict()
        financial_dict = convert_timestamp(cash_flow)
        res = {
            'symbol' : symbol,
            'quarterly_cash_flow' : financial_dict
        }

        client.set(cache_key, json.dumps(res), ex=cache_ttl)
        print("without cache")
        return res
    
    except Exception as e:  
        logging.error(f"found error: {e}")  