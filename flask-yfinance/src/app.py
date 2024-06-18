from flask import Flask
from controllers import blueprints

    
app=Flask(__name__)



for blueprint in blueprints:
    app.register_blueprint(blueprint)

if __name__ == '__main__':
    app.run(host='localhost', port=5001, debug=False)



