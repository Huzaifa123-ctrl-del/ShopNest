import connectDb from "@/middleware/mongoose"
import User from "@/models/User.js"
import bcrypt from "bcryptjs"

export async function POST(req){
  await connectDb()
  let { name, email, password } = await req.json()

  let existing = await User.findOne({ email })
  if(existing){
    return Response.json({ success: false, error: "User already exists with this email!" }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  let u = new User({ name, email, password: hashedPassword })
  await u.save()

  return Response.json({ success: true, message: "User created" })
}