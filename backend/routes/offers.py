from flask import Blueprint, request, jsonify
from models import offers_db
from schemas import OfferSchema
from services.offers import add_offer, update_offer, delete_offer, get_all_offers
from utils.errors import NotFoundError, InvalidInputError
import uuid
bp = Blueprint('offers', __name__, url_prefix='/offers')

@bp.route('/', methods=['GET'])
def get_offers():
    try:
        offers = get_all_offers()
        return jsonify([OfferSchema().dump(offer) for offer in offers])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/management', methods=['POST', 'PUT'])
def manage_offer():
    try:
        data = request.get_json()
        print("Received data ", data)

        offer_data = OfferSchema().load(data)

        # Handle empty ID - generate if not provided
        if not offer_data.get('id'):
            offer_data['id'] = str(uuid.uuid4())

        if offer_data['id'] in offers_db:
            offer = update_offer(offer_data)
            return jsonify(OfferSchema().dump(offer)), 200
        else:
            offer = add_offer(offer_data)
            return jsonify(OfferSchema().dump(offer)), 201

    except InvalidInputError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@bp.route('/management/<offer_id>', methods=['DELETE'])
def remove_offer(offer_id):
    try:
        delete_offer(offer_id)
        return jsonify({'message': 'Offer deleted successfully'}), 200
    except NotFoundError as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500