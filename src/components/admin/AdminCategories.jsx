import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Tags, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { categoryAPI } from '../../services/api';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [newCategory, setNewCategory] = useState('');
  const [editValue, setEditValue] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryAPI.getAll();
      setCategories(response.data || []);
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 403) {
        console.warn('Backend /categories endpoint not implemented yet, using mock data');
        setCategories([
          { id: 1, name: 'Өрмийн машин', productCount: 12 },
          { id: 2, name: 'Гагнуурын төхөөрөмж', productCount: 8 },
          { id: 3, name: 'Компрессор', productCount: 6 },
          { id: 4, name: 'Хөрөө', productCount: 10 },
          { id: 5, name: 'Хэмжих багаж', productCount: 15 },
        ]);
      } else {
        console.error('Ангилал сээрээх алдаа:', error);
        toast.error('Ангилал сээрээхэд алдаа гарлаа');
        setCategories([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newCategory.trim()) {
      toast.error('Ангилалын нэр оруулна уу');
      return;
    }

    try {
      await categoryAPI.create({ name: newCategory.trim() });
      setNewCategory('');
      setShowAddForm(false);
      toast.success('Ангилал нэмэгдлээ');
      fetchCategories();
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 403) {
        // Fallback: add to local state
        const newId = Math.max(...categories.map(c => c.id), 0) + 1;
        setCategories([...categories, {
          id: newId,
          name: newCategory.trim(),
          productCount: 0
        }]);
        setNewCategory('');
        setShowAddForm(false);
        toast.success('Ангилал нэмэгдлээ (Local)');
      } else {
        console.error('Ангилал нэмэхэд алдаа:', error);
        toast.error('Ангилал нэмэхэд алдаа гарлаа');
      }
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setEditValue(category.name);
  };

  const handleSave = async (id) => {
    if (!editValue.trim()) {
      toast.error('Ангилалын нэр оруулна уу');
      return;
    }

    try {
      await categoryAPI.update(id, { name: editValue.trim() });
      setEditingId(null);
      setEditValue('');
      toast.success('Ангилал шинэчлэгдлээ');
      fetchCategories();
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 403) {
        // Fallback: update local state
        setCategories(categories.map(cat =>
          cat.id === id ? { ...cat, name: editValue.trim() } : cat
        ));
        setEditingId(null);
        setEditValue('');
        toast.success('Ангилал шинэчлэгдлээ (Local)');
      } else {
        console.error('Ангилал шинэчлэхэд алдаа:', error);
        toast.error('Ангилал шинэчлэхэд алдаа гарлаа');
      }
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`"${name}" ангилалыг устгахдаа итгэлтэй байна уу?`)) {
      try {
        await categoryAPI.delete(id);
        toast.success('Ангилал устгагдлаа');
        fetchCategories();
      } catch (error) {
        if (error.response?.status === 404 || error.response?.status === 403) {
          // Fallback: delete from local state
          setCategories(categories.filter(cat => cat.id !== id));
          toast.success('Ангилал устгагдлаа (Local)');
        } else {
          console.error('Ангилал устгахад алдаа:', error);
          toast.error('Ангилал устгахад алдаа гарлаа');
        }
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue('');
    setShowAddForm(false);
    setNewCategory('');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ангилалууд</h2>
          <p className="text-gray-600 mt-1">Бүтээгдэхүүний ангилал удирдах</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Шинэ ангилал
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="card p-4 mb-6 bg-gray-50">
          <div className="flex items-center gap-4">
            <Tags className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Ангилалын нэр"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
              <Save className="w-4 h-4" />
              Хадгалах
            </button>
            <button onClick={handleCancel} className="btn-secondary flex items-center gap-2">
              <X className="w-4 h-4" />
              Цуцлах
            </button>
          </div>
        </div>
      )}

      {/* Categories Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">ID</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Ангилалын нэр</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Бүтээгдэхүүний тоо</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    Ангилал байхгүй байна
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 text-gray-600">#{category.id}</td>
                    <td className="py-4 px-6">
                      {editingId === category.id ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium text-gray-900">{category.name}</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {category.productCount} бүтээгдэхүүн
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        {editingId === category.id ? (
                          <>
                            <button
                              onClick={() => handleSave(category.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                              title="Хадгалах"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancel}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                              title="Цуцлах"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(category)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Засах"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(category.id, category.name)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Устгах"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;

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
  const [categories, setCategories] = useState([]);
  const [featureInput, setFeatureInput] = useState('');

  const fuelTypes = ['Бензин', 'Дизель', 'Hybrid', 'Цахилгаан'];
  const transmissions = ['Автомат', 'Механик'];

  useEffect(() => {
    fetchCategories();
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

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

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