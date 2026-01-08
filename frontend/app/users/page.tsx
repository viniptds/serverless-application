'use client'
import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus, X, Save } from 'lucide-react';
import { useUserService } from '@/hooks/useUserService';

interface User {
  id: string;
  name: string;
  email: string;
}

export default function Users() {
  const [items, setItems] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const userService = useUserService();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await userService.getItems();
      setItems(data.users);
    } catch (err) {
      setError('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({ name: '', email: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: User) => {
    setEditingItem(item);
    setFormData({ name: item.name, email: item.email });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (editingItem) {
        const updated = await userService.updateItem(editingItem.id, formData);
        setItems(items.map((item) => item.id === editingItem.id ? { ...item, ...formData } : item));
      } else {
        const newItem = await userService.createItem(formData);
        setItems([newItem, ...items]);
      }
      setIsModalOpen(false);
      setFormData({ name: '', email: '' });
    } catch (err) {
      setError('Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    setLoading(true);
    setError('');
    try {
      await userService.deleteItem(id);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      setError('Failed to delete item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">CRUD Application</h1>
            <button
              onClick={handleCreate}
              disabled={loading}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              <Plus size={20} />
              Create New
            </button>
          </div>

          {error.length > 0 && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading && !isModalOpen ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No items found. Create your first item!
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between content-center">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {item.name}
                        </h3>
                        <p className="text-gray-600">{item.email}</p>
                      </div>
                      <div className="flex gap-2 ml-4 content-center">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingItem ? 'Edit Item' : 'Create New Item'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type='email'
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter email"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  <Save size={18} />
                  {editingItem ? 'Update' : 'Create'}
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}