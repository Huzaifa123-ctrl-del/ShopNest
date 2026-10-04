import Product from "@/models/Products"
import connectDb from "@/middleware/mongoose"

export async function GET(req){
  await connectDb()
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get("slug")
  let product = await Product.findOne({ slug: slug })
  return Response.json({ product })
}