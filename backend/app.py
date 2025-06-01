from flask import Flask
from routes import items, orders, offers
from utils.logger import setup_logging
from utils.errors import setup_error_handlers
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    
    setup_logging(app)
    app.logger.info("Starting Flask app...")
    app.register_blueprint(items.bp)
    app.register_blueprint(orders.bp)
    app.register_blueprint(offers.bp)
    

    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
    app.logger.info("CORS setup completed.")

    setup_error_handlers(app)
    app.logger.info("Error handlers set up.")

    return app

app = create_app()

@app.route("/ping")
def ping():
    app.logger.info("Ping endpoint was hit.")
    return {"message": "pong"}

if __name__ == '__main__':
    app.logger.info("Running app in debug mode.")
    app.run(debug=True)
