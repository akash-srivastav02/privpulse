import { createHmac, randomInt, randomUUID, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { Resend } from "resend";
import { appUrl, hasResend, hasSupabase } from "./config";
import { getSupabaseAdmin } from "./supabase";

const cookieName = "pp_session";
const sessionDays = 30;

export type SessionUser = {
  email: string;
  name?: string | null;
};

export type LoginCodeResult = {
  code: string;
  emailSent: boolean;
  emailError?: string;
};

export function generateLoginCode() {
  return String(randomInt(100000, 999999));
}

export async function createLoginCode(email: string): Promise<LoginCodeResult> {
  const code = generateLoginCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  let emailSent = false;
  let emailError: string | undefined;

  if (hasSupabase) {
    const supabase = getSupabaseAdmin()!;
    await supabase.from("user_accounts").upsert({ email }, { onConflict: "email" });
    const { error } = await supabase.from("login_codes").insert({
      id: randomUUID(),
      email,
      code,
      expires_at: expiresAt,
    });
    if (error) throw error;
  }

  if (hasResend) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from: process.env.AUTH_FROM_EMAIL ?? process.env.DIGEST_FROM_EMAIL ?? "PrivPulse <onboarding@resend.dev>",
      to: email,
      subject: "Your PrivPulse login code",
      html: `<p>Your PrivPulse login code is <strong>${code}</strong>.</p><p>It expires in 10 minutes.</p>`,
    });
    if (result.error) {
      emailError = result.error.message;
    } else {
      emailSent = true;
    }
  }

  return { code, emailSent, emailError };
}

export async function verifyLoginCode(email: string, code: string) {
  if (!hasSupabase) return code.length === 6;

  const supabase = getSupabaseAdmin()!;
  const { data } = await supabase
    .from("login_codes")
    .select("*")
    .eq("email", email)
    .eq("code", code)
    .is("used_at", null)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return false;

  await supabase.from("login_codes").update({ used_at: new Date().toISOString() }).eq("id", data.id);
  await supabase.from("user_accounts").upsert({ email }, { onConflict: "email" });
  return true;
}

export async function setSession(email: string) {
  const store = await cookies();
  const expires = Date.now() + sessionDays * 24 * 60 * 60 * 1000;
  store.set(cookieName, signSession({ email, expires }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionDays * 24 * 60 * 60,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(cookieName);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const raw = store.get(cookieName)?.value;
  if (!raw) return null;
  const session = unsignSession(raw);
  if (!session || session.expires < Date.now()) return null;
  return { email: session.email };
}

function signSession(payload: { email: string; expires: number }) {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = hmac(body);
  return `${body}.${sig}`;
}

function unsignSession(value: string) {
  const [body, sig] = value.split(".");
  if (!body || !sig) return null;
  if (!safeEqual(sig, hmac(body))) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as { email: string; expires: number };
  } catch {
    return null;
  }
}

function hmac(value: string) {
  return createHmac("sha256", process.env.APP_SESSION_SECRET ?? "dev-session-secret-change-me")
    .update(value)
    .digest("base64url");
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function loginRedirect(next = "/app") {
  return `${appUrl}/login?next=${encodeURIComponent(next)}`;
}
