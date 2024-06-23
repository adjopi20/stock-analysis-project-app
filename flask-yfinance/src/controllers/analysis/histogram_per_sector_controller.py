from flask import Blueprint, jsonify
from utils.histogram import histogram_tool
import json

hist_bp = Blueprint('hist', __name__)

@hist_bp.route('/histogram-analysis-for-sector/<sector>/<category>', methods=['GET'])
def histogram_for_sector(sector: str, category: str):
        
    try:
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