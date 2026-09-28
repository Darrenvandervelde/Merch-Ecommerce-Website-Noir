import { useEffect, useState } from 'react';
import { useParams, useLocation, useSearchParams, Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { formatPrice } from '../utils/format';
import { verifyPaystackPayment } from '../api/payments';

export function OrderConfirmation() {
  const { orderId } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const state = location.state as {
    total?: number;
    email?: string;
    paymentStatus?: string;
  } | null;

  const reference = searchParams.get('reference') || searchParams.get('trxref');
  const [verifyMsg, setVerifyMsg] = useState<string | null>(null);
  const [paid, setPaid] = useState(state?.paymentStatus === 'paid');
  const [verifiedTotal, setVerifiedTotal] = useState<number | undefined>(
    state?.total
  );

  useEffect(() => {
    if (!reference) return;
    let cancelled = false;
    (async () => {
      try {
        setVerifyMsg('Confirming payment…');
        const result = await verifyPaystackPayment(reference);
        if (cancelled) return;
        setPaid(result.paid);
        setVerifyMsg(
          result.paid
            ? 'Payment confirmed via Paystack.'
            : 'Payment not completed yet. If you were charged, contact support with your reference.'
        );
        if (result.order?.total != null) setVerifiedTotal(result.order.total);
      } catch (err) {
        if (!cancelled) {
          setVerifyMsg(
            err instanceof Error
              ? err.message
              : 'Could not verify payment automatically.'
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reference]);

  const loyaltyCode = 'NOIR10';
  const total = verifiedTotal ?? state?.total;

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
          {paid ? 'Thank you for your order' : 'Order received'}
        </h1>
        <p className="mt-3 text-brand-500">
          Order number:{' '}
          <strong className="text-brand-900 font-mono">{orderId}</strong>
        </p>

        {total != null && (
          <p className="mt-2 text-lg font-medium">
            {paid ? 'Total paid' : 'Order total'}: {formatPrice(total)}
          </p>
        )}

        {verifyMsg && (
          <p className="mt-4 text-sm text-brand-600" role="status">
            {verifyMsg}
          </p>
        )}

        <p className="mt-6 text-brand-600">
          We’ve sent a confirmation email
          {state?.email ? ` to ${state.email}` : ''}. Estimated delivery: 3–7
          business days.
        </p>

        <p className="mt-4">
          <Link
            to={`/track/${orderId}`}
            className="text-sm font-medium text-brand-900 underline underline-offset-2"
          >
            Track this order →
          </Link>
        </p>
      </div>

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

      <div className="mt-6 rounded-lg border border-brand-900 bg-brand-950 text-white p-6 text-left">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-300">
          Your next order
        </h2>
        <p className="mt-2 text-sm text-brand-200">
          Use code <strong className="text-white tracking-wide">{loyaltyCode}</strong>{' '}
          for 10% off your next purchase. Valid for 60 days.
        </p>
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
