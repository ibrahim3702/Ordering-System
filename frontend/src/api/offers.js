const API_BASE = 'http://localhost:5000';

export const getOffers = async () => {
    const response = await fetch(`${API_BASE}/offers/`);
    return await response.json();
};

export const manageOffer = async (offer, isUpdate = false) => {
    const method = isUpdate ? 'PUT' : 'POST';
    const response = await fetch(`${API_BASE}/offers/management`, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(offer),
    });
    return await response.json();
};

export const deleteOffer = async (offerId) => {
    const response = await fetch(`${API_BASE}/offers/management/${offerId}`, {
        method: 'DELETE',
    });
    return await response.json();
};