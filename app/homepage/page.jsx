'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, User, Package } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

// Dummy user data
const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "/api/placeholder/32/32"
};

// Dummy products data
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    description: "Premium noise-cancelling wireless headphones with 30-hour battery life",
    price: 149.99,
    image: "/api/placeholder/320/180",
    rating: 4.5,
    category: "Electronics",
    inStock: true
  },
  {
    id: 2,
    name: "Smart Watch",
    description: "Fitness tracker with heart rate monitoring and sleep analysis",
    price: 199.99,
    image: "/api/placeholder/320/180",
    rating: 4.2,
    category: "Electronics",
    inStock: true
  },
  {
    id: 3,
    name: "Organic Cotton T-Shirt",
    description: "Soft, breathable organic cotton t-shirt, available in multiple colors",
    price: 29.99,
    image: "/api/placeholder/320/180",
    rating: 4.0,
    category: "Clothing",
    inStock: true
  },
  {
    id: 4,
    name: "Stainless Steel Water Bottle",
    description: "Vacuum insulated bottle keeps drinks cold for 24 hours or hot for 12 hours",
    price: 34.99,
    image: "/api/placeholder/320/180",
    rating: 4.7,
    category: "Home",
    inStock: false
  },
  {
    id: 5,
    name: "Wireless Charging Pad",
    description: "Fast wireless charging for all Qi-enabled devices",
    price: 49.99,
    image: "/api/placeholder/320/180",
    rating: 4.3,
    category: "Electronics",
    inStock: true
  },
  {
    id: 6,
    name: "Leather Wallet",
    description: "Handcrafted genuine leather wallet with RFID protection",
    price: 59.99,
    image: "/api/placeholder/320/180",
    rating: 4.6,
    category: "Accessories",
    inStock: true
  }
];

// Dummy categories
const categories = ["All", "Electronics", "Clothing", "Home", "Accessories"];

export default function homePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter products based on category and search query
  const filteredProducts = products.filter(product => 
    (selectedCategory === "All" || product.category === selectedCategory) &&
    (product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     product.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and brand */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-indigo-600">ShopEasy</span>
              </div>
              
              {/* Category navigation */}
              <nav className="hidden md:ml-6 md:flex space-x-8">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      selectedCategory === category
                        ? "border-indigo-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </nav>
            </div>

            {/* Search bar */}
            <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
              <div className="max-w-lg w-full lg:max-w-xs">
                <label htmlFor="search" className="sr-only">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="search"
                    name="search"
                    className="block w-full pl-10 pr-3 py-2"
                    placeholder="Search"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Right side - User profile, cart */}
            <div className="flex items-center">
              {/* Shopping cart */}
              <Button variant="ghost" size="icon" className="ml-4 relative">
                <ShoppingCart className="h-6 w-6" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  3
                </Badge>
              </Button>

              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="ml-3 relative rounded-full">
                    <Avatar>
                      <AvatarImage src={userData.avatar} alt={userData.name} />
                      <AvatarFallback>{userData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span className="ml-2 hidden md:inline">{userData.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Package className="mr-2 h-4 w-4" />
                      <span>My Orders</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="pb-5 border-b border-gray-200 mb-5">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
              {selectedCategory === "All" ? "All Products" : selectedCategory}
            </h1>
            <p className="mt-2 max-w-4xl text-sm text-gray-500">
              Showing {filteredProducts.length} products
            </p>
          </div>

          {/* Products grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden h-full flex flex-col">
                <div className="h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      ★ {product.rating}
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2 flex-grow">
                  <Badge variant="outline">{product.category}</Badge>
                  {!product.inStock && (
                    <Badge variant="destructive" className="ml-2">Out of Stock</Badge>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between items-center pt-2">
                  <div className="text-lg font-bold">${product.price.toFixed(2)}</div>
                  <Button disabled={!product.inStock}>
                    {product.inStock ? "Add to Cart" : "Sold Out"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2025 ShopEasy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}