from flask import Flask
from routes import items, orders, offers
from utils.logger import setup_logging
from utils.errors import setup_error_handlers
from flask_cors import CORS
def create_app():
    app = Flask(__name__)
    setup_logging(app)
    
    # Register blueprints
    app.register_blueprint(items.bp)
    app.register_blueprint(orders.bp)
    app.register_blueprint(offers.bp)
    
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
    
    # Setup error handlers
    setup_error_handlers(app)

    
    return app

app = create_app()
@app.route("/ping")
def ping():
    return {"message": "pong"}

if __name__ == '__main__':
    app.run(debug=True)