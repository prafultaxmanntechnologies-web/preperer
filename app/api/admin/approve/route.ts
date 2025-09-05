import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { Store } from "@/lib/store"

function requireAdmin() {
  const c = cookies()
  const token = c.get("admin_auth")?.value
  if (token !== "1") {
    return false
  }
  return true
}

export async function POST(req: NextRequest) {
  if (!requireAdmin()) return new NextResponse("Unauthorized", { status: 401 })
  const { id } = await req.json().catch(() => ({}))
  if (!id) return new NextResponse("Missing id", { status: 400 })
  const item = Store.approve(id)
  if (!item) return new NextResponse("Not found", { status: 404 })
  return NextResponse.json({ item })
}
