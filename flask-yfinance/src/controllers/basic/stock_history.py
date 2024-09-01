from flask import Blueprint, jsonify, request
import json
import pydantic
import yfinance as yf 
import pandas as pd
from utils.add_jk import addJK
from utils.convertTimestamp import convert_timestamp
from services.stock_info_service import scrape_stock_with_cache
import logging
from configs.cache_config import client, cache_ttl

history_bp = Blueprint('history', __name__)

# symbol_arr = addJK

@history_bp.route('/history-metadata/<period>', methods=['GET'])
def get_all_history_metadata(period ):
    cache_key = f'all_historical_price_{period}'
    stock_arr = []
    scraped_stock = scrape_stock_with_cache()
    try: 
        cached_raw_value = client.get(cache_key)

        if cached_raw_value is not None:
            typeAdapter = pydantic.TypeAdapter(list)
            retrieved_data = typeAdapter.validate_json(cached_raw_value)
            print(f"stock_history.get_all_history_metadata: {len(retrieved_data)}")
            return retrieved_data
        
        for item in scraped_stock:
            symbol = (item['symbol'])
            try:
                start = request.args.get('start')
                end = request.args.get('end')

                # condition3 = lambda x: x.get('listing_board') == listingBoard if listingBoard  else True
                # condition4 = lambda x: int(x.get('marketCap'))>= int(minMarketCap) if minMarketCap else True

                stock = yf.Ticker(symbol)
                hist = stock.history(period=period, start=start, end=end)
                
                if hist.empty:
                    continue
                else:   
                    # hist.index = hist.index.strftime('%Y-%m-%d')
                    # metadata = stock.history_metadata
                    hist_dict = convert_timestamp(hist.to_dict()) 
                    metadata = stock.history_metadata

                    stock_arr.append(({
                        # 'history': hist.to_dict(orient='index'),
                        'history': hist_dict,
                        'metadata': metadata
                    }))  
            except Exception as e:
                logging.error(f"error getting symbol for {symbol}: {e}")
        
        raw_value = json.dumps(stock_arr)
        client.set(cache_key, raw_value, ex=cache_ttl)
        return stock_arr

    except Exception as e:
        logging.error(f"found error: {e}")
    return jsonify({"data" : stock_arr,
                    "count" : len(stock_arr)}) 

@history_bp.route('/history-metadata/<symbol>/<period>', methods=['GET'])
def get_history_metadata(symbol, period):
    try:
        start = request.args.get('start')
        end = request.args.get('end')

        stock = yf.Ticker(symbol)
        hist = stock.history(period=period, start=start, end=end)

        hist_dict = convert_timestamp(hist.to_dict()) 
        metadata = stock.history_metadata

        return jsonify({
            'history': hist_dict,
            'metadata': metadata
        })

    except Exception as e:
        logging.error(f"Error getting stock info for {symbol}: {e}")
        return jsonify({"error": str(e)}), 500
    
