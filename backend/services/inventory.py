from models import items_db
from utils.errors import NotFoundError, InvalidInputError

def get_all_items():
    return list(items_db.values())

def get_item(item_id: str):
    if item_id not in items_db:
        raise NotFoundError(f"Item with ID {item_id} not found")
    return items_db[item_id]

def add_item(item):
    if item.id in items_db:
        raise InvalidInputError(f"Item with ID {item.id} already exists")
    items_db[item.id] = item
    return item

def update_item(item):
    if item.id not in items_db:
        raise NotFoundError(f"Item with ID {item.id} not found")
    items_db[item.id] = item
    return item

def delete_item(item_id):
    if item_id not in items_db:
        raise NotFoundError(f"Item with ID {item_id} not found")
    del items_db[item_id]