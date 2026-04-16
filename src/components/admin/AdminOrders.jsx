import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Eye, Package, Truck, CheckCircle, XCircle, 
  Clock, MapPin, Phone, Mail, Calendar, DollarSign,
  ChevronDown, ChevronUp, Filter
} from 'lucide-react';
import { orderAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter, dateRange]);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getAll();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Захиалга ачааллахад алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(o => 
        o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.contactPhone?.includes(searchTerm)
      );
    }
    
    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(o => o.status === statusFilter);
    }
    
    // Date range filter
    if (dateRange.start) {
      filtered = filtered.filter(o => new Date(o.createdAt) >= new Date(dateRange.start));
    }
    if (dateRange.end) {
      filtered = filtered.filter(o => new Date(o.createdAt) <= new Date(dateRange.end));
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    setFilteredOrders(filtered);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      toast.success('Захиалгын төлөв шинэчлэгдлээ');
      fetchOrders();
    } catch (error) {
      toast.error('Төлөв шинэчлэхэд алдаа гарлаа');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('mn-MN').format(price || 0) + ' ₮';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('mn-MN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Хүлээгдэж байна' },
      PROCESSING: { color: 'bg-blue-100 text-blue-800', icon: Package, text: 'Боловсруулж байна' },
      SHIPPED: { color: 'bg-purple-100 text-purple-800', icon: Truck, text: 'Хүргэлтэнд гарсан' },
      DELIVERED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Хүргэгдсэн' },
      CANCELLED: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Цуцлагдсан' }
    };
    return badges[status] || { color: 'bg-gray-100 text-gray-800', icon: Package, text: status };
  };

  const getNextStatus = (currentStatus) => {
    const flow = {
      PENDING: 'PROCESSING',
      PROCESSING: 'SHIPPED',
      SHIPPED: 'DELIVERED',
      DELIVERED: null,
      CANCELLED: null
    };
    return flow[currentStatus];
  };

  const statuses = ['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  const totalRevenue = filteredOrders
    .filter(o => o.status === 'DELIVERED')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const pendingCount = filteredOrders.filter(o => o.status === 'PENDING').length;
  const processingCount = filteredOrders.filter(o => o.status === 'PROCESSING').length;

  return (
    <div className="container-custom py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Захиалгын удирдлага</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <p className="text-sm text-gray-600">Нийт захиалга</p>
          <p className="text-2xl font-bold text-gray-900">{filteredOrders.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-600">Хүлээгдэж буй</p>
          <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-600">Боловсруулж буй</p>
          <p className="text-2xl font-bold text-blue-600">{processingCount}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-600">Нийт орлого</p>
          <p className="text-2xl font-bold text-green-600">{formatPrice(totalRevenue)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Захиалгын дугаар, хэрэглэгч, утас..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'ALL' ? 'Бүх төлөв' : getStatusBadge(status).text}
              </option>
            ))}
          </select>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            Огноогоор шүүх
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {(searchTerm || statusFilter !== 'ALL' || dateRange.start || dateRange.end) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
                setDateRange({ start: '', end: '' });
              }}
              className="text-red-600 hover:text-red-700"
            >
              Цэвэрлэх
            </button>
          )}
        </div>
        
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Эхлэх огноо
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дуусах огноо
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        )}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))
        ) : filteredOrders.length === 0 ? (
          <div className="card p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Захиалга олдсонгүй</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const statusBadge = getStatusBadge(order.status);
            const StatusIcon = statusBadge.icon;
            const nextStatus = getNextStatus(order.status);
            const isExpanded = expandedOrder === order.id;
            
            return (
              <div key={order.id} className="card overflow-hidden">
                {/* Order Header */}
                <div className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                      
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-semibold text-gray-900">
                            Захиалга #{order.orderNumber}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusBadge.text}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Нийт дүн</p>
                        <p className="text-xl font-bold text-primary-600">
                          {formatPrice(order.totalAmount)}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        {nextStatus && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, nextStatus)}
                            className="btn-primary !py-2 !px-4 text-sm"
                          >
                            {nextStatus === 'PROCESSING' && 'Боловсруулах'}
                            {nextStatus === 'SHIPPED' && 'Хүргэлтэнд гаргах'}
                            {nextStatus === 'DELIVERED' && 'Хүргэгдсэн'}
                          </button>
                        )}
                        
                        {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'CANCELLED')}
                            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm"
                          >
                            Цуцлах
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-200 bg-gray-50 p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Customer Info */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Хэрэглэгчийн мэдээлэл</h4>
                        <div className="space-y-2">
                          <p className="flex items-center text-gray-700">
                            <User className="w-4 h-4 mr-2 text-gray-400" />
                            {order.user?.fullName || 'N/A'} (@{order.user?.username})
                          </p>
                          <p className="flex items-center text-gray-700">
                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                            {order.user?.email || 'N/A'}
                          </p>
                          <p className="flex items-center text-gray-700">
                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                            {order.contactPhone}
                          </p>
                          <p className="flex items-start text-gray-700">
                            <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-1" />
                            {order.shippingAddress}
                          </p>
                        </div>
                      </div>
                      
                      {/* Order Items */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Захиалсан бүтээгдэхүүн</h4>
                        <div className="space-y-2">
                          {order.items?.map((item, index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.machine?.imageUrls?.[0] || 'https://via.placeholder.com/40x40?text=No+Image'}
                                  alt={item.machine?.name}
                                  className="w-10 h-10 object-cover rounded"
                                />
                                <div>
                                  <p className="font-medium text-gray-900">{item.machine?.name}</p>
                                  <p className="text-sm text-gray-500">
                                    {item.quantity} x {formatPrice(item.unitPrice)}
                                  </p>
                                </div>
                              </div>
                              <p className="font-medium text-gray-900">
                                {formatPrice(item.totalPrice)}
                              </p>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Нийт дүн:</span>
                            <span className="text-lg font-bold text-primary-600">
                              {formatPrice(order.totalAmount)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {order.notes && (
                      <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-1">Тэмдэглэл:</p>
                        <p className="text-gray-600">{order.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminOrders;