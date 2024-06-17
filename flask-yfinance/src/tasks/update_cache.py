from flask import current_app
from flask_apscheduler import APScheduler

scheduler = APScheduler()

@scheduler.task('cron', id="update_cache", hour=0)
def update_cache():
    with current_app.app_context():
        cache2 = current_app.extensions.get('cache')
        cache2.__delattr__('stock_info')