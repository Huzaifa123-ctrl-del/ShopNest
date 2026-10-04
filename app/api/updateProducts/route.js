import connectDb from "@/middleware/mongoose";
import { Product } from "@/models/Products";

export async function GET() {
  try {
    await connectDb();
    await Product.deleteMany({});
    await Product.insertMany([
      {
        title: "Wireless Headphones",
        slug: "wireless-headphones",
        desc: "High quality wireless sound",
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
        desc: "Latest smart watch",
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
        desc: "Comfortable running shoes",
        img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        category: "Fashion",
        size: "L",
        color: "Blue",
        price: 3500,
        availableQty: 20
      },
    ]);
    return Response.json({ message: "Seeded Successfully!" });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}