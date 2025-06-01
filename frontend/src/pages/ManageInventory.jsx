import React, { useState, useEffect } from 'react';
import { getItems, manageItem, deleteItem } from '../api/items';
import ConfirmModal from '../components/ConfirmModal';
import { toast } from 'react-hot-toast';
const ManageInventory = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState(null);
    const [deleteTargetId, setDeleteTargetId] = useState(null);

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        price: 0,
        stock: 0,
        description: ''
    });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const data = await getItems();
            setItems(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching items:', error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value
        });
    };

    const handleEdit = (item) => {
        setEditingItem(item.id);
        setFormData({
            id: item.id,
            name: item.name,
            price: item.price,
            stock: item.stock,
            description: item.description || ''
        });
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
        setFormData({
            id: '',
            name: '',
            price: 0,
            stock: 0,
            description: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const isUpdate = editingItem !== null;
            await manageItem(formData, isUpdate);
            fetchItems();
            handleCancelEdit();
            setTimeout(() => {
                toast.success(`✅ Item ${isUpdate ? 'updated' : 'added'} successfully!`);
            }, 50);
        } catch (error) {
            console.error('Error saving item:', error);
            toast.error('❌ Failed to save item. Please try again.');
        }
    };

    const requestDelete = (id) => {
        setDeleteTargetId(id);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteItem(deleteTargetId);

            setTimeout(() => {
                toast.success('🗑️ Item deleted successfully!');
            }, 50);
            fetchItems();
            setDeleteTargetId(null);
        } catch (error) {
            console.error('Error deleting item:', error);
            toast.error('❌ Failed to delete item. Please try again.');
        }
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen text-[var(--text-primary)] bg-[var(--bg-primary)]">
                <p className="text-lg font-medium">Loading inventory...</p>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen px-6 py-10 bg-[var(--bg-primary)] text-[var(--text-primary)] font-[var(--font-family)]">
                <h2 className="text-3xl font-bold text-[var(--primary)] mb-6 text-center">Manage Inventory</h2>

                <div className="bg-[var(--bg-secondary)] shadow-md rounded-md p-6 mb-10 max-w-3xl mx-auto">
                    <h3 className="text-xl font-semibold mb-4">
                        {editingItem ? 'Edit Item' : 'Add New Item'}
                    </h3>
                    <form onSubmit={handleSubmit} className="grid gap-4">
                        {editingItem && (
                            <div>
                                <label className="block mb-1 text-sm font-medium">ID</label>
                                <input
                                    type="text"
                                    value={formData.id}
                                    disabled
                                    className="w-full px-3 py-2 rounded-md bg-gray-100 border border-[var(--border)]"
                                />
                            </div>
                        )}
                        <div>
                            <label className="block mb-1 text-sm font-medium">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 rounded-md border border-[var(--border)]"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    required
                                    className="w-full px-3 py-2 rounded-md border border-[var(--border)]"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium">Stock</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    min="0"
                                    required
                                    className="w-full px-3 py-2 rounded-md border border-[var(--border)]"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 rounded-md border border-[var(--border)] resize-none"
                            />
                        </div>
                        <div className="flex gap-3 mt-4">
                            <button
                                type="submit"
                                className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-4 py-2 rounded-md font-medium transition"
                            >
                                {editingItem ? 'Update Item' : 'Add Item'}
                            </button>
                            {editingItem && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-medium transition"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="bg-[var(--bg-secondary)] shadow-md rounded-md p-6 max-w-5xl mx-auto">
                    <h3 className="text-xl font-semibold mb-4">Current Inventory</h3>
                    {items.length === 0 ? (
                        <p className="text-[var(--text-tertiary)] text-center">No items in inventory</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto border-collapse">
                                <thead>
                                    <tr className="bg-[var(--bg-tertiary)] text-left text-sm text-[var(--text-secondary)]">
                                        <th className="p-3 font-semibold">Name</th>
                                        <th className="p-3 font-semibold">Price</th>
                                        <th className="p-3 font-semibold">Stock</th>
                                        <th className="p-3 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item) => (
                                        <tr key={item.id} className="border-b border-[var(--border)]">
                                            <td className="p-3">{item.name}</td>
                                            <td className="p-3">${item.price.toFixed(2)}</td>
                                            <td className="p-3">{item.stock}</td>
                                            <td className="p-3 flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="bg-[var(--info)] hover:bg-[var(--info-dark)] text-white px-3 py-1 rounded-md text-sm"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => requestDelete(item.id)}
                                                    className="bg-[var(--danger)] hover:bg-[var(--danger-dark)] text-white px-3 py-1 rounded-md text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            <ConfirmModal
                isOpen={deleteTargetId !== null}
                onCancel={() => setDeleteTargetId(null)}
                onConfirm={handleConfirmDelete}
                message="Are you sure you want to delete this item?"
            />
        </>
    );
};

export default ManageInventory;
