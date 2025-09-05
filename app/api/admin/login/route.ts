import { type NextRequest, NextResponse } from "next/server"

const ADMIN_EMAIL = "admin@prep"
const ADMIN_PASSWORD = "apply@123"

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { email, password } = body
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const res = NextResponse.json({ ok: true })
    // Set a simple session cookie (httpOnly=false in this environment; demo only)
    res.cookies.set("admin_auth", "1", {
      httpOnly: false,
      path: "/",
      maxAge: 60 * 60 * 6, // 6 hours
    })
    return res
  }
  return new NextResponse("Unauthorized", { status: 401 })
}
