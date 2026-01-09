'use client'
import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus, X, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Metadata } from 'next';
import { useStockService } from '@/hooks/useStockService';

interface StockItem {
    "1. symbol": string;
    "2. name": string;
    "3. type": string;
    "4. region": string;
    "5. marketOpen": string;
    "6. marketClose": string;
    "7. timezone": string;
    "8. currency": string;
    "9. matchScore": string;
}

const mockItems: StockItem[] = [
    {
        "1. symbol": "NVDA",
        "2. name": "NVIDIA Corp",
        "3. type": "Equity",
        "4. region": "United States",
        "5. marketOpen": "09:30",
        "6. marketClose": "16:00",
        "7. timezone": "UTC-04",
        "8. currency": "USD",
        "9. matchScore": "1.0000"
    },
    {
        "1. symbol": "NVDAX",
        "2. name": "Wells Fargo Diversified Eqs Fd USD Class A",
        "3. type": "Mutual Fund",
        "4. region": "United States",
        "5. marketOpen": "09:30",
        "6. marketClose": "16:00",
        "7. timezone": "UTC-04",
        "8. currency": "USD",
        "9. matchScore": "0.8889"
    },
    {
        "1. symbol": "NVDA.TRT",
        "2. name": "Nvidia CDR (CAD Hedged)",
        "3. type": "Equity",
        "4. region": "Toronto",
        "5. marketOpen": "09:30",
        "6. marketClose": "16:00",
        "7. timezone": "UTC-05",
        "8. currency": "CAD",
        "9. matchScore": "0.7273"
    }
]

// export const metadata: Metadata = {
//   title: 'Stocks', // Renders as 'Dashboard | My App'
// };

export default function Stocks() {
    const [items, setItems] = useState<StockItem[]>(mockItems);
    // const [searchQuery, setSearchQuery] = useState('NVDA');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<StockItem | null>(null);
    const [formData, setFormData] = useState({ title: '', body: '' });
    const router = useRouter();
    const stockService = useStockService();

    const updateStockSearch = async () => {
        if (searchQuery.length >= 3) {
            setLoading(true);
            setError('');
            try {
                console.log('Searching for term: [' + searchQuery + ']');
                const data = await stockService.list(searchQuery);
                console.log(data);
                setItems(data.bestMatches);
            } catch (err) {
                setError("Failed to load items");
            } finally {
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        return () => clearTimeout(setTimeout(() => {
            updateStockSearch();
        }, 1000));
    }, [searchQuery]);

    const handleViewStockPrice = (ticket: string) => {
        router.push('/stocks/' + ticket);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Stock Report</h1>
                        {/* <button
                            onClick={handleCreate}
                            disabled={loading}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                        >
                            <Plus size={20} />
                            Create New
                        </button> */}
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

                        // TODO: create top stocks button and route

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 w-full">
                                <input type='text' placeholder='Type to search a symbol' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="p-2 border border-gray-300 rounded-lg flex-1" />
                                <button type='button' className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition" onClick={updateStockSearch}>Search</button>
                            </div>

                            {items.length === 0 && searchQuery && (
                                <div className="text-center py-12 text-gray-500">
                                    No items found. Create your first item!
                                </div>
                            )}

                            {items.length > 0 && (items.map((item, i) => (
                                <div
                                    key={i}
                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                                >
                                    <div className="flex justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                                {item['1. symbol']}
                                            </h3>
                                            <p className="text-gray-600">{item['2. name']} | {item['4. region']} | {item['8. currency']}</p>
                                            <span>Type: {item['3. type']}</span>
                                        </div>
                                        <div className="flex gap-2 ml-4 content-center">

                                            <button type='button' onClick={() => handleViewStockPrice(item['1. symbol'])} className='bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition'>View Stock Price</button>
                                            {/* <button
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
                                            </button> */}
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
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                                    value={formData.body}
                                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Enter description"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                {/* <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                                >
                                    <Save size={18} />
                                    {editingItem ? 'Update' : 'Create'}
                                </button> */}
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