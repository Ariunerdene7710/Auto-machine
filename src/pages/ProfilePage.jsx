import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import { Package, MapPin, Phone, Mail, Calendar, Clock, User, Car } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getMyOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('mn-MN').format(price) + ' ₮';

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('mn-MN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      PENDING: 'Хүлээгдэж байна',
      PROCESSING: 'Боловсруулж байна',
      SHIPPED: 'Хүргэлтэнд гарсан',
      DELIVERED: 'Хүргэгдсэн',
      CANCELLED: 'Цуцлагдсан'
    };
    return texts[status] || status;
  };

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Миний профайл</h1>

      <div className="grid md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="card p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-lg font-semibold text-gray-900">{user?.fullName || user?.username}</h2>
              <p className="text-gray-600">@{user?.username}</p>
            </div>

            <div className="space-y-2">
              <button onClick={() => setActiveTab('orders')} className={`w-full text-left px-4 py-2 rounded-lg transition ${activeTab === 'orders' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                <Package className="inline w-4 h-4 mr-2" /> Миний захиалгууд
              </button>
              <button onClick={() => setActiveTab('profile')} className={`w-full text-left px-4 py-2 rounded-lg transition ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                <User className="inline w-4 h-4 mr-2" /> Хувийн мэдээлэл
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          {activeTab === 'orders' && (
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Миний захиалгууд</h3>
              
              {loading ? (
                <div className="space-y-4">{[...Array(3)].map((_, i) => (<div key={i} className="animate-pulse"><div className="h-20 bg-gray-200 rounded-lg"></div></div>))}</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12"><Package className="w-16 h-16 text-gray-400 mx-auto mb-4" /><p className="text-gray-600">Танд захиалга байхгүй байна</p><Link to="/cars" className="btn-primary inline-block mt-4">Машин хайх</Link></div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div><p className="font-semibold text-gray-900">Захиалга #{order.orderNumber}</p><p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p></div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>{getStatusText(order.status)}</span>
                      </div>
                      <div className="border-t border-gray-100 pt-3">
                        <div className="flex justify-between mb-2"><span className="text-gray-600">Нийт дүн:</span><span className="font-semibold text-gray-900">{formatPrice(order.totalAmount)}</span></div>
                        <div className="flex items-start gap-2 text-sm text-gray-600"><MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" /><span className="line-clamp-1">{order.shippingAddress}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Хувийн мэдээлэл</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100"><User className="w-5 h-5 text-gray-400" /><div><p className="text-sm text-gray-500">Хэрэглэгчийн нэр</p><p className="font-medium text-gray-900">{user?.username}</p></div></div>
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100"><Mail className="w-5 h-5 text-gray-400" /><div><p className="text-sm text-gray-500">И-мэйл</p><p className="font-medium text-gray-900">{user?.email}</p></div></div>
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100"><User className="w-5 h-5 text-gray-400" /><div><p className="text-sm text-gray-500">Бүтэн нэр</p><p className="font-medium text-gray-900">{user?.fullName || '-'}</p></div></div>
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100"><Phone className="w-5 h-5 text-gray-400" /><div><p className="text-sm text-gray-500">Утасны дугаар</p><p className="font-medium text-gray-900">{user?.phoneNumber || 'Оруулаагүй'}</p></div></div>
                <div className="flex items-start gap-3"><MapPin className="w-5 h-5 text-gray-400 mt-0.5" /><div><p className="text-sm text-gray-500">Хаяг</p><p className="font-medium text-gray-900">{user?.address || 'Оруулаагүй'}</p></div></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;