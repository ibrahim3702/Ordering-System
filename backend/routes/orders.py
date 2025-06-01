from flask import Blueprint, request, jsonify
from models import orders_db
from schemas import OrderSchema, OrderCreateSchema
from services.ordering import create_order, get_order, get_all_orders
from utils.errors import NotFoundError, InvalidInputError, OutOfStockError

bp = Blueprint('orders', __name__, url_prefix='/orders')

@bp.route('/', methods=['GET'])
def list_orders():
    try:
        orders = get_all_orders()
        return jsonify([OrderSchema().dump(order) for order in orders])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/', methods=['POST'])
def place_order():
    try:
        data = request.get_json()
        print(f"Received order data: {data}")
        order_data = OrderCreateSchema().load(data)
        print(order_data)
        order = create_order(order_data)
        return jsonify(OrderSchema().dump(order)), 201
    except OutOfStockError as e:
        return jsonify({'error': str(e)}), 400
    except InvalidInputError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/<order_id>', methods=['GET'])
def get_single_order(order_id):
    try:
        order = get_order(order_id)
        return jsonify(OrderSchema().dump(order))
    except NotFoundError as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500