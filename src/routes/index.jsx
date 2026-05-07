import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout Components
import Layout from '../components/Layout/Layout';
import AdminLayout from '../components/admin/AdminLayout';

// Public Pages
import HomePage from '../pages/HomePage';
import CarsPage from '../pages/CarsPage';
import CarDetailPage from '../pages/CarDetailPage';
import ProductsPage from '../pages/ProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import CartPage from '../pages/CartPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

// Protected Pages
import CheckoutPage from '../pages/CheckoutPage';
import ProfilePage from '../pages/ProfilePage';

// Admin Pages
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminProducts from '../components/admin/AdminProducts';
import AdminOrders from '../components/admin/AdminOrders';
import AdminCategories from '../components/admin/AdminCategories';
import AdminCustomers from '../components/admin/AdminCustomers';
import AdminSettings from '../components/admin/AdminSettings';

// Route Guards
import PrivateRoute from '../components/PrivateRoute';
import AdminRoute from '../components/AdminRoute';

const PlaceholderPage = ({ title }) => (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
    <div className="card p-8 text-center">
      <p className="text-gray-600">Энэ хуудас хөгжүүлэлтийн шатандаа байна.</p>
    </div>
  </div>
);

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes with Main Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="cars" element={<CarsPage />} />
        <Route path="cars/:id" element={<CarDetailPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        
        {/* About and Contact */}
        <Route path="about" element={
          <div className="container-custom py-16">
            <h1 className="text-3xl font-bold mb-6">Бидний тухай</h1>
            <p className="text-gray-600">AutoMarket нь Монголын хамгийн том автомашины худалдааны төв юм.</p>
          </div>
        } />
        <Route path="contact" element={
          <div className="container-custom py-16">
            <h1 className="text-3xl font-bold mb-6">Холбоо барих</h1>
            <p className="text-gray-600">Утас: +976 9999-9999 | И-мэйл: info@automarket.mn</p>
          </div>
        } />
        
        {/* Protected User Routes */}
        <Route path="checkout" element={
          <PrivateRoute>
            <CheckoutPage />
          </PrivateRoute>
        } />
        <Route path="profile" element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        } />
        <Route path="orders" element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        } />
      </Route>

      {/* Admin Routes with Admin Layout */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<AdminProducts />} />
        <Route path="products/edit/:id" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="settings" element={<AdminSettings />} />
        
        {/* Placeholder routes for other menu items */}
        <Route path="analytics" element={<PlaceholderPage title="Аналитик" />} />
        <Route path="inventory" element={<PlaceholderPage title="Бараа материал" />} />
        <Route path="shipping" element={<PlaceholderPage title="Хүргэлт" />} />
      </Route>

      {/* 404 Not Found */}
      <Route path="404" element={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-9xl font-bold text-gray-300 mb-4">404</h1>
            <h2 className="text-3xl font-semibold text-gray-700 mb-4">Хуудас олдсонгүй</h2>
            <p className="text-gray-600 mb-8">Уучлаарай, таны хайсан хуудас олдсонгүй.</p>
            <a href="/" className="btn-primary">Нүүр хуудас руу буцах</a>
          </div>
        </div>
      } />
      
      {/* Redirect to 404 for unknown routes */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default AppRoutes;
