import React, { useEffect, useState } from 'react';
import { Search, Eye, Mail, Phone, MapPin, Calendar, Shield, UserCheck, UserX, X } from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_CUSTOMERS = [
  { id: 1, username: 'admin', email: 'admin@machineshop.mn', fullName: 'Ð¡Ð¸ÑÑ‚ÐµÐ¼ ÐÐ´Ð¼Ð¸Ð½', phoneNumber: '99999999', address: 'Ð£Ð»Ð°Ð°Ð½Ð±Ð°Ð°Ñ‚Ð°Ñ€', role: 'ADMIN', enabled: true, createdAt: '2024-01-01' },
  { id: 2, username: 'testuser', email: 'user@test.com', fullName: 'Ð‘Ð°Ñ‚ Ð”Ð¾Ñ€Ð¶', phoneNumber: '88888888', address: 'Ð£Ð»Ð°Ð°Ð½Ð±Ð°Ð°Ñ‚Ð°Ñ€, Ð‘Ð°ÑÐ½Ð·Ò¯Ñ€Ñ… Ð´Ò¯Ò¯Ñ€ÑÐ³', role: 'USER', enabled: true, createdAt: '2024-02-15' },
  { id: 3, username: 'bold_1990', email: 'bold@email.com', fullName: 'Ð‘Ð¾Ð»Ð´ Ð­Ñ€Ð´ÑÐ½Ñ', phoneNumber: '99112233', address: 'Ð£Ð»Ð°Ð°Ð½Ð±Ð°Ð°Ñ‚Ð°Ñ€, Ð¡Ò¯Ñ…Ð±Ð°Ð°Ñ‚Ð°Ñ€ Ð´Ò¯Ò¯Ñ€ÑÐ³', role: 'USER', enabled: true, createdAt: '2024-03-10' },
  { id: 4, username: 'saraa_shop', email: 'saraa@shop.mn', fullName: 'Ð¡Ð°Ñ€ÑƒÑƒÐ» ÐžÐ´', phoneNumber: '99445566', address: 'Ð£Ð»Ð°Ð°Ð½Ð±Ð°Ð°Ñ‚Ð°Ñ€, Ð§Ð¸Ð½Ð³ÑÐ»Ñ‚ÑÐ¹ Ð´Ò¯Ò¯Ñ€ÑÐ³', role: 'USER', enabled: false, createdAt: '2024-03-20' },
  { id: 5, username: 'tumur_steel', email: 'tumur@steel.mn', fullName: 'Ð¢Ó©Ð¼Ó©Ñ€Ð±Ð°Ð°Ñ‚Ð°Ñ€', phoneNumber: '99778899', address: 'Ð”Ð°Ñ€Ñ…Ð°Ð½-Ð£ÑƒÐ» Ð°Ð¹Ð¼Ð°Ð³', role: 'USER', enabled: true, createdAt: '2024-04-01' },
];

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setCustomers(MOCK_CUSTOMERS);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredCustomers(customers);
      return;
    }

    const lowerSearch = searchTerm.toLowerCase();
    setFilteredCustomers(
      customers.filter((customer) =>
        customer.username.toLowerCase().includes(lowerSearch) ||
        customer.email.toLowerCase().includes(lowerSearch) ||
        customer.fullName.toLowerCase().includes(lowerSearch) ||
        customer.phoneNumber?.includes(searchTerm)
      )
    );
  }, [customers, searchTerm]);

  const handleToggleStatus = (id) => {
    setCustomers(customers.map(c =>
      c.id === id ? { ...c, enabled: !c.enabled } : c
    ));
    toast.success('Ð¥ÑÑ€ÑÐ³Ð»ÑÐ³Ñ‡Ð¸Ð¹Ð½ Ñ‚Ó©Ð»Ó©Ð² Ó©Ó©Ñ€Ñ‡Ð»Ó©Ð³Ð´Ð»Ó©Ó©');
  };

  const handleToggleRole = (id) => {
    setCustomers(customers.map(c =>
      c.id === id ? { ...c, role: c.role === 'ADMIN' ? 'USER' : 'ADMIN' } : c
    ));
    toast.success('Ð¥ÑÑ€ÑÐ³Ð»ÑÐ³Ñ‡Ð¸Ð¹Ð½ ÑÑ€Ñ… Ó©Ó©Ñ€Ñ‡Ð»Ó©Ð³Ð´Ð»Ó©Ó©');
  };

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowDetailModal(true);
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('mn-MN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ð¥ÑÑ€ÑÐ³Ð»ÑÐ³Ñ‡Ð¸Ð´</h2>
          <p className="text-gray-600 mt-1">Ð‘Ò¯Ñ€Ñ‚Ð³ÑÐ»Ñ‚ÑÐ¹ Ñ…ÑÑ€ÑÐ³Ð»ÑÐ³Ñ‡Ð´Ð¸Ð¹Ð½ ÑƒÐ´Ð¸Ñ€Ð´Ð»Ð°Ð³Ð°</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="ÐÑÑ€, Ð¸Ð¼ÑÐ¹Ð», ÑƒÑ‚Ð°ÑÐ°Ð°Ñ€ Ñ…Ð°Ð¹Ñ…..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <p className="text-sm text-gray-600">ÐÐ¸Ð¹Ñ‚ Ñ…ÑÑ€ÑÐ³Ð»ÑÐ³Ñ‡</p>
          <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-600">Ð˜Ð´ÑÐ²Ñ…Ñ‚ÑÐ¹</p>
          <p className="text-2xl font-bold text-green-600">
            {customers.filter(c => c.enabled).length}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-600">ÐÐ´Ð¼Ð¸Ð½</p>
          <p className="text-2xl font-bold text-purple-600">
            {customers.filter(c => c.role === 'ADMIN').length}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-600">Ð­Ð½Ñ ÑÐ°Ñ€Ð´ Ð±Ò¯Ñ€Ñ‚Ð³Ò¯Ò¯Ð»ÑÑÐ½</p>
          <p className="text-2xl font-bold text-blue-600">3</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">ID</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Ð¥ÑÑ€ÑÐ³Ð»ÑÐ³Ñ‡</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Ð˜Ð¼ÑÐ¹Ð»</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Ð£Ñ‚Ð°Ñ</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Ð­Ñ€Ñ…</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Ð¢Ó©Ð»Ó©Ð²</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">Ò®Ð¹Ð»Ð´ÑÐ»</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td colSpan="7" className="py-4 px-6">
                      <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
                    </td>
                  </tr>
                ))
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-500">
                    Ð¥ÑÑ€ÑÐ³Ð»ÑÐ³Ñ‡ Ð¾Ð»Ð´ÑÐ¾Ð½Ð³Ò¯Ð¹
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 text-gray-600">#{customer.id}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {customer.fullName?.charAt(0) || customer.username.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{customer.fullName}</p>
                          <p className="text-sm text-gray-500">@{customer.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{customer.email}</td>
                    <td className="py-4 px-6 text-gray-600">{customer.phoneNumber || '-'}</td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleRole(customer.id)}
                        className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                          customer.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {customer.role === 'ADMIN' ? (
                          <><Shield className="w-3 h-3" /> ÐÐ´Ð¼Ð¸Ð½</>
                        ) : (
                          <>Ð¥ÑÑ€ÑÐ³Ð»ÑÐ³Ñ‡</>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleStatus(customer.id)}
                        className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                          customer.enabled
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {customer.enabled ? (
                          <><UserCheck className="w-3 h-3" /> Ð˜Ð´ÑÐ²Ñ…Ñ‚ÑÐ¹</>
                        ) : (
                          <><UserX className="w-3 h-3" /> Ð˜Ð´ÑÐ²Ñ…Ð³Ò¯Ð¹</>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => handleViewDetails(customer)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Ð”ÑÐ»Ð³ÑÑ€ÑÐ½Ð³Ò¯Ð¹"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDetailModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Ð¥ÑÑ€ÑÐ³Ð»ÑÐ³Ñ‡Ð¸Ð¹Ð½ Ð¼ÑÐ´ÑÑÐ»ÑÐ»</h3>
              <button onClick={() => setShowDetailModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-center mb-4">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {selectedCustomer.fullName?.charAt(0) || selectedCustomer.username.charAt(0)}
                </div>
              </div>

              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <span className="font-medium w-24">ÐÑÑ€:</span>
                  <span>{selectedCustomer.fullName}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium w-24">Ð¥ÑÑ€ÑÐ³Ð»ÑÐ³Ñ‡:</span>
                  <span>@{selectedCustomer.username}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{selectedCustomer.email}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{selectedCustomer.phoneNumber || '-'}</span>
                </p>
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                  <span>{selectedCustomer.address || '-'}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Ð‘Ò¯Ñ€Ñ‚Ð³Ò¯Ò¯Ð»ÑÑÐ½: {formatDate(selectedCustomer.createdAt)}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span>Ð­Ñ€Ñ…: {selectedCustomer.role}</span>
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Ð¥Ð°Ð°Ñ…
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
