from flask import jsonify
from http import HTTPStatus

class NotFoundError(Exception):
    pass

class InvalidInputError(Exception):
    pass

class OutOfStockError(Exception):
    pass

def setup_error_handlers(app):
    @app.errorhandler(NotFoundError)
    def handle_not_found(error):
        return jsonify({'error': str(error)}), HTTPStatus.NOT_FOUND
    
    @app.errorhandler(InvalidInputError)
    def handle_invalid_input(error):
        return jsonify({'error': str(error)}), HTTPStatus.BAD_REQUEST
    
    @app.errorhandler(OutOfStockError)
    def handle_out_of_stock(error):
        return jsonify({'error': str(error)}), HTTPStatus.BAD_REQUEST
    
    @app.errorhandler(Exception)
    def handle_unexpected_error(error):
        app.logger.error(f"Unexpected error: {str(error)}")
        return jsonify({'error': 'An unexpected error occurred'}), HTTPStatus.INTERNAL_SERVER_ERROR