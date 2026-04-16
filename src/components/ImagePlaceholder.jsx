import React from 'react';
import { Package } from 'lucide-react';

const ImagePlaceholder = ({ 
  width = '100%', 
  height = 200, 
  text = 'Зураг байхгүй',
  className = '',
  iconSize = 48
}) => {
  return (
    <div 
      className={`bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center rounded-lg ${className}`}
      style={{ width, height: typeof height === 'number' ? `${height}px` : height }}
    >
      <Package className="text-gray-400 mb-2" style={{ width: iconSize, height: iconSize }} />
      <span className="text-sm text-gray-500 text-center px-2">{text}</span>
    </div>
  );
};

export default ImagePlaceholder;