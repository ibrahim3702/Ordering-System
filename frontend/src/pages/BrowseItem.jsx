import React, { useEffect, useState } from 'react';
import { getItems } from '../api/items';
import ItemCard from '../components/ItemCard';

const BrowseItems = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const data = await getItems();
                setItems(data);
            } catch (error) {
                console.error('Error fetching items:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-[var(--font-family)]">
                <div className="text-xl animate-pulse">Loading...</div>
            </div>
        );
    }

    return (
        <div className="browse-items min-h-screen bg-[var(--bg-primary)] px-6 py-10 font-[var(--font-family)] text-[var(--text-primary)]">
            <h2 className="text-3xl font-bold text-[var(--primary)] text-center mb-10">Available Items</h2>

            {items && items.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-grid">
                    {items.map(item => (
                        <ItemCard key={item.id} item={item} />
                    ))}
                </div>
            ) : (
                <div className="text-center text-lg text-[var(--text-tertiary)] mt-10">
                    No items available
                </div>
            )}
        </div>
    );
};

export default BrowseItems;
