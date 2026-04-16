import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Package, CreditCard, Car } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shippingAddress: user?.address || '',
    contactPhone: user?.phoneNumber || '',
    notes: ''
  });

  const formatPrice = (price) => new Intl.NumberFormat('mn-MN').format(price) + ' ₮';

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderItems = cartItems.map(item => ({
        car: { id: item.id },
        quantity: item.quantity,
        price: item.price
      }));

      await orderAPI.create(orderItems, formData.shippingAddress, formData.contactPhone, formData.notes);
      clearCart();
      toast.success('Захиалга амжилттай!');
      navigate('/profile');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Захиалга хийхэд алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Захиалга баталгаажуулах</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Хүргэлтийн мэдээлэл</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"><MapPin className="inline w-4 h-4 mr-1" />Хүргэлтийн хаяг *</label>
                  <textarea name="shippingAddress" value={formData.shippingAddress} onChange={handleChange} required rows="3" className="input-field" placeholder="Улаанбаатар хот, Баянзүрх дүүрэг, 26-р хороо..." />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"><Phone className="inline w-4 h-4 mr-1" />Утасны дугаар *</label>
                  <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} required className="input-field" placeholder="9999-9999" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Нэмэлт мэдээлэл</label>
                  <textarea name="notes" value={formData.notes} onChange={handleChange} rows="2" className="input-field" placeholder="Хүргэлтийн тусгай заавар..." />
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button type="button" onClick={() => navigate('/cart')} className="btn-secondary">Буцах</button>
              <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Боловсруулж байна...' : 'Захиалга баталгаажуулах'}</button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Таны захиалга</h2>

            <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3 py-2 border-b border-gray-100">
                  {item.images?.[0] ? (
                    <img src={`http://localhost:8080/api/images/${item.images[0]}`} alt={item.model} className="w-16 h-16 object-cover rounded" onError={(e) => { e.target.src = 'https://placehold.co/60x60/e5e7eb/6b7280?text=No+Image'; }} />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center"><Car className="w-6 h-6 text-gray-400" /></div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm line-clamp-1">{item.brand} {item.model}</p>
                    <p className="text-sm text-gray-500">{item.quantity} x {formatPrice(item.price)}</p>
                  </div>
                  <p className="font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between"><span className="text-gray-600">Бүтээгдэхүүн</span><span className="font-medium">{formatPrice(getCartTotal())}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Хүргэлт</span><span className="text-green-600">Үнэгүй</span></div>
              <div className="flex justify-between pt-2 border-t border-gray-200"><span className="text-lg font-bold text-gray-900">Нийт</span><span className="text-lg font-bold text-blue-600">{formatPrice(getCartTotal())}</span></div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-2"><CreditCard className="w-5 h-5 text-blue-600 mt-0.5" /><div><p className="text-sm font-medium text-gray-900">Төлбөрийн мэдээлэл</p><p className="text-sm text-gray-600">Хүргэлтээр төлөх (Бэлнээр эсвэл картаар)</p></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;