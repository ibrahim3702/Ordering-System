from dataclasses import dataclass, field
from typing import List, Dict, Optional
from datetime import datetime

@dataclass
class Item:
    id: str
    name: str
    price: float
    stock: int
    description: str = ""
    
@dataclass
class Offer:
    id: str
    name: str
    description: str
    discount_percentage: float
    applicable_items: List[str]  # List of item IDs
    min_quantity: int = 1
    
@dataclass
class OrderItem:
    item_id: str
    quantity: int
    unit_price: float
    
@dataclass
class Order:
    id: str
    items: List[OrderItem]
    total: float
    discount_applied: float = 0.0
    created_at: datetime = field(default_factory=datetime.now)

# In-memory storage
items_db: Dict[str, Item] = {}
offers_db: Dict[str, Offer] = {}
orders_db: Dict[str, Order] = {}
# from uuid import uuid4
# from models import Item, Offer, Order, OrderItem, items_db, offers_db, orders_db

# Add sample items
items_db["item1"] = Item(id="item1", name="Wireless Mouse", price=29.99, stock=12, description="Ergonomic design with 2.4GHz wireless receiver.")
items_db["item2"] = Item(id="item2", name="Mechanical Keyboard", price=89.99, stock=7, description="Blue switch mechanical keyboard with RGB lights.")
items_db["item3"] = Item(id="item3", name="USB-C Hub", price=49.99, stock=3, description="5-in-1 USB-C hub with HDMI, USB 3.0, SD card.")
items_db["item4"] = Item(id="item4", name="Laptop Stand", price=39.99, stock=0, description="Aluminum adjustable laptop stand for desk setup.")
items_db["item5"] = Item(id="item5", name="Noise Cancelling Headphones", price=149.99, stock=5, description="Over-ear wireless headphones with ANC.")

# Add sample offers
offers_db["offer1"] = Offer(
    id="offer1",
    name="Bundle Discount",
    description="10% off when buying 2 or more input devices",
    discount_percentage=10.0,
    applicable_items=["item1", "item2"],
    min_quantity=2
)

offers_db["offer2"] = Offer(
    id="offer2",
    name="USB Accessories Deal",
    description="5% off on USB accessories for orders of 3+ units",
    discount_percentage=5.0,
    applicable_items=["item3"],
    min_quantity=3
)

# Add sample order
orders_db["order1"] = Order(
    id="order1",
    items=[
        OrderItem(item_id="item1", quantity=2, unit_price=29.99),
        OrderItem(item_id="item2", quantity=1, unit_price=89.99),
    ],
    total=149.97,
    discount_applied=14.99
)
