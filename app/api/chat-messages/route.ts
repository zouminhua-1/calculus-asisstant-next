import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const apiKey = process.env.NEXT_PUBLIC_DIFY_API_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_DIFY_BASE_URL;

  const res = await fetch(`${baseUrl}/chat-messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  // 关键：将 Dify 的响应流直接透传给前端
  return new NextResponse(res.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
