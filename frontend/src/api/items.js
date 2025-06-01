import axios from 'axios';

const API_BASE = 'http://localhost:5000';

// Get all items
export const getItems = async () => {
    try {
        const response = await axios.get(`${API_BASE}/items/`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: false
        });
        console.log("Response:", response);
        return response.data;
    } catch (error) {
        console.error('Error fetching items:', error);
        throw error;
    }
};

// Add or update item
export const manageItem = async (item, isUpdate = false) => {
    try {
        const url = `${API_BASE}/items/management`;
        const method = isUpdate ? 'put' : 'post';

        const response = await axios({
            method,
            url,
            headers: {
                'Content-Type': 'application/json',
            },
            data: item,
            withCredentials: false
        });

        return response.data;
    } catch (error) {
        console.error('Error managing item:', error);
        throw error;
    }
};

// Delete an item
export const deleteItem = async (itemId) => {
    try {
        const response = await axios.delete(`${API_BASE}/items/management/${itemId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: false
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting item:', error);
        throw error;
    }
};
