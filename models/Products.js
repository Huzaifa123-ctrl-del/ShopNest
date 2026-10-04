import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  desc: String,
  img: String,
  category: String,
  size: String,
  color: String,
  price: Number,
  availableQty: Number,
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

export default Product;
export { Product };