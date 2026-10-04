import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://siddiquehuzaifa96_db_user:ShopNest123@cluster0.t1j7bnq.mongodb.net/shopnest?appName=Cluster0";

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

export async function GET() {
  try {
    await mongoose.connect(MONGODB_URI);
    await Product.deleteMany({});
    await Product.insertMany([
      {
        title: "Wireless Headphones",
        slug: "wireless-headphones",
        desc: "High quality wireless sound with noise cancellation",
        img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
        category: "Electronics",
        size: "M",
        color: "Black",
        price: 2500,
        availableQty: 10
      },
      {
        title: "Smart Watch",
        slug: "smart-watch",
        desc: "Latest smart watch with fitness tracking",
        img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        category: "Electronics",
        size: "M",
        color: "Black",
        price: 5000,
        availableQty: 15
      },
      {
        title: "Running Shoes",
        slug: "running-shoes",
        desc: "Comfortable running shoes for daily use",
        img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        category: "Fashion",
        size: "L",
        color: "Blue",
        price: 3500,
        availableQty: 20
      },
    ]);
    return Response.json({ message: "Seeded Successfully with Correct Schema!" });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}