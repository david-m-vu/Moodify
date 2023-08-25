from flask import Flask
from flask_cors import CORS  

from routes import main

def create_app():
    app = Flask(__name__) 
    # when running website in localhost, add http://localhost:3000 to origins
    CORS(app)

    app.register_blueprint(main)

    return app

