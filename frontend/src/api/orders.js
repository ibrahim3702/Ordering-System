const API_BASE = 'http://localhost:5000';

export const createOrder = async (orderItems) => {
    const response = await fetch(`${API_BASE}/orders/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: orderItems }),
    });
    return await response.json();
};

export const getOrders = async () => {
    const response = await fetch(`${API_BASE}/orders/`);
    return await response.json();
};