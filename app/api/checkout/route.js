import connectDb from "@/middleware/mongoose";
import Product from "@/models/Products";
import Order from "@/models/Order";

export async function POST(req) {
  try {
    await connectDb();
    const { userId, cart, address } = await req.json();
    if (!userId) return Response.json({ error: "Login required" }, { status: 401 });

    let totalAmount = 0;
    let verifiedProducts = [];

    for (let itemCode in cart) {
      let dbProduct = await Product.findOne({ slug: itemCode });
      if (!dbProduct) return Response.json({ error: `Product ${itemCode} not found` }, { status: 400 });
      if (dbProduct.availableQty < cart[itemCode].qty) return Response.json({ error: `${dbProduct.title} out of stock` }, { status: 400 });
      totalAmount += dbProduct.price * cart[itemCode].qty;
      verifiedProducts.push({ productId: dbProduct._id, quantity: cart[itemCode].qty });
    }

    let order = await Order.create({ userId, products: verifiedProducts, address, amount: totalAmount, status: "Pending" });

    for (let itemCode in cart) {
      await Product.findOneAndUpdate({ slug: itemCode }, { $inc: { availableQty: -cart[itemCode].qty } });
    }
    return Response.json({ success: true, orderId: order._id });
  } catch (e) {
    console.log(e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}