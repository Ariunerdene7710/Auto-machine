import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Tags, Package, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { categoryAPI } from '../../services/api';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [newCategory, setNewCategory] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState('');
  const [editValue, setEditValue] = useState('');
  const [editImage, setEditImage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [imageInputMode, setImageInputMode] = useState('url'); // 'url' or 'file'

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
          { id: 1, name: 'Ó¨Ñ€Ð¼Ð¸Ð¹Ð½ Ð¼Ð°ÑˆÐ¸Ð½', productCount: 12 },
          { id: 2, name: 'Ð“Ð°Ð³Ð½ÑƒÑƒÑ€Ñ‹Ð½ Ñ‚Ó©Ñ…Ó©Ó©Ñ€Ó©Ð¼Ð¶', productCount: 8 },
          { id: 3, name: 'ÐšÐ¾Ð¼Ð¿Ñ€ÐµÑÑÐ¾Ñ€', productCount: 6 },
          { id: 4, name: 'Ð¥Ó©Ñ€Ó©Ó©', productCount: 10 },
          { id: 5, name: 'Ð¥ÑÐ¼Ð¶Ð¸Ñ… Ð±Ð°Ð³Ð°Ð¶', productCount: 15 },
        ]);
      } else {
        console.error('ÐÐ½Ð³Ð¸Ð»Ð°Ð» ÑÑÑÑ€ÑÑÑ… Ð°Ð»Ð´Ð°Ð°:', error);
        toast.error('ÐÐ½Ð³Ð¸Ð»Ð°Ð» ÑÑÑÑ€ÑÑÑ…ÑÐ´ Ð°Ð»Ð´Ð°Ð° Ð³Ð°Ñ€Ð»Ð°Ð°');
        setCategories([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newCategory.trim()) {
      toast.error('ÐÐ½Ð³Ð¸Ð»Ð°Ð»Ñ‹Ð½ Ð½ÑÑ€ Ð¾Ñ€ÑƒÑƒÐ»Ð½Ð° ÑƒÑƒ');
      return;
    }

    try {
      await categoryAPI.create({ 
        name: newCategory.trim(),
        image: newCategoryImage.trim() || null
      });
      setNewCategory('');
      setShowAddForm(false);
      toast.success('ÐÐ½Ð³Ð¸Ð»Ð°Ð» Ð½ÑÐ¼ÑÐ³Ð´Ð»ÑÑ');
      fetchCategories();
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 403) {
        const newId = Math.max(...categories.map(c => c.id), 0) + 1;
        setCategories([...categories, {
          id: newId,
          name: newCategory.trim(),
          image: newCategoryImage.trim() || null,
          productCount: 0
        }]);
        setNewCategory('');
        setNewCategoryImage('');
        setImagePreview('');
        setShowAddForm(false);
        setImageInputMode('url');
        toast.success('ÐÐ½Ð³Ð¸Ð»Ð°Ð» Ð½ÑÐ¼ÑÐ³Ð´Ð»ÑÑ (Local)');
      } else {
        console.error('ÐÐ½Ð³Ð¸Ð»Ð°Ð» Ð½ÑÐ¼ÑÑ…ÑÐ´ Ð°Ð»Ð´Ð°Ð°:', error);
        toast.error('ÐÐ½Ð³Ð¸Ð»Ð°Ð» Ð½ÑÐ¼ÑÑ…ÑÐ´ Ð°Ð»Ð´Ð°Ð° Ð³Ð°Ñ€Ð»Ð°Ð°');
      }
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setEditValue(category.name);
    setEditImage(category.image || '');
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setNewCategoryImage(url);
    if (url && imageInputMode === 'url') {
      setImagePreview(url);
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Зургийн файл сонгоно уу');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Файлын хэмжээ 5MB-аас бага байх ёстой');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setNewCategoryImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (id) => {
    if (!editValue.trim()) {
      toast.error('ÐÐ½Ð³Ð¸Ð»Ð°Ð»Ñ‹Ð½ Ð½ÑÑ€ Ð¾Ñ€ÑƒÑƒÐ»Ð½Ð° ÑƒÑƒ');
      return;
    }

    try {
      await categoryAPI.update(id, { 
        name: editValue.trim(),
        image: editImage.trim() || null
      });
      setEditingId(null);
      setEditValue('');
      setEditImage('');
      toast.success('Ангилал шинэчлэгдлээ');
      fetchCategories();
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 403) {
        setCategories(categories.map(cat =>
          cat.id === id ? { ...cat, name: editValue.trim(), image: editImage.trim() || null } : cat
        ));
        setEditingId(null);
        setEditValue('');
        setEditImage('');
        toast.success('Ангилал шинэчлэгдлээ (Local)');
      } else {
        console.error('ÐÐ½Ð³Ð¸Ð»Ð°Ð» ÑˆÐ¸Ð½ÑÑ‡Ð»ÑÑ…ÑÐ´ Ð°Ð»Ð´Ð°Ð°:', error);
        toast.error('ÐÐ½Ð³Ð¸Ð»Ð°Ð» ÑˆÐ¸Ð½ÑÑ‡Ð»ÑÑ…ÑÐ´ Ð°Ð»Ð´Ð°Ð° Ð³Ð°Ñ€Ð»Ð°Ð°');
      }
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`"${name}" Ð°Ð½Ð³Ð¸Ð»Ð°Ð»Ñ‹Ð³ ÑƒÑÑ‚Ð³Ð°Ñ…Ð´Ð°Ð° Ð¸Ñ‚Ð³ÑÐ»Ñ‚ÑÐ¹ Ð±Ð°Ð¹Ð½Ð° ÑƒÑƒ?`)) {
      try {
        await categoryAPI.delete(id);
        toast.success('ÐÐ½Ð³Ð¸Ð»Ð°Ð» ÑƒÑÑ‚Ð³Ð°Ð³Ð´Ð»Ð°Ð°');
        fetchCategories();
      } catch (error) {
        if (error.response?.status === 404 || error.response?.status === 403) {
          setCategories(categories.filter(cat => cat.id !== id));
          toast.success('ÐÐ½Ð³Ð¸Ð»Ð°Ð» ÑƒÑÑ‚Ð³Ð°Ð³Ð´Ð»Ð°Ð° (Local)');
        } else {
          console.error('ÐÐ½Ð³Ð¸Ð»Ð°Ð» ÑƒÑÑ‚Ð³Ð°Ñ…Ð°Ð´ Ð°Ð»Ð´Ð°Ð°:', error);
          toast.error('ÐÐ½Ð³Ð¸Ð»Ð°Ð» ÑƒÑÑ‚Ð³Ð°Ñ…Ð°Ð´ Ð°Ð»Ð´Ð°Ð° Ð³Ð°Ñ€Ð»Ð°Ð°');
        }
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue('');
    setEditImage('');
    setShowAddForm(false);
    setNewCategory('');
    setNewCategoryImage('');
    setImagePreview('');
    setImageInputMode('url');
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
          Шин ангилал
        </button>
      </div>

      {showAddForm && (
        <div className="card p-6 mb-6 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Шин ангилал нэмэх</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ангилалын нэр *
              </label>
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
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Зургийг нэмэх арга
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="imageMode"
                    value="url"
                    checked={imageInputMode === 'url'}
                    onChange={(e) => setImageInputMode(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">URL холбоос</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="imageMode"
                    value="file"
                    checked={imageInputMode === 'file'}
                    onChange={(e) => setImageInputMode(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Файлаас</span>
                </label>
              </div>
            </div>

            {imageInputMode === 'url' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Зургийн URL
                </label>
                <input
                  type="url"
                  value={newCategoryImage}
                  onChange={handleImageUrlChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Зургийн файл
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {imagePreview && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Урдчилсан үзүүлэлт</p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/150/e5e7eb/6b7280?text=Invalid+URL';
                  }}
                />
              </div>
            )}

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
              <button 
                onClick={handleCancel} 
                className="btn-secondary flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Цуцлах
              </button>
              <button 
                onClick={handleAdd} 
                className="btn-primary flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Хадгалах
              </button>
            </div>
          </div>
        </div>
      )}

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
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Зураг</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Ангилалын нэр</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Бүтээгдэхүүний тоо</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-500">
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
                        <div className="flex items-center gap-2">
                          {imageInputMode === 'url' ? (
                            <input
                              type="url"
                              value={editImage}
                              onChange={(e) => setEditImage(e.target.value)}
                              placeholder="Зургийн URL"
                              className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          ) : (
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setEditImage(reader.result);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          )}
                        </div>
                      ) : category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-12 h-12 object-cover rounded border border-gray-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/50/e5e7eb/6b7280?text=No+Image';
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </td>
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
