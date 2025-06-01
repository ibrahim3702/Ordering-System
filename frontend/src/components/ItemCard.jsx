import React from 'react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';

const ItemCard = ({ item }) => {
    const { addToCart } = useCart();

    const getStockStatusStyle = () => {
        if (item.stock <= 0) return 'text-[var(--danger)] font-semibold';
        if (item.stock <= 5) return 'text-[var(--warning)] font-semibold';
        return 'text-[var(--text-secondary)]';
    };

    const handleAddToCart = () => {
        addToCart(item);
        toast.success(`${item.name} added to cart!`);
    };

    return (
        <div className="item-card bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-5 shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg">
            <h3 className="text-xl font-bold text-[var(--primary-dark)] mb-2">{item.name}</h3>

            <p className="text-[var(--text-secondary)] mb-1">
                <strong>Price:</strong> ${item.price.toFixed(2)}
            </p>

            <p className={`${getStockStatusStyle()} mb-1`}>
                <strong>Stock:</strong> {item.stock > 0 ? item.stock : 'Out of stock'}
            </p>

            {item.description && (
                <p className="text-sm text-[var(--text-tertiary)] mb-3">{item.description}</p>
            )}

            <button
                onClick={handleAddToCart}
                disabled={item.stock <= 0}
                className={`w-full py-2 px-4 rounded-md font-semibold transition-colors 
                    ${item.stock <= 0
                        ? 'bg-[var(--text-disabled)] cursor-not-allowed text-white'
                        : 'bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white'
                    }`}
            >
                {item.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
        </div>
    );
};

export default ItemCard;
