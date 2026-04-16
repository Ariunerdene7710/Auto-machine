import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create a separate axios instance for images (no auth required for public images)
const imageApi = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds for image uploads
});

// Image API service
export const imageAPI = {
  /**
   * Get full image URL
   * @param {string} relativeUrl - Relative image URL from backend
   * @returns {string} Full image URL
   */
  getImageUrl: (relativeUrl) => {
    if (!relativeUrl) return null;
    if (relativeUrl.startsWith('http')) return relativeUrl;
    if (relativeUrl.startsWith('/images/')) return `${API_URL}${relativeUrl}`;
    return `${API_URL}/images/${relativeUrl}`;
  },

  /**
   * Upload single image
   * @param {File} file - Image file to upload
   * @returns {Promise} Upload response with URL
   */
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await imageApi.post('/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return {
        success: true,
        url: response.data.url,
        fileName: response.data.fileName,
        fullUrl: `${API_URL}${response.data.url}`
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Зураг хуулахад алдаа гарлаа'
      };
    }
  },

  /**
   * Upload multiple images
   * @param {File[]} files - Array of image files
   * @returns {Promise} Upload response with URLs
   */
  uploadMultipleImages: async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await imageApi.post('/images/upload-multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return {
        success: true,
        urls: response.data,
        fullUrls: response.data.map(url => `${API_URL}${url}`)
      };
    } catch (error) {
      console.error('Error uploading images:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Зурагнууд хуулахад алдаа гарлаа'
      };
    }
  },

  /**
   * Delete image
   * @param {string} fileName - Image file name
   * @returns {Promise} Delete response
   */
  deleteImage: async (fileName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await imageApi.delete(`/images/${fileName}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      
      return {
        success: true,
        message: response.data
      };
    } catch (error) {
      console.error('Error deleting image:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Зураг устгахад алдаа гарлаа'
      };
    }
  },

  /**
   * Check if image exists
   * @param {string} url - Image URL
   * @returns {Promise<boolean>}
   */
  checkImageExists: async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  },

  /**
   * Get placeholder image URL
   * @param {number} width - Image width
   * @param {number} height - Image height
   * @param {string} text - Placeholder text
   * @returns {string} Placeholder URL
   */
  getPlaceholderUrl: (width = 400, height = 300, text = 'No Image') => {
    return `https://placehold.co/${width}x${height}/e5e7eb/6b7280?text=${encodeURIComponent(text)}`;
  },
};

export default imageAPI;