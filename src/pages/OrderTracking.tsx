import { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Button } from '../components/common/Button';
import { useAdminStore, type AdminOrder, type OrderStatus } from '../store/adminStore';
import { formatPrice } from '../utils/format';
import {
  Check,
  Package,
  Truck,
  MapPin,
  Circle,
  Search,
  AlertCircle,
} from 'lucide-react';
import { cn } from '../utils/cn';

/** Demo numbers from seed orders — used in UI + README */
export const DEMO_ORDER_NUMBERS = [
  { number: 'ORD-8K2M9X', status: 'processing' as const, hint: 'Processing' },
  { number: 'ORD-4P7Q1A', status: 'shipped' as const, hint: 'Shipped' },
  { number: 'ORD-9R3T2B', status: 'pending' as const, hint: 'Pending' },
  { number: 'ORD-2M8K5C', status: 'delivered' as const, hint: 'Delivered' },
] as const;

type TrackStatus = 'pending' | 'processing' | 'shipped' | 'delivered';

const STEPS: { key: TrackStatus; label: string; description: string }[] = [
  {
    key: 'pending',
    label: 'Order placed',
    description: 'We received your order',
  },
  {
    key: 'processing',
    label: 'Processing',
    description: 'Picked and packed in the warehouse',
  },
  {
    key: 'shipped',
    label: 'Shipped',
    description: 'On the way to you',
  },
  {
    key: 'delivered',
    label: 'Delivered',
    description: 'Left at your address',
  },
];

function normalizeOrderNumber(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, '');
}

function toTrackStatus(status: OrderStatus): TrackStatus {
  if (status === 'cancelled' || status === 'refunded') return 'pending';
  return status;
}

function stepIndex(status: TrackStatus): number {
  return STEPS.findIndex((s) => s.key === status);
}

function findOrder(
  orders: AdminOrder[],
  raw: string
): AdminOrder | undefined {
  const q = normalizeOrderNumber(raw);
  if (!q) return undefined;
  return orders.find(
    (o) =>
      normalizeOrderNumber(o.orderNumber) === q ||
      normalizeOrderNumber(o.id) === q
  );
}

