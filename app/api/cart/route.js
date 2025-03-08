
import { NextResponse } from 'next/server';
import Connection from '@/lib/db.js';
import Cart from '@/models/Cart';
import { currentUser } from '@clerk/nextjs/server';

export async function GET(request) {
  try {
    // Get current authenticated user
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;
    const url = new URL(request.url);
    const queryUserId = url.searchParams.get('userId');

    // Security check - make sure the user can only access their own cart
    if (queryUserId && queryUserId !== userId) {
      return NextResponse.json({ error: 'Unauthorized access to another user\'s cart' }, { status: 403 });
    }

    await Connection();
    
    // Find the user's cart
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      // If no cart exists, return an empty cart
      return NextResponse.json({
        items: [],
        totalItems: 0,
        totalAmount: 0
      });
    }
    
    // Return the cart data
    return NextResponse.json({
      items: cart.items,
      totalItems: cart.totalItems,
      totalAmount: cart.totalAmount
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // Get current authenticated user
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;
    const cartData = await request.json();
    
    // Security check - make sure user can only modify their own cart
    if (cartData.userId && cartData.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized attempt to modify another user\'s cart' }, { status: 403 });
    }

    await Connection();
    
    // Update or create the cart using upsert
    const updatedCart = await Cart.findOneAndUpdate(
      { userId },
      {
        userId,
        items: cartData.items,
        totalItems: cartData.totalItems,
        totalAmount: cartData.totalAmount
      },
      { new: true, upsert: true }
    );
    
    return NextResponse.json({
      items: updatedCart.items,
      totalItems: updatedCart.totalItems,
      totalAmount: updatedCart.totalAmount
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    // Get current authenticated user
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;
    await Connection();
    
    // Delete the cart
    await Cart.findOneAndDelete({ userId });
    
    return NextResponse.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}