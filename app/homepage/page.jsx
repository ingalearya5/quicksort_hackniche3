'use client';

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductGrid from './components/ProductGrid';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
 
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data.products);
        setFilteredProducts(data.products);
        
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Filter products when search term or category changes
  useEffect(() => {
    let result = [...products];
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(product => 
        product.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }
    
    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, products]);

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Bar */}
      <Header onSearch={handleSearch} onCategorySelect={handleCategorySelect} />

      {/* Main content */}
      <main className="py-6 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="pb-5 border-b border-gray-200 mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div>
                <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
                  {selectedCategory === 'all' 
                    ? 'All Products' 
                    : selectedCategory === 'men' 
                      ? "Men's Collection" 
                      : "Women's Collection"}
                </h1>
                {!loading && (
                  <p className="mt-2 max-w-4xl text-sm text-gray-500">
                    Showing {filteredProducts.length} of {products.length} products
                  </p>
                )}
              </div>
              
              <div className="flex mt-4 sm:mt-0 space-x-2">
                <Button 
                  variant={selectedCategory === 'all' ? 'default' : 'outline'} 
                  onClick={() => handleCategorySelect('all')}
                  className="hidden sm:inline-flex"
                >
                  All
                </Button>
                <Button 
                  variant={selectedCategory === 'men' ? 'default' : 'outline'} 
                  onClick={() => handleCategorySelect('men')}
                  className="hidden sm:inline-flex"
                >
                  Men
                </Button>
                <Button 
                  variant={selectedCategory === 'women' ? 'default' : 'outline'} 
                  onClick={() => handleCategorySelect('women')}
                  className="hidden sm:inline-flex"
                >
                  Women
                </Button>
              </div>
            </div>
          </div>

          {/* Products grid */}
          <ProductGrid 
            products={filteredProducts} 
            loading={loading} 
            error={error} 
          />
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}