import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Package, Eye, ToggleLeft, ToggleRight, Filter, X } from 'lucide-react';
import { productAPI } from '../../services/api';
import ProductForm from './ProductForm';
import toast from 'react-hot-toast';

// Helper function to get full image URL
const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/images/')) return `http://localhost:8080/api${url}`;
  return `http://localhost:8080/api/images/${url}`;
};

const AdminProducts = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const isEditMode = !!id || !!editingProduct;
  const isNewMode = searchParams.get('new') !== null || window.location.pathname.includes('/new');

  useEffect(() => {
    fetchProducts();
    
    if (id) {
      fetchProductForEdit(id);
    }
  }, [id]);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, categoryFilter, statusFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Бүтээгдэхүүн ачааллахад алдаа гарлаа');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductForEdit = async (productId) => {
    try {
      const response = await productAPI.getById(productId);
      setEditingProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Бүтээгдэхүүн ачааллахад алдаа гарлаа');
      navigate('/admin/products');
    }
  };

  const filterProducts = () => {
    let filtered = [...products];
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (categoryFilter) {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }
    
    if (statusFilter === 'active') {
      filtered = filtered.filter(p => p.active);
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(p => !p.active);
    } else if (statusFilter === 'lowStock') {
      filtered = filtered.filter(p => p.stockQuantity < 5);
    } else if (statusFilter === 'outOfStock') {
      filtered = filtered.filter(p => p.stockQuantity === 0);
    }
    
    setFilteredProducts(filtered);
  };

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  const handleEdit = (product) => {
    navigate(`/admin/products/edit/${product.id}`);
  };

  const handleCloseForm = () => {
    setEditingProduct(null);
    navigate('/admin/products');
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    
    try {
      if (editingProduct) {
        await productAPI.update(editingProduct.id, formData);
        toast.success('Бүтээгдэхүүн амжилттай шинэчлэгдлээ');
      } else {
        await productAPI.create(formData);
        toast.success('Бүтээгдэхүүн амжилттай үүслээ');
      }
      
      handleCloseForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.message || 'Хадгалахад алдаа гарлаа');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      await productAPI.delete(productToDelete.id);
      toast.success('Бүтээгдэхүүн устгагдлаа');
      fetchProducts();
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Устгахад алдаа гарлаа');
    }
  };

  const handleToggleActive = async (product) => {
    try {
      const formData = new FormData();
      const updatedProduct = { ...product, active: !product.active };
      
      formData.append('machine', new Blob([JSON.stringify(updatedProduct)], {
        type: 'application/json'
      }));
      
      await productAPI.update(product.id, formData);
      toast.success(`Бүтээгдэхүүн ${updatedProduct.active ? 'идэвхжлээ' : 'идэвхгүй боллоо'}`);
      fetchProducts();
    } catch (error) {
      toast.error('Төлөв өөрчлөхөд алдаа гарлаа');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('mn-MN').format(price || 0) + ' ₮';
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setStatusFilter('all');
  };

  if (isEditMode || isNewMode) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {editingProduct ? 'Бүтээгдэхүүн засах' : 'Шинэ бүтээгдэхүүн'}
          </h1>
        </div>
        
        <ProductForm
          product={editingProduct}
          onSubmit={handleSubmit}
          onCancel={handleCloseForm}
          loading={submitting}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Бүтээгдэхүүний удирдлага</h1>
        <Link to="/admin/products/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Шинэ бүтээгдэхүүн
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Бүтээгдэхүүн хайх..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            Шүүлтүүр
          </button>
          
          {(searchTerm || categoryFilter || statusFilter !== 'all') && (
            <button
              onClick={clearFilters}
              className="text-red-600 hover:text-red-700"
            >
              Цэвэрлэх
            </button>
          )}
        </div>
        
        {showFilters && (
          <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Бүх ангилал</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">Бүх төлөв</option>
              <option value="active">Идэвхтэй</option>
              <option value="inactive">Идэвхгүй</option>
              <option value="lowStock">Бага үлдэгдэлтэй</option>
              <option value="outOfStock">Дууссан</option>
            </select>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-pulse">
              <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Бүтээгдэхүүн олдсонгүй
          </h3>
          <p className="text-gray-600 mb-4">
            {products.length === 0 ? 'Одоогоор бүтээгдэхүүн байхгүй байна' : 'Шүүлтүүрт тохирох бүтээгдэхүүн олдсонгүй'}
          </p>
          {products.length === 0 && (
            <Link to="/admin/products/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition inline-block">
              Шинэ бүтээгдэхүүн нэмэх
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group">
              <div className="relative">
                {product.imageUrls?.[0] ? (
                  <img
                    src={getImageUrl(product.imageUrls[0])}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/400x300/e5e7eb/6b7280?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                    <Package className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => handleToggleActive(product)}
                    className={`p-2 rounded-full shadow-lg transition ${
                      product.active 
                        ? 'bg-green-500 text-white hover:bg-green-600' 
                        : 'bg-gray-500 text-white hover:bg-gray-600'
                    }`}
                    title={product.active ? 'Идэвхтэй' : 'Идэвхгүй'}
                  >
                    {product.active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  </button>
                </div>
                {!product.active && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Идэвхгүй
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="mb-2">
                  <span className="text-xs text-gray-500">{product.category || 'Ангилалгүй'}</span>
                  <h3 className="font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-blue-600">
                    {formatPrice(product.price)}
                  </span>
                  <span className={`text-sm font-medium ${
                    product.stockQuantity === 0 ? 'text-red-600' : 
                    product.stockQuantity < 5 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {product.stockQuantity} ш
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Link
                    to={`/products/${product.id}`}
                    target="_blank"
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    <Eye className="w-4 h-4" />
                    Харах
                  </Link>
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                  >
                    <Edit className="w-4 h-4" />
                    Засах
                  </button>
                  <button
                    onClick={() => {
                      setProductToDelete(product);
                      setShowDeleteModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    Устгах
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Бүтээгдэхүүн устгах</h3>
              <button onClick={() => setShowDeleteModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Та "{productToDelete?.name}" бүтээгдэхүүнийг устгахдаа итгэлтэй байна уу?
              Энэ үйлдлийг буцаах боломжгүй.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Цуцлах
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Устгах
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;