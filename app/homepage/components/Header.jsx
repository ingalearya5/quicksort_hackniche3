'use client';

import React, { useState } from 'react';
import { Search, ShoppingCart, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserButton } from '@clerk/nextjs';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = ({ onSearch, onCategorySelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <header className="bg-white sticky top-0 z-10 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">ShopEasy</span>
            </div>
          </div>

          {/* Center - Search bar */}
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

          {/* Category dropdown */}
          <div className="hidden md:block mr-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  Categories <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => onCategorySelect('all')}>
                    All Products
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onCategorySelect('men')}>
                    Men's Fashion
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onCategorySelect('women')}>
                    Women's Fashion
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right side - User profile, cart */}
          <div className="flex items-center">
            {/* Shopping cart */}
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-6 w-6" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                0
              </Badge>
            </Button>

            {/* User button */}
            <div className="ml-4">
              <UserButton />
            </div>
          </div>
        </div>

        {/* Mobile search bar - visible only on small screens */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
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

        {/* Mobile category buttons */}
        <div className="md:hidden flex gap-2 overflow-x-auto pb-3 no-scrollbar">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onCategorySelect('all')} 
            className="whitespace-nowrap"
          >
            All Products
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onCategorySelect('men')} 
            className="whitespace-nowrap"
          >
            Men's Fashion
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onCategorySelect('women')} 
            className="whitespace-nowrap"
          >
            Women's Fashion
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;