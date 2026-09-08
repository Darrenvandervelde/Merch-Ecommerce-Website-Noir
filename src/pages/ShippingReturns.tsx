export function ShippingReturns() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-brand-950">
        Shipping & Returns
      </h1>

      <section className="mt-10 space-y-6 text-brand-600 leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold text-brand-900">Shipping</h2>
          <ul className="mt-3 list-disc pl-5 space-y-2">
            <li>Free standard shipping on orders over $100 (continental US).</li>
            <li>Standard delivery: 3–7 business days.</li>
            <li>Express delivery: 1–2 business days (additional fee).</li>
            <li>We currently ship to the United States and Canada.</li>
            <li>Orders are processed within 1–2 business days.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-brand-900">Returns</h2>
          <ul className="mt-3 list-disc pl-5 space-y-2">
            <li>30-day return window from the delivery date.</li>
            <li>Items must be unworn, unwashed, and with original tags attached.</li>
            <li>Free return shipping labels are provided for eligible returns.</li>
            <li>Refunds are issued to the original payment method within 5–10 business days after we receive the item.</li>
            <li>Sale items and final-sale pieces are not eligible for return.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-brand-900">Exchanges</h2>
          <p className="mt-3">
            We currently process exchanges as a return + new order. This ensures
            the size you want is reserved and ships as quickly as possible.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-brand-900">Damaged or incorrect items</h2>
          <p className="mt-3">
            If you receive a damaged or incorrect item, contact us within 7 days
            of delivery with photos and your order number. We will make it right.
          </p>
        </div>
      </section>
    </div>
  );
}
