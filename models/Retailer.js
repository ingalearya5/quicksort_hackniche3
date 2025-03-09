import mongoose from 'mongoose';

const { Schema } = mongoose;

const RetailerSchema = new Schema({
  product_id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  Retailer: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

RetailerSchema.index({ product_id: 1 });
RetailerSchema.index({ Retailer: 1 });

const Retailer = mongoose.model('Retailer', RetailerSchema);
export default Retailer; // ✅ Use ES module export
