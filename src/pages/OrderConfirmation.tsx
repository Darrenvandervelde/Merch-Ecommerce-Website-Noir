import { useParams, useLocation, Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { formatPrice } from '../utils/format';

export function OrderConfirmation() {
  const { orderId } = useParams();
  const location = useLocation();
  const state = location.state as any;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
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
        Order number: <strong className="text-brand-900">{orderId}</strong>
      </p>

      {state?.total && (
        <p className="mt-2 text-lg font-medium">
          Total paid: {formatPrice(state.total)}
        </p>
      )}

      <p className="mt-6 text-brand-600">
        We’ve sent a confirmation email
        {state?.email ? ` to ${state.email}` : ''}. Estimated delivery: 3–7
        business days.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={() => (window.location.href = '/shop')}>
          Continue shopping
        </Button>
        <Link to="/account">
          <Button variant="outline">View account</Button>
        </Link>
      </div>
    </div>
  );
}
