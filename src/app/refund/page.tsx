import type { Metadata } from "next";
import { LegalSection, LegalShell } from "../legal-shell";

export const metadata: Metadata = {
  title: "Refund Policy - PrivPulse",
  description: "Refund and cancellation rules for PrivPulse subscriptions.",
};

export default function RefundPage() {
  return (
    <LegalShell
      title="Refund Policy"
      description="This page explains how cancellations and refund requests work for PrivPulse paid plans."
    >
      <LegalSection title="Free Plan">
        <p>
          PrivPulse offers a free plan so customers can test the product before upgrading. We recommend using the free plan to
          confirm that the tracking script and dashboard fit your workflow.
        </p>
      </LegalSection>

      <LegalSection title="Subscriptions">
        <p>
          Paid subscriptions renew according to the billing period shown at checkout. You may cancel your subscription from the
          payment provider portal or by contacting support. Cancellation stops future renewals, but it does not automatically
          refund past charges.
        </p>
      </LegalSection>

      <LegalSection title="Refund Window">
        <p>
          If you are unhappy with a new paid subscription, contact us within 7 days of the first charge. We will review the
          request and may issue a refund when the account shows normal use and no abuse, chargeback risk, or policy violation.
        </p>
      </LegalSection>

      <LegalSection title="Non-Refundable Cases">
        <p>
          Refunds are generally not available for renewals after the 7-day window, accounts suspended for abuse, heavy usage
          beyond the plan&apos;s intended evaluation period, custom work, taxes, payment processor fees, or services already
          consumed.
        </p>
      </LegalSection>

      <LegalSection title="How To Request">
        <p>
          Email{" "}
          <a className="font-medium text-[#111] underline" href="mailto:akashpsri02@gmail.com">
            akashpsri02@gmail.com
          </a>{" "}
          with your account email, payment email, plan, charge date, and the reason for the request. Approved refunds are
          processed through the original payment provider.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
