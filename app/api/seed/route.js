import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://siddiquehuzaifa96_db_user:ShopNest123@cluster0.t1j7bnq.mongodb.net/shopnest?appName=Cluster0";

const ProductSchema = new mongoose.Schema({
  name: String, description: String, price: Number, image: String, category: String, countInStock: Number
});
const Product = mongoose.models.Products || mongoose.model('Products', ProductSchema);

export async function GET() {
  try {
    await mongoose.connect(MONGODB_URI);
    await Product.deleteMany({});
    await Product.insertMany([
      { name: "Wireless Headphones", price: 2500, description: "High quality sound", image: "/images/headphone.jpg", category: "Electronics", countInStock: 10 },
      { name: "Smart Watch", price: 5000, description: "Latest smart watch", image: "/images/watch.jpg", category: "Electronics", countInStock: 15 },
      { name: "Running Shoes", price: 3500, description: "Comfortable shoes", image: "/images/shoes.jpg", category: "Fashion", countInStock: 20 },
    ]);
    return Response.json({ message: "Seeded Successfully!" });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}