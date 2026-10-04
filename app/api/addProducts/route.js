
import {Product} from "@/models/Products";
import connectDb from "@/middleware/mongoose";
import { getAuthenticatedUser } from "@/lib/auth";

export async function POST(req) {
  try {
    const user = await getAuthenticatedUser(req);

    if (!user || user.role !== "admin") {
      return Response.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const requiredFields = [
      "slug",
      "title",
      "desc",
      "img",
      "category",
      "price",
      "availableQty",
    ];

    for (const field of requiredFields) {
      if (
        body[field] === undefined ||
        body[field] === null ||
        body[field] === ""
      ) {
        return Response.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    if (
      typeof body.slug !== "string" ||
      typeof body.title !== "string" ||
      typeof body.desc !== "string" ||
      typeof body.img !== "string" ||
      typeof body.category !== "string"
    ) {
      return Response.json(
        { success: false, error: "Invalid product fields" },
        { status: 400 }
      );
    }

    if (
      typeof body.price !== "number" ||
      !Number.isFinite(body.price) ||
      body.price < 0 ||
      typeof body.availableQty !== "number" ||
      !Number.isInteger(body.availableQty) ||
      body.availableQty < 0
    ) {
      return Response.json(
        {
          success: false,
          error: "Price must be non-negative and quantity a non-negative integer",
        },
        { status: 400 }
      );
    }

    await connectDb();

    const product = await Product.create({
      slug: body.slug.trim(),
      title: body.title.trim(),
      desc: body.desc.trim(),
      img: body.img.trim(),
      category: body.category.trim(),
      price: body.price,
      availableQty: body.availableQty,
      ...(typeof body.size === "string"
        ? { size: body.size }
        : {}),
      ...(typeof body.color === "string"
        ? { color: body.color }
        : {}),
    });

    return Response.json(
      { success: true, product },
      { status: 201 }
    );
  } catch (error) {
    if (error?.code === 11000) {
      return Response.json(
        { success: false, error: "A product with this slug already exists" },
        { status: 409 }
      );
    }

    console.error("ADD PRODUCT ERROR:", error);

    return Response.json(
      { success: false, error: "Unable to add product" },
      { status: 500 }
    );
  }
}
