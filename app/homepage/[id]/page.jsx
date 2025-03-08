"use client"
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Heart, ChevronLeft } from 'lucide-react';

const ProductDetailPage = () => {
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const params = useParams();
    const [product, setProduct] = useState({});
    
    useEffect(() => {
      // Fetch the product data using the ID from the URL
      const fetchProduct = async () => {
        try {
          // Assuming the ID parameter in your route is named 'id'
          const productId = params.id;
          
          // Make the fetch request with the correct ID
          const response = await fetch(`/api/products?id=${productId}`);
     
          
          // Then try parsing if it looks like JSON
          try {
            const data = await response.json();
            console.log(data)
            // Set the product data if successful
            if (data.product) {
              setProduct(data.product);
            }
          } catch (error) {
            console.error("Response is not valid JSON:", error);
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      };
      
      // Only fetch if we have an ID
      if (params.id) {
        fetchProduct();
      }
    }, [params.id]); 
  
  if (!product) return <div>Loading...</div>;

  const handleGoBack = () => {
    router.back();
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  return (
    <div className="container mx-auto py-8 px-4">
      <Button 
        variant="ghost" 
        className="mb-6 flex items-center gap-1" 
        onClick={handleGoBack}
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Products
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative">
          <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md">
            <Heart className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          
          <div className="text-2xl font-bold mb-6">${product.price}</div>
          
          <div className="space-y-6">
            {/* Category and Gender */}
            <div className="flex flex-wrap gap-2">
              {product.gender && <Badge className="bg-pink-100 text-pink-800">{product.gender}</Badge>}
              {product.category && <Badge variant="outline">{product.category}</Badge>}
              <Badge className="bg-green-100 text-green-800">In Stock</Badge>
            </div>
            
            {/* Quantity and Add to Cart */}
            <div className="flex gap-4 items-center">
              <div className="flex items-center border rounded-md overflow-hidden">
                <button 
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                  onClick={decrementQuantity}
                >-</button>
                <span className="px-4 py-2">{quantity}</span>
                <button 
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                  onClick={incrementQuantity}
                >+</button>
              </div>
              <Button className="flex-1 flex items-center justify-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
            </div>
            
            {/* Link to Original */}
            {product.link && (
              <div className="text-sm text-gray-500">
                <a href={product.link} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  View on original website
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Product Details Tab */}
      <Tabs defaultValue="details" className="mt-12">
        <TabsList className="mb-6">
          <TabsTrigger value="details">Product Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Product Specifications</CardTitle>
              <CardDescription>Detailed product information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Only display attributes from MongoDB schema */}
                {product.title && (
                  <div className="border-b pb-2">
                    <span className="text-sm font-medium text-gray-600">Title</span>
                    <div>{product.title}</div>
                  </div>
                )}
                
                {product.price && (
                  <div className="border-b pb-2">
                    <span className="text-sm font-medium text-gray-600">Price</span>
                    <div>{product.price}</div>
                  </div>
                )}
                
                {product.rating && (
                  <div className="border-b pb-2">
                    <span className="text-sm font-medium text-gray-600">Rating</span>
                    <div>{product.rating}</div>
                  </div>
                )}
                
                {product.reviews && (
                  <div className="border-b pb-2">
                    <span className="text-sm font-medium text-gray-600">Reviews</span>
                    <div>{product.reviews}</div>
                  </div>
                )}
                
                {product.category && (
                  <div className="border-b pb-2">
                    <span className="text-sm font-medium text-gray-600">Category</span>
                    <div>{product.category}</div>
                  </div>
                )}
                
                {product.gender && (
                  <div className="border-b pb-2">
                    <span className="text-sm font-medium text-gray-600">Gender</span>
                    <div>{product.gender}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductDetailPage;