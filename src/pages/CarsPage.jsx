import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, X, Car, SlidersHorizontal } from 'lucide-react';
import { carAPI } from '../services/api';
import CarCard from '../components/CarCard';

const CarsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    brand: '',
    minPrice: '',
    maxPrice: '',
    year: '',
    fuelType: '',
    transmission: '',
    location: ''
  });
  const [sortBy, setSortBy] = useState('newest');

  const brands = ['Бүгд', 'Toyota', 'Lexus', 'Nissan', 'Honda', 'BMW', 'Mercedes-Benz', 'Audi', 'Hyundai', 'Kia', 'Mazda'];
  const fuelTypes = ['Бүгд', 'Бензин', 'Дизель', 'Hybrid', 'Цахилгаан'];
  const transmissions = ['Бүгд', 'Автомат', 'Механик'];

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    filterAndSortCars();
  }, [cars, filters, sortBy]);

  const mockCars = [
    { id: 1, brand: 'Toyota', model: 'Camry', year: 2023, price: 35000000, fuelType: 'Бензин', transmission: 'Автомат', location: 'Улаанбаатар', active: true },
    { id: 2, brand: 'Lexus', model: 'RX', year: 2023, price: 75000000, fuelType: 'Бензин', transmission: 'Автомат', location: 'Улаанбаатар', active: true },
    { id: 3, brand: 'Honda', model: 'Civic', year: 2022, price: 28000000, fuelType: 'Бензин', transmission: 'Механик', location: 'Улаанбаатар', active: true },
    { id: 4, brand: 'Nissan', model: 'Qashqai', year: 2023, price: 32000000, fuelType: 'Дизель', transmission: 'Автомат', location: 'Улаанбаатар', active: true },
    { id: 5, brand: 'BMW', model: '3 Series', year: 2022, price: 65000000, fuelType: 'Бензин', transmission: 'Автомат', location: 'Улаанбаатар', active: true },
    { id: 6, brand: 'Mercedes-Benz', model: 'C-Class', year: 2023, price: 72000000, fuelType: 'Бензин', transmission: 'Автомат', location: 'Улаанбаатар', active: true },
  ];

  const fetchCars = async () => {
    try {
      const searchQuery = searchParams.get('search');
      const brandParam = searchParams.get('brand');
      
      let response;
      if (searchQuery) {
        response = await carAPI.search({ keyword: searchQuery });
      } else {
        response = await carAPI.getAll();
      }
      
      const allCars = response.data || mockCars;
      const activeCars = allCars.filter(car => car.active !== false);
      setCars(activeCars);
      
      if (brandParam) {
        setFilters(prev => ({ ...prev, brand: brandParam }));
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
      setCars(mockCars);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCars = () => {
    let filtered = [...cars];

    if (filters.brand && filters.brand !== 'Бүгд') {
      filtered = filtered.filter(c => c.brand === filters.brand);
    }
    if (filters.minPrice) {
      filtered = filtered.filter(c => c.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(c => c.price <= parseFloat(filters.maxPrice));
    }
    if (filters.year) {
      filtered = filtered.filter(c => c.year === parseInt(filters.year));
    }
    if (filters.fuelType && filters.fuelType !== 'Бүгд') {
      filtered = filtered.filter(c => c.fuelType === filters.fuelType);
    }
    if (filters.transmission && filters.transmission !== 'Бүгд') {
      filtered = filtered.filter(c => c.transmission === filters.transmission);
    }
    if (filters.location) {
      filtered = filtered.filter(c => c.location?.toLowerCase().includes(filters.location.toLowerCase()));
    }

    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'year-desc':
        filtered.sort((a, b) => (b.year || 0) - (a.year || 0));
        break;
      case 'year-asc':
        filtered.sort((a, b) => (a.year || 0) - (b.year || 0));
        break;
      default:
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    setFilteredCars(filtered);
  };

  const clearFilters = () => {
    setFilters({
      brand: '',
      minPrice: '',
      maxPrice: '',
      year: '',
      fuelType: '',
      transmission: '',
      location: ''
    });
    setSortBy('newest');
    setSearchParams({});
  };

  const hasActiveFilters = Object.values(filters).some(v => v && v !== 'Бүгд');

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Автомашинууд</h1>
        <p className="text-gray-600">{filteredCars.length} машин олдлоо</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="hidden lg:block w-72 flex-shrink-0">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-20">
            <h3 className="font-semibold text-gray-900 mb-4">Шүүлтүүр</h3>
            
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Брэнд</label>
              <select value={filters.brand} onChange={(e) => setFilters({...filters, brand: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Үнэ (₮)</label>
              <div className="flex gap-2">
                <input type="number" placeholder="Бага" value={filters.minPrice} onChange={(e) => setFilters({...filters, minPrice: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <input type="number" placeholder="Их" value={filters.maxPrice} onChange={(e) => setFilters({...filters, maxPrice: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Он</label>
              <input type="number" placeholder="Жиш: 2020" value={filters.year} onChange={(e) => setFilters({...filters, year: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Шатахуун</label>
              <select value={filters.fuelType} onChange={(e) => setFilters({...filters, fuelType: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                {fuelTypes.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Хурдны хайрцаг</label>
              <select value={filters.transmission} onChange={(e) => setFilters({...filters, transmission: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                {transmissions.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Байршил</label>
              <input type="text" placeholder="Улаанбаатар..." value={filters.location} onChange={(e) => setFilters({...filters, location: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>

            {hasActiveFilters && (
              <button onClick={clearFilters} className="w-full px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                Цэвэрлэх
              </button>
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <SlidersHorizontal className="w-4 h-4" /> Шүүлтүүр
            </button>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg">
              <option value="newest">Шинэ эхэндээ</option>
              <option value="price-asc">Үнэ өсөхөөр</option>
              <option value="price-desc">Үнэ буурахаар</option>
              <option value="year-desc">Он ихээр</option>
              <option value="year-asc">Он багаар</option>
            </select>
          </div>

          {showFilters && (
            <div className="lg:hidden bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Шүүлтүүр</h3>
                <button onClick={() => setShowFilters(false)}><X className="w-5 h-5" /></button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Брэнд</label>
                <select value={filters.brand} onChange={(e) => setFilters({...filters, brand: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  {brands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Үнэ (₮)</label>
                <div className="flex gap-2">
                  <input type="number" placeholder="Бага" value={filters.minPrice} onChange={(e) => setFilters({...filters, minPrice: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  <input type="number" placeholder="Их" value={filters.maxPrice} onChange={(e) => setFilters({...filters, maxPrice: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>
              <button onClick={clearFilters} className="w-full px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Цэвэрлэх</button>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-pulse">
                  <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="text-center py-12">
              <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Машин олдсонгүй</h3>
              <p className="text-gray-600">Шүүлтүүрээ өөрчилж үзнэ үү</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCars.map(car => <CarCard key={car.id} car={car} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarsPage;