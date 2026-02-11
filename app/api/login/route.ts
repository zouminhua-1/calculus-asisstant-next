import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { ApiResponse, UserInfo } from "@/types/api";
import db from "@/lib/prisma";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-key",
);
export async function POST(request: Request) {
  try {
    const { name, pwd } = await request.json();

    const user = await db.user.findUnique({
      where: { username: name },
    });

    if (!user || !(await bcrypt.compare(pwd, user.password))) {
      const errorRes: ApiResponse = { error: "用户名或密码错误", code: 401 };
      return NextResponse.json(errorRes, { status: 200 });
    }

    const token = await new SignJWT({
      userId: user.id,
      username: user.username,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    const cookieStore = await cookies();

    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    const userInfo: UserInfo = {
      id: user.id,
      user_name: user.username,
    };

    const successRes: ApiResponse<UserInfo> = { data: userInfo, code: 200 };
    return NextResponse.json(successRes);
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
