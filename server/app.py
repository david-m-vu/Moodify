from flask import Flask
from flask_cors import CORS  

from routes import main

def create_app():
    app = Flask(__name__) 
    CORS(app, origins=["https://david-m-vu.github.io", "http://localhost:3000"])

    app.register_blueprint(main)

    return app

