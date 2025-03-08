'use client';

import React from 'react';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { PackageOpen } from 'lucide-react';

const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
        <p className="mt-5 text-gray-600 font-medium">Fetching products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 rounded-xl bg-red-50 border border-red-100">
        <div className="rounded-full bg-red-100 p-3 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-red-600 font-medium mb-3">Failed to load products</p>
        <p className="text-gray-500 mb-5 text-center max-w-md">
          {error}. Please check your connection and try again.
        </p>
        <Button 
          variant="outline" 
          className="border-red-200 text-red-600 hover:bg-red-50"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-50 rounded-xl border border-gray-100">
        <div className="rounded-full bg-gray-100 p-3 mb-4">
          <PackageOpen className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-gray-700 font-medium mb-2">No products found</p>
        <p className="text-gray-500 text-center max-w-md">
          We couldn't find any products matching your criteria. Try adjusting your filters or search term.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;