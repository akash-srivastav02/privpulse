import { NextResponse } from "next/server";
import { hasResend } from "@/lib/config";
import { createLoginCode } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();

    if (!email.includes("@")) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    const code = await createLoginCode(email);
    return NextResponse.json({
      ok: true,
      devCode: process.env.NODE_ENV === "production" || hasResend ? undefined : code,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not send login code." }, { status: 500 });
  }
}
