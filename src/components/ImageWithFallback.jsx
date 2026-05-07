import React, { useState } from 'react';
import { Package, ImageOff } from 'lucide-react';
import { imageAPI } from '../services/imageApi';

const ImageWithFallback = ({ 
  src, 
  alt = 'Image', 
  className = '', 
  fallbackClassName = '',
  showLoading = true
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageSrc] = useState(() => {
    if (!src) return null;
    return imageAPI.getImageUrl(src);
  });

  const handleError = () => {
    setError(true);
    setLoading(false);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  if (!imageSrc || error) {
    return (
      <div className={`bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center ${fallbackClassName || className}`}>
        <ImageOff className="w-12 h-12 text-gray-400 mb-2" />
        <span className="text-sm text-gray-500">{alt}</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {loading && showLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <Package className="w-8 h-8 text-gray-300" />
          </div>
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

export default ImageWithFallback;
