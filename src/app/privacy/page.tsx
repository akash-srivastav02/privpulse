import type { Metadata } from "next";
import { LegalSection, LegalShell } from "../legal-shell";

export const metadata: Metadata = {
  title: "Privacy Policy - PrivPulse",
  description: "How PrivPulse collects, uses, stores, and protects customer and analytics data.",
};

export default function PrivacyPage() {
  return (
    <LegalShell
      title="Privacy Policy"
      description="This policy explains what PrivPulse collects from customers and websites using our privacy-friendly analytics product."
    >
      <LegalSection title="Who We Are">
        <p>
          PrivPulse provides no-cookie website analytics for businesses, founders, and agencies. For privacy questions, contact us at{" "}
          <a className="font-medium text-[#111] underline" href="mailto:akashpsri02@gmail.com">
            akashpsri02@gmail.com
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="Customer Account Data">
        <p>
          When you create or use a PrivPulse account, we collect information such as your email address, website domain, plan,
          billing status, login codes, and support messages. We use this data to provide the service, secure your account,
          send login emails, process billing, and communicate important product updates.
        </p>
      </LegalSection>

      <LegalSection title="Website Analytics Data">
        <p>
          PrivPulse is designed to avoid collecting personal profiles. Our tracking script records pageviews, custom events,
          paths, referrers, UTM parameters, country, city when available, device type, browser, operating system, and timestamps.
          We do not set cookies and we do not use cross-site tracking.
        </p>
        <p>
          Visitor and session identifiers are generated using one-way hashing so customers can see aggregate metrics such as
          unique visitors without receiving raw IP addresses from PrivPulse dashboards.
        </p>
      </LegalSection>

      <LegalSection title="Payments and Email Providers">
        <p>
          We use third-party providers to operate the product: Vercel for hosting, Supabase for database storage, Upstash for
          rate limiting, Resend for email, and Lemon Squeezy or Razorpay-compatible payment flows for billing. These providers
          process data only as needed to deliver the service.
        </p>
      </LegalSection>

      <LegalSection title="Data Retention">
        <p>
          Analytics retention depends on the customer plan. Free workspaces are intended for shorter retention, while paid plans
          may retain analytics data longer. Account and billing records may be retained as required for security, accounting,
          fraud prevention, legal compliance, and dispute handling.
        </p>
      </LegalSection>

      <LegalSection title="Your Rights">
        <p>
          You can request access, correction, export, or deletion of your account data by emailing us. If you are using PrivPulse
          on behalf of your own website visitors, you are responsible for responding to visitor requests that relate to your
          website and for using PrivPulse in a lawful manner.
        </p>
      </LegalSection>

      <LegalSection title="Security">
        <p>
          We use encrypted infrastructure, server-side API keys, rate limiting, signed sessions, and webhook verification to
          protect the service. No internet service can be guaranteed completely secure, but we work to reduce risk and respond
          quickly to issues.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
