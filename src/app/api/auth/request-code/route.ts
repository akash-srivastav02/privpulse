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

    const result = await createLoginCode(email);
    const showFallbackCode = process.env.SHOW_LOGIN_CODE_FALLBACK === "true" || !result.emailSent;
    return NextResponse.json({
      ok: true,
      emailSent: result.emailSent,
      message: result.emailSent
        ? "Login code sent."
        : "Email delivery is not fully configured yet. Use the temporary beta code shown below.",
      emailError: result.emailError,
      devCode: showFallbackCode ? result.code : process.env.NODE_ENV === "production" || hasResend ? undefined : result.code,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not send login code." }, { status: 500 });
  }
}
