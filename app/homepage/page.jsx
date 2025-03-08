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
  
  // New state for filters and sorting
  const [filters, setFilters] = useState({
    category: 'all',
    gender: 'all',
    rating: 0
  });
  
  const [sortOption, setSortOption] = useState('relevance');
 
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

  // Filter and sort products when filters, search term, or sort option changes
  useEffect(() => {
    let result = [...products];
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (filters.category !== 'all') {
      result = result.filter(product => 
        product.category.toLowerCase() === filters.category.toLowerCase()
      );
    }
    
    // Filter by gender
    if (filters.gender !== 'all') {
      result = result.filter(product => 
        product.gender && product.gender.toLowerCase() === filters.gender.toLowerCase()
      );
    }
    
    // Filter by rating
    if (filters.rating > 0) {
      result = result.filter(product => 
        product.rating >= filters.rating
      );
    }
    
    // Sort products
    if (sortOption !== 'relevance') {
      result = sortProducts(result, sortOption);
    }
    
    setFilteredProducts(result);
  }, [searchTerm, filters, sortOption, products]);

  // Sort function
  const sortProducts = (productsToSort, option) => {
    const sortedProducts = [...productsToSort];
    
    switch (option) {
      case 'price-asc':
        return sortedProducts.sort((a, b) => {
          // Convert price strings to numbers for comparison
          const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ''));
          const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ''));
          return priceA - priceB;
        });
      
      case 'price-desc':
        return sortedProducts.sort((a, b) => {
          const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ''));
          const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ''));
          return priceB - priceA;
        });
      
      case 'rating-desc':
        return sortedProducts.sort((a, b) => 
          (b.rating || 0) - (a.rating || 0)
        );
      
      case 'newest':
        return sortedProducts.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
      default:
        return sortedProducts;
    }
  };

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Handle category selection (modified to work with new filter system)
  const handleCategorySelect = (category) => {
    setFilters(prev => ({ ...prev, category }));
  };
  
  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  // Handle sort changes
  const handleSortChange = (option) => {
    setSortOption(option);
  };

  // Get page title based on current filters
  const getPageTitle = () => {
    if (filters.category !== 'all') {
      return filters.category.charAt(0).toUpperCase() + filters.category.slice(1);
    }
    
    if (filters.gender !== 'all') {
      return `${filters.gender.charAt(0).toUpperCase() + filters.gender.slice(1)}'s Collection`;
    }
    
    return 'All Products';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Bar with updated props */}
      <Header 
        onSearch={handleSearch} 
        onCategorySelect={handleCategorySelect}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />

      {/* Main content */}
      <main className="py-6 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="pb-5 border-b border-gray-200 mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div>
                <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
                  {getPageTitle()}
                </h1>
                {!loading && (
                  <p className="mt-2 max-w-4xl text-sm text-gray-500">
                    Showing {filteredProducts.length} of {products.length} products
                  </p>
                )}
              </div>
              
              {/* Filter badges/indicators */}
              <div className="flex flex-wrap mt-4 sm:mt-0 gap-2">
                {filters.category !== 'all' && (
                  <Badge 
                    label={`Category: ${filters.category}`} 
                    onClear={() => setFilters(prev => ({...prev, category: 'all'}))} 
                  />
                )}
                {filters.gender !== 'all' && (
                  <Badge 
                    label={`Gender: ${filters.gender}`} 
                    onClear={() => setFilters(prev => ({...prev, gender: 'all'}))} 
                  />
                )}
                {filters.rating > 0 && (
                  <Badge 
                    label={`${filters.rating}+ Star Rating`} 
                    onClear={() => setFilters(prev => ({...prev, rating: 0}))} 
                  />
                )}
                {sortOption !== 'relevance' && (
                  <Badge 
                    label={`Sorted by: ${getSortLabel(sortOption)}`} 
                    onClear={() => setSortOption('relevance')} 
                  />
                )}
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

// Helper component for filter badges
const Badge = ({ label, onClear }) => (
  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
    {label}
    <button 
      onClick={onClear} 
      className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-600 focus:outline-none"
    >
      <span className="sr-only">Remove filter</span>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </button>
  </div>
);

// Helper function to get readable sort labels
const getSortLabel = (option) => {
  switch (option) {
    case 'price-asc': return 'Price: Low to High';
    case 'price-desc': return 'Price: High to Low';
    case 'rating-desc': return 'Highest Rated';
    case 'newest': return 'Newest First';
    default: return 'Relevance';
  }
};