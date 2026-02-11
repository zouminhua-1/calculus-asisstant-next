import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const user = formData.get("user") as string;

    const difyFormData = new FormData();
    difyFormData.append("file", file);
    difyFormData.append("user", user);
    const apiKey = process.env.DIFY_API_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_DIFY_BASE_URL;
    const res = await fetch(`${baseUrl}/files/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: difyFormData,
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
