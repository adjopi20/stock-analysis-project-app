from flask import Flask
from controllers import blueprints
# from utils.histogram import *
from utils.mean import trimmed_mean
import redis

    
app=Flask(__name__)
client=redis.Redis()


for blueprint in blueprints:
    app.register_blueprint(blueprint)

if __name__ == '__main__':
    app.run(host='localhost', port=5001, debug=False)
    # histogram_tool()
    trimmed_mean()

