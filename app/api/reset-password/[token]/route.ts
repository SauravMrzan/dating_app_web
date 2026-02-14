import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ token: string }> },
) {
  try {
    const body = await req.json();
    const { token } = await context.params; // ✅ await the params

    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) {
      return NextResponse.json(
        { success: false, message: "BACKEND_URL not configured" },
        { status: 500 },
      );
    }

    const res = await fetch(
      `http://localhost:5000/api/reset-password/${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: "Backend error" },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Proxy error" },
      { status: 500 },
    );
  }
}
