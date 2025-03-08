// app/api/products/route.js
import { NextResponse } from 'next/server';
import Connection from '@/lib/db';
import Product from '@/models/Products.js';

export async function GET() {
  try {
    // Connect to database
    await Connection();
    
    // Fetch all products from database
    const products = await Product.find({});
    
    // Map products to match the expected format
    const formattedProducts = products.map(product => ({
      id: product._id.toString(),
      name: product.title,
      description: `${product.category} - ${product.review} Review`,
      price: parseFloat(product.price.replace(/[^0-9.]/g, '')),
      image: product.image,
      rating: product.rating || 0,
      category: product.category,
      inStock: true,
      link: product.link
    }));
    
    return NextResponse.json({ products: formattedProducts });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}