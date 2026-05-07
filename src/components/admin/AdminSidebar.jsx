import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  BarChart3,
  Tags,
  Truck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Home,
  ClipboardList,
  TrendingUp,
  Archive
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AdminSidebar = ({ isCollapsed, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Амжилттай гарлаа');
  };

  const menuItems = [
    {
      path: '/admin',
      icon: LayoutDashboard,
      label: 'Хяналтын самбар',
      exact: true
    },
    {
      path: '/admin/products',
      icon: Package,
      label: 'Бүтээгдэхүүн',
    },
    {
      path: '/admin/orders',
      icon: ShoppingBag,
      label: 'Захиалгууд',
    },
    {
      path: '/admin/categories',
      icon: Tags,
      label: 'Ангилалууд',
    },
    {
      path: '/admin/customers',
      icon: Users,
      label: 'Хэрэглэгчид',
    },
    {
      path: '/admin/analytics',
      icon: BarChart3,
      label: 'Аналитик',
    },
    {
      path: '/admin/inventory',
      icon: Archive,
      label: 'Бараа материал',
    },
    {
      path: '/admin/shipping',
      icon: Truck,
      label: 'Хүргэлт',
    },
    {
      path: '/admin/settings',
      icon: Settings,
      label: 'Тохиргоо',
    }
  ];

  const NavItem = ({ item }) => {
    return (
      <NavLink
        to={item.path}
        className={({ isActive }) => `
          flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
          ${isActive 
            ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }
          ${isCollapsed ? 'justify-center' : ''}
        `}
        title={isCollapsed ? item.label : ''}
      >
        <item.icon className={`w-5 h-5 flex-shrink-0`} />
        {!isCollapsed && <span className="font-medium">{item.label}</span>}
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-200
          transition-all duration-300 z-50
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Sidebar Header */}
        <div className={`flex items-center justify-between h-16 px-4 border-b border-gray-200`}>
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">MachineShop</span>
            </div>
          )}
          
          {isCollapsed && (
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center mx-auto">
              <Package className="w-5 h-5 text-white" />
            </div>
          )}

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* User Info */}
        <div className={`p-4 border-b border-gray-200 ${isCollapsed ? 'text-center' : ''}`}>
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.fullName || user?.username}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full font-medium">
                  Админ
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className={`p-4 space-y-1 overflow-y-auto ${isCollapsed ? 'h-[calc(100vh-200px)]' : 'h-[calc(100vh-180px)]'}`}>
          {menuItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white`}>
          <NavLink
            to="/"
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all
              ${isCollapsed ? 'justify-center' : ''}
            `}
            title={isCollapsed ? 'Нүүр хуудас' : ''}
          >
            <Home className="w-5 h-5" />
            {!isCollapsed && <span>Нүүр хуудас</span>}
          </NavLink>

          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all
              ${isCollapsed ? 'justify-center' : ''}
            `}
            title={isCollapsed ? 'Гарах' : ''}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span>Гарах</span>}
          </button>

          {/* Collapse Toggle - Desktop Only */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white border border-gray-200 rounded-full items-center justify-center hover:bg-gray-50"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
