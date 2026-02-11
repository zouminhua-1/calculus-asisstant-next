import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user = searchParams.get("user");
  const conversation_id = searchParams.get("conversation_id");

  const apiKey = process.env.DIFY_API_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_DIFY_BASE_URL;

  try {
    const res = await fetch(
      `${baseUrl}/messages?user=${user}&conversation_id=${conversation_id}`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
      },
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}
