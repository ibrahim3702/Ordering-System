from flask import Blueprint, request, jsonify, current_app
from models import orders_db
from schemas import OrderSchema, OrderCreateSchema
from services.ordering import create_order, get_order, get_all_orders
from utils.errors import NotFoundError, InvalidInputError, OutOfStockError

bp = Blueprint('orders', __name__, url_prefix='/orders')

@bp.route('/', methods=['GET'])
def list_orders():
    try:
        current_app.logger.info("GET /orders - Fetching all orders.")
        orders = get_all_orders()
        return jsonify([OrderSchema().dump(order) for order in orders])
    except Exception as e:
        current_app.logger.error(f"Error fetching orders: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500

@bp.route('/', methods=['POST'])
def place_order():
    try:
        data = request.get_json()
        current_app.logger.info(f"POST /orders - Received order data: {data}")

        order_data = OrderCreateSchema().load(data)
        current_app.logger.info(f"Validated order data: {order_data}")

        order = create_order(order_data)
        current_app.logger.info(f"Order created successfully: {order}")

        return jsonify(OrderSchema().dump(order)), 201
    except OutOfStockError as e:
        current_app.logger.warning(f"Order failed - out of stock: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except InvalidInputError as e:
        current_app.logger.warning(f"Order validation error: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        current_app.logger.error(f"Unexpected error placing order: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500

@bp.route('/<order_id>', methods=['GET'])
def get_single_order(order_id):
    try:
        current_app.logger.info(f"GET /orders/{order_id} - Fetching order.")
        order = get_order(order_id)
        current_app.logger.info(f"Order retrieved: {order}")
        return jsonify(OrderSchema().dump(order))
    except NotFoundError as e:
        current_app.logger.warning(f"Order not found: {str(e)}")
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        current_app.logger.error(f"Error retrieving order {order_id}: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500
