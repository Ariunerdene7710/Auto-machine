import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, ShoppingBag, Users, DollarSign,
  Clock, CheckCircle, XCircle, Truck, RefreshCw, AlertCircle,
} from 'lucide-react';
import { productAPI, orderAPI } from '../../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    totalCustomers: 0,
    lowStockProducts: 0
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [productsRes, ordersRes] = await Promise.all([
        productAPI.getAll().catch(() => ({ data: [] })),
        orderAPI.getAll().catch(() => ({ data: [] }))
      ]);

      const products = productsRes.data || [];
      const orders = ordersRes.data || [];
      
      const totalRevenue = orders
        .filter(o => o.status === 'DELIVERED')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      const lowStockProducts = products.filter(p => p.stockQuantity < 5).length;
      const uniqueCustomers = new Set(orders.map(o => o.user?.id).filter(Boolean)).size;

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders: orders.filter(o => o.status === 'PENDING').length,
        processingOrders: orders.filter(o => o.status === 'PROCESSING').length,
        shippedOrders: orders.filter(o => o.status === 'SHIPPED').length,
        deliveredOrders: orders.filter(o => o.status === 'DELIVERED').length,
        cancelledOrders: orders.filter(o => o.status === 'CANCELLED').length,
        totalCustomers: uniqueCustomers,
        lowStockProducts
      });

      const sortedOrders = [...orders].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setRecentOrders(sortedOrders.slice(0, 5));
      
      const sortedProducts = [...products].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setRecentProducts(sortedProducts.slice(0, 5));

      prepareChartData(orders);
      prepareCategoryData(products);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Мэдээлэл ачааллахад алдаа гарлаа');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const prepareChartData = (orders) => {
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const dailyOrders = last7Days.map(date => {
      const dayOrders = orders.filter(o => o.createdAt?.split('T')[0] === date);
      return {
        name: new Date(date).toLocaleDateString('mn-MN', { weekday: 'short' }),
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
      };
    });

    setChartData(dailyOrders);
  };

  const prepareCategoryData = (products) => {
    const categories = {};
    
    products.forEach(product => {
      if (product.category) {
        categories[product.category] = (categories[product.category] || 0) + 1;
      }
    });

    const categoryArray = Object.entries(categories).map(([name, value]) => ({
      name,
      value
    }));

    setCategoryData(categoryArray);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    toast.success('Мэдээлэл шинэчлэгдлээ');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('mn-MN').format(price || 0) + ' ₮';
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Хүлээгдэж байна' },
      PROCESSING: { color: 'bg-blue-100 text-blue-800', icon: RefreshCw, label: 'Боловсруулж байна' },
      SHIPPED: { color: 'bg-purple-100 text-purple-800', icon: Truck, label: 'Хүргэлтэнд' },
      DELIVERED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Хүргэгдсэн' },
      CANCELLED: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Цуцлагдсан' }
    };
    return badges[status] || { color: 'bg-gray-100 text-gray-800', icon: AlertCircle, label: status };
  };

  const statCards = [
    {
      title: 'Нийт бүтээгдэхүүн',
      value: stats.totalProducts,
      subValue: `${stats.lowStockProducts} бага үлдэгдэлтэй`,
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      link: '/admin/products'
    },
    {
      title: 'Нийт захиалга',
      value: stats.totalOrders,
      subValue: `${stats.pendingOrders} хүлээгдэж буй`,
      icon: ShoppingBag,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      link: '/admin/orders'
    },
    {
      title: 'Нийт орлого',
      value: formatPrice(stats.totalRevenue),
      subValue: '📈 Нийт орлого',
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      link: '/admin/orders'
    },
    {
      title: 'Нийт хэрэглэгч',
      value: stats.totalCustomers,
      subValue: '👥 Бүртгэлтэй',
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      link: '/admin/customers'
    }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Мэдээлэл ачааллаж байна...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Хяналтын самбар</h1>
          <p className="text-gray-600 mt-1">Системийн ерөнхий мэдээлэл</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Сэргээх
          </button>
          <Link to="/admin/products/new" className="btn-primary flex items-center gap-2">
            <Package className="w-4 h-4" />
            + Шинэ бүтээгдэхүүн
          </Link>
        </div>
      </div>

      {/* Order Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Хүлээгдэж буй', value: stats.pendingOrders, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Боловсруулж буй', value: stats.processingOrders, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Хүргэлтэнд', value: stats.shippedOrders, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Хүргэгдсэн', value: stats.deliveredOrders, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Цуцлагдсан', value: stats.cancelledOrders, color: 'text-red-600', bg: 'bg-red-50' }
        ].map((status, index) => (
          <div key={index} className={`${status.bg} rounded-lg p-4`}>
            <p className="text-sm text-gray-600 mb-1">{status.label}</p>
            <p className={`text-2xl font-bold ${status.color}`}>{status.value}</p>
          </div>
        ))}
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-xl`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.subValue}</p>
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">7 хоногийн захиалга</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ангилалын хуваарилалт</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              Мэдээлэл байхгүй
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders and Products */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Сүүлийн захиалгууд</h3>
            <Link to="/admin/orders" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Бүгдийг харах →
            </Link>
          </div>

          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Захиалга байхгүй байна</p>
            ) : (
              recentOrders.map((order) => {
                const statusBadge = getStatusBadge(order.status);
                const StatusIcon = statusBadge.icon;
                
                return (
                  <Link
                    key={order.id}
                    to={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{order.orderNumber}</p>
                        <p className="text-sm text-gray-500">{order.user?.fullName || order.user?.username || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatPrice(order.totalAmount)}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge.color}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusBadge.label}
                      </span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Шинэ бүтээгдэхүүн</h3>
            <Link to="/admin/products" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Бүгдийг харах →
            </Link>
          </div>

          <div className="space-y-3">
            {recentProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Бүтээгдэхүүн байхгүй байна</p>
            ) : (
              recentProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/admin/products/edit/${product.id}`}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
                >
                  <div className="flex items-center gap-3">
                    {product.imageUrls?.[0] ? (
                      <img
                        src={product.imageUrls[0].startsWith('http') ? product.imageUrls[0] : `http://localhost:8080${product.imageUrls[0]}`}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/40x40/e5e7eb/6b7280?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.category || 'Ангилалгүй'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatPrice(product.price)}</p>
                    <p className={`text-sm ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stockQuantity} ш үлдсэн
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
