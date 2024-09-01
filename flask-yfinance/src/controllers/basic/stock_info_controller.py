
from flask import Blueprint, jsonify, render_template_string, send_file, request
import matplotlib.pyplot as plt
import io
import yfinance as yf
import pandas as pd
from utils.add_jk import addJK
import logging
from services.stock_info_service import stocklist, combine_fetched_scraped_info, scrape_stock_with_cache
from services.histogram_sector_service import *
import numpy as np
from configs.cache_config import client
import math

info_bp = Blueprint('info', __name__)

# stocklist=combine_fetched_scraped_info()

@info_bp.route('/info/<symbol>', methods=['GET'])
def get_info(symbol):
    try:
        stocks_info = combine_fetched_scraped_info()
        for stock_info in stocks_info:
            # Ensure stock_info is a dictionary and 'symbol' key exists and is a string
            if isinstance(stock_info, dict) and 'symbol' in stock_info and isinstance(stock_info['symbol'], str):
                if stock_info['symbol'].lower() == symbol.lower():
                    return jsonify(stock_info)
        # If symbol not found, return a 404 response
        return jsonify({"error": "Symbol not found"}), 404
    except Exception as e:
        print(f"stock_info.get_info.error: {e}")
        return jsonify({"error": str(e)}), 500

@info_bp.route('/info2/<symbol>', methods=['GET'])
def get_info2(symbol):
    try:
        ticker = yf.Ticker(symbol)
        ticker_info = ticker.info
        return jsonify(ticker_info)
        # If symbol not found, return a 404 response
        # return jsonify({"error": "Symbol not found"}), 404
    except Exception as e:
        print(f"stock_info.get_info.error: {e}")
        return jsonify({"error": str(e)}), 500


#alternative way, manual
@info_bp.route('/info/stocklist2', methods=['GET']) #cadangan seandainya sumber data yang dr cache tidak tersedia
def get_all_info2():
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
def get_all_info():
    stock_info = {}
    stocks_info = []
    
    # stocklist = combine_fetched_scraped_info()
    print(f"stocklist: {len(stocklist)}")

    # energy_stock_list = list(filter(lambda x : x.get('sector') == 'Energy', stocklist))
    # print(f"stocklist: {len(energy_stock_list)}")

    try:
        sector = request.args.get('sector')
        industry = request.args.get('industry')
        listingBoard = request.args.get('listingBoard')
        minMarketCap = request.args.get('minMarketCap')
        maxMarketCap = request.args.get('maxMarketCap')
        minPrice = request.args.get('minPrice')
        maxPrice = request.args.get('maxPrice')
        recommendation = request.args.get('recommendation')
        minDividendRate = request.args.get('minDividendRate')
        maxDividendRate = request.args.get('maxDividendRate')
        key = request.args.get('sortBy')
        order = request.args.get('order')
        # page = request.args.get('page', 1, int)
        # limit = request.args.get('limit', 12, int)

        condition1 = lambda x: x.get('sector') == sector if sector else True #anjing trnyata sebenarnya lambda x itu adalah def function(x)
        condition2 = lambda x: x.get('industry') == industry if industry else True
        condition3 = lambda x: x.get('listing_board') == listingBoard if listingBoard  else True
        condition4 = lambda x: int(x.get('marketCap'))>= int(minMarketCap) if minMarketCap else True
        condition5 = lambda x: int(x.get('marketCap'))< int(maxMarketCap) if maxMarketCap else True
        condition6 = lambda x: int(x.get('currentPrice')) >= int(minPrice) if minPrice else True
        condition7 = lambda x: int(x.get('currentPrice')) < int(maxPrice) if maxPrice else True 
        condition8 = lambda x: x.get('recommendationKey') == recommendation if recommendation else True
        condition9 = lambda x: round(float(x.get('dividendRate',0.0)), 0) >= round(float(minDividendRate), 0) if minDividendRate else True
        condition10 = lambda x: round(float(x.get('dividendRate',0.0)), 0) < round(float(maxDividendRate), 0) if maxDividendRate else True 

        filtered_stock = filter(lambda x : condition1(x) 
                                and condition2(x) 
                                and condition3(x) 
                                and condition4(x) and condition5(x)
                                and condition6(x) and condition7(x)
                                and condition8(x)
                                and condition9(x) and condition10(x)
                                , stocklist) # karna refer ke object yang sama, jadi harus nya di lambda lagi dengan satu parameter x yang mana parameter x ini dimasukkan lagi ke dua function di dalamnya.
        # karna kalau kita cuma pake condition1 and condition2 dia ga refer ke object yang sama, cuma flase atau true, kombinasi dari value itu
        filtered_stock_list = list(filtered_stock)
        # paged_filtered_stock_list = filtered_stock_list[(page*limit-limit):page*limit]#ini istilahnya kan menyaring dari awl ke akhir, tapi karena array akhir itu ga inclusive jadi kita buat aja dari arr[0] sampai arr[12]
        sorted_paged_filtered_stock_list = sorted(filtered_stock_list, key=lambda x: x.get(key, 0.0) if x.get(key) is not None else 0.0, reverse=order=='desc')
        # print(f"stock_info.get_all_info2.stocks_info: {len(filtered_stock_list)}")
        return jsonify({
            # 'currentPage': int(page),
            # 'limit':limit,
            # 'totalPage' : math.ceil(len(filtered_stock_list)/limit),
            'total': len(stocklist),
            'totalChosenItems': len(list(filtered_stock_list)),
            'data': list(sorted_paged_filtered_stock_list)})

    except Exception as e:
        logging.error(f"stock_info.get_all_info error : {e}")

