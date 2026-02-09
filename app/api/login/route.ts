import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { ApiResponse, UserInfo } from "@/types/api";
import { cookies } from "next/headers";
export async function POST(request: Request) {
  try {
    const { name, pwd } = await request.json();

    const { data, error } = (await supabaseServer
      .rpc("login_user", {
        p_user_name: name,
        p_password: pwd,
      })
      .single()) as any;

    console.log("login data", data);
    console.log("login error", error);

    if (error) {
      const errorRes: ApiResponse = { error: error.message, code: 401 };
      return NextResponse.json(errorRes, { status: 200 });
    }
    const cookieStore = await cookies();

    cookieStore.set("auth_token", "your_jwt_token_here", {
      httpOnly: true, // 防止 JS 读取，提高安全性
      secure: process.env.NODE_ENV === "production", // 仅在 HTTPS 下传输
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7天有效
    });

    const successRes: ApiResponse<UserInfo> = { data, code: 200 };
    return NextResponse.json(successRes);
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