export function OrderTracking() {
  useDocumentTitle('Track order');
  const navigate = useNavigate();
  const { orderId: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const orders = useAdminStore((s) => s.orders);

  const initial =
    paramId ?? searchParams.get('order') ?? searchParams.get('q') ?? '';

  const [query, setQuery] = useState(initial);
  const [submitted, setSubmitted] = useState(initial);
  const [touched, setTouched] = useState(Boolean(initial.trim()));

  // Keep form in sync when navigating via /track/:orderId or demo chips
  useEffect(() => {
    const next = paramId ?? searchParams.get('order') ?? '';
    if (next) {
      setQuery(next);
      setSubmitted(next);
      setTouched(true);
    }
  }, [paramId, searchParams]);

  const order = useMemo(
    () => (submitted.trim() ? findOrder(orders, submitted) : undefined),
    [orders, submitted]
  );

  const status: TrackStatus | null = order
    ? toTrackStatus(order.status)
    : null;
  const currentIdx = status ? stepIndex(status) : -1;
  const notFound = touched && submitted.trim() && !order;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = query.trim();
    setTouched(true);
    setSubmitted(value);
    if (value) {
      navigate(`/track/${encodeURIComponent(normalizeOrderNumber(value))}`, {
        replace: true,
      });
    }
  };

  const tryDemo = (number: string) => {
    setQuery(number);
    setSubmitted(number);
    setTouched(true);
    navigate(`/track/${encodeURIComponent(number)}`, { replace: true });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-brand-950">
        Track your order
      </h1>
      <p className="mt-2 text-brand-500">
        Enter the order number from your confirmation email to see shipping
        status and items.
      </p>

      {/* Lookup form */}
      <form
        onSubmit={handleSubmit}
        className="mt-8 flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. ORD-8K2M9X"
            className="h-12 w-full rounded-md border border-brand-300 pl-10 pr-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-900"
            aria-label="Order number"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <Button type="submit" size="lg">
          Track order
        </Button>
      </form>

      {/* Demo chips for testing */}
      <div className="mt-4">
        <p className="text-xs text-brand-400 mb-2">Try a demo order number:</p>
        <div className="flex flex-wrap gap-2">
          {DEMO_ORDER_NUMBERS.map((d) => (
            <button
              key={d.number}
              type="button"
              onClick={() => tryDemo(d.number)}
              className="rounded-full border border-brand-200 bg-white px-3 py-1.5 text-xs font-mono text-brand-700 hover:border-brand-900 hover:bg-brand-50 transition-colors"
            >
              {d.number}
              <span className="ml-1.5 text-brand-400 font-sans">
                · {d.hint}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Not found */}
      {notFound && (
        <div
          className="mt-10 flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-medium text-amber-950">
              No order found for{' '}
              <span className="font-mono">{normalizeOrderNumber(submitted)}</span>
            </p>
            <p className="mt-1 text-xs text-amber-800">
              Check the number on your confirmation email, or try one of the
              demo orders above. Matching is case-insensitive.
            </p>
          </div>
        </div>
      )}

      {/* Tracking section — shown when order number resolves */}
      {order && status && (
        <section className="mt-12" aria-label="Order tracking details">
          <div className="rounded-lg border border-brand-200 bg-brand-50 p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-brand-700 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-brand-950">
                    Order{' '}
                    <span className="font-mono">{order.orderNumber}</span>
                  </p>
                  <p className="text-xs text-brand-500">
                    Placed{' '}
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                    {' · '}
                    <span className="capitalize">{order.status}</span>
                    {' · '}
                    Payment {order.paymentStatus}
                  </p>
                </div>
              </div>
              <p className="text-sm font-semibold text-brand-950">
                {formatPrice(order.total)}
              </p>
            </div>

            {order.estimatedDelivery && (
              <p className="mt-3 text-xs text-brand-600">
                Estimated delivery:{' '}
                <span className="font-medium text-brand-900">
                  {new Date(order.estimatedDelivery).toLocaleDateString(
                    undefined,
                    {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    }
                  )}
                </span>
              </p>
            )}
          </div>

          {/* Status timeline */}
          <h2 className="mt-10 text-sm font-semibold uppercase tracking-wider text-brand-500">
            Shipping progress
          </h2>
          <ol className="mt-4 space-y-0">
            {STEPS.map((step, i) => {
              const done = i <= currentIdx;
              const active = i === currentIdx;
              const Icon =
                step.key === 'shipped'
                  ? Truck
                  : step.key === 'delivered'
                    ? MapPin
                    : step.key === 'processing'
                      ? Package
                      : Check;

              return (
                <li key={step.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full border-2',
                        done
                          ? 'border-brand-900 bg-brand-900 text-white'
                          : 'border-brand-300 bg-white text-brand-400'
                      )}
                    >
                      {done ? (
                        <Icon className="h-4 w-4" />
                      ) : (
                        <Circle className="h-3 w-3" />
                      )}
                    </span>
                    {i < STEPS.length - 1 && (
                      <span
                        className={cn(
                          'w-0.5 flex-1 min-h-[2rem]',
                          i < currentIdx ? 'bg-brand-900' : 'bg-brand-200'
                        )}
                      />
                    )}
                  </div>
                  <div className={cn('pb-8', active && 'pt-1')}>
                    <p
                      className={cn(
                        'text-sm font-semibold',
                        done ? 'text-brand-950' : 'text-brand-400'
                      )}
                    >
                      {step.label}
                      {active && (
                        <span className="ml-2 text-[10px] uppercase tracking-wider text-emerald-600">
                          Current
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 text-xs text-brand-500">
                      {step.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Items in order */}
          <h2 className="mt-2 text-sm font-semibold uppercase tracking-wider text-brand-500">
            Items
          </h2>
          <ul className="mt-3 divide-y divide-brand-100 border border-brand-200 rounded-lg overflow-hidden">
            {order.items.map((item) => (
              <li
                key={`${item.productId}-${item.colour}-${item.size}`}
                className="flex gap-3 bg-white p-3"
              >
                <img
                  src={item.image}
                  alt=""
                  className="h-16 w-12 object-cover bg-brand-100 rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-brand-900 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-brand-500">
                    {item.colour} / {item.size} · Qty {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-medium text-brand-900">
                  {formatPrice(
                    (item.salePrice ?? item.price) * item.quantity
                  )}
                </p>
              </li>
            ))}
          </ul>

          {/* Ship-to summary */}
          <div className="mt-6 rounded-lg border border-brand-200 p-4 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">
              Shipping to
            </p>
            <p className="mt-1 text-brand-900">
              {order.shippingAddress.firstName}{' '}
              {order.shippingAddress.lastName}
            </p>
            <p className="text-brand-600">
              {order.shippingAddress.address1}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
              {order.shippingAddress.postalCode}
              <br />
              {order.shippingAddress.country}
            </p>
            <p className="mt-2 text-xs text-brand-400">{order.email}</p>
          </div>

          <p className="mt-6 text-xs text-brand-400">
            Demo tracking reads orders from the store catalogue (admin seed
            data). Connect a carrier / order API later for live updates.
          </p>
        </section>
      )}

      <div className="mt-12 text-center">
        <Link to="/account" className="text-sm text-brand-600 hover:underline">
          View account orders
        </Link>
        <span className="mx-2 text-brand-300">·</span>
        <Link to="/shop" className="text-sm text-brand-600 hover:underline">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
