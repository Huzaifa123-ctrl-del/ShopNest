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

    for (let itemCode in cart) {
      let item = cart[itemCode];

      // FIX: _id se search karo, slug se nahi
      let dbProduct = await Product.findById(itemCode);
      if (!dbProduct) {
        dbProduct = await Product.findOne({ _id: itemCode });
      }

      if (!dbProduct) {
        return Response.json({ error: `Product ${itemCode} not found in DB` }, { status: 400 });
      }

      // FIX: countInStock check
      if (dbProduct.countInStock < item.qty) {
        return Response.json({ error: `${dbProduct.name} out of stock` }, { status: 400 });
      }

      totalAmount += dbProduct.price * item.qty;

      verifiedProducts.push({
        productId: dbProduct._id.toString(),
        name: dbProduct.name,
        quantity: item.qty,
        price: dbProduct.price
      });
    }

    let order = await Order.create({
      userId,
      products: verifiedProducts,
      address,
      amount: totalAmount,
      status: "Pending",
    });

    // FIX: Stock kam karo countInStock se
    for (let itemCode in cart) {
      await Product.findByIdAndUpdate(itemCode, { $inc: { countInStock: -cart[itemCode].qty } });
    }

    return Response.json({ success: true, orderId: order._id, amount: totalAmount });

  } catch (e) {
    console.log(e);
    return Response.json({ error: "Server error: " + e.message }, { status: 500 });
  }
}