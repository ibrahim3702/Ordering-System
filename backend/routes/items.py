from flask import Blueprint, request, jsonify
from models import items_db, Item
from schemas import ItemSchema
from services.inventory import add_item, update_item, delete_item, get_all_items
from utils.errors import NotFoundError, InvalidInputError

bp = Blueprint('items', __name__, url_prefix='/items')

@bp.route('/', methods=['GET'])
def get_items():
    try:
        items = get_all_items()
        return jsonify([ItemSchema().dump(item) for item in items])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/management', methods=['POST', 'PUT'])
def manage_item():
    try:
        data = request.get_json()
        print(f"Received item data: {data}")
        item_data = ItemSchema().load(data)

        # Convert to Item object if needed
        item_obj = Item(**item_data)

        if item_obj.id in items_db:
            item = update_item(item_obj)
            return jsonify(ItemSchema().dump(item)), 200
        else:
            item = add_item(item_obj)
            return jsonify(ItemSchema().dump(item)), 201
    except InvalidInputError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@bp.route('/management/<id>', methods=['DELETE', 'OPTIONS'])
def remove_item(id):
    try:
        if request.method == 'OPTIONS':
            return '', 204  # Respond OK to preflight
        delete_item(id)
        return jsonify({'message': 'Item deleted successfully'}), 200
    except NotFoundError as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500