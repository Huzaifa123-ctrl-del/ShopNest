
import jwt from "jsonwebtoken";
import User from "@/models/User";
import connectDb from "@/middleware/mongoose";

export async function getAuthenticatedUser(req) {
  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const authorization = req.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return null;
    }

    const token = authorization.slice(7);
    const payload = jwt.verify(token, secret);

    if (
      typeof payload !== "object" ||
      !payload.sub
    ) {
      return null;
    }

    await connectDb();

    // Database se current user aur uska role verify karo.
    const user = await User.findById(payload.sub)
      .select("_id name email role");

    return user || null;
  } catch {
    return null;
  }
}
