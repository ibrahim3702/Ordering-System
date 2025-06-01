# routes/__init__.py
from .items import bp as items_bp
from .orders import bp as orders_bp
from .offers import bp as offers_bp

__all__ = ['items_bp', 'orders_bp', 'offers_bp']