import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number
  }],
  address: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;
export { Order };
