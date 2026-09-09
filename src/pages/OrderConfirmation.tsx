import { useParams, useLocation, Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { formatPrice } from '../utils/format';

export function OrderConfirmation() {
  const { orderId } = useParams();
  const location = useLocation();
  const state = location.state as {
    total?: number;
    email?: string;
  } | null;

  const loyaltyCode = 'NOIR10';

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-brand-950">
          Thank you for your order
        </h1>
        <p className="mt-3 text-brand-500">
          Order number:{' '}
          <strong className="text-brand-900">{orderId}</strong>
        </p>

        {state?.total != null && (
          <p className="mt-2 text-lg font-medium">
            Total paid: {formatPrice(state.total)}
          </p>
        )}

        <p className="mt-6 text-brand-600">
          We’ve sent a confirmation email
          {state?.email ? ` to ${state.email}` : ''}. Estimated delivery: 3–7
          business days.
        </p>
      </div>

      {/* Care tips */}
      <div className="mt-12 rounded-lg border border-brand-200 bg-brand-50 p-6 text-left">
        <h2 className="text-sm font-semibold text-brand-950 uppercase tracking-wider">
          Care for your pieces
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-brand-600">
          <li>• Machine wash cold, inside out</li>
          <li>• Hang dry or tumble on low heat</li>
          <li>• Avoid bleach and fabric softener</li>
          <li>• Heavyweight hoodies hold shape best if not over-dried</li>
        </ul>
      </div>

      {/* Loyalty / next order */}
      <div className="mt-6 rounded-lg border border-brand-900 bg-brand-950 text-white p-6 text-left">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-300">
          Your next order
        </h2>
        <p className="mt-2 text-sm text-brand-200">
          Use code <strong className="text-white tracking-wide">{loyaltyCode}</strong> for
          10% off your next purchase. Valid for 60 days.
        </p>
        <p className="mt-3 text-xs text-brand-400">
          Early access to drops is coming soon for returning customers.
        </p>
      </div>

      {/* Review CTA */}
      <div className="mt-6 rounded-lg border border-brand-200 p-6 text-left">
        <h2 className="text-sm font-semibold text-brand-950">Share your fit</h2>
        <p className="mt-2 text-sm text-brand-600">
          Once your order arrives, leave a quick review — it helps other people
          choose the right size and supports the brand.
        </p>
        <Link
          to="/shop"
          className="mt-3 inline-block text-sm font-medium text-brand-900 underline underline-offset-2"
        >
          Browse again after it ships →
        </Link>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/shop">
          <Button>Continue shopping</Button>
        </Link>
        <Link to="/account">
          <Button variant="outline">View account</Button>
        </Link>
      </div>
    </div>
  );
}
