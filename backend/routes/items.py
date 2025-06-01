from flask import Blueprint, request, jsonify, current_app
from models import items_db, Item
from schemas import ItemSchema
from services.inventory import add_item, update_item, delete_item, get_all_items
from utils.errors import NotFoundError, InvalidInputError

bp = Blueprint('items', __name__, url_prefix='/items')

@bp.route('/', methods=['GET'])
def get_items():
    try:
        current_app.logger.info("GET /items - Fetching all items.")
        items = get_all_items()
        return jsonify([ItemSchema().dump(item) for item in items])
    except Exception as e:
        current_app.logger.error(f"Error fetching items: {str(e)}")
        return jsonify({'error': str(e)}), 500

@bp.route('/management', methods=['POST', 'PUT'])
def manage_item():
    try:
        data = request.get_json()
        current_app.logger.info(f"{request.method} /items/management - Received item data: {data}")
        item_data = ItemSchema().load(data)

        item_obj = Item(**item_data)

        if item_obj.id in items_db:
            current_app.logger.info(f"Item with ID {item_obj.id} exists. Updating...")
            item = update_item(item_obj)
            current_app.logger.info(f"Item updated: {item}")
            return jsonify(ItemSchema().dump(item)), 200
        else:
            current_app.logger.info(f"Item with ID {item_obj.id} not found. Adding new item...")
            item = add_item(item_obj)
            current_app.logger.info(f"New item added: {item}")
            return jsonify(ItemSchema().dump(item)), 201

    except InvalidInputError as e:
        current_app.logger.warning(f"Invalid input: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        current_app.logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500

@bp.route('/management/<id>', methods=['DELETE', 'OPTIONS'])
def remove_item(id):
    try:
        if request.method == 'OPTIONS':
            current_app.logger.info(f"OPTIONS /items/management/{id} - Preflight request.")
            return '', 204
        
        current_app.logger.info(f"DELETE /items/management/{id} - Deleting item...")
        delete_item(id)
        current_app.logger.info(f"Item {id} deleted successfully.")
        return jsonify({'message': 'Item deleted successfully'}), 200

    except NotFoundError as e:
        current_app.logger.warning(f"Item not found: {str(e)}")
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        current_app.logger.error(f"Error deleting item {id}: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500
