import Link from 'next/link'

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white px-5 py-10">
      <article className="max-w-3xl mx-auto prose prose-invert prose-sm prose-headings:font-display prose-a:text-[#6c63ff]">
        <Link href="/" className="no-underline text-white/40">← Back to PrivPulse</Link>
        <h1>Terms of Service</h1>
        <p>By using PrivPulse, you agree to use the service lawfully and only on websites where you are authorized to install analytics.</p>
        <h2>Service</h2>
        <p>PrivPulse provides privacy-first website analytics, dashboards, custom events, public sharing, and email reports. Features may change as the product improves.</p>
        <h2>Acceptable use</h2>
        <p>You may not use PrivPulse for illegal content, abuse, spam, malware, attempts to identify individual visitors, or tracking websites you do not control.</p>
        <h2>Billing</h2>
        <p>Paid plans renew according to the checkout terms shown by the payment provider. You can cancel a paid plan from the billing provider or by contacting support.</p>
        <h2>Availability</h2>
        <p>We aim to keep the service reliable, but do not guarantee uninterrupted availability on free or beta plans.</p>
        <h2>Contact</h2>
        <p>Email <a href="mailto:hello@privpulse.in">hello@privpulse.in</a> for support.</p>
      </article>
    </main>
  )
}
