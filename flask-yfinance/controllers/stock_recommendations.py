from flask import Blueprint, jsonify
import yfinance as yf
import pandas as pd
from utils.excelParser import symbol_arr
from utils.convertTimestamp import convert_timestamp
import logging

recommendations_bp = Blueprint('recommendations', __name__)

@recommendations_bp.route('/recommendations/<symbol>', methods=['GET'])
def get_recommendations(symbol):
    try:
        stock = yf.Ticker(symbol)
        recommendations = stock.recommendations
        recommendations_dict = convert_timestamp(recommendations.to_dict())
        recommendations_summary = stock.recommendations_summary
        recommendations_summary_dict = convert_timestamp(recommendations_summary.to_dict())
        upgrades_downgrades = stock.upgrades_downgrades
        upgrades_downgrades_dict = convert_timestamp(upgrades_downgrades.to_dict())
        return jsonify({
            'recommendations_summary': recommendations_summary_dict,
            'recommendations': recommendations_dict,
            'upgrades_downgrades': upgrades_downgrades_dict,
            'symbol': symbol
        })
    except Exception as e:
        logging.error(f"Error getting stock info for {symbol}: {e}")
        return jsonify({"error": str(e)}), 500  
    
@recommendations_bp.route('/recommendations', methods=['GET'])
def get_all_recommendations():
    recommendations_arr = []
    for symbol in symbol_arr:
        try:
            stock = yf.Ticker(symbol)
            recommendations = stock.recommendations
            recommendations_dict = convert_timestamp(recommendations.to_dict())
            recommendations_summary = stock.recommendations_summary
            recommendations_summary_dict = convert_timestamp(recommendations_summary.to_dict())
            upgrades_downgrades = stock.upgrades_downgrades
            upgrades_downgrades_dict = convert_timestamp(upgrades_downgrades.to_dict())
            recommendations_arr.append({
                'symbol': symbol,
                'recommendations_summary': recommendations_summary_dict,
                'recommendations': recommendations_dict,
                'upgrades_downgrades': upgrades_downgrades_dict
            })
        except Exception as e:
            logging.error(f"error getting symbol for {symbol}: {e}")
    return jsonify(recommendations_arr)

