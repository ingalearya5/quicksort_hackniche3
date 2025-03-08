import mongoose from 'mongoose';

const PurchaseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
  items: [{
    productId: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
  // Analytics fields
  purchaseCount: {
    type: Number,
    default: 1, // Incremented for repeat purchases by same user
  },
  // Track user session data
  sessionData: {
    deviceType: String,
    browser: String,
    referrer: String,
  },
  // Additional analytics data
  purchaseFrequency: {
    type: String,
    enum: ['first_time', 'occasional', 'frequent', 'regular'],
    default: 'first_time',
  },
  customerSegment: {
    type: String,
    default: 'new', // Can be updated to 'returning', 'loyal', etc.
  },
}, { timestamps: true });

// Compound index for analytics queries
PurchaseSchema.index({ userId: 1, purchaseDate: -1 });

// Static method to update purchase frequency
PurchaseSchema.statics.updatePurchaseAnalytics = async function(userId) {
  // Count total purchases by this user
  const purchaseCount = await this.countDocuments({ userId });
  
  // Determine frequency based on purchase count
  let purchaseFrequency = 'first_time';
  let customerSegment = 'new';
  
  if (purchaseCount > 10) {
    purchaseFrequency = 'frequent';
    customerSegment = 'loyal';
  } else if (purchaseCount > 5) {
    purchaseFrequency = 'regular';
    customerSegment = 'returning';
  } else if (purchaseCount > 1) {
    purchaseFrequency = 'occasional';
    customerSegment = 'returning';
  }
  
  // Update all purchases by this user with the new analytics data
  await this.updateMany(
    { userId },
    { 
      $set: { 
        purchaseFrequency,
        customerSegment,
      } 
    }
  );
  
  return { purchaseFrequency, customerSegment };
};

export default mongoose.models.Purchase || mongoose.model('Purchase', PurchaseSchema);