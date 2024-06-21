from flask import Blueprint, jsonify
import yfinance as yf
from utils.add_jk import addJK2
from utils.convertTimestamp import convert_timestamp
import logging
from services.stock_financials_services import *

financials_bp = Blueprint('financials', __name__)

symbol_arr = addJK2()



@financials_bp.route('/financials/q-income-statement/<symbol>', methods=['GET'])
def get_quarterly_income_statement(symbol):
    income_stmt = get_q_inc_stmt_with_cache(symbol)
    return jsonify(income_stmt)
    
@financials_bp.route('/financials/q-income-statement', methods=['GET'])
def get_all_quarterly_income_statement():
    all_income_statement = get_all_q_income_statement_with_cache()
    return jsonify(all_income_statement)


@financials_bp.route('/financials/quarterly-balance-sheet/<symbol>', methods=['GET'])   
def get_quarterly_balance_sheet(symbol):
    try:
        stock = yf.Ticker(symbol)
        financials = stock.quarterly_balance_sheet
        financials_dict = convert_timestamp(financials.to_dict())
        return jsonify({
            'quarterly-balance-sheet': financials_dict,
            'symbol': symbol
        })
    except Exception as e:
        logging.error(f"Error getting stock info for {symbol}: {e}")
        return jsonify({"error": str(e)}), 500
    
@financials_bp.route('/financials/quarterly-balance-sheet', methods=['GET'])
def get_all_quarterly_balance_sheet():
    financials_arr = []
    for symbol in symbol_arr:
        try:
            stock = yf.Ticker(symbol)
            financials = stock.quarterly_balance_sheet
            financials_dict = convert_timestamp(financials.to_dict())
            financials_arr.append({
                'symbol': symbol,
                'quarterly-balance-sheet': financials_dict
            })
        except Exception as e:
            logging.error(f"error getting symbol for {symbol}: {e}")
    return jsonify(financials_arr)


@financials_bp.route('/financials/quarterly-cash-flow/<symbol>', methods=['GET'])   
def get_quarterly_cash_flow(symbol):
    try:
        stock = yf.Ticker(symbol)
        financials = stock.quarterly_cashflow
        financials_dict = convert_timestamp(financials.to_dict())
        return jsonify({
            'quarterly-cash-flow': financials_dict,
            'symbol': symbol
        })
    except Exception as e:
        logging.error(f"Error getting stock info for {symbol}: {e}")
        return jsonify({"error": str(e)}), 500
    
@financials_bp.route('/financials/quarterly-cash-flow', methods=['GET'])
def get_all_quarterly_cash_flow():
    financials_arr = []
    for symbol in symbol_arr:
        try:
            stock = yf.Ticker(symbol)
            financials = stock.quarterly_cashflow
            financials_dict = convert_timestamp(financials.to_dict())
            financials_arr.append({
                'symbol': symbol,
                'quarterly-cash-flow': financials_dict
            })
        except Exception as e:
            logging.error(f"error getting symbol for {symbol}: {e}")
    return jsonify(financials_arr)