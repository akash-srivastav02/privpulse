import type { Metadata } from "next";
import { LegalSection, LegalShell } from "../legal-shell";

export const metadata: Metadata = {
  title: "DPDP and GDPR Statement - PrivPulse",
  description: "PrivPulse privacy and compliance positioning for DPDP, GDPR, and no-cookie analytics.",
};

export default function DpdpPage() {
  return (
    <LegalShell
      title="DPDP and GDPR Statement"
      description="PrivPulse is built to help teams use simple website analytics with fewer privacy risks than cookie-based tracking tools."
    >
      <LegalSection title="Privacy-First Analytics">
        <p>
          PrivPulse does not use tracking cookies, does not create cross-site advertising profiles, and does not sell analytics
          data. The product is designed around aggregate website measurement instead of individual user surveillance.
        </p>
      </LegalSection>

      <LegalSection title="India DPDP Act">
        <p>
          India&apos;s Digital Personal Data Protection Act, 2023 focuses on clear purpose, responsible processing, data
          minimization, safeguards, and user rights. PrivPulse supports these principles by keeping analytics lightweight,
          avoiding cookies by default, and giving customers aggregate reports for their own websites.
        </p>
        <p>
          Customers remain responsible for their own notices, consent decisions, legal basis, and compliance obligations based
          on their website, audience, industry, and data use.
        </p>
      </LegalSection>

      <LegalSection title="GDPR and ePrivacy">
        <p>
          PrivPulse is intended to reduce dependence on cookie banners for basic analytics by avoiding client-side cookies and
          personal advertising identifiers. Whether a specific website needs consent or additional notice depends on local law
          and the customer&apos;s implementation.
        </p>
      </LegalSection>

      <LegalSection title="Data We Avoid">
        <p>
          We do not intentionally collect names, phone numbers, emails, payment data, or account credentials from visitors
          through the tracking script. Customers should not place personal data inside page paths, page titles, custom event
          names, or UTM values.
        </p>
      </LegalSection>

      <LegalSection title="Customer Controls">
        <p>
          Customers can choose where to install the script, what custom events to track, whether to share public dashboards,
          and when to remove the script. Deleting a site or account may remove or limit access to related analytics data.
        </p>
      </LegalSection>

      <LegalSection title="Not Legal Advice">
        <p>
          This statement describes product design and intended privacy posture. It is not legal advice. Businesses should talk
          to a qualified professional for compliance decisions specific to their organization.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
