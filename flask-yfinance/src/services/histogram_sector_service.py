# from utils.bell_curve import create_bell_curve
from services.fetching_stock_info_service import combine_fetched_scraped_info
from models.sector_enum import Sector
import pandas as pd
import numpy as np


def get_stock_info_for_histogram(sector, category, listBoard=None, industry=None, marketCap=None, recKey=None, recMean=None):
    try: 
        stock_quantitative_data = []
        stocklist = combine_fetched_scraped_info()
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
                    "symbol" : stock.get("underlyingSymbol", np.nan),
                    "listingBoard": stock.get("listing_board", np.nan),
                    "industry" :  stock.get("industry", np.nan),
                    "sector" : stock.get("sector", np.nan),
                    "marketCap" : stock.get("marketCap", np.nan),
                    "recommendationKey" : stock.get("recommendationKey", np.nan),
                    "recommendationMean" : stock.get("recommendationMean", np.nan),
                    "debtToEquity" : stock.get("debtToEquity", np.nan),
                    "forwardEps" : stock.get("forwardEps", np.nan),
                    "forwardPE" : stock.get("forwardPE", np.nan),
                    "freeCashflow" : stock.get("freeCashflow", np.nan),
                    "grossMargins" : stock.get("grossMargins", np.nan),
                    "grossProfits" : stock.get("grossProfits", np.nan),
                    "netProfitMargins" : stock.get("netProfitMargins", np.nan),
                    "returnOnAssets" : stock.get("returnOnAssets", np.nan),
                    "returnOnEquity" : stock.get("returnOnEquity", np.nan),
                    "revenueGrowth" : stock.get("revenueGrowth", np.nan),
                    "revenuePerShare" : stock.get("revenuePerShare", np.nan),
                    "totalDebt" : stock.get("totalDebt", np.nan),
                    "totalRevenue" : stock.get("totalRevenue", np.nan),
                    "totalCash" : stock.get("totalCash", np.nan),
                    "totalCashPerShare" : stock.get("totalCashPerShare", np.nan),
                    "trailingEps": stock.get("trailingEps", np.nan),
                    "trailingPE" : stock.get("trailingPE", np.nan),
                    "trailingPegRatio" : stock.get("trailingPegRatio", np.nan),
                    })
        print(f"sector quantitative: {len(stock_quantitative_data)}")
        return stock_quantitative_data
    except Exception as e:
        print(f"error: {e}")

