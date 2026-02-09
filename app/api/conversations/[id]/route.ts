import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { user } = await request.json();
  const { id } = await params;
  const apiKey = process.env.NEXT_PUBLIC_DIFY_API_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_DIFY_BASE_URL;

  try {
    const res = await fetch(`${baseUrl}/conversations/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ user }),
    });

    return NextResponse.json({ success: res.ok });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
