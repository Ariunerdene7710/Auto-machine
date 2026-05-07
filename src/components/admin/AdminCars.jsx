import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Car, Eye, ToggleLeft, ToggleRight, Filter, X, Loader } from 'lucide-react';
import { carAPI } from '../../services/api';
import toast from 'react-hot-toast';

const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `http://localhost:8080/api/images/${url}`;
};

const CarForm = ({ car, onSubmit, onCancel, loading: submitting }) => {
  const [formData, setFormData] = useState({
    brand: '', model: '', year: '', price: '', originalPrice: '', mileage: '',
    fuelType: '', transmission: '', location: '', description: '', features: [],
    stock: 1, isNew: false, isFeatured: false, active: true, categoryId: ''
  });
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [featureInput, setFeatureInput] = useState('');

  const fuelTypes = ['Бензин', 'Дизель', 'Hybrid', 'Цахилгаан'];
  const transmissions = ['Автомат', 'Механик'];

  useEffect(() => {
    if (car) {
      setFormData({
        brand: car.brand || '', model: car.model || '', year: car.year || '', price: car.price || '',
        originalPrice: car.originalPrice || '', mileage: car.mileage || '', fuelType: car.fuelType || '',
        transmission: car.transmission || '', location: car.location || '', description: car.description || '',
        features: car.features || [], stock: car.stock || 1, isNew: car.isNew || false,
        isFeatured: car.isFeatured || false, active: car.active !== false, categoryId: car.categoryId || ''
      });
      if (car.images) setExistingImages(car.images);
      if (car.imageUrls) setExistingImages(car.imageUrls);
    }
  }, [car]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const addFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData(prev => ({ ...prev, features: [...prev.features, featureInput.trim()] }));
      setFeatureInput('');
    }
  };

  const removeFeature = (feature) => setFormData(prev => ({ ...prev, features: prev.features.filter(f => f !== feature) }));

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (!file.type.startsWith('image/')) return toast.error(`${file.name} нь зураг биш`);
      if (file.size > 5 * 1024 * 1024) return toast.error(`${file.name} хэмжээ хэтэрсэн`);
      setImages(prev => [...prev, file]);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrls(prev => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeNewImage = (index) => { setImages(prev => prev.filter((_, i) => i !== index)); setPreviewUrls(prev => prev.filter((_, i) => i !== index)); };
  const removeExistingImage = (index) => setExistingImages(prev => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.brand.trim() || !formData.model.trim()) return toast.error('Брэнд болон загвар оруулна уу');
    if (!formData.price || formData.price <= 0) return toast.error('Үнэ зөв оруулна уу');
    if (existingImages.length === 0 && images.length === 0) return toast.error('Дор хаяж нэг зураг оруулна уу');

    setUploading(true);
    try {
      const submitData = new FormData();
      submitData.append('car', new Blob([JSON.stringify(formData)], { type: 'application/json' }));
      images.forEach(image => submitData.append('images', image));
      if (existingImages.length > 0) submitData.append('existingImages', JSON.stringify(existingImages));
      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Хадгалахад алдаа гарлаа');
    } finally {
      setUploading(false);
    }
  };

  const isSubmitting = submitting || uploading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Үндсэн мэдээлэл</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Брэнд *</label>
            <input type="text" name="brand" value={formData.brand} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Toyota" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Загвар *</label>
            <input type="text" name="model" value={formData.model} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Camry" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Он</label>
            <input type="number" name="year" value={formData.year} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="2020" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Үнэ (₮) *</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Анхны үнэ (₮)</label>
            <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Км</label>
            <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Шатахуун</label>
            <select name="fuelType" value={formData.fuelType} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
              <option value="">Сонгох</option>{fuelTypes.map(f => <option key={f} value={f}>{f}</option>)}
            </select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Хурдны хайрцаг</label>
            <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
              <option value="">Сонгох</option>{transmissions.map(t => <option key={t} value={t}>{t}</option>)}
            </select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Байршил</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Улаанбаатар" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Үлдэгдэл</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Тодорхойлолт</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Машины дэлгэрэнгүй мэдээлэл..." /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Онцлогууд</label>
            <div className="flex gap-2 mb-2"><input type="text" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} placeholder="Шинэ онцлог нэмэх" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg" /><button type="button" onClick={addFeature} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Нэмэх</button></div>
            <div className="flex flex-wrap gap-2">{formData.features.map((f, idx) => <span key={idx} className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1">{f}<button type="button" onClick={() => removeFeature(f)} className="text-red-500 hover:text-red-700">×</button></span>)}</div></div>
          <div className="flex items-center gap-4"><label className="flex items-center"><input type="checkbox" name="isNew" checked={formData.isNew} onChange={handleChange} className="rounded border-gray-300 text-blue-600" /><span className="ml-2 text-sm">Шинэ</span></label>
            <label className="flex items-center"><input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="rounded border-gray-300 text-blue-600" /><span className="ml-2 text-sm">Онцлох</span></label>
            <label className="flex items-center"><input type="checkbox" name="active" checked={formData.active} onChange={handleChange} className="rounded border-gray-300 text-blue-600" /><span className="ml-2 text-sm">Идэвхтэй</span></label></div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Зураг</h3>
        {existingImages.length > 0 && (<div className="mb-4"><p className="text-sm font-medium text-gray-700 mb-2">Одоогийн зургууд</p><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{existingImages.map((url, index) => (<div key={index} className="relative group"><img src={getImageUrl(url)} alt={`Car ${index + 1}`} className="w-full h-32 object-cover rounded-lg border" onError={(e) => { e.target.src = 'https://placehold.co/150/e5e7eb/6b7280?text=No+Image'; }} /><button type="button" onClick={() => removeExistingImage(index)} className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100"><X className="w-4 h-4" /></button></div>))}</div></div>)}
        {previewUrls.length > 0 && (<div className="mb-4"><p className="text-sm font-medium text-gray-700 mb-2">Шинэ зургууд</p><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{previewUrls.map((url, index) => (<div key={index} className="relative group"><img src={url} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-lg border" /><button type="button" onClick={() => removeNewImage(index)} className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100"><X className="w-4 h-4" /></button></div>))}</div></div>)}
        <div><label className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500"><Upload className="w-12 h-12 text-gray-400 mb-3" /><span className="text-gray-600 font-medium">Зураг сонгох</span><span className="text-sm text-gray-400 mt-1">JPG, PNG (5MB хүртэл)</span><input type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" disabled={isSubmitting} /></label></div>
      </div>

      <div className="flex justify-end gap-4">
        <button type="button" onClick={onCancel} className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50" disabled={isSubmitting}>Цуцлах</button>
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2" disabled={isSubmitting}>
          {isSubmitting ? <><Loader className="animate-spin h-4 w-4" />Хадгалж байна...</> : (car ? 'Шинэчлэх' : 'Үүсгэх')}
        </button>
      </div>
    </form>
  );
};

const AdminCars = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCar, setEditingCar] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = !!id || !!editingCar;
  const isNewMode = searchParams.get('new') !== null || window.location.pathname.includes('/new');

  useEffect(() => { fetchCars(); if (id) fetchCarForEdit(id); }, [id]);

  useEffect(() => {
    let filtered = cars;
    if (searchTerm) filtered = filtered.filter(c => c.brand?.toLowerCase().includes(searchTerm.toLowerCase()) || c.model?.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredCars(filtered);
  }, [cars, searchTerm]);

  const fetchCars = async () => {
    try { setLoading(true); const response = await carAPI.getAll(); setCars(response.data || []); }
    catch (error) { console.error('Error fetching cars:', error); toast.error('Машинууд ачааллахад алдаа гарлаа'); setCars([]); }
    finally { setLoading(false); }
  };

  const fetchCarForEdit = async (carId) => {
    try { const response = await carAPI.getById(carId); setEditingCar(response.data); }
    catch (error) { console.error('Error fetching car:', error); toast.error('Машин ачааллахад алдаа гарлаа'); navigate('/admin/cars'); }
  };

  const handleEdit = (car) => navigate(`/admin/cars/edit/${car.id}`);
  const handleCloseForm = () => { setEditingCar(null); navigate('/admin/cars'); };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editingCar) { await carAPI.update(editingCar.id, formData); toast.success('Машин амжилттай шинэчлэгдлээ'); }
      else { await carAPI.create(formData); toast.success('Машин амжилттай нэмэгдлээ'); }
      handleCloseForm(); fetchCars();
    } catch (error) { console.error('Error saving car:', error); toast.error(error.response?.data?.message || 'Хадгалахад алдаа гарлаа'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!carToDelete) return;
    try { await carAPI.delete(carToDelete.id); toast.success('Машин устгагдлаа'); fetchCars(); setShowDeleteModal(false); setCarToDelete(null); }
    catch (error) { console.error('Error deleting car:', error); toast.error('Устгахад алдаа гарлаа'); }
  };

  const formatPrice = (price) => new Intl.NumberFormat('mn-MN').format(price || 0) + ' ₮';

  if (isEditMode || isNewMode) {
    return (<div><div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">{editingCar ? 'Машин засах' : 'Шинэ машин'}</h1></div><CarForm car={editingCar} onSubmit={handleSubmit} onCancel={handleCloseForm} loading={submitting} /></div>);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold text-gray-900">Машины удирдлага</h1><Link to="/admin/cars/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"><Plus className="w-5 h-5" />Шинэ машин</Link></div>
      <div className="mb-6"><div className="relative max-w-md"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="Брэнд, загвараар хайх..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" /></div></div>

      {loading ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(6)].map((_, i) => (<div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-pulse"><div className="bg-gray-300 h-48 rounded-lg mb-4"></div><div className="h-4 bg-gray-300 rounded mb-2"></div><div className="h-4 bg-gray-300 rounded w-2/3"></div></div>))}</div>
      ) : filteredCars.length === 0 ? (<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"><Car className="w-16 h-16 text-gray-400 mx-auto mb-4" /><h3 className="text-lg font-semibold text-gray-900 mb-2">Машин олдсонгүй</h3><Link to="/admin/cars/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition inline-block">Шинэ машин нэмэх</Link></div>
      ) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{filteredCars.map((car) => (<div key={car.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group"><div className="relative">{car.images?.[0] ? (<img src={getImageUrl(car.images[0])} alt={car.model} className="w-full h-48 object-cover" onError={(e) => { e.target.src = 'https://placehold.co/400x300/e5e7eb/6b7280?text=No+Image'; }} />) : (<div className="w-full h-48 bg-gray-100 flex items-center justify-center"><Car className="w-12 h-12 text-gray-400" /></div>)}<div className="absolute top-2 right-2"><button className={`p-2 rounded-full shadow-lg transition ${car.active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}><ToggleRight className="w-4 h-4" /></button></div>{!car.active && (<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"><span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">Идэвхгүй</span></div>)}</div><div className="p-4"><h3 className="font-semibold text-gray-900">{car.brand} {car.model}</h3><p className="text-gray-500 text-sm">{car.year} • {car.mileage?.toLocaleString()} км</p><div className="flex items-center justify-between mt-3"><span className="text-xl font-bold text-blue-600">{formatPrice(car.price)}</span><span className={`text-sm font-medium ${car.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>{car.stock} машин</span></div><div className="flex gap-2 mt-3"><button onClick={() => handleEdit(car)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"><Edit className="w-4 h-4" />Засах</button><button onClick={() => { setCarToDelete(car); setShowDeleteModal(true); }} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"><Trash2 className="w-4 h-4" />Устгах</button></div></div></div>))}</div>)}

      {showDeleteModal && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div className="bg-white rounded-lg p-6 max-w-md w-full mx-4"><div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold text-gray-900">Машин устгах</h3><button onClick={() => setShowDeleteModal(false)}><X className="w-5 h-5 text-gray-500" /></button></div><p className="text-gray-600 mb-6">Та "{carToDelete?.brand} {carToDelete?.model}" машиныг устгахдаа итгэлтэй байна уу?</p><div className="flex justify-end gap-3"><button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Цуцлах</button><button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Устгах</button></div></div></div>)}
    </div>
  );
};

export default AdminCars;
