from flask import Blueprint, jsonify, request
from utils.histogram import histogram_tool
from utils.mean import trimmed_mean
from services.stock_info_service import combine_fetched_scraped_info
from services.histogram_sector_service import get_stock_info_for_histogram
import json
import numpy as np

hist_bp = Blueprint('hist', __name__)

@hist_bp.route('/histogram-analysis-for-sector/<sector>/<category>', methods=['GET'])
def histogram_for_sector(sector: str, category: str):
        
    # try:
        #request param=========================================================================
        listingBoard = request.args.get('listingBoard')
        industry = request.args.get('industry')
        marketCap = request.args.get('marketCap')
        recKey = request.args.get('recommendationKey')  
        recMean = request.args.get('recommendationMean')  
        #===============================================================================

        #dataset===============================================================================
        dataset = get_stock_info_for_histogram(sector, category, listingBoard, industry, marketCap, recKey, recMean) #dataset disini dtype list()
        #===============================================================================

        #histogram =============================================================================
        freq, bin_edges_list = histogram_tool(dataset, category) #bin edges disini dtype sudah list dari metod yg di return
        freq_list = freq.tolist()
        if freq_list is not None and bin_edges_list is not None:
            histogram_item = {
                "freq": freq_list,
                "bin_edged": bin_edges_list}
        # for item in freq_list:
        #     freq_list[item] += 1

        print(f"isi freq_list: {sum(freq_list)}")
        #===============================================================================

        #table stocklist ==========================================================================================
        table = []

        for stock in dataset:
            items = ({ #disini aku tau bahwa ternyata dictionary itu disebut juga dengan set
                'symbol': stock.get('symbol', 'none'),
                'listingBoard': stock.get('listingBoard', 'none'),
                category : stock.get(category) or 0,
                'sector': stock.get('sector', 'none'),
                'industry': stock.get('industry', 'none'),
                'recommendationKey': stock.get('recommendationKey', 'none'),
                'recommendationMean': stock.get('recommendationMean', 0),
            })
            table.append(items)
                # count +=1
        table.sort(key= lambda x: x[category], reverse=False)
        # print(f"table: {table}")
        #==========================================================================================================      
        
        #trimmed mean==============================================================================================   
        tes = trimmed_mean(dataset, category)
        #==========================================================================================================

        #output================================================================================================
        print(f"dataset: {len(dataset)}, table: {len(table)}")
        if freq_list is not None and bin_edges_list is not None:
            return jsonify({sector + " - " + category :{ 
                "stocklist": table,        
                "histogram": histogram_item,
                "trimmedMean": tes
            }})
        #==========================================================================================================
        
    # except Exception as e:
    #     return jsonify({"error": f"Exception occurred: {str(e)}"}), 500

@hist_bp.route('/histogram-analysis-for-sector-2/<sector>/<category>', methods=['GET'])
def histogram_for_sector_2(sector: str, category: str):
        
    # try:
        #request param=========================================================================
        listingBoard = request.args.get('listingBoard')
        industry = request.args.get('industry')
        marketCap = request.args.get('marketCap')
        recKey = request.args.get('recommendationKey')  
        #===============================================================================

        #dataset===============================================================================
        dataset = get_stock_info_for_histogram(sector, category, listingBoard, industry, marketCap, recKey) #dataset disini dtype list()
        #===============================================================================

        #table stocklist ==========================================================================================
        table = []

        for stock in dataset:
            

            items = ({ #disini aku tau bahwa ternyata dictionary itu disebut juga dengan set
                'symbol': stock.get('symbol', 'none'),
                'listingBoard': stock.get('listingBoard', 'none'),
                category : stock.get(category) or 0,
                'sector': stock.get('sector', 'none'),
                'industry': stock.get('industry', 'none'),
                'recommendationKey': stock.get('recommendationKey', 'none'),
                'recommendationMean': stock.get('recommendationMean', 0),
            })

            if items[category] == 0:
                continue

            table.append(items)
                    # count +=1
        table.sort(key= lambda x: x[category], reverse=False)
        # print(f"table: {table}")
        #==========================================================================================================      
        
        #trimmed mean==============================================================================================   
        tes = trimmed_mean(dataset, category)
        #==========================================================================================================

        #output================================================================================================
        print(f"dataset: {len(dataset)}, table: {len(table)}")
        return jsonify({ 
            "identifier": sector + " - " + category,
            "stocklist": table,        
            "trimmedMean": tes
        })
        #==========================================================================================================
        
    # except Exception as e:
    #     return jsonify({"error": f"Exception occurred: {str(e)}"}), 500


# @hist_bp.route('/table-for-sector/<sector>/<category>', methods=['GET'])
# def table_for_sector(sector: str, category: str):
#     try: 
#         #request param
#         listingBoard = request.args.get('listingBoard')
#         industry = request.args.get('industry')
#         marketCap = request.args.get('marketCap')
#         reckey = request.args.get('recommendationKey')
#         recMean = request.args.get('recommendationMean')

#         stocklist = get_stock_info_for_histogram(sector, category, listingBoard, industry, marketCap,  reckey, recMean)
#         table = []
#         # count = 0
#         for stock in stocklist:
#             # if key, value in stock.items():
#             #     if isinstance(value, set):
#             # if 'sector' in stock and stock['sector'] == sector and category in stock :
#             items = ({ #disini aku tau bahwa ternyata dictionary itu disebut juga dengan set
#                 'symbol': stock.get('symbol', np.nan),
#                 'listingBoard': stock.get('listingBoard', np.nan),
#                 category : stock.get(category, np.nan),
#                 'sector': stock.get('sector', np.nan),
#                 'industry': stock.get('industry', np.nan),
#                 'recommendationKey': stock.get('recommendationKey', np.nan),
#                 'recommendationMean': stock.get('recommendationMean', np.nan),
#             })
            
#             table.append(items)
#                 # count +=1
        
#         table.sort(key= lambda x: x[category], reverse=False)
#         # print(f"jumlah banyak: count: {count}")
#         return jsonify(table)

#     except Exception as e:
#         return jsonify({f"error: {e}"}), 

# @hist_bp.route('/trimmed-mean/', methods=['GET'])
# def mean():
#     tes = trimmed_mean()
#     return jsonify(tes)
