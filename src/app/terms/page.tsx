import type { Metadata } from "next";
import { LegalSection, LegalShell } from "../legal-shell";

export const metadata: Metadata = {
  title: "Terms of Service - PrivPulse",
  description: "The terms that apply when customers use PrivPulse.",
};

export default function TermsPage() {
  return (
    <LegalShell
      title="Terms of Service"
      description="These terms describe the rules for using PrivPulse, including accounts, acceptable use, billing, and service availability."
    >
      <LegalSection title="Agreement">
        <p>
          By using PrivPulse, you agree to these Terms of Service. If you use PrivPulse for a business or client, you confirm
          that you have authority to accept these terms for that organization.
        </p>
      </LegalSection>

      <LegalSection title="Service">
        <p>
          PrivPulse provides website analytics, dashboard views, tracking scripts, custom event collection, public sharing
          options, and related email reports. We may add, change, or remove features as the product improves.
        </p>
      </LegalSection>

      <LegalSection title="Accounts">
        <p>
          You are responsible for keeping your email account secure because PrivPulse uses email login codes. You must provide
          accurate account, website, and billing information and must not attempt to access another customer&apos;s workspace.
        </p>
      </LegalSection>

      <LegalSection title="Acceptable Use">
        <p>
          You may not use PrivPulse for unlawful websites, malware, spam, deceptive activity, privacy-invasive tracking,
          credential theft, scraping abuse, or activity that harms the service or other customers. We may suspend accounts that
          create security, legal, payment, or infrastructure risk.
        </p>
      </LegalSection>

      <LegalSection title="Customer Responsibilities">
        <p>
          You are responsible for the websites where you install the PrivPulse script, your privacy notices, your legal basis
          for analytics, and your compliance with laws that apply to your business, including India&apos;s DPDP Act, GDPR,
          ePrivacy rules, and local consumer laws where relevant.
        </p>
      </LegalSection>

      <LegalSection title="Billing">
        <p>
          Paid plans are billed through our payment provider. Prices, pageview limits, website limits, and plan features are
          shown on the pricing page or checkout page. If payment fails or a subscription is cancelled, access may be downgraded
          or limited.
        </p>
      </LegalSection>

      <LegalSection title="Availability">
        <p>
          We aim to keep PrivPulse fast and reliable, but we do not guarantee uninterrupted service. Maintenance, provider
          outages, abuse prevention, or technical issues may affect availability.
        </p>
      </LegalSection>

      <LegalSection title="Liability">
        <p>
          PrivPulse is provided on an as-is and as-available basis. To the maximum extent allowed by law, we are not liable for
          indirect, incidental, special, consequential, lost-profit, lost-revenue, or lost-data damages.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about these terms can be sent to{" "}
          <a className="font-medium text-[#111] underline" href="mailto:akashpsri02@gmail.com">
            akashpsri02@gmail.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalShell>
  );
}
