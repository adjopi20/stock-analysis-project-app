from flask import Blueprint, jsonify, request
from utils.histogram import histogram_tool
from services.fetching_stock_info_service import combine_fetched_scraped_info
import json
import numpy as np

hist_bp = Blueprint('hist', __name__)

@hist_bp.route('/histogram-analysis-for-sector/<sector>/<category>', methods=['GET'])
def histogram_for_sector(sector: str, category: str):
        
    try:
        #request param
        listingBoard = request.args.get('listingBoard')
        industry = request.args.get('industry')
        marketCap = request.args.get('marketCap')
        recKey = request.args.get('recommendationKey')  
        recMean = request.args.get('recommendationMean')  

        freq, bin_edges_list = histogram_tool(sector, category) #bin edges disini dtype sudah list dari metod yg di return
        freq_list = freq.tolist()
        
        if freq_list is not None and bin_edges_list is not None:
            return jsonify({sector + " - " + category : {
                "freq": freq_list,
                "bin_edges": bin_edges_list
            }
            })
        
    except Exception as e:
        return jsonify({"error": f"Exception occurred: {str(e)}"}), 500

@hist_bp.route('/table-for-sector/<sector>/<category>', methods=['GET'])
def table_for_sector(sector: str, category: str):
    try: 
        stocklist = combine_fetched_scraped_info()
        table = []
        # count = 0
        for stock in stocklist:
            # if key, value in stock.items():
            #     if isinstance(value, set):
            if 'sector' in stock and stock['sector'] == sector and category in stock :
                items = ({ #disini aku tau bahwa ternyata dictionary itu disebut juga dengan set
                    'symbol': stock.get('symbol', np.nan),
                    'listingBoard': stock.get('listing_board', np.nan),
                    category : stock.get(category, np.nan),
                    'sector': stock.get('sector', np.nan),
                    'industry': stock.get('industry', np.nan),
                })
                
                table.append(items)
                # count +=1
        
        table.sort(key= lambda x: x[category], reverse=False)
        # print(f"jumlah banyak: count: {count}")
        return jsonify(table)

    except Exception as e:
        return jsonify({f"error: {e}"}), 500