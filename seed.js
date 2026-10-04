const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://siddiquehuzaifa96_db_user:ApyCj1jvEvAwWjni@cluster0.t1j7bnq.mongodb.net/shopnest?appName=Cluster0";
const ProductSchema = new mongoose.Schema({
  name: String, description: String, price: Number, image: String, category: String, countInStock: Number
});
const Product = mongoose.models.Products || mongoose.model('Products', ProductSchema);
const products = [
  { name: "Wireless Headphones", description: "High quality sound", price: 2500, image: "/images/headphone.jpg", category: "Electronics", countInStock: 10 },
  { name: "Smart Watch", description: "Latest smart watch", price: 5000, image: "/images/watch.jpg", category: "Electronics", countInStock: 15 },
  { name: "Running Shoes", description: "Comfortable shoes", price: 3500, image: "/images/shoes.jpg", category: "Fashion", countInStock: 20 },
];
async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to Atlas");
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log("Products Seeded Successfully!");
    process.exit(0);
  } catch (err) { console.error(err); process.exit(1); }
}
seed();