from utils.idx_list_scrape import *

# append_info_bp = Blueprint("append_info", __name__)

def append_info():
    stocks=scrape_stock()
    print(stocks)

