import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Phone, Mail, MapPin } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Car className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold text-white">AutoMarket</span>
            </div>
            <p className="text-gray-400 mb-4">
              Монголын хамгийн том автомашины худалдааны төв. Чанартай, найдвартай автомашинууд.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition"><FaFacebook className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition"><FaTwitter className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition"><FaInstagram className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition"><FaYoutube className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Шуурхай холбоос</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition">Нүүр хуудас</Link></li>
              <li><Link to="/cars" className="text-gray-400 hover:text-white transition">Автомашин</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition">Бидний тухай</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition">Холбоо барих</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Брэндүүд</h3>
            <ul className="space-y-2">
              <li><Link to="/cars?brand=Toyota" className="text-gray-400 hover:text-white transition">Toyota</Link></li>
              <li><Link to="/cars?brand=Lexus" className="text-gray-400 hover:text-white transition">Lexus</Link></li>
              <li><Link to="/cars?brand=Nissan" className="text-gray-400 hover:text-white transition">Nissan</Link></li>
              <li><Link to="/cars?brand=BMW" className="text-gray-400 hover:text-white transition">BMW</Link></li>
              <li><Link to="/cars?brand=Mercedes" className="text-gray-400 hover:text-white transition">Mercedes-Benz</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Холбоо барих</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                <span className="text-gray-400">Улаанбаатар, Баянзүрх дүүрэг, 26-р хороо</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-gray-400">+976 9999-9999</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <a href="mailto:info@automarket.mn" className="text-gray-400 hover:text-white transition">info@automarket.mn</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">&copy; 2024 AutoMarket. Бүх эрх хуулиар хамгаалагдсан.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;