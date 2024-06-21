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
    res = get_q_inc_stmt_with_cache(symbol)
    return jsonify(res)
    
@financials_bp.route('/financials/q-income-statement', methods=['GET'])
def get_all_quarterly_income_statement():
    res = get_all_q_income_statement_with_cache()
    return jsonify(res)

#========================================================================================
@financials_bp.route('/financials/q-balance-sheet/<symbol>', methods=['GET'])   
def get_quarterly_balance_sheet(symbol):
    res= get_q_bal_sheet_with_cache(symbol)
    return jsonify(res)
    
@financials_bp.route('/financials/q-balance-sheet', methods=['GET'])
def get_all_quarterly_balance_sheet():    
    res= get_all_q_bal_sheet_with_cache()
    return jsonify(res)

#==========================================================================================
@financials_bp.route('/financials/q-cash-flow/<symbol>', methods=['GET'])   
def get_quarterly_cash_flow(symbol):
    res = get_q_cash_flow_with_cache(symbol)
    return jsonify(res)
    
@financials_bp.route('/financials/q-cash-flow', methods=['GET'])
def get_all_quarterly_cash_flow():
    res = get_all_q_cash_flow_with_cache()
    return jsonify(res)