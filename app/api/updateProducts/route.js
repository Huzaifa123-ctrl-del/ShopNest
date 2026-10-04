
import Product from "@/models/Products";
import connectDb from "@/middleware/mongoose";
import { getAuthenticatedUser } from "@/lib/auth";

export async function PUT(req) {
  try {
    const user = await getAuthenticatedUser(req);

    if (!user || user.role !== "admin") {
      return Response.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await req.json();

    if (
      typeof body.slug !== "string" ||
      !body.slug.trim()
    ) {
      return Response.json(
        { success: false, error: "Product slug is required" },
        { status: 400 }
      );
    }

    const allowedFields = [
      "title",
      "desc",
      "img",
      "category",
      "size",
      "color",
      "price",
      "availableQty",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return Response.json(
        { success: false, error: "No valid fields to update" },
        { status: 400 }
      );
    }

    for (const field of ["title", "desc", "img", "category"]) {
      if (
        field in updates &&
        (typeof updates[field] !== "string" ||
          !updates[field].trim())
      ) {
        return Response.json(
          { success: false, error: `Invalid ${field}` },
          { status: 400 }
        );
      }
    }

    if (
      "price" in updates &&
      (typeof updates.price !== "number" ||
        !Number.isFinite(updates.price) ||
        updates.price < 0)
    ) {
      return Response.json(
        { success: false, error: "Invalid price" },
        { status: 400 }
      );
    }

    if (
      "availableQty" in updates &&
      (!Number.isInteger(updates.availableQty) ||
        updates.availableQty < 0)
    ) {
      return Response.json(
        { success: false, error: "Invalid available quantity" },
        { status: 400 }
      );
    }

    await connectDb();

    const product = await Product.findOneAndUpdate(
      { slug: body.slug.trim() },
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return Response.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, product });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    return Response.json(
      { success: false, error: "Unable to update product" },
      { status: 500 }
    );
  }
}
