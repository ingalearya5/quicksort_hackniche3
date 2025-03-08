import { currentUser } from '@clerk/nextjs/server';
import Purchase from '@/models/purchase';
import Connection from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';

// App Router API routes use named exports for HTTP methods
export async function POST(request) {
  try {
    // Get authenticated user
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const { cart, sessionData } = body;
   
    if (!cart || !cart.items || cart.items.length === 0) {
      return NextResponse.json(
        { message: 'Cart is empty' },
        { status: 400 }
      );
    }
    
    // Connect to MongoDB
    await Connection();
    
    // Create a new purchase record with the user's ID as string
    const purchase = new Purchase({
      userId: user.id, // Extract just the ID string from the user object
      orderId: uuidv4(),
      items: cart.items.map(item => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        price: Number(item.price)
      })),
      totalAmount: cart.totalAmount,
      totalItems: cart.totalItems,
      sessionData: sessionData || {}
    });
    
    // Save the purchase
    await purchase.save();
   
    // Update analytics for this user
    await Purchase.updatePurchaseAnalytics(user.id); // Use the ID string here too
    
    return NextResponse.json({
      success: true,
      orderId: purchase.orderId
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { message: 'Failed to process checkout', error: error.message },
      { status: 500 }
    );
  }
}