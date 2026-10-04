import {Product} from "@/models/Products";
import connectDb from "@/middleware/mongoose";

export async function GET() {
  try {
    await connectDb();
    let products = await Product.find({});
    return Response.json({ products: products || [] });
  } catch (error) {
    console.error("GET ERROR:", error);
    return Response.json({ products: [], error: error.message }, { status: 500 });
  }
}