

// export default ProductCard;
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { ShoppingCart, Heart, ExternalLink, Star, X } from 'lucide-react';

const ProductCard = ({ product }) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Determine gender category
  const isMen = product.gender?.toLowerCase() === 'male' || 
                product.category?.toLowerCase().includes('men');
  const isWomen = product.gender?.toLowerCase() === 'female' || 
                  product.category?.toLowerCase().includes('women');

  // Determine category badge color
  const getCategoryBadge = () => {
    if (isMen) {
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Men</Badge>;
    } else if (isWomen) {
      return <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-200">Women</Badge>;
    } else {
      return <Badge variant="outline">{product.category}</Badge>;
    }
  };

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

  return (
    <>
      {/* Product Card */}
      <Card 
        className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="relative h-48 overflow-hidden bg-gray-100 group">
          <img
            src={product.image}
            alt={product.title || product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <button 
            className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md opacity-70 hover:opacity-100 transition-opacity"
            onClick={handleInnerElementClick}
          >
            <Heart className="h-4 w-4 text-gray-600" />
          </button>
        </div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg line-clamp-1">{product.title || product.name}</CardTitle>
            <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
              <span className="text-yellow-600 mr-0.5">★</span>
              {ratingValue.toFixed(1)}
            </div>
          </div>
          <CardDescription className="line-clamp-2 h-10">
            {product.description || `Beautiful ${product.title || product.name} for everyday wear`}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2 flex-grow">
          <div className="flex gap-2">
            {getCategoryBadge()}
            {inStock ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">In Stock</Badge>
            ) : (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Out of Stock</Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-2">
          <div className="text-lg font-bold">${typeof priceValue === 'number' ? priceValue.toFixed(2) : priceValue}</div>
          <Button 
            className="flex items-center gap-1.5 transition-transform hover:scale-105"
            onClick={handleInnerElementClick}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>

      {/* Detailed Product Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{product.title || product.name}</DialogTitle>
            <DialogDescription>
              Product ID: {product._id?.toString().substring(0, 10)}...
            </DialogDescription>
          </DialogHeader>
          
          <div className="md:flex gap-6 mt-4">
            {/* Product Image */}
            <div className="md:w-1/2 mb-4 md:mb-0">
              <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title || product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Product Details */}
            <div className="md:w-1/2 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="text-3xl font-bold text-green-700">
                  ${typeof priceValue === 'number' ? priceValue.toFixed(2) : priceValue}
                </div>
                {ratingValue && (
                  <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full flex items-center">
                    <Star className="h-4 w-4 text-yellow-600 fill-yellow-500 mr-1" />
                    {ratingValue.toFixed(1)}
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {getCategoryBadge()}
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {product.gender || "Unisex"}
                </Badge>
                {inStock ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">In Stock</Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Out of Stock</Badge>
                )}
              </div>
              
              <div className="space-y-4 flex-grow">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Description</h3>
                  <p className="text-gray-700">
                    {product.description || `Beautiful ${product.title || product.name} for everyday wear.`}
                  </p>
                </div>
                
                {product.reviews && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Reviews</h3>
                    <p className="text-gray-700">{product.reviews || "No reviews yet"}</p>
                  </div>
                )}
                
                {product.link && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Product Link</h3>
                    <button 
                      className="text-blue-600 hover:underline flex items-center"
                      onClick={handleExternalLinkClick}
                    >
                      Visit product page <ExternalLink className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex gap-2 mt-6">
            <Button 
              className="flex-1 py-5 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700"
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>
            <Button 
              className="flex items-center justify-center gap-2"
              variant="outline"
            >
              <Heart className="h-5 w-5" />
              Add to Wishlist
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductCard;