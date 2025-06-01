from uuid import uuid4
from datetime import datetime
from models import items_db, orders_db, Order, OrderItem
from services.offers import calculate_discount
from utils.errors import OutOfStockError, InvalidInputError, NotFoundError

def get_all_orders():
    return list(orders_db.values())

def get_order(order_id: str):
    if order_id not in orders_db:
        raise NotFoundError(f"Order with ID {order_id} not found")
    return orders_db[order_id]

def create_order(order_data):
    order_items = []
    total = 0.0
    
    for item_data in order_data['items']:
        item_id = item_data['item_id']
        quantity = item_data['quantity']
        
        if item_id not in items_db:
            raise InvalidInputError(f"Item with ID {item_id} not found")
        
        item = items_db[item_id]
        
        if item.stock < quantity:
            raise OutOfStockError(f"Not enough stock for item {item_id}")
        
        order_items.append(OrderItem(
            item_id=item_id,
            quantity=quantity,
            unit_price=item.price
        ))
        
        total += item.price * quantity
        
        # Update stock
        item.stock -= quantity
    
    # Calculate discounts
    discount = calculate_discount(order_items)
    total -= discount
    
    order = Order(
        id=str(uuid4()),
        items=order_items,
        total=total,
        discount_applied=discount
    )
    
    orders_db[order.id] = order
    return order