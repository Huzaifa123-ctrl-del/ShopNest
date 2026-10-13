import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  desc: String,
  img: String,
  category: String,
  size: String,
  color: String,
  price: { type: Number, required: true },
  availableQty: { type: Number, required: true },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

export default Product;
export { Product };
