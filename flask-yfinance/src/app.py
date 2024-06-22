from flask import Flask
from controllers import blueprints
from services.bell_curve_stock_info_service import bell_curve_stock_info
import redis

    
app=Flask(__name__)
client=redis.Redis()


for blueprint in blueprints:
    app.register_blueprint(blueprint)

if __name__ == '__main__':
    app.run(host='localhost', port=5001, debug=False)
    # bell_curve_stock_info()
    
