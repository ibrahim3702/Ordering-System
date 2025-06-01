from flask import Blueprint, request, jsonify, current_app
from models import offers_db
from schemas import OfferSchema
from services.offers import add_offer, update_offer, delete_offer, get_all_offers
from utils.errors import NotFoundError, InvalidInputError
import uuid

bp = Blueprint('offers', __name__, url_prefix='/offers')

@bp.route('/', methods=['GET'])
def get_offers():
    try:
        current_app.logger.info("GET /offers - Fetching all offers.")
        offers = get_all_offers()
        return jsonify([OfferSchema().dump(offer) for offer in offers])
    except Exception as e:
        current_app.logger.error(f"Error fetching offers: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500

@bp.route('/management', methods=['POST', 'PUT'])
def manage_offer():
    try:
        data = request.get_json()
        current_app.logger.info(f"{request.method} /offers/management - Received data: {data}")

        offer_data = OfferSchema().load(data)

        # Handle empty ID - generate if not provided
        if not offer_data.get('id'):
            offer_data['id'] = str(uuid.uuid4())
            current_app.logger.info(f"Generated new UUID for offer: {offer_data['id']}")

        if offer_data['id'] in offers_db:
            current_app.logger.info(f"Updating existing offer with ID: {offer_data['id']}")
            offer = update_offer(offer_data)
            current_app.logger.info(f"Offer updated: {offer}")
            return jsonify(OfferSchema().dump(offer)), 200
        else:
            current_app.logger.info(f"Adding new offer with ID: {offer_data['id']}")
            offer = add_offer(offer_data)
            current_app.logger.info(f"New offer added: {offer}")
            return jsonify(OfferSchema().dump(offer)), 201

    except InvalidInputError as e:
        current_app.logger.warning(f"Invalid input for offer: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        current_app.logger.error(f"Unexpected error in manage_offer: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500

@bp.route('/management/<offer_id>', methods=['DELETE'])
def remove_offer(offer_id):
    try:
        current_app.logger.info(f"DELETE /offers/management/{offer_id} - Deleting offer...")
        delete_offer(offer_id)
        current_app.logger.info(f"Offer {offer_id} deleted successfully.")
        return jsonify({'message': 'Offer deleted successfully'}), 200
    except NotFoundError as e:
        current_app.logger.warning(f"Offer not found: {str(e)}")
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        current_app.logger.error(f"Error deleting offer {offer_id}: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500
