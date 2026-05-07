import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Car, Fuel, Gauge, Calendar, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `http://localhost:8080/api/images/${url}`;
};

const CarCard = ({ car }) => {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(car, 1);
    toast.success(`${car.brand} ${car.model} сагсанд нэмэгдлээ`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('mn-MN').format(price || 0) + ' ₮';
  };

  const formatMileage = (mileage) => {
    if (!mileage) return '-';
    return new Intl.NumberFormat('mn-MN').format(mileage) + ' км';
  };

  const imageUrl = getImageUrl(car.images?.[0] || car.imageUrls?.[0]);
  const carName = `${car.brand || ''} ${car.model || ''}`.trim();

  return (
    <Link to={`/cars/${car.id}`} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group block hover:shadow-lg transition">
      <div className="relative overflow-hidden bg-gray-100">
        {imageUrl && !imageError ? (
          <>
            {imageLoading && (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <div className="animate-pulse">
                  <Car className="w-12 h-12 text-gray-300" />
                </div>
              </div>
            )}
            <img
              src={imageUrl}
              alt={carName}
              className={`w-full h-52 object-cover group-hover:scale-110 transition duration-500 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => setImageLoading(false)}
              onError={() => { setImageError(true); setImageLoading(false); }}
            />
          </>
        ) : (
          <div className="w-full h-52 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <Car className="w-16 h-16 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Зураг байхгүй</span>
          </div>
        )}
        
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {car.isNew && (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              ШИНЭ
            </span>
          )}
          {car.isFeatured && (
            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              ОНЦЛОХ
            </span>
          )}
          {car.stock === 0 && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              ЗАРАГДСАН
            </span>
          )}
        </div>
        
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition">
          <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition">
            <Eye className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
          {carName}
        </h3>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          {car.year && (
            <div className="flex items-center gap-1 text-gray-600 text-sm">
              <Calendar className="w-4 h-4" />
              <span>{car.year}</span>
            </div>
          )}
          {car.mileage !== undefined && (
            <div className="flex items-center gap-1 text-gray-600 text-sm">
              <Gauge className="w-4 h-4" />
              <span>{formatMileage(car.mileage)}</span>
            </div>
          )}
          {car.fuelType && (
            <div className="flex items-center gap-1 text-gray-600 text-sm">
              <Fuel className="w-4 h-4" />
              <span>{car.fuelType}</span>
            </div>
          )}
          {car.transmission && (
            <div className="flex items-center gap-1 text-gray-600 text-sm">
              <Car className="w-4 h-4" />
              <span>{car.transmission}</span>
            </div>
          )}
          {car.location && (
            <div className="flex items-center gap-1 text-gray-600 text-sm col-span-2">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1">{car.location}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-xl font-bold text-blue-600">
              {formatPrice(car.price)}
            </span>
            {car.originalPrice && car.originalPrice > car.price && (
              <span className="text-sm text-gray-400 line-through ml-2">
                {formatPrice(car.originalPrice)}
              </span>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={car.stock === 0}
            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            title="Сагсанд нэмэх"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>   
    </Link>
  );
};

export default CarCard;
