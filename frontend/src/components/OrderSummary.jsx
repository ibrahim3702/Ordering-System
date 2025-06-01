import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const OrderSummary = ({ items, total, discount }) => {
    const { updateQuantity } = useContext(CartContext);

    return (
        <div className="order-summary bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-6 shadow-md max-w-xl mx-auto">
            <h3 className="text-2xl font-bold text-[var(--primary)] mb-4">🧾 Order Summary</h3>

            <ul className="divide-y divide-[var(--border-light)] mb-4">
                {items.map((item) => (
                    <li key={item.id} className="py-3 flex justify-between items-center text-[var(--text-primary)] text-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-2/3">
                            <span className="font-semibold">{item.name}</span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="px-2 py-1 bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded shadow-sm disabled:opacity-50"
                                    disabled={item.quantity <= 1}
                                >
                                    −
                                </button>
                                <span className="min-w-[24px] text-center">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="px-2 py-1 bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded shadow-sm disabled:opacity-50"
                                    disabled={item.quantity >= item.stock}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <div className="w-1/3 text-right font-medium">
                            ${(item.quantity * item.price).toFixed(2)}
                        </div>
                    </li>
                ))}
            </ul>

            {discount > 0 && (
                <p className="text-[var(--success-dark)] font-semibold text-sm mb-2">
                    🎁 Discount Applied: -${discount.toFixed(2)}
                </p>
            )}

            <p className="text-lg font-bold text-[var(--primary-dark)] border-t border-[var(--border)] pt-3">
                💰 Total: ${total.toFixed(2)}
            </p>
        </div>
    );
};

export default OrderSummary;
