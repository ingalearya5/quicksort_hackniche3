import { currentUser } from '@clerk/nextjs/server';
import Purchase from '@/models/purchase';
import Connection from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Get authenticated user
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Use the string ID instead of the entire user object
    const userId = user.id;
    
    // Connect to the database
    await Connection();
    
    // Get query parameters from URL
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || 'month';
    const productId = searchParams.get('productId');
    const limit = parseInt(searchParams.get('limit') || '10');
   
    // Build date filter based on timeframe
    const dateFilter = {};
    const now = new Date();
   
    if (timeframe === 'day') {
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      dateFilter.purchaseDate = { $gte: startOfDay };
    } else if (timeframe === 'week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      dateFilter.purchaseDate = { $gte: startOfWeek };
    } else if (timeframe === 'month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      dateFilter.purchaseDate = { $gte: startOfMonth };
    } else if (timeframe === 'year') {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      dateFilter.purchaseDate = { $gte: startOfYear };
    }
    
    // Product filter if productId is provided
    const productFilter = productId ? {
      'items.productId': productId
    } : {};
    
    // Base query combining filters and including the correct userId
    const baseQuery = {
      userId: userId, // Add user ID to queries to filter by the current user
      ...dateFilter,
      ...productFilter
    };
    
    // Execute analytics aggregations
    const [
      totalPurchases,
      totalRevenue,
      frequentlyPurchasedProducts,
      customerSegmentBreakdown
    ] = await Promise.all([
      // Count total purchases
      Purchase.countDocuments(baseQuery),
     
      // Calculate total revenue
      Purchase.aggregate([
        { $match: baseQuery },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
     
      // Find most frequently purchased products
      Purchase.aggregate([
        { $match: baseQuery },
        { $unwind: '$items' },
        { $group: {
          _id: '$items.productId',
          productName: { $first: '$items.productName' },
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          purchaseCount: { $sum: 1 }
        }},
        { $sort: { totalQuantity: -1 } },
        { $limit: limit }
      ]),
     
      // Customer segment breakdown
      Purchase.aggregate([
        { $match: baseQuery },
        { $group: {
          _id: '$customerSegment',
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }},
        { $sort: { count: -1 } }
      ]),
    ]);
    
    // Return analytics data
    return NextResponse.json({
      totalPurchases,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      frequentlyPurchasedProducts,
      customerSegmentBreakdown,
      timeframe
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { message: 'Failed to retrieve analytics', error: error.message },
      { status: 500 }
    );
  }
}