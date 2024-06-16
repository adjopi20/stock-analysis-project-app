from controllers.stock_actions import actions_bp
from controllers.stock_history import history_bp
from controllers.stock_info import info_bp
from controllers.stock_financials import financials_bp
from controllers.stock_holders import holders_bp
from controllers.stock_recommendations import recommendations_bp
from controllers.stock_news import news_bp

blueprints = [
    info_bp,
    history_bp,
    actions_bp,
    financials_bp,
    holders_bp,
    recommendations_bp,
    news_bp
]