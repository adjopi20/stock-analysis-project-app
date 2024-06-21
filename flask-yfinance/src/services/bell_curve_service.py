from utils.bell_curve import create_bell_curve
from services.fetching_stock_info_service import combine_fetched_scraped_info

def bell_curve_stock_info():
    try:
        list_name = combine_fetched_scraped_info()
        res = create_bell_curve(list_name)
        print(res)
    except Exception as e :
        print(f"{e}")
bell_curve_stock_info()