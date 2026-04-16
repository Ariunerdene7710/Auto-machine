import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, MapPin, Eye, EyeOff, Car } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', fullName: '', phoneNumber: '', address: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await register(formData);
    if (result.success) navigate('/login');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4"><div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center"><Car className="w-8 h-8 text-white" /></div></div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Бүртгүүлэх</h2>
          <p className="text-gray-600">Шинэ бүртгэл үүсгэнэ үү</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Хэрэглэгчийн нэр *</label><div className="relative"><User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" name="username" value={formData.username} onChange={handleChange} required minLength={3} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="username" /></div></div>

            <div><label className="block text-sm font-medium text-gray-700 mb-2">И-мэйл *</label><div className="relative"><Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="example@email.com" /></div></div>

            <div><label className="block text-sm font-medium text-gray-700 mb-2">Нууц үг *</label><div className="relative"><Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" /><input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required minLength={6} className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="••••••••" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2">{showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}</button></div></div>

            <div><label className="block text-sm font-medium text-gray-700 mb-2">Бүтэн нэр *</label><div className="relative"><User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Бат Дорж" /></div></div>

            <div><label className="block text-sm font-medium text-gray-700 mb-2">Утасны дугаар</label><div className="relative"><Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="9999-9999" /></div></div>

            <div><label className="block text-sm font-medium text-gray-700 mb-2">Хаяг</label><div className="relative"><MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" /><textarea name="address" value={formData.address} onChange={handleChange} rows="2" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Улаанбаатар хот..." /></div></div>

            <button type="submit" disabled={loading} className="w-full btn-primary">{loading ? 'Бүртгэж байна...' : 'Бүртгүүлэх'}</button>
          </form>

          <div className="mt-6 text-center"><p className="text-gray-600">Бүртгэлтэй юу? <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">Нэвтрэх</Link></p></div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;