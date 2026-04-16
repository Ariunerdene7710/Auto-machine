import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Car } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container-custom relative py-16 md:py-24 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Таны мөрөөдлийн {' '}
              <span className="text-yellow-300">Автомашин</span>
              {' '}энэ дээр
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
              Монголд итгэмжлэгдсэн худалдааны төв. Шинэ болон хуучин автомашины өргөн сонголт.
              Баталгаат үйлчилгээ, уян хатан санхүүжилт.
            </p>
            
            <div className="bg-white p-2 rounded-lg shadow-lg mb-8">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Брэнд, загвар эсвэл түлхүүр үг..."
                    className="w-full pl-10 pr-4 py-3 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Link
                  to="/cars"
                  className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition whitespace-nowrap"
                >
                  Хайх
                </Link>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/cars"
                className="inline-flex items-center justify-center bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition group"
              >
                Бүх автомашин харах
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition"
              >
                Зөвлөгөө авах
              </Link>
            </div>
            
            <div className="mt-12 flex items-center space-x-8">
              <div>
                <div className="text-2xl font-bold">150+</div>
                <div className="text-blue-100 text-sm">Автомашин</div>
              </div>
              <div className="w-px h-10 bg-blue-400"></div>
              <div>
                <div className="text-2xl font-bold">500+</div>
                <div className="text-blue-100 text-sm">Харилцагч</div>
              </div>
              <div className="w-px h-10 bg-blue-400"></div>
              <div>
                <div className="text-2xl font-bold">15+</div>
                <div className="text-blue-100 text-sm">Жил ажилласан</div>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block animate-scale-up">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent z-10 rounded-2xl"></div>
              <img
                src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800"
                alt="Luxury Car"
                className="rounded-2xl shadow-2xl w-full object-cover"
              />
              <div className="absolute bottom-4 left-4 z-20 bg-white text-gray-900 px-4 py-2 rounded-lg shadow-lg">
                <p className="text-sm text-gray-500">Онцлох</p>
                <p className="text-xl font-bold text-blue-600">₮65,000,000</p>
              </div>
              <div className="absolute top-4 right-4 z-20 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                <Car className="w-4 h-4" />
                Шинэ
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="#f9fafb"/>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;