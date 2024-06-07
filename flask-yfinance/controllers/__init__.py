from controllers.stock_actions import *
from controllers.stock_history import *
from controllers.stock_info import *
from controllers.stock_financials import *
from controllers.stock_holders import *
from controllers.stock_recommendations import *

blueprints = [
    info_bp,
    history_bp,
    actions_bp,
    financials_bp,
    holders_bp,
    recommendations_bp
]