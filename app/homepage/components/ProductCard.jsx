"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const isMen = product.category.toLowerCase().includes("men");
  const isWomen = product.category.toLowerCase().includes("women");

  // Determine category badge color
  const getCategoryBadge = () => {
    if (isMen) {
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
          Men
        </Badge>
      );
    } else if (isWomen) {
      return (
        <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-200">
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
    });

    toast.success(`✅ ${product.name} added to your cart!`, {
      duration: 2000,
      position: "top-right",
    });
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg">
      <div className="relative h-48 overflow-hidden bg-gray-100 group">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <button className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md opacity-70 hover:opacity-100 transition-opacity">
          <Heart className="h-4 w-4 text-gray-600" />
        </button>
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
          <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
            <span className="text-yellow-600 mr-0.5">★</span>
            {product.rating.toFixed(1)}
          </div>
        </div>
        <CardDescription className="line-clamp-2 h-10">
          {product.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="flex gap-2">
          {getCategoryBadge()}
          {product.inStock ? (
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
        <div className="text-lg font-bold">
          ${parseFloat(product.price).toFixed(2)}
        </div>
        <Button
          className="flex items-center gap-1.5 transition-transform hover:scale-105 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
