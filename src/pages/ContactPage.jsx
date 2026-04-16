import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Таны мессеж илгээгдлээ. Бид тун удахгүй холбогдох болно.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setLoading(false);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Хаяг',
      details: ['Улаанбаатар хот, Баянзүрх дүүрэг', '26-р хороо, Энхтайваны өргөн чөлөө']
    },
    {
      icon: Phone,
      title: 'Утас',
      details: ['+976 9999-9999', '+976 8888-8888']
    },
    {
      icon: Mail,
      title: 'И-мэйл',
      details: ['info@machineshop.mn', 'support@machineshop.mn']
    },
    {
      icon: Clock,
      title: 'Ажлын цаг',
      details: ['Даваа - Баасан: 09:00 - 18:00', 'Бямба: 10:00 - 16:00', 'Ням: Амарна']
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Холбоо барих</h1>
          <p className="text-xl text-primary-100">
            Бидэнтэй холбогдож, асуулт асуух, зөвлөгөө авах
          </p>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => (
            <div key={index} className="card p-6 text-center">
              <info.icon className="w-10 h-10 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{info.title}</h3>
              {info.details.map((detail, i) => (
                <p key={i} className="text-gray-600">{detail}</p>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form & Map */}
      <div className="bg-gray-50 py-16">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Мессеж илгээх</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Нэр *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="Таны нэр"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      И-мэйл *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Утас
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="9999-9999"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Гарчиг *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="Гарчиг"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Мессеж *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="input-field"
                    placeholder="Таны мессеж..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary"
                >
                  {loading ? 'Илгээж байна...' : 'Мессеж илгээх'}
                </button>
              </form>
            </div>

            {/* Map */}
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Байршил</h2>
              <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Газрын зураг энд байрлана</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Улаанбаатар хот, Баянзүрх дүүрэг, 26-р хороо
                  </p>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <h3 className="font-semibold text-gray-900">Чиглэл</h3>
                <p className="text-gray-600">
                  "Сансар" худалдааны төвийн урд, "Мишээл" экспо төвийн хойд талд 
                  байрладаг. Нийтийн тээврээр ирэх бол 3, 21, 32-р чиглэлийн 
                  автобусаар "26-р хороолол" буудал дээр бууна уу.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;