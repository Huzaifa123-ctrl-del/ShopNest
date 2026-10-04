import connectDb from "@/middleware/mongoose";
import Product from "@/models/Products";
import Order from "@/models/Order";

export async function POST(req) {
  try {
    await connectDb();
    const { userId, cart, address } = await req.json();

    if (!userId) return Response.json({ error: "Login required" }, { status: 401 });
    if (!cart || Object.keys(cart).length === 0) return Response.json({ error: "Cart empty" }, { status: 400 });

    let verifiedProducts = [];
    let totalAmount = 0;

    // Har item ka price DB se verify karo
    for (let itemCode in cart) {
      let item = cart[itemCode];
      // itemCode tumhara slug hai jaise "wear-the-code"
      let dbProduct = await Product.findOne({ slug: itemCode });

      if (!dbProduct) {
        return Response.json({ error: `Product ${itemCode} not found` }, { status: 400 });
      }
      if (dbProduct.availableQty < item.qty) {
        return Response.json({ error: `${dbProduct.title} out of stock` }, { status: 400 });
      }

      // REAL PRICE DB SE
      totalAmount += dbProduct.price * item.qty;

      verifiedProducts.push({
        productId: dbProduct._id.toString(),
        quantity: item.qty,
      });
    }

    // Order create - amount tumhara nahi, DB wala
    let order = await Order.create({
      userId,
      products: verifiedProducts,
      address,
      amount: totalAmount,
      status: "Pending",
    });

    // Stock kam karo
    for (let itemCode in cart) {
      await Product.findOneAndUpdate({ slug: itemCode }, { $inc: { availableQty: -cart[itemCode].qty } });
    }

    return Response.json({ success: true, orderId: order._id, amount: totalAmount });

  } catch (e) {
    console.log(e);
    return Response.json({ error: "Server error: " + e.message }, { status: 500 });
  }
}