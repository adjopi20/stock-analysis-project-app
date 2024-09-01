from flask import Flask
from controllers import blueprints
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
import pytz
from services.stock_info_service import combine_fetched_scraped_info
from controllers.basic.stock_history import get_all_history_metadata
from controllers.basic.stock_news import get_all_news
import redis

    
app=Flask(__name__)
client=redis.Redis()

scheduler = BackgroundScheduler()
jakarta_tz = pytz.timezone('Asia/Jakarta')

scheduler.add_job(combine_fetched_scraped_info, CronTrigger(hour=4, minute=0, timezone=jakarta_tz))
scheduler.add_job(get_all_history_metadata, CronTrigger(hour=5, minute=0, timezone=jakarta_tz), args=['5d'])
scheduler.add_job(get_all_history_metadata, CronTrigger(hour=5, minute=5, timezone=jakarta_tz), args=['1mo'])
scheduler.add_job(get_all_history_metadata, CronTrigger(hour=5, minute=10, timezone=jakarta_tz), args=['3mo'])
scheduler.add_job(get_all_history_metadata, CronTrigger(hour=5, minute=15, timezone=jakarta_tz), args=['6mo'])
scheduler.add_job(get_all_history_metadata, CronTrigger(hour=5, minute=20, timezone=jakarta_tz), args=['1y'])
scheduler.add_job(get_all_history_metadata, CronTrigger(hour=5, minute=25, timezone=jakarta_tz), args=['2y'])
scheduler.add_job(get_all_history_metadata, CronTrigger(hour=5, minute=30, timezone=jakarta_tz), args=['5y'])
scheduler.add_job(get_all_news, CronTrigger(hour=4, minute=45, timezone=jakarta_tz))


scheduler.start()

CORS(app)   

for blueprint in blueprints:
    app.register_blueprint(blueprint)

if __name__ == '__main__':
    try:
        app.run(debug=False)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()

    