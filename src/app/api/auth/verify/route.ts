import { NextResponse } from "next/server";
import { setSession, verifyLoginCode } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const code = String(body.code ?? "").replace(/\D/g, "");
    const next = safeNext(String(body.next ?? "/app"));

    if (!email.includes("@") || code.length !== 6) {
      return NextResponse.json({ error: "Enter the 6-digit code from your email." }, { status: 400 });
    }

    const ok = await verifyLoginCode(email, code);
    if (!ok) {
      return NextResponse.json({ error: "That code is invalid or expired." }, { status: 401 });
    }

    await setSession(email);
    return NextResponse.json({ ok: true, next });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not verify login code." }, { status: 500 });
  }
}

function safeNext(value: string) {
  return value.startsWith("/") && !value.startsWith("//") ? value : "/app";
}
