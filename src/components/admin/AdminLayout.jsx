import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  Tags,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Home,
  Bell,
  Search,
  BarChart3,
  Truck,
  Archive
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Амжилттай гарлаа');
  };

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Хяналтын самбар', exact: true },
    { path: '/admin/products', icon: Package, label: 'Бүтээгдэхүүн' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'Захиалгууд' },
    { path: '/admin/categories', icon: Tags, label: 'Ангилалууд' },
    { path: '/admin/customers', icon: Users, label: 'Хэрэглэгчид' },
    { path: '/admin/analytics', icon: BarChart3, label: 'Аналитик' },
    { path: '/admin/inventory', icon: Archive, label: 'Бараа материал' },
    { path: '/admin/shipping', icon: Truck, label: 'Хүргэлт' },
    { path: '/admin/settings', icon: Settings, label: 'Тохиргоо' },
  ];

  const isActive = (path, exact) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  // Get current page title
  const getPageTitle = () => {
    const currentItem = menuItems.find(item => 
      item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path)
    );
    return currentItem?.label || 'Админ самбар';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-200
          transition-all duration-300 z-50 overflow-y-auto flex flex-col
          ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}
          ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 flex-shrink-0">
          {(!isSidebarCollapsed || isMobileMenuOpen) ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">MachineShop</span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center mx-auto">
              <Package className="w-5 h-5 text-white" />
            </div>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* User Info */}
        <div className={`p-4 border-b border-gray-200 flex-shrink-0 ${isSidebarCollapsed && !isMobileMenuOpen ? 'text-center' : ''}`}>
          <div className={`flex items-center gap-3 ${isSidebarCollapsed && !isMobileMenuOpen ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
              {user?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            {(!isSidebarCollapsed || isMobileMenuOpen) && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.fullName || user?.username || 'Admin'}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@example.com'}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                  Админ
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const active = isActive(item.path, item.exact);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${active
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                  ${isSidebarCollapsed && !isMobileMenuOpen ? 'justify-center' : ''}
                `}
                title={isSidebarCollapsed && !isMobileMenuOpen ? item.label : ''}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {(!isSidebarCollapsed || isMobileMenuOpen) && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0 relative">
          <Link
            to="/"
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all
              ${isSidebarCollapsed && !isMobileMenuOpen ? 'justify-center' : ''}
            `}
            title={isSidebarCollapsed && !isMobileMenuOpen ? 'Нүүр хуудас' : ''}
          >
            <Home className="w-5 h-5" />
            {(!isSidebarCollapsed || isMobileMenuOpen) && <span>Нүүр хуудас</span>}
          </Link>

          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all mt-2
              ${isSidebarCollapsed && !isMobileMenuOpen ? 'justify-center' : ''}
            `}
            title={isSidebarCollapsed && !isMobileMenuOpen ? 'Гарах' : ''}
          >
            <LogOut className="w-5 h-5" />
            {(!isSidebarCollapsed || isMobileMenuOpen) && <span>Гарах</span>}
          </button>

          {/* Collapse Toggle - Desktop */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden lg:flex absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white border border-gray-200 rounded-full items-center justify-center hover:bg-gray-50 shadow-sm"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  {getPageTitle()}
                </h1>
              </div>

              <div className="flex items-center gap-2 md:gap-4">
                {/* Search */}
                <div className="hidden md:flex items-center relative">
                  <Search className="absolute left-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Хайх..."
                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Notifications */}
                <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;