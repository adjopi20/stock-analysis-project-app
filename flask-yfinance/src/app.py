from flask import Flask
from controllers import blueprints
from services.append_info import append_info 

import logging
    
app=Flask(__name__)

for blueprint in blueprints:
    app.register_blueprint(blueprint)

# logging.basicConfig(level=logging.ERROR)


if __name__ == '__main__':
    app.run(host='localhost', port=5001, debug=False)
    append_info()

