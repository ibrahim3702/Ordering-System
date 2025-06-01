import React from 'react';
import { useParams, Link } from 'react-router-dom';

const OrderConfirmation = () => {
    const { orderId } = useParams();

    return (
        <div className="h-screen flex items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)] font-[var(--font-family)] px-4">
            <div className="bg-[var(--bg-secondary)] shadow-lg rounded-xl w-full max-w-md text-center p-6 sm:p-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-[var(--primary)] mb-4">🎉 Order Confirmed!</h2>
                <p className="text-base sm:text-lg text-[var(--text-secondary)] mb-6">
                    Your order <span className="font-semibold text-[var(--primary-dark)]">#{orderId}</span> has been placed successfully.
                </p>
                <Link
                    to="/"
                    className="inline-block bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-6 py-2 rounded-md transition"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default OrderConfirmation;
