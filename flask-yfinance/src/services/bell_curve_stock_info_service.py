# from utils.bell_curve import create_bell_curve
from services.fetching_stock_info_service import combine_fetched_scraped_info
from models.sector_enum import Sector
import pandas as pd
import numpy as np


def get_stock_info_for_bell_curve():
    try: 
        sector = "Basic Materials"
        stock_per_sector = []
        stocklist = combine_fetched_scraped_info()
        print(f"stocklist: {len(stocklist)}")
        for stock in stocklist:
            if stock.get("sector", None) == sector :
                stock_per_sector.append({
                    "symbol" : stock["underlyingSymbol"],
                    "listingBoard": stock["listing_board"],
                    "industry" :  stock["industry"],
                    "sector" : stock.get("sector", np.nan),
                    "marketCap" : stock["marketCap"],
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
        print(f"sector: {len(stock_per_sector)}")
        return stock_per_sector
    except Exception as e:
        print(f"error: {e}")

def bell_curve_stock_info():
    try:
        stock_per_sector = []
        stocklist = get_stock_info_for_bell_curve()  # Replace with your actual data retrieval function

        for stock in stocklist:
            # Example of extracting relevant fields, modify as per your actual data structure
            if 'returnOnEquity' in stock:
                stock_per_sector.append({
                    "symbol": stock.get("symbol", np.nan),
                    "returnOnEquity": stock["returnOnEquity"],
                    # Add other relevant fields
                })
            

        df = pd.DataFrame(stock_per_sector)
        print(f"a:{df[df['symbol'].isna()] }")
        return df

    except Exception as e:
        print(f"Error in bell_curve_stock_info: {e}")
        return None
    # try:
    #     res = get_stock_info_for_bell_curve()
    #     df = pd.DataFrame(res)
    #     print(df)
    # except Exception as e :
    #     print(f"{e}")
bell_curve_stock_info()






                                           

        
