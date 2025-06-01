# utils/logger.py
import logging
import os
from logging.handlers import RotatingFileHandler

def setup_logging(app):
    log_dir = 'logs'
    os.makedirs(log_dir, exist_ok=True)
    
    file_handler = RotatingFileHandler(
        os.path.join(log_dir, 'app.log'),
        maxBytes=1_000_000,
        backupCount=5
    )
    file_handler.setLevel(logging.INFO)
    formatter = logging.Formatter('[%(asctime)s] %(levelname)s in %(module)s: %(message)s')
    file_handler.setFormatter(formatter)

    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)
    app.logger.info("Logging initialized.")
