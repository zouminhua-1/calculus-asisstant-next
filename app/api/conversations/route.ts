import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user = searchParams.get("user");

  // 从服务端环境变量获取，不需要 NEXT_PUBLIC_ 前缀，更安全
  const DIFY_API_KEY = process.env.NEXT_PUBLIC_DIFY_API_KEY;
  const DIFY_BASE_URL = process.env.NEXT_PUBLIC_DIFY_BASE_URL;

  console.log("DIFY_BASE_URL", DIFY_BASE_URL);

  try {
    const response = await fetch(
      `${DIFY_BASE_URL}/conversations?user=${user}&limit=20`,
      {
        headers: {
          Authorization: `Bearer ${DIFY_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 },
    );
  }
}
