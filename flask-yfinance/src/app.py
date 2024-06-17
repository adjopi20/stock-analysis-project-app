from flask import Flask
from flask_apscheduler import APScheduler
from controllers import blueprints
from flask_caching import Cache

import logging
    
app=Flask(__name__)

#initialize cache
cache = Cache(app, config={'CACHE_TYPE':'simple'})

#initialize scheduler
scheduler = APScheduler()
scheduler.api_enabled = True
scheduler.init_app(app)
scheduler.start()

for blueprint in blueprints:
    app.register_blueprint(blueprint)

if __name__ == '__main__':
    app.run(host='localhost', port=5001, debug=False)



