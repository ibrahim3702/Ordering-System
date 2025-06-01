import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../api/orders';
import { getOffers } from '../api/offers';
import OrderSummary from '../components/OrderSummary';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-hot-toast';

const CreateOrder = () => {
    const { cartItems, clearCart } = useContext(CartContext);
    const navigate = useNavigate();
    const [offers, setOffers] = useState([]);
    const [discount, setDiscount] = useState(0);
    const [finalTotal, setFinalTotal] = useState(0);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const data = await getOffers();
                setOffers(data);
            } catch (error) {
                console.error('Error fetching offers:', error);
            }
        };

        fetchOffers();
    }, []);

    useEffect(() => {
        const calculate = () => {
            let total = 0;
            let discountValue = 0;

            cartItems.forEach((item) => {
                let itemTotal = item.price * item.quantity;
                let itemDiscount = 0;

                offers.forEach((offer) => {
                    const applies = offer.applicable_items.includes(item.id) && item.quantity >= offer.min_quantity;
                    if (applies) {
                        const thisDiscount = (offer.discount_percentage / 100) * itemTotal;
                        if (thisDiscount > itemDiscount) {
                            itemDiscount = thisDiscount;
                        }
                    }
                });

                discountValue += itemDiscount;
                total += itemTotal;
            });

            setDiscount(discountValue);
            setFinalTotal(total - discountValue);
        };

        if (offers.length > 0 || cartItems.length > 0) {
            calculate();
        }
    }, [cartItems, offers]);

    const handlePlaceOrder = async () => {
        try {
            const orderItems = cartItems.map(item => ({
                item_id: item.id,
                quantity: item.quantity,
            }));

            const order = await createOrder(
                orderItems
            );

            clearCart();
            toast.success('✅ Order placed successfully!');
            navigate(`/order-confirmation/${order.id}`);
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error('❌ Failed to place order. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] px-6 py-10 font-[var(--font-family)]">
            <div className="max-w-4xl mx-auto bg-[var(--bg-secondary)] shadow-md rounded-lg p-8">
                <h2 className="text-3xl font-bold text-[var(--primary)] mb-6 text-center">Your Order</h2>

                {cartItems.length === 0 ? (
                    <p className="text-center text-lg text-[var(--text-tertiary)]">Your cart is empty</p>
                ) : (
                    <>
                        <OrderSummary items={cartItems} total={finalTotal} discount={discount} />

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={handlePlaceOrder}
                                className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-semibold py-2 px-6 rounded-md transition-colors duration-300"
                            >
                                Place Order
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CreateOrder;
