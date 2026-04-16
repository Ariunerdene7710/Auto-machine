import React, { useState } from 'react';
import { Save, Globe, Mail, Phone, MapPin, Clock, CreditCard, Truck, Shield, Bell, Database } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'MachineShop',
    siteDescription: 'Мэргэжлийн тоног төхөөрөмжийн дэлгүүр',
    contactEmail: 'info@machineshop.mn',
    contactPhone: '+976 9999-9999',
    address: 'Улаанбаатар, Баянзүрх дүүрэг, 26-р хороо',
    workingHours: 'Даваа - Баасан: 09:00 - 18:00, Бямба: 10:00 - 16:00',
    currency: 'MNT',
    timezone: 'Asia/Ulaanbaatar'
  });

  const [paymentSettings, setPaymentSettings] = useState({
    cashOnDelivery: true,
    bankTransfer: true,
    cardPayment: false,
    bankAccount: 'Хаан Банк: 1234567890',
    accountName: 'MachineShop ХХК'
  });

  const [shippingSettings, setShippingSettings] = useState({
    freeShippingOver: 500000,
    defaultShippingFee: 10000,
    deliveryTime: '1-3 хоног',
    shippingAreas: ['Улаанбаатар', 'Дархан', 'Эрдэнэт']
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderAlerts: true,
    lowStockAlerts: true,
    customerMessages: true,
    adminEmail: 'admin@machineshop.mn'
  });

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Тохиргоо амжилттай хадгалагдлаа');
    }, 1000);
  };

  const tabs = [
    { id: 'general', label: 'Ерөнхий', icon: Globe },
    { id: 'payment', label: 'Төлбөр', icon: CreditCard },
    { id: 'shipping', label: 'Хүргэлт', icon: Truck },
    { id: 'notification', label: 'Мэдэгдэл', icon: Bell },
    { id: 'backup', label: 'Нөөцлөлт', icon: Database },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Тохиргоо</h2>
        <p className="text-gray-600 mt-1">Системийн тохиргоо</p>
      </div>

      <div className="flex gap-6">
        {/* Tabs */}
        <div className="w-64 flex-shrink-0">
          <div className="card p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition
                  ${activeTab === tab.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="card p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ерөнхий тохиргоо</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Сайтын нэр
                    </label>
                    <input
                      type="text"
                      value={generalSettings.siteName}
                      onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Тайлбар
                    </label>
                    <textarea
                      value={generalSettings.siteDescription}
                      onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})}
                      rows="2"
                      className="input-field"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="inline w-4 h-4 mr-1" />
                        Имэйл
                      </label>
                      <input
                        type="email"
                        value={generalSettings.contactEmail}
                        onChange={(e) => setGeneralSettings({...generalSettings, contactEmail: e.target.value})}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="inline w-4 h-4 mr-1" />
                        Утас
                      </label>
                      <input
                        type="text"
                        value={generalSettings.contactPhone}
                        onChange={(e) => setGeneralSettings({...generalSettings, contactPhone: e.target.value})}
                        className="input-field"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline w-4 h-4 mr-1" />
                      Хаяг
                    </label>
                    <textarea
                      value={generalSettings.address}
                      onChange={(e) => setGeneralSettings({...generalSettings, address: e.target.value})}
                      rows="2"
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="inline w-4 h-4 mr-1" />
                      Ажлын цаг
                    </label>
                    <input
                      type="text"
                      value={generalSettings.workingHours}
                      onChange={(e) => setGeneralSettings({...generalSettings, workingHours: e.target.value})}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Settings */}
            {activeTab === 'payment' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Төлбөрийн тохиргоо</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={paymentSettings.cashOnDelivery}
                        onChange={(e) => setPaymentSettings({...paymentSettings, cashOnDelivery: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600"
                      />
                      <span>Хүргэлтээр бэлнээр төлөх</span>
                    </label>
                    
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={paymentSettings.bankTransfer}
                        onChange={(e) => setPaymentSettings({...paymentSettings, bankTransfer: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600"
                      />
                      <span>Банкны шилжүүлэг</span>
                    </label>
                    
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={paymentSettings.cardPayment}
                        onChange={(e) => setPaymentSettings({...paymentSettings, cardPayment: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600"
                      />
                      <span>Картаар төлөх</span>
                    </label>
                  </div>
                  
                  {paymentSettings.bankTransfer && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Банкны данс
                        </label>
                        <input
                          type="text"
                          value={paymentSettings.bankAccount}
                          onChange={(e) => setPaymentSettings({...paymentSettings, bankAccount: e.target.value})}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Данс эзэмшигч
                        </label>
                        <input
                          type="text"
                          value={paymentSettings.accountName}
                          onChange={(e) => setPaymentSettings({...paymentSettings, accountName: e.target.value})}
                          className="input-field"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Shipping Settings */}
            {activeTab === 'shipping' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Хүргэлтийн тохиргоо</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Үнэгүй хүргэлтийн босго (₮)
                    </label>
                    <input
                      type="number"
                      value={shippingSettings.freeShippingOver}
                      onChange={(e) => setShippingSettings({...shippingSettings, freeShippingOver: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Хүргэлтийн үндсэн төлбөр (₮)
                    </label>
                    <input
                      type="number"
                      value={shippingSettings.defaultShippingFee}
                      onChange={(e) => setShippingSettings({...shippingSettings, defaultShippingFee: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Хүргэлтийн хугацаа
                    </label>
                    <input
                      type="text"
                      value={shippingSettings.deliveryTime}
                      onChange={(e) => setShippingSettings({...shippingSettings, deliveryTime: e.target.value})}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notification' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Мэдэгдлийн тохиргоо</h3>
                
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600"
                    />
                    <span>Имэйл мэдэгдэл илгээх</span>
                  </label>
                  
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={notificationSettings.orderAlerts}
                      onChange={(e) => setNotificationSettings({...notificationSettings, orderAlerts: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600"
                    />
                    <span>Шинэ захиалгын мэдэгдэл</span>
                  </label>
                  
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={notificationSettings.lowStockAlerts}
                      onChange={(e) => setNotificationSettings({...notificationSettings, lowStockAlerts: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600"
                    />
                    <span>Бага үлдэгдлийн мэдэгдэл</span>
                  </label>
                  
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={notificationSettings.customerMessages}
                      onChange={(e) => setNotificationSettings({...notificationSettings, customerMessages: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600"
                    />
                    <span>Хэрэглэгчийн мессежийн мэдэгдэл</span>
                  </label>
                  
                  <div className="pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Админ имэйл
                    </label>
                    <input
                      type="email"
                      value={notificationSettings.adminEmail}
                      onChange={(e) => setNotificationSettings({...notificationSettings, adminEmail: e.target.value})}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Backup Settings */}
            {activeTab === 'backup' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Нөөцлөлт ба сэргээх</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-800 font-medium mb-2">Сүүлийн нөөцлөлт</p>
                    <p className="text-blue-600">2024-04-10 15:30:22</p>
                  </div>
                  
                  <button className="btn-primary w-full">
                    <Database className="inline w-4 h-4 mr-2" />
                    Нөөцлөлт хийх
                  </button>
                  
                  <button className="btn-secondary w-full">
                    <Shield className="inline w-4 h-4 mr-2" />
                    Нөөцлөлтөөс сэргээх
                  </button>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
              <button
                onClick={handleSave}
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Хадгалж байна...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Тохиргоо хадгалах
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;