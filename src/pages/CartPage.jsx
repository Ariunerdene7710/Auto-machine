import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();

  const formatPrice = (price) => new Intl.NumberFormat('mn-MN').format(price || 0) + ' ₮';

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Та эхлээд нэвтэрнэ үү');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container-custom py-16">
        <div className="flex flex-col items-center justify-center min-h-[500px]">
          <ShoppingCart className="w-24 h-24 text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Сагс хоосон байна</h2>
          <p className="text-gray-600 mb-6">Сагсан дээ бүтээгдэхүүнээ нэмнэ үү</p>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary flex items-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Бүтээгдэхүүн сонгох
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Буцах
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Сагс</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-2">
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Бүтээгдэхүүн</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Үнэ</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Тоо хэмжээ</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Нийт үнэ</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {item.brand && item.model ? `${item.brand} ${item.model}` : item.name}
                        </p>
                        <p className="text-sm text-gray-500">ID: {item.id}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center text-gray-900 font-medium">
                      {formatPrice(item.price)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center border border-gray-300 rounded-lg w-fit mx-auto">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="px-3 py-1 hover:bg-gray-100 transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-1 border-x border-gray-300 min-w-[50px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="px-3 py-1 hover:bg-gray-100 transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center text-gray-900 font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => {
                          removeFromCart(item.id);
                          toast.success('Сагснаас хасагдлаа');
                        }}
                        className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition"
                        title="Устгах"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => navigate('/products')}
              className="flex-1 btn-secondary py-3 rounded-lg font-medium hover:bg-gray-100 transition"
            >
              Үргэлжүүлэн худалдан авах
            </button>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="md:col-span-1">
          <div className="card p-6 sticky top-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Дүн</h3>

            <div className="space-y-3 mb-4 pb-4 border-b">
              <div className="flex justify-between text-gray-600">
                <span>Нийт утга:</span>
                <span>{formatPrice(getCartTotal())}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Хүргэлтийн үнэ:</span>
                <span>Үнэгүй</span>
              </div>
            </div>

            <div className="flex justify-between mb-6">
              <span className="text-lg font-semibold text-gray-900">Нийт: </span>
              <span className="text-2xl font-bold text-blue-600">{formatPrice(getCartTotal())}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-3"
            >
              Төлөх
            </button>

            <button
              onClick={() => navigate('/products')}
              className="w-full btn-secondary py-3 rounded-lg font-medium hover:bg-gray-100 transition"
            >
              Үргэлжүүлэх
            </button>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">
                ✓ Найдвартай төлөлт<br />
                ✓ Шуурхай хүргэлт<br />
                ✓ 24/7 Дэмжлэг
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
