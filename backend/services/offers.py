from models import offers_db
from utils.errors import NotFoundError, InvalidInputError

def get_all_offers():
    return list(offers_db.values())

def get_offer(offer_id: str):
    if offer_id not in offers_db:
        raise NotFoundError(f"Offer with ID {offer_id} not found")
    return offers_db[offer_id]

def add_offer(offer):
    if offer['id'] in offers_db:
        raise InvalidInputError(f"Offer with ID {offer['id']} already exists")
    offers_db[offer['id']] = offer
    return offer

def update_offer(offer):
    if offer['id'] not in offers_db:
        raise NotFoundError(f"Offer with ID {offer['id']} not found")
    offers_db[offer['id']] = offer
    return offer

def delete_offer(offer_id):
    if offer_id not in offers_db:
        raise NotFoundError(f"Offer with ID {offer_id} not found")
    del offers_db[offer_id]

def calculate_discount(order_items):
    applicable_offers = []
    
    for offer in offers_db.values():
        for order_item in order_items:
            if (order_item.item_id in offer.applicable_items and 
                order_item.quantity >= offer.min_quantity):
                applicable_offers.append(offer)
                break
    
    if not applicable_offers:
        return 0.0
    
    # For simplicity, apply the highest discount available
    best_offer = max(applicable_offers, key=lambda o: o.discount_percentage)
    
    # Calculate discount for applicable items
    discount = 0.0
    for order_item in order_items:
        if order_item.item_id in best_offer.applicable_items:
            discount += (order_item.unit_price * order_item.quantity * 
                         best_offer.discount_percentage / 100)
    
    return discount