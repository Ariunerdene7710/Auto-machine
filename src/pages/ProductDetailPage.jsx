import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingCart, ArrowLeft, Star, Truck, Shield, Award, Package, Fuel, Gauge, Calendar, MapPin, CheckCircle } from 'lucide-react';
import { carAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `http://localhost:8080/api/images/${url}`;
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const mockProduct = {
    id: 1,
    brand: 'Toyota',
    model: 'Camry',
    year: 2023,
    price: 35000000,
    mileage: 15000,
    fuelType: 'Бензин',
    transmission: 'Автомат',
    location: 'Улаанбаатар',
    description: 'Идэвхтэй машин, сайн нөхцөлийн орилго',
    features: ['ABS', 'Cruise Control', 'Bluetooth', 'Backup Camera'],
    images: [],
    stock: 2
  };

  const fetchProduct = async () => {
    try {
      const response = await carAPI.getById(id);
      setProduct(response.data || mockProduct);
    } catch (error) {
      console.error('Error fetching product:', error);
      setProduct(mockProduct);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.brand || product.name} сагсанд нэмэгдлээ`);
  };

  const formatPrice = (price) => new Intl.NumberFormat('mn-MN').format(price || 0) + ' ₮';
  const formatMileage = (mileage) => mileage ? new Intl.NumberFormat('mn-MN').format(mileage) + ' км' : '-';

  const handleImageError = (index) => setImageErrors(prev => ({ ...prev, [index]: true }));

  if (loading) {
    return (
      <div className="container-custom py-12">
        <div className="animate-pulse">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-300 h-96 rounded-lg"></div>
            <div className="space-y-4"><div className="h-8 bg-gray-300 rounded w-3/4"></div><div className="h-6 bg-gray-300 rounded w-1/4"></div><div className="h-4 bg-gray-300 rounded"></div></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const productName = `${product.brand || product.name || ''} ${product.model || ''}`.trim() || 'Бүтээгдэхүүн';
  const images = product.images || product.imageUrls || [];

  return (
    <div className="container-custom py-8">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition">
        <ArrowLeft className="w-5 h-5 mr-2" /> Буцах
      </button>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {images.length > 0 && !imageErrors[selectedImage] ? (
              <img src={getImageUrl(images[selectedImage])} alt={productName} className="w-full h-full object-cover" onError={() => handleImageError(selectedImage)} />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <Package className="w-24 h-24 text-gray-400 mb-4" /><span className="text-gray-500">Зураг байхгүй</span>
              </div>
            )}
          </div>
          
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((url, index) => (
                <button key={index} onClick={() => setSelectedImage(index)} className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition ${selectedImage === index ? 'border-blue-600 shadow-md' : 'border-transparent hover:border-gray-300'}`}>
                  {!imageErrors[index] ? <img src={getImageUrl(url)} alt={`${productName} - ${index + 1}`} className="w-full h-full object-cover" onError={() => handleImageError(index)} /> : <div className="w-full h-full flex items-center justify-center bg-gray-100"><Package className="w-6 h-6 text-gray-400" /></div>}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-500">{product.year}</span>
              {product.isNew && <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">ШИНЭ</span>}
              {product.isFeatured && <span className="bg-yellow-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">ОНЦЛОХ</span>}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{productName}</h1>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}</div>
              <span className="text-gray-600">(12 үнэлгээ)</span>
            </div>

            <div className="text-4xl font-bold text-blue-600 mb-4">{formatPrice(product.price)}</div>
            {product.originalPrice && product.originalPrice > product.price && <span className="text-gray-400 line-through ml-2">{formatPrice(product.originalPrice)}</span>}

            <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {product.stock > 0 ? `${product.stock} нэгж үлдсэн` : 'Зарагдсан'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2"><Calendar className="w-5 h-5 text-gray-400" /><div><p className="text-xs text-gray-500">Он</p><p className="font-medium">{product.year || '-'}</p></div></div>
            <div className="flex items-center gap-2"><Gauge className="w-5 h-5 text-gray-400" /><div><p className="text-xs text-gray-500">Км</p><p className="font-medium">{formatMileage(product.mileage)}</p></div></div>
            <div className="flex items-center gap-2"><Fuel className="w-5 h-5 text-gray-400" /><div><p className="text-xs text-gray-500">Шатахуун</p><p className="font-medium">{product.fuelType || '-'}</p></div></div>
            <div className="flex items-center gap-2"><Package className="w-5 h-5 text-gray-400" /><div><p className="text-xs text-gray-500">Төрөл</p><p className="font-medium">{product.transmission || '-'}</p></div></div>
            <div className="flex items-center gap-2 col-span-2"><MapPin className="w-5 h-5 text-gray-400" /><div><p className="text-xs text-gray-500">Байршил</p><p className="font-medium">{product.location || '-'}</p></div></div>
          </div>

          <div className="border-t border-gray-200 py-6">
            <h3 className="font-semibold text-gray-900 mb-3">Тодорхойлолт</h3>
            <p className="text-gray-600 leading-relaxed">{product.description || 'Тодорхойлолт байхгүй'}</p>
          </div>

          {product.features && product.features.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Онцлогууд</h3>
              <div className="flex flex-wrap gap-2">{product.features.map((feature, idx) => <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"><CheckCircle className="inline w-3 h-3 mr-1 text-green-500" />{feature}</span>)}</div>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <label className="font-semibold text-gray-900">Тоо хэмжээ:</label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-gray-100 transition" disabled={product.stock === 0}><Minus className="w-4 h-4" /></button>
                <span className="px-4 py-2 border-x border-gray-300 min-w-[50px] text-center">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-3 py-2 hover:bg-gray-100 transition" disabled={product.stock === 0}><Plus className="w-4 h-4" /></button>
              </div>
            </div>

            <button onClick={handleAddToCart} disabled={product.stock === 0} className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <ShoppingCart className="w-5 h-5" /> {product.stock === 0 ? 'Зарагдсан' : 'Сагсанд нэмэх'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2"><Truck className="w-6 h-6 text-blue-600" /></div><p className="text-sm text-gray-600">Шуурхай хүргэлт</p></div>
            <div className="text-center"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2"><Shield className="w-6 h-6 text-blue-600" /></div><p className="text-sm text-gray-600">1 жилийн баталгаа</p></div>
            <div className="text-center"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2"><Award className="w-6 h-6 text-blue-600" /></div><p className="text-sm text-gray-600">Чанартай бүтээгдэхүүн</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
