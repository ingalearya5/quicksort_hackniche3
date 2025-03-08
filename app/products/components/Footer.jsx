'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  ChevronRight
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">ShopEasy</span>
            </div>
            <p className="text-gray-300 text-sm">
              Your one-stop destination for premium fashion at affordable prices. Discover the latest trends and timeless classics.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              {['Men\'s Collection', 'Women\'s Collection', 'New Arrivals', 'Discounts', 'Accessories'].map((item) => (
                <li key={item} className="group">
                  <a href="#" className="text-gray-300 hover:text-white text-sm flex items-center">
                    <ChevronRight size={14} className="mr-1 text-indigo-400 transition-transform duration-300 group-hover:translate-x-1" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {['About Us', 'Contact', 'Careers', 'Terms & Conditions', 'Privacy Policy', 'FAQ'].map((item) => (
                <li key={item} className="group">
                  <a href="#" className="text-gray-300 hover:text-white text-sm flex items-center">
                    <ChevronRight size={14} className="mr-1 text-indigo-400 transition-transform duration-300 group-hover:translate-x-1" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Newsletter and contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
            <p className="text-gray-300 text-sm mb-3">
              Subscribe to our newsletter for updates on new arrivals and special offers.
            </p>
            <div className="flex">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="rounded-r-none bg-gray-800 border-gray-700 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500" 
              />
              <Button className="rounded-l-none bg-indigo-600 hover:bg-indigo-700">
                Subscribe
              </Button>
            </div>
            
            <div className="mt-6 space-y-2">
              <div className="flex items-center text-sm text-gray-300">
                <Mail size={14} className="mr-2 text-indigo-400" />
                <span>support@shopeasy.com</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <Phone size={14} className="mr-2 text-indigo-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <MapPin size={14} className="mr-2 text-indigo-400" />
                <span>123 Fashion Street, New York, NY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center text-gray-400 text-sm">
          <p>© 2025 ShopEasy. All rights reserved.</p>
          <div className="flex space-x-4 mt-3 sm:mt-0">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;