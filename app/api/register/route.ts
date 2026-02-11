import { NextResponse } from "next/server";
import db from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { ApiResponse } from "@/types/api";

export async function POST(request: Request) {
  try {
    const { name, pwd, email } = await request.json();

    // 1. 基础校验
    if (!name || !pwd || pwd.length < 6) {
      return NextResponse.json(
        { error: "用户名和密码不能为空，且密码至少6位", code: 400 },
        { status: 200 }, // 业务逻辑错误通常返回 200 或 400
      );
    }

    // 2. 检查用户是否已存在
    const existingUser = await db.user.findUnique({
      where: { username: name },
    });

    if (existingUser) {
      const errorRes: ApiResponse = { error: "该用户名已被注册", code: 409 };
      return NextResponse.json(errorRes, { status: 200 });
    }

    // 3. 密码加密 (Salt Rounds 通常设为 10)
    const hashedPassword = await bcrypt.hash(pwd, 10);

    // 4. 存入数据库
    const newUser = await db.user.create({
      data: {
        username: name,
        password: hashedPassword,
        email: email,
      },
    });

    // 5. 返回成功响应（不返回密码）
    const successRes: ApiResponse = {
      data: {
        id: newUser.id,
        user_name: newUser.username,
        email: newUser.email,
      },
      code: 200,
    };

    return NextResponse.json(successRes);
  } catch (err) {
    console.error("Registration Error:", err);
    return NextResponse.json(
      { error: "服务器内部错误", code: 500 },
      { status: 500 },
    );
  }
}
