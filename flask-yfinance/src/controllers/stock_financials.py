from flask import Blueprint, jsonify
import yfinance as yf
from utils.add_jk import addJK
from utils.convertTimestamp import convert_timestamp
import logging

financials_bp = Blueprint('financials', __name__)

symbol_arr = addJK

@financials_bp.route('/financials/income-statement/<symbol>', methods=['GET'])
def get_income_statement(symbol):
    try:
        stock = yf.Ticker(symbol)
        financials = stock.income_stmt
        financials_dict = convert_timestamp(financials.to_dict())
        return jsonify({
            'income-statement': financials_dict,
            'symbol': symbol
        })
    except Exception as e:
        logging.error(f"Error getting stock info for {symbol}: {e}")
        return jsonify({"error": str(e)}), 500
    
@financials_bp.route('/financials/income-statement', methods=['GET'])
def get_all_income_statement():
    financials_arr = []
    for symbol in symbol_arr:
        try:
            stock = yf.Ticker(symbol)
            financials = stock.income_stmt
            financials_dict = convert_timestamp(financials.to_dict())
            financials_arr.append({
                'symbol': symbol,
                'income-statement': financials_dict
            })
        except Exception as e:
            logging.error(f"error getting symbol for {symbol}: {e}")
    return jsonify(financials_arr)

@financials_bp.route('/financials/quarterly-income-statement/<symbol>', methods=['GET'])
def get_quarterly_income_statement(symbol):
    try:
        stock = yf.Ticker(symbol)
        financials = stock.quarterly_income_stmt
        financials_dict = convert_timestamp(financials.to_dict())
        return jsonify({
            'quarterly-income-statement': financials_dict,
            'symbol': symbol
        })
    except Exception as e:
        logging.error(f"Error getting stock info for {symbol}: {e}")
        return jsonify({"error": str(e)}), 500
    
@financials_bp.route('/financials/quarterly-income-statement', methods=['GET'])
def get_all_quarterly_income_statement():
    financials_arr = []
    for symbol in symbol_arr:
        try:
            stock = yf.Ticker(symbol)
            financials = stock.quarterly_income_stmt
            financials_dict = convert_timestamp(financials.to_dict())
            financials_arr.append({
                'symbol': symbol,
                'quarterly-income-statement': financials_dict
            })
        except Exception as e:
            logging.error(f"error getting symbol for {symbol}: {e}")
    return jsonify(financials_arr)

@financials_bp.route('/financials/balance-sheet/<symbol>', methods=['GET'])
def get_balance_sheet(symbol):
    try:
        stock = yf.Ticker(symbol)
        financials = stock.balance_sheet
        financials_dict = convert_timestamp(financials.to_dict())
        return jsonify({
            'balance-sheet': financials_dict,
            'symbol': symbol
        })
    except Exception as e:
        logging.error(f"Error getting stock info for {symbol}: {e}")
        return jsonify({"error": str(e)}), 500
    
@financials_bp.route('/financials/balance-sheet', methods=['GET'])
def get_all_balance_sheet():
    financials_arr = []
    for symbol in symbol_arr:
        try:
            stock = yf.Ticker(symbol)
            financials = stock.balance_sheet
            financials_dict = convert_timestamp(financials.to_dict())
            financials_arr.append({
                'symbol': symbol,
                'balance-sheet': financials_dict
            })
        except Exception as e:
            logging.error(f"error getting symbol for {symbol}: {e}")
    return jsonify(financials_arr)

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

@financials_bp.route('/financials/cash-flow/<symbol>', methods=['GET'])
def get_cash_flow(symbol):
    try:
        stock = yf.Ticker(symbol)
        financials = stock.cashflow
        financials_dict = convert_timestamp(financials.to_dict())
        return jsonify({
            'cash-flow': financials_dict,
            'symbol': symbol
        })
    except Exception as e:
        logging.error(f"Error getting stock info for {symbol}: {e}")
        return jsonify({"error": str(e)}), 500
    
@financials_bp.route('/financials/cash-flow', methods=['GET'])
def get_all_cash_flow():
    financials_arr = []
    for symbol in symbol_arr:
        try:
            stock = yf.Ticker(symbol)
            financials = stock.cashflow
            financials_dict = convert_timestamp(financials.to_dict())
            financials_arr.append({
                'symbol': symbol,
                'cash-flow': financials_dict
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