export function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-brand-950">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-brand-500">Last updated: September 2026</p>

      <div className="mt-10 space-y-8 text-brand-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-brand-900">1. Information we collect</h2>
          <p className="mt-3">
            We collect information you provide directly (name, email, shipping
            address, order details) and technical data such as IP address, browser
            type, and device information when you visit our site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-900">2. How we use your information</h2>
          <ul className="mt-3 list-disc pl-5 space-y-1">
            <li>To process and fulfil orders</li>
            <li>To communicate about your orders and support requests</li>
            <li>To improve our website and products</li>
            <li>To send marketing communications if you opt in</li>
            <li>To prevent fraud and maintain security</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-900">3. Payment information</h2>
          <p className="mt-3">
            We never store raw credit card numbers. All payment processing is
            handled by our payment provider (e.g. Stripe). We only receive
            confirmation tokens and limited transaction metadata.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-900">4. Cookies & local storage</h2>
          <p className="mt-3">
            We use cookies and localStorage for essential functionality such as
            cart and wishlist persistence, session management, and analytics.
            You can control cookies through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-900">5. Data sharing</h2>
          <p className="mt-3">
            We share data only with service providers necessary to operate the
            store (payment processors, shipping carriers, email providers). We do
            not sell your personal information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-900">6. Your rights</h2>
          <p className="mt-3">
            Depending on your location you may have rights to access, correct,
            delete, or export your data. Contact us at privacy@noir.example to
            exercise these rights.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-900">7. Contact</h2>
          <p className="mt-3">
            For privacy-related questions: privacy@noir.example
          </p>
        </section>
      </div>
    </div>
  );
}
