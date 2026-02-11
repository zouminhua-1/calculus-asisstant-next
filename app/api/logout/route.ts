// app/api/logout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
export async function POST(request: NextRequest) {
  // 清除服务端 Cookie
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  return NextResponse.json({ message: "Logout successful" }, { status: 200 });
}
