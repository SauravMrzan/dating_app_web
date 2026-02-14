import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(` http://localhost:5000/api/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    // If backend didn’t return JSON, handle gracefully
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
