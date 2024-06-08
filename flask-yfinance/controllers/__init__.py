from controllers.stock_actions import *
from controllers.stock_history import *
from controllers.stock_info import *
from controllers.stock_financials import *
from controllers.stock_holders import *
from controllers.stock_recommendations import *
from controllers.stock_news import *

blueprints = [
    info_bp,
    history_bp,
    actions_bp,
    financials_bp,
    holders_bp,
    recommendations_bp,
    news_bp
]