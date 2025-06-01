import React, { useState, useEffect } from 'react';
import { getOffers, manageOffer, deleteOffer } from '../api/offers';
import { getItems } from '../api/items';
import ConfirmModal from '../components/ConfirmModal';
import { toast } from 'react-hot-toast';
const ManageOffers = () => {
    const [offers, setOffers] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingOffer, setEditingOffer] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        discount_percentage: 0,
        applicable_items: [],
        min_quantity: 1
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [offersData, itemsData] = await Promise.all([getOffers(), getItems()]);
            setOffers(offersData);
            setItems(itemsData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: ['discount_percentage', 'min_quantity'].includes(name)
                ? parseFloat(value) || 0
                : value,
        });
    };

    const handleItemToggle = (itemId) => {
        setFormData(prev => {
            const updated = prev.applicable_items.includes(itemId)
                ? prev.applicable_items.filter(id => id !== itemId)
                : [...prev.applicable_items, itemId];
            return { ...prev, applicable_items: updated };
        });
    };

    const handleEdit = (offer) => {
        setEditingOffer(offer.id);
        setFormData({
            id: offer.id,
            name: offer.name,
            description: offer.description || '',
            discount_percentage: offer.discount_percentage,
            applicable_items: [...offer.applicable_items],
            min_quantity: offer.min_quantity || 1,
        });
    };

    const handleCancelEdit = () => {
        setEditingOffer(null);
        setFormData({
            id: '',
            name: '',
            description: '',
            discount_percentage: 0,
            applicable_items: [],
            min_quantity: 1,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await manageOffer(formData, editingOffer !== null);
            fetchData();
            handleCancelEdit();
            toast.success(editingOffer ? 'Offer updated successfully!' : 'Offer added successfully!');
        } catch (error) {
            toast.error('Failed to add/update offer');
            console.error('Error saving offer:', error);
        }
    };
    const confirmDelete = async () => {
        try {
            await deleteOffer(confirmDeleteId);
            fetchData();
            toast.success('Offer deleted successfully!');
        } catch (error) {
            toast.error('Failed to delete offer');
            console.error('Error deleting offer:', error);
        } finally {
            setConfirmDeleteId(null);
        }
    };


    // const handleDelete = async (offerId) => {
    //     if (window.confirm('Are you sure you want to delete this offer?')) {
    //         try {
    //             await deleteOffer(offerId);
    //             fetchData();
    //         } catch (error) {
    //             console.error('Error deleting offer:', error);
    //         }
    //     }
    // };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen text-[var(--text-primary)] bg-[var(--bg-primary)]">
                <p className="text-lg font-medium">Loading offers...</p>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen px-6 py-10 bg-[var(--bg-primary)] text-[var(--text-primary)] font-[var(--font-family)]">
                <h2 className="text-3xl font-bold text-[var(--primary)] text-center mb-8">Manage Offers</h2>

                <div className="bg-[var(--bg-secondary)] shadow-md rounded-md p-6 mb-10 max-w-3xl mx-auto">
                    <h3 className="text-xl font-semibold mb-4">{editingOffer ? 'Edit Offer' : 'Add New Offer'}</h3>
                    <form onSubmit={handleSubmit} className="grid gap-4">
                        {editingOffer && (
                            <div>
                                <label className="text-sm font-medium block mb-1">ID</label>
                                <input type="text" value={formData.id} disabled className="w-full bg-gray-100 px-3 py-2 border border-[var(--border)] rounded-md" />
                            </div>
                        )}
                        <div>
                            <label className="text-sm font-medium block mb-1">Offer Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-3 py-2 border border-[var(--border)] rounded-md" />
                        </div>
                        <div>
                            <label className="text-sm font-medium block mb-1">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full px-3 py-2 border border-[var(--border)] rounded-md resize-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium block mb-1">Discount (%)</label>
                                <input type="number" name="discount_percentage" value={formData.discount_percentage} onChange={handleInputChange} min="0" max="100" step="0.1" required className="w-full px-3 py-2 border border-[var(--border)] rounded-md" />
                            </div>
                            <div>
                                <label className="text-sm font-medium block mb-1">Min Quantity</label>
                                <input type="number" name="min_quantity" value={formData.min_quantity} onChange={handleInputChange} min="1" required className="w-full px-3 py-2 border border-[var(--border)] rounded-md" />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium block mb-2">Applicable Items</label>
                            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                                {items.map(item => (
                                    <label key={item.id} className="flex items-center gap-2 text-sm">
                                        <input type="checkbox" checked={formData.applicable_items.includes(item.id)} onChange={() => handleItemToggle(item.id)} />
                                        {item.name} (${item.price.toFixed(2)})
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-3 mt-4">
                            <button type="submit" className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-4 py-2 rounded-md font-medium transition">
                                {editingOffer ? 'Update Offer' : 'Add Offer'}
                            </button>
                            {editingOffer && (
                                <button type="button" onClick={handleCancelEdit} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-medium transition">
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="bg-[var(--bg-secondary)] shadow-md rounded-md p-6 max-w-6xl mx-auto">
                    <h3 className="text-xl font-semibold mb-4">Current Offers</h3>
                    {offers.length === 0 ? (
                        <p className="text-center text-[var(--text-tertiary)]">No offers available</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto border-collapse">
                                <thead>
                                    <tr className="bg-[var(--bg-tertiary)] text-left text-sm text-[var(--text-secondary)]">
                                        <th className="p-3 font-semibold">Name</th>
                                        <th className="p-3 font-semibold">Discount</th>
                                        <th className="p-3 font-semibold">Min Qty</th>
                                        <th className="p-3 font-semibold">Items</th>
                                        <th className="p-3 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {offers.map((offer) => {
                                        const applicableItems = items.filter(item => offer.applicable_items.includes(item.id));
                                        return (
                                            <tr key={offer.id} className="border-b border-[var(--border)]">
                                                <td className="p-3">
                                                    <div className="font-medium">{offer.name}</div>
                                                    {offer.description && <div className="text-sm text-[var(--text-tertiary)]">{offer.description}</div>}
                                                </td>
                                                <td className="p-3">{offer.discount_percentage}%</td>
                                                <td className="p-3">{offer.min_quantity}</td>
                                                <td className="p-3">
                                                    {applicableItems.length > 0 ? (
                                                        <ul className="list-disc list-inside text-sm space-y-1">
                                                            {applicableItems.map(item => (
                                                                <li key={item.id}>{item.name}</li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <span className="text-sm text-[var(--text-tertiary)]">None</span>
                                                    )}
                                                </td>
                                                <td className="p-3 flex gap-2">
                                                    <button onClick={() => handleEdit(offer)} className="bg-[var(--info)] hover:bg-[var(--info-dark)] text-white px-3 py-1 rounded-md text-sm">Edit</button>
                                                    <button onClick={() => setConfirmDeleteId(offer.id)} className="bg-[var(--danger)] hover:bg-[var(--danger-dark)] text-white px-3 py-1 rounded-md text-sm">Delete</button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            <ConfirmModal
                isOpen={!!confirmDeleteId}
                onClose={() => setConfirmDeleteId(null)}
                onConfirm={confirmDelete}
                message="Are you sure you want to delete this offer?"
            />
        </>
    );
};

export default ManageOffers;
