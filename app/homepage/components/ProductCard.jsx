'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ShoppingCart, Heart, Eye, CheckCircle } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { toast } from 'sonner';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const isMen = product.category.toLowerCase().includes('men');
  const isWomen = product.category.toLowerCase().includes('women');
  const isNew = product.isNew || Math.random() > 0.7; // Simulating "new" tag for some products
  const hasDiscount = product.discountPercentage || Math.random() > 0.8; // Simulating discounts
  const discountPercentage = product.discountPercentage || Math.floor(Math.random() * 30) + 10;
  const originalPrice = hasDiscount ? (product.price * 100 / (100 - discountPercentage)).toFixed(2) : null;

  // Determine category badge color
  const getCategoryBadge = () => {
    if (isMen) {
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-0">
          Men
        </Badge>
      );
    } else if (isWomen) {
      return (
        <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-200 border-0">
          Women
        </Badge>
      );
    } else {
      return <Badge variant="outline">{product.category}</Badge>;
    }
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: 1
    });

    toast.success(`Added to cart`, {
      description: product.name,
      duration: 2000,
      position: 'top-right',
      icon: <CheckCircle className="h-4 w-4 text-green-500" />
    });
  // Convert price string to number if needed
  const priceValue = typeof product.price === 'string' 
    ? parseFloat(product.price) || 0 
    : product.price || 0;

  // Default rating value
  const ratingValue = product.rating === null ? 4.5 : product.rating;
  
  // Check if product is in stock (assuming true if not specified)
  const inStock = product.inStock !== undefined ? product.inStock : true;

  // Handle card click to open detailed modal
  const handleCardClick = () => {
    setIsDetailOpen(true);
  };
  
  // Prevent propagation for specific elements inside the card
  const handleInnerElementClick = (e) => {
    e.stopPropagation();
  };

  // Handle external link click
  const handleExternalLinkClick = (e) => {
    e.stopPropagation();
    if (product.link) {
      window.open(product.link, '_blank');
    }
  };

  const toggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    
    if (!isFavorite) {
      toast.success(`Added to wishlist`, {
        description: product.name,
        duration: 2000,
        position: 'top-right'
      });
    }
  };

  return (
    <Card 
      className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg border-gray-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
        
        {/* Quick action buttons that appear on hover */}
        <div className={`absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <Button 
            size="icon" 
            variant="secondary" 
            className="rounded-full bg-white bg-opacity-90 hover:bg-opacity-100 h-9 w-9"
            onClick={toggleFavorite}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-700'}`} />
          </Button>
          <Button 
            size="icon" 
            variant="secondary" 
            className="rounded-full bg-white bg-opacity-90 hover:bg-opacity-100 h-9 w-9"
          >
            <Eye className="h-4 w-4 text-gray-700" />
          </Button>
        </div>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isNew && (
            <div className="bg-green-500 text-white px-2 py-0.5 text-xs font-semibold rounded">
              NEW
            </div>
          )}
          {hasDiscount && (
            <div className="bg-red-500 text-white px-2 py-0.5 text-xs font-semibold rounded">
              -{discountPercentage}%
            </div>
          )}
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium line-clamp-1">{product.name}</CardTitle>
          <div className="bg-yellow-50 text-yellow-800 text-xs px-2 py-0.5 rounded-full flex items-center border border-yellow-100">
            <span className="text-yellow-500 mr-0.5">★</span>
            {(product.rating || (3.5 + Math.random())).toFixed(1)}
          </div>
        </div>
        <CardDescription className="line-clamp-2 h-10 text-gray-600">
          {product.description || "Premium quality product with elegant design and durable materials."}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow">
        <div className="flex flex-wrap gap-2">
          {getCategoryBadge()}
          {product.inStock !== false ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              In Stock
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              Out of Stock
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center pt-2">
        <div className="font-medium">
          <div className="text-lg font-bold text-gray-900">
            ${parseFloat(product.price).toFixed(2)}
          </div>
          {hasDiscount && (
            <div className="text-sm text-gray-500 line-through">
              ${originalPrice}
            </div>
          )}
        </div>
        <Button
          className="flex items-center gap-1.5 transition-all bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-sm hover:shadow"
          onClick={handleAddToCart}
          disabled={product.inStock === false}
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;