// src/pages/ProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const response = await productAPI.getAll();
            setProducts(response.data);
        } catch (error) {
            console.error('Failed to load products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            loadProducts();
            return;
        }
        
        try {
            setLoading(true);
            const response = await productAPI.search(searchTerm);
            setProducts(response.data);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Бүтээгдэхүүнүүд</h1>
            
            <form onSubmit={handleSearch} className="mb-8">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Хайх..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 px-4 py-2 border rounded-lg"
                    />
                    <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-lg">
                        Хайх
                    </button>
                </div>
            </form>

            {loading ? (
                <div className="text-center py-8">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="border rounded-lg p-4 shadow">
                            {product.images && product.images[0] && (
                                <img 
                                    src={`http://localhost:8080${product.images[0]}`}
                                    alt={product.name}
                                    className="w-full h-48 object-cover rounded mb-4"
                                />
                            )}
                            <h3 className="text-xl font-semibold">
                                {product.brand} {product.model}
                            </h3>
                            <p className="text-gray-600">{product.year} он</p>
                            <p className="text-lg font-bold text-blue-600 mt-2">
                                ₮{product.price?.toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductsPage;