import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">ShopEasy</h3>
            <p className="text-sm text-gray-500">
              Your one-stop shop for all fashion needs. Quality products at affordable prices.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>About Us</li>
              <li>Contact</li>
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Newsletter</h3>
            <p className="text-sm text-gray-500 mb-2">
              Subscribe to our newsletter for the latest updates.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-3 py-2 border border-gray-300 rounded-l-md text-sm w-full" 
              />
              <button className="bg-indigo-600 text-white px-3 py-2 rounded-r-md text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="text-center text-gray-500 text-sm mt-8 pt-4 border-t border-gray-200">
          <p>© 2025 ShopEasy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;