@info_bp.route('/filter-options', methods=['GET'])
def filter_options():
    # stocklist = combine_fetched_scraped_info()
    metric=["bookValue", "currentPrice", "currentRatio", "debtToEquity", "dividendRate", "dividendYield", "earningsGrowth", "earningsQuarterlyGrowth",
            "ebitda","ebitdaMargins", "enterpriseToEbitda","enterpriseToRevenue","enterpriseValue","floatShares", "forwardEps","forwardPE",
            "freeCashflow","grossMargins","heldPercentInsiders","heldPercentInstitutions","marketCap", "netIncomeToCommon", "operatingCashflow",
            "operatingMargins","payoutRatio","pegRatio","priceToBook","profitMargins","quickRatio","returnOnAssets","returnOnEquity","revenueGrowth",
            "revenuePerShare", "sharesOutstanding","stock_shares","totalCash","totalCashPerShare","totalRevenue","trailingEps","trailingPE","volume"]

    listingBoard = list(set(item['listing_board'] for item in stocklist))
    sector = list(set(item['sector'] for item in stocklist))
    industry = list(set(item['industry'] for item in stocklist))
    recommendationKey = list(set(item['recommendationKey'] for item in stocklist))

    return jsonify({
        'listingBoard':listingBoard,
        'sector': sector,
        'industry': industry,
        'recommendationKey': recommendationKey,
        'metrics': metric
    })

@info_bp.route('/clear_cache/<key>', methods=['POST'])
def clear_cache(key):
    try:
        client.delete(key)                
        # client.delete('all-news')
        # client.delete('fetched_all_stock')
        # client.delete('scrape_all_stock')
        # client.delete('all_stock')
        # all_historical_price_{period}
        # curl -X POST http://127.0.0.1:5000/clear_cache/all_historical_price_1mo

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

@info_bp.route('/hist/<sector>/<metric>/hist.png')
def create_bell_curve (sector: str, metric: str):
    
    
    df = pd.DataFrame(get_stock_info_for_histogram(sector, metric))

    # print(f"create_bell_curve.df: {df}")

    if df is None:
        return "No data to display", 400
    
    if metric in df:
        # Filter out None or NaN values
        valid_data = df[metric].dropna()

        
        if not valid_data.empty:
            valid_data.plot.hist(bins=50, color='blue', edgecolor='black')
            plt.xlabel(metric)
            plt.ylabel('Frequency')
            img = io.BytesIO()
            plt.savefig(img, format='png')
            img.seek(0)
            plt.close()
            return send_file(img, mimetype='image/png')
        else:
            return "No valid returnOnEquity data to display"
    else: 
        return f"{metric} column not found"
    
    
@info_bp.route("/hist", methods=['GET'])
def get_hist():
    return render_template_string('''<img src="{{url_for('info.create_bell_curve', sector='Industrials', metric='returnOnEquity')}}" alt="histogram" />''')



