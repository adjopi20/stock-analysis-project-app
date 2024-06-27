# from flask import current_app


# @scheduler.task('cron', id="update_cache", hour=0)
# def update_cache():
#     with current_app.app_context():
#         cache2 = current_app.extensions['cache']
#         cache2.delete('stock_info')