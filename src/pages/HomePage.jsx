import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Car, Shield, Award, Clock, Fuel, Gauge, Calendar, Wrench } from 'lucide-react';
import { carAPI } from '../services/api';
import CarCard from '../components/CarCard';
import HeroSection from '../components/HeroSection';
import { mockCars } from '../data/mockCars';

const HomePage = () => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await carAPI.getAll();
      const cars = response.data || mockCars;
      const featured = cars.filter(car => car.isFeatured).slice(0, 6);
      setFeaturedCars(featured.length > 0 ? featured : cars.slice(0, 6));
    } catch (error) {
      console.error('Error fetching cars:', error);
      setFeaturedCars(mockCars);
    } finally {
      setLoading(false);
    }
  };

  const brands = [
    { name: 'Toyota', icon: '🚗', count: 24, slug: 'toyota' },
    { name: 'Lexus', icon: '✨', count: 15, slug: 'lexus' },
    { name: 'Nissan', icon: '🏎️', count: 18, slug: 'nissan' },
    { name: 'Honda', icon: '🚙', count: 12, slug: 'honda' },
    { name: 'BMW', icon: '🛞', count: 10, slug: 'bmw' },
    { name: 'Mercedes-Benz', icon: '⭐', count: 14, slug: 'mercedes' },
    { name: 'Audi', icon: '🔰', count: 8, slug: 'audi' },
    { name: 'Hyundai', icon: '🚐', count: 20, slug: 'hyundai' },
    { name: 'Kia', icon: '🚘', count: 16, slug: 'kia' },
    { name: 'Mazda', icon: '🏁', count: 11, slug: 'mazda' },
  ];

  const features = [
    { icon: Car, title: 'Баталгаажсан машин', description: 'Бүх машин техникийн хяналтад орсон' },
    { icon: Shield, title: 'Баталгаат үйлчилгээ', description: '1 жилийн баталгаа, итгэлтэй үйлчилгээ' },
    { icon: Award, title: 'Чанартай автомашин', description: 'Япон, Солонгос, Герман улсаас оруулж ирсэн' },
    { icon: Clock, title: '24/7 Тусламж', description: 'Мэргэжлийн зөвлөгөө, түргэн шуурхай үйлчилгээ' },
  ];

  return (
    <div className="min-h-screen">
      <HeroSection />

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-lg transition">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 py-16">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Алдартай брэндүүд</h2>
            <p className="text-gray-600 text-lg">Дэлхийд алдартай үйлдвэрлэгчдийн автомашинууд</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {brands.map((brand, index) => (
              <Link key={index} to={`/cars?brand=${brand.slug}`} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:border-blue-500 hover:shadow-md transition group">
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{brand.icon}</div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition">{brand.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{brand.count} машин</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-16">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Онцлох автомашинууд</h2>
              <p className="text-gray-600">Шинээр ирсэн, хамгийн эрэлттэй автомашинууд</p>
            </div>
            <Link to="/cars" className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
              Бүгдийг харах <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-pulse">
                  <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : featuredCars.length === 0 ? (
            <div className="text-center py-12">
              <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Одоогоор машин байхгүй байна</h3>
              <p className="text-gray-600">Удахгүй шинэ машинууд нэмэгдэх болно</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCars.map((car) => <CarCard key={car.id} car={car} />)}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-blue-800 py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Таны мөрөөдлийн <span className="text-yellow-300">Автомашин</span> хүлээж байна
          </h2>
          <p className="text-blue-100 text-lg md:text-xl mb-8 max-w-3xl mx-auto">
            Монголд итгэмжлэгдсэн худалдааны төв. Шинэ болон хуучин автомашины өргөн сонголт.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cars" className="inline-flex items-center justify-center bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition text-lg">
              Автомашин хайх <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition text-lg">
              Холбоо барих
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
