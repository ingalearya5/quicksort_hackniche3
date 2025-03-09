'use client';

import React, { useState } from 'react';
import { Search, ChevronDown, ShoppingCart, Filter, ArrowUpDown } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import {
  Slider
} from '@/components/ui/slider';

const Header = ({ onSearch, onCategorySelect, onFilterChange, onSortChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [activeFilters, setActiveFilters] = useState({
    category: 'all',
    gender: 'all',
    rating: 0,
  });
  const [sortOption, setSortOption] = useState('relevance');
  const router = useRouter();

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...activeFilters, [filterType]: value };
    setActiveFilters(newFilters);
    if (onFilterChange) onFilterChange(newFilters);
  };

  const handleSortChange = (value) => {
    setSortOption(value);
    if (onSortChange) onSortChange(value);
  };

  const categories = [
    'all', 
    'electronics', 
    'clothing', 
    'home', 
    'sports', 
    'beauty', 
    'toys'
  ];

  const genders = ['all', 'men', 'women', 'unisex'];

  return (
    <header className="bg-white sticky top-0 z-10 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">ShopEasy</span>
          </div>

          <div className="hidden md:flex items-center flex-grow mx-6">
            <div className="relative w-full max-w-xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 w-full"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  Categories <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Product Categories</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {categories.map((category) => (
                    <DropdownMenuItem 
                      key={category}
                      onClick={() => handleFilterChange('category', category)}
                      className={activeFilters.category === category ? "bg-slate-100" : ""}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Filters Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" /> Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Gender Filter */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Gender</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup 
                      value={activeFilters.gender} 
                      onValueChange={(value) => handleFilterChange('gender', value)}
                    >
                      {genders.map((gender) => (
                        <DropdownMenuRadioItem key={gender} value={gender}>
                          {gender.charAt(0).toUpperCase() + gender.slice(1)}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                
                {/* Rating Filter */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Minimum Rating</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup 
                      value={activeFilters.rating.toString()} 
                      onValueChange={(value) => handleFilterChange('rating', parseInt(value))}
                    >
                      {[0, 1, 2, 3, 4, 5].map((rating) => (
                        <DropdownMenuRadioItem key={rating} value={rating.toString()}>
                          {rating > 0 ? `${rating}+ Stars` : 'Any Rating'}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <ArrowUpDown className="h-4 w-4" /> Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={sortOption} onValueChange={handleSortChange}>
                  <DropdownMenuRadioItem value="relevance">Relevance</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="price-asc">Price: Low to High</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="price-desc">Price: High to Low</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="rating-desc">Highest Rated</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="newest">Newest First</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="relative" onClick={() => router.push('/cartpage')}>
              <ShoppingCart className="h-6 w-6" />
            </Button>

            <div className="ml-4">
              <UserButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;