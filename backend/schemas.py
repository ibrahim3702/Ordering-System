from marshmallow import Schema, fields, validate, ValidationError
from datetime import datetime

class ItemSchema(Schema):
    id = fields.Str(required=True)
    name = fields.Str(required=True)
    price = fields.Float(required=True, validate=validate.Range(min=0))
    stock = fields.Int(required=True, validate=validate.Range(min=0))
    description = fields.Str()

class OfferSchema(Schema):
    id = fields.Str(required=True)
    name = fields.Str(required=True)
    description = fields.Str()
    discount_percentage = fields.Float(
        required=True, 
        validate=validate.Range(min=0, max=100)
    )
    applicable_items = fields.List(
        fields.Str(), 
        required=True,
        validate=validate.Length(min=1)
    )
    min_quantity = fields.Int(
        validate=validate.Range(min=1),
        load_default=1  # Changed from 'missing' to 'load_default'
    )

class OrderItemSchema(Schema):
    item_id = fields.Str(required=True)
    quantity = fields.Int(required=True, validate=validate.Range(min=1))

class OrderCreateSchema(Schema):
    items = fields.List(
        fields.Nested(OrderItemSchema),
        required=True,
        validate=validate.Length(min=1)
    )

class OrderSchema(Schema):
    id = fields.Str()
    items = fields.List(fields.Nested(OrderItemSchema))
    total = fields.Float()
    discount_applied = fields.Float()
    created_at = fields.DateTime()