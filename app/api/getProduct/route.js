import { NextResponse } from 'next/server';
import Connection from '@/lib/db';
import Product from '@/models/Products.js';
export async function GET(request) {
    try {
      // Connect to database
      await Connection();
      
    //   const { searchParams } = new URL(request.url);
    //   const id = searchParams.get('id');
    //   console.log('Requested ID:', id); 
      const url = new URL(req.url);
      const userId = url.searchParams.get("userId");// More descriptive logging
      console.log(userId)
      if (id) {
        console.log('Searching for product with ID:', id);
        const product = await Product.find({ id: userId });
        
        if (!product) {
          console.log('No product found with ID:', id);
          return NextResponse.json(
            { error: 'Product not found' },
            { status: 404 }
          );
        }
        
        // Format and return the found product
        const formattedProduct = {
          // ... your formatting code ...
        };
        
        return NextResponse.json({ product: formattedProduct });
      } else {
        console.log('No ID provided, returning first product');
        // ... rest of your code for no ID case ...
      }
    } catch (error) {
      console.error('Error details:', error.message);
      return NextResponse.json(
        { error: 'Failed to fetch products', details: error.message },
        { status: 500 }
      );
    }
  }