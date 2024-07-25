# from utils.bell_curve import create_bell_curve
from services.stock_info_service import combine_fetched_scraped_info, stocklist
from models.sector_enum import Sector
import pandas as pd
import numpy as np


def get_stock_info_for_histogram(sector, category, listBoard=None, industry=None, marketCap=None, recKey=None, recMean=None):
    try: 
        stock_quantitative_data = []
        print(f"stocklist: {len(stocklist)}")
        for stock in stocklist:
            if stock.get('sector') == sector and category in stock:
                if listBoard and stock.get('listing_board') != listBoard:
                    continue
                if industry and stock.get('industry') != industry:
                    continue
                if marketCap and stock.get('marketCap') != marketCap:
                    continue
                if recKey and stock.get('recommendationKey') != recKey:
                    continue
                if recMean and stock.get('recommendationMean') != recMean:
                    continue
        
                # apabila key nya tidak ada, maka nilai dari key akan diubah menjadi nan, tapi key tetap ada
                stock_quantitative_data.append({
                    "symbol" : stock.get("symbol"),
                    "listingBoard": stock.get("listing_board"),
                    "industry" :  stock.get("industry"),
                    "sector" : stock.get("sector"),
                    "marketCap" : stock.get("marketCap"),
                    "recommendationKey" : stock.get("recommendationKey"),
                    "recommendationMean" : stock.get("recommendationMean"),
                    "debtToEquity" : stock.get("debtToEquity"),
                    "forwardEps" : stock.get("forwardEps"),
                    "forwardPE" : stock.get("forwardPE"),
                    "freeCashflow" : stock.get("freeCashflow"),
                    "grossMargins" : stock.get("grossMargins"),
                    "returnOnAssets" : stock.get("returnOnAssets"),
                    "returnOnEquity" : stock.get("returnOnEquity"),
                    "revenueGrowth" : stock.get("revenueGrowth"),
                    "revenuePerShare" : stock.get("revenuePerShare"),
                    "totalRevenue" : stock.get("totalRevenue"),
                    "totalCash" : stock.get("totalCash"),
                    "totalCashPerShare" : stock.get("totalCashPerShare"),
                    "trailingEps": stock.get("trailingEps"),
                    "trailingPE" : stock.get("trailingPE"),
                    })
        
        print(f"sector quantitative: {stock_quantitative_data}")
        print(f"sector quantitative: {len(stock_quantitative_data)}")
        return stock_quantitative_data
    except Exception as e:
        print(f"error: {e}")